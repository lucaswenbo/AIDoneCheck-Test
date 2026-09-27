import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const original=process.env.EVIDENCE_DIR,downloaded=process.env.DOWNLOADED;
assert(original&&downloaded);
const files=(await fs.readdir(original)).sort();
assert.deepEqual((await fs.readdir(downloaded)).sort(),files);
for(const file of files){
  const hash=async root=>createHash('sha256').update(await fs.readFile(path.join(root,file))).digest('hex');
  assert.equal(await hash(original),await hash(downloaded),`Downloaded Artifact differs: ${file}`);
}
console.log('已从 GitHub 下载证据产物；所有文件 SHA-256 均与原始证据一致');
