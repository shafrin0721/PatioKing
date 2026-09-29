"""Parametric product visualization of the Patio King wardrobe. Python 3 stdlib only.
Run: python generate.py [config.json] [wardrobe.glb]
All measurements are in millimetres in config; GLB uses metres. Z is up.
"""
import json, struct, sys, math
from pathlib import Path

cfg=json.loads(Path(sys.argv[1] if len(sys.argv)>1 else 'config.json').read_text())
out=Path(sys.argv[2] if len(sys.argv)>2 else 'wardrobe.glb')
W,H,D=[cfg[k]/1000 for k in ('width_mm','height_mm','depth_mm')]
TK=cfg['toe_kick_mm']/1000
DH=cfg['drawer_height_mm']/1000
if min(W,H,D,TK,DH)<=0 or W<1.2 or H<1.4 or D<0.3 or DH*3>H*.42:
    raise ValueError('Unsupported dimensions; try width >=1200, height >=1400, depth >=300 mm and smaller drawers.')
C=cfg['colors']; mats=[]; meshes=[]; nodes=[]; blob=bytearray(); views=[]; accessors=[]
def material(name,color,metal=0,rough=.7):
    s=color.lstrip('#'); rgb=[int(s[i:i+2],16)/255 for i in (0,2,4)]
    mats.append({'name':name,'pbrMetallicRoughness':{'baseColorFactor':rgb+[1],'metallicFactor':metal,'roughnessFactor':rough},'doubleSided':True})
    return len(mats)-1
wood=material('Wood finish',C['wood']); edge=material('Wood side and reveals',C['wood_edge']); inside=material('Shelf interior',C['interior']); mirror=material('Mirror tint (approximate reflection)',C['mirror'],.85,.09); metal=material('Handles',C['metal'],.85,.2); base=material('Dark plinth',C['base'])
def add_data(raw,target):
    while len(blob)%4: blob.append(0)
    start=len(blob);blob.extend(raw);views.append({'buffer':0,'byteOffset':start,'byteLength':len(raw),'target':target})
    return len(views)-1
def box(name,x,y,z,w,d,h,mat):
    # x left/right, y back/front (front is negative), z bottom/top
    if min(w,d,h)<=0: return
    x0,x1=x-w/2,x+w/2;y0,y1=y-d/2,y+d/2;z0,z1=z-h/2,z+h/2
    faces=[([(x0,y0,z0),(x1,y0,z0),(x1,y0,z1),(x0,y0,z1)],(0,-1,0)),
           ([(x1,y1,z0),(x0,y1,z0),(x0,y1,z1),(x1,y1,z1)],(0,1,0)),
           ([(x0,y1,z0),(x0,y0,z0),(x0,y0,z1),(x0,y1,z1)],(-1,0,0)),
           ([(x1,y0,z0),(x1,y1,z0),(x1,y1,z1),(x1,y0,z1)],(1,0,0)),
           ([(x0,y0,z1),(x1,y0,z1),(x1,y1,z1),(x0,y1,z1)],(0,0,1)),
           ([(x0,y1,z0),(x1,y1,z0),(x1,y0,z0),(x0,y0,z0)],(0,0,-1))]
    positions=[];normals=[];indices=[]
    for verts,n in faces:
        i=len(positions);positions+=verts;normals += [n]*4;indices += [i,i+1,i+2,i,i+2,i+3]
    pv=add_data(b''.join(struct.pack('<3f',*p) for p in positions),34962)
    nv=add_data(b''.join(struct.pack('<3f',*n) for n in normals),34962)
    iv=add_data(struct.pack('<%dH'%len(indices),*indices),34963)
    for v,typ,count,extra in [(pv,5126,24,{'min':[x0,y0,z0],'max':[x1,y1,z1]}),(nv,5126,24,{}),(iv,5123,36,{})]:
        accessors.append({'bufferView':v,'componentType':typ,'count':count,'type':'SCALAR' if v==iv else 'VEC3',**extra})
    a=len(accessors)-3
    meshes.append({'name':name,'primitives':[{'attributes':{'POSITION':a,'NORMAL':a+1},'indices':a+2,'material':mat}]})
    nodes.append({'name':name,'mesh':len(meshes)-1})
# Shell and proportions inferred from one photo; the model is a visual approximation.
t=0.018; gap=.004;front=-D/2-.002; top=H-TK
box('Recessed plinth',0,0,TK/2,W-.035,D-.055,TK,base)
box('Full rear panel',0,D/2-t/2,TK+(H-TK)/2,W,D if False else t,H-TK,edge)
box('Left end panel',-W/2+t/2,0,TK+(H-TK)/2,t,D,H-TK,wood)
box('Right end panel',W/2-t/2,0,TK+(H-TK)/2,t,D,H-TK,wood)
box('Top panel',0,0,H-t/2,W,D,t,wood)
left=W*.62; center=W*.23; right=W-left-center
bounds=[-W/2,-W/2+left,-W/2+left+center,W/2]
for i,x in enumerate(bounds[1:-1]): box('Structural divider %d'%i,x,0,TK+(H-TK)/2,t,D,H-TK,edge)
# Left side: three tall doors above six drawers.
lx0,lx1=bounds[0],bounds[1]; drawer_top=TK+3*DH+3*gap; upper=H-drawer_top-.016
for i in range(3):
    a=lx0+(lx1-lx0)*i/3; b=lx0+(lx1-lx0)*(i+1)/3
    box('Upper wood door %d'%(i+1),(a+b)/2,front,(H+drawer_top)/2,b-a-gap,.019,upper,wood)
for row in range(3):
    for col in range(2):
        a=lx0+(lx1-lx0)*col/2;b=lx0+(lx1-lx0)*(col+1)/2
        z=TK+gap+row*(DH+gap)+DH/2
        box('Drawer front %d %d'%(row+1,col+1),(a+b)/2,front-.004,z,b-a-gap,.024,DH,wood)
        handle_w=min((b-a)*.37,.17)
        box('Silver drawer pull %d %d'%(row+1,col+1),(a+b)/2,front-.027,z+DH*.13,handle_w,.012,.010,metal)
        for sign in (-1,1): box('Pull mount', (a+b)/2+sign*handle_w*.42,front-.020,z+DH*.13,.010,.018,.010,metal)
# Mirrored central door with adjacent open shelves.
c0,c1=bounds[1],bounds[2]; mirror_w=(c1-c0)*.52; shelf0=c0+mirror_w
box('Mirror backing',(c0+shelf0)/2,front,(H+TK)/2,mirror_w-gap,.024,H-TK-.016,edge)
box('Full height mirror',(c0+shelf0)/2,front-.015,(H+TK)/2,mirror_w-.014,.006,H-TK-.030,mirror)
box('Shelf recess backing',(shelf0+c1)/2,D/2-.03,(H+TK)/2,c1-shelf0-.025,.018,H-TK-.035,inside)
for x in (shelf0+.009,c1-.009): box('Shelf vertical side',x,0,(H+TK)/2,.018,D-.02,H-TK-.03,wood)
for j in range(1,5):
    z=TK+(H-TK)*j/5
    box('Open shelf %d'%j,(shelf0+c1)/2,0,z,c1-shelf0-.025,D-.045,.019,wood)
# Right module: upper narrow mirror and wood base panel.
r0,r1=bounds[2],bounds[3]; lower=TK+(H-TK)*.25
box('Right lower wood door',(r0+r1)/2,front, (TK+lower)/2,r1-r0-gap,.02,lower-TK-.006,wood)
box('Right mirror backing',(r0+r1)/2,front,(lower+H)/2,r1-r0-gap,.02,H-lower-.012,edge)
box('Right mirror',(r0+r1)/2,front-.015,(lower+H)/2,r1-r0-.018,.006,H-lower-.028,mirror)
asset={'version':'2.0','generator':'Luvio Labs parametric wardrobe generator','extras':{'dimensions_mm':{k:cfg[k] for k in ('width_mm','height_mm','depth_mm')},'source':'visual approximation based on supplied Patio King reference photo'}}
gltf={'asset':asset,'scene':0,'scenes':[{'nodes':list(range(len(nodes)))}],'nodes':nodes,'meshes':meshes,'materials':mats,'buffers':[{'byteLength':len(blob)}],'bufferViews':views,'accessors':accessors}
j=json.dumps(gltf,separators=(',',':')).encode();j+=b' '*((-len(j))%4);blob+=b'\0'*((-len(blob))%4)
length=12+8+len(j)+8+len(blob)
out.write_bytes(struct.pack('<III',0x46546C67,2,length)+struct.pack('<I4s',len(j),b'JSON')+j+struct.pack('<I4s',len(blob),b'BIN\0')+blob)
print(f'{out}: {len(meshes)} parts, {W:.2f} x {H:.2f} x {D:.2f} m')
