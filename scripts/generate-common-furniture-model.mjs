import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(repositoryRoot, "public", "models");
const outputPath = path.join(outputDirectory, "common-furniture.glb");
const roles = ["wood", "upholstery", "metal"];
const boxes = {
  wood: [
    [-0.7, 0.72, 0, 0.08, 1.35, 0.72], [0.7, 0.72, 0, 0.08, 1.35, 0.72],
    [0, 1.4, 0, 1.48, 0.08, 0.76], [0, 0.08, 0, 1.48, 0.16, 0.76],
    [0, 0.72, -0.32, 1.34, 0.07, 0.07], [0, 0.28, 0, 1.32, 0.06, 0.64],
    [0, 0.73, 0, 0.06, 1.12, 0.64],
  ],
  upholstery: [
    [-0.35, 0.78, 0.37, 0.62, 1.12, 0.06], [0.35, 0.78, 0.37, 0.62, 1.12, 0.06],
  ],
  metal: [
    [-0.045, 0.78, 0.414, 0.025, 0.14, 0.025], [0.045, 0.78, 0.414, 0.025, 0.14, 0.025],
  ],
};
const faces = [
  { normal: [1, 0, 0], corners: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]] },
  { normal: [-1, 0, 0], corners: [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]] },
  { normal: [0, 1, 0], corners: [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]] },
  { normal: [0, -1, 0], corners: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]] },
  { normal: [0, 0, 1], corners: [[1, 0, 1], [1, 1, 1], [0, 1, 1], [0, 0, 1]] },
  { normal: [0, 0, -1], corners: [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]] },
];

function geometryForRole(role) {
  const positions = [];
  const normals = [];
  const indices = [];
  for (const [centerX, centerY, centerZ, width, height, depth] of boxes[role]) {
    const minimum = [centerX - width / 2, centerY - height / 2, centerZ - depth / 2];
    const dimensions = [width, height, depth];
    for (const face of faces) {
      const start = positions.length / 3;
      for (const corner of face.corners) {
        positions.push(...corner.map((value, axis) => minimum[axis] + value * dimensions[axis]));
        normals.push(...face.normal);
      }
      indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
    }
  }
  return { positions, normals, indices };
}

const binaryChunks = [];
const bufferViews = [];
const accessors = [];
let byteOffset = 0;

function appendBufferView(data, target) {
  const padding = (4 - (byteOffset % 4)) % 4;
  if (padding) {
    binaryChunks.push(Buffer.alloc(padding));
    byteOffset += padding;
  }
  const buffer = Buffer.from(data);
  const viewIndex = bufferViews.length;
  bufferViews.push({ buffer: 0, byteOffset, byteLength: buffer.length, target });
  binaryChunks.push(buffer);
  byteOffset += buffer.length;
  return viewIndex;
}

function appendAccessor(view, componentType, count, type, min, max) {
  accessors.push({ bufferView: view, componentType, count, type, ...(min ? { min } : {}), ...(max ? { max } : {}) });
  return accessors.length - 1;
}

const primitives = roles.map((role, material) => {
  const geometry = geometryForRole(role);
  const positions = new Float32Array(geometry.positions);
  const normals = new Float32Array(geometry.normals);
  const indices = new Uint16Array(geometry.indices);
  const positionView = appendBufferView(positions.buffer, 34962);
  const normalView = appendBufferView(normals.buffer, 34962);
  const indexView = appendBufferView(indices.buffer, 34963);
  const bounds = [0, 1, 2].map((axis) => geometry.positions.filter((_, index) => index % 3 === axis));
  const positionAccessor = appendAccessor(positionView, 5126, positions.length / 3, "VEC3", bounds.map((axis) => Math.min(...axis)), bounds.map((axis) => Math.max(...axis)));
  const normalAccessor = appendAccessor(normalView, 5126, normals.length / 3, "VEC3");
  const indexAccessor = appendAccessor(indexView, 5123, indices.length, "SCALAR");
  return { attributes: { POSITION: positionAccessor, NORMAL: normalAccessor }, indices: indexAccessor, material, mode: 4 };
});

const binary = Buffer.concat(binaryChunks);
const gltf = {
  asset: { version: "2.0", generator: "Patio King generic furniture preview" },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ name: "Generic configurable furniture preview", mesh: 0 }],
  meshes: [{ name: "Generic configurable furniture preview", primitives }],
  materials: [
    { name: "Wood", pbrMetallicRoughness: { baseColorFactor: [0.55, 0.37, 0.22, 1], roughnessFactor: 0.78, metallicFactor: 0 } },
    { name: "Upholstery", pbrMetallicRoughness: { baseColorFactor: [0.78, 0.75, 0.68, 1], roughnessFactor: 0.92, metallicFactor: 0 } },
    { name: "Metal", pbrMetallicRoughness: { baseColorFactor: [0.48, 0.5, 0.5, 1], roughnessFactor: 0.35, metallicFactor: 0.65 } },
  ],
  accessors,
  bufferViews,
  buffers: [{ byteLength: binary.length }],
};
const json = Buffer.from(JSON.stringify(gltf));
const jsonPadding = (4 - (json.length % 4)) % 4;
const binaryPadding = (4 - (binary.length % 4)) % 4;
const jsonChunk = Buffer.concat([json, Buffer.alloc(jsonPadding, 0x20)]);
const binaryChunk = Buffer.concat([binary, Buffer.alloc(binaryPadding)]);
const totalLength = 12 + 8 + jsonChunk.length + 8 + binaryChunk.length;
const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(totalLength, 8);
const jsonHeader = Buffer.alloc(8);
jsonHeader.writeUInt32LE(jsonChunk.length, 0);
jsonHeader.writeUInt32LE(0x4e4f534a, 4);
const binaryHeader = Buffer.alloc(8);
binaryHeader.writeUInt32LE(binaryChunk.length, 0);
binaryHeader.writeUInt32LE(0x004e4942, 4);

fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(outputPath, Buffer.concat([header, jsonHeader, jsonChunk, binaryHeader, binaryChunk]));
console.log(`Generated ${path.relative(repositoryRoot, outputPath)} (${totalLength} bytes)`);