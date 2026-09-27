import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
export const git=(cwd,...args)=>execFileSync('git',args,{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
export async function write(root,file,content){
  const destination=path.join(root,file);
  await fs.mkdir(path.dirname(destination),{recursive:true});
  await fs.writeFile(destination,typeof content==='string'?content:JSON.stringify(content,null,2)+'\n');
}
