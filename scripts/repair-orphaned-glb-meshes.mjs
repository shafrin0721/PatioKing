import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const modelsDirectory = path.join(projectRoot, "public", "models");
const modelFiles = [
  "beds.glb",
  "bedside-cupboards.glb",
  "coffee-tables.glb",
  "cupboards.glb",
  "dining-chairs.glb",
  "dining-tables.glb",
  "divan.glb",
  "dressing-tables.glb",
  "l-sofas.glb",
  "poufottoman.glb",
  "relaxing-chairs.glb",
  "rocking-chairs.glb",
  "round-sofa.glb",
  "single-chairs.glb",
  "sofa.glb",
  "tv-console.glb",
];

function getChunk(buffer, offset) {
  const length = buffer.readUInt32LE(offset);
  const type = buffer.readUInt32LE(offset + 4);
  return { length, type, data: buffer.subarray(offset + 8, offset + 8 + length), nextOffset: offset + 8 + length };
}

function reachableMeshes(document) {
  const scene = document.scenes?.[document.scene ?? 0];
  if (!scene) throw new Error("GLB has no active scene");
  const visitedNodes = new Set();
  const meshes = new Set();
  const visit = (nodeIndex) => {
    if (visitedNodes.has(nodeIndex)) return;
    visitedNodes.add(nodeIndex);
    const node = document.nodes[nodeIndex];
    if (!node) throw new Error(`Scene references missing node ${nodeIndex}`);
    if (Number.isInteger(node.mesh)) meshes.add(node.mesh);
    for (const childIndex of node.children ?? []) visit(childIndex);
  };
  for (const nodeIndex of scene.nodes ?? []) visit(nodeIndex);
  return { scene, meshes };
}

function repairModel(fileName) {
  const filePath = path.join(modelsDirectory, fileName);
  const buffer = fs.readFileSync(filePath);
  if (buffer.toString("ascii", 0, 4) !== "glTF" || buffer.readUInt32LE(4) !== 2 || buffer.readUInt32LE(8) !== buffer.length) {
    throw new Error(`${fileName} is not a complete glTF 2.0 binary`);
  }

  const jsonChunk = getChunk(buffer, 12);
  if (jsonChunk.type !== 0x4e4f534a) throw new Error(`${fileName} has no leading JSON chunk`);
  const document = JSON.parse(jsonChunk.data.toString("utf8"));
  const binaryChunk = getChunk(buffer, jsonChunk.nextOffset);
  const { scene, meshes: referencedMeshes } = reachableMeshes(document);
  const orphanedMeshes = document.meshes.map((_, index) => index).filter((index) => !referencedMeshes.has(index));
  if (orphanedMeshes.length === 0) {
    console.log(`${fileName}: all ${referencedMeshes.size} meshes are already in the active scene`);
    return;
  }

  const attachToWorld = scene.nodes?.length === 1
    && Number.isInteger(scene.nodes[0])
    && !Number.isInteger(document.nodes[scene.nodes[0]]?.mesh);
  const worldNode = attachToWorld ? document.nodes[scene.nodes[0]] : null;
  if (worldNode && !worldNode.children) worldNode.children = [];

  for (const meshIndex of orphanedMeshes) {
    const nodeIndex = document.nodes.length;
    const mesh = document.meshes[meshIndex];
    document.nodes.push({ name: mesh.name || `Recovered mesh ${meshIndex}`, mesh: meshIndex });
    if (worldNode) worldNode.children.push(nodeIndex);
    else scene.nodes.push(nodeIndex);
  }

  const jsonData = Buffer.from(JSON.stringify(document), "utf8");
  const jsonPadding = (4 - (jsonData.length % 4)) % 4;
  const paddedJson = Buffer.concat([jsonData, Buffer.alloc(jsonPadding, 0x20)]);
  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(paddedJson.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4);

  const header = Buffer.alloc(12);
  header.write("glTF", 0, 4, "ascii");
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(header.length + jsonHeader.length + paddedJson.length + (binaryChunk.length ? 8 + binaryChunk.length : 0), 8);

  const chunks = [header, jsonHeader, paddedJson];
  if (binaryChunk.length) {
    const binaryHeader = Buffer.alloc(8);
    binaryHeader.writeUInt32LE(binaryChunk.length, 0);
    binaryHeader.writeUInt32LE(binaryChunk.type, 4);
    chunks.push(binaryHeader, binaryChunk.data);
  }
  fs.writeFileSync(filePath, Buffer.concat(chunks));
  console.log(`${fileName}: attached ${orphanedMeshes.length} supplied mesh(es) ${orphanedMeshes.join(", ")} to the active scene`);
}

for (const fileName of modelFiles) repairModel(fileName);