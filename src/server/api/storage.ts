import {mkdir,readFile,unlink,writeFile} from "node:fs/promises";
import {join} from "node:path";
const root=join(process.cwd(),".data","uploads");
const pathFor=(workspaceId:string,uploadId:string)=>join(root,workspaceId,uploadId);
export async function saveUploadFile(workspaceId:string,uploadId:string,data:Buffer){const directory=join(root,workspaceId);await mkdir(directory,{recursive:true});await writeFile(pathFor(workspaceId,uploadId),data);}
export const readUploadFile=(workspaceId:string,uploadId:string)=>readFile(pathFor(workspaceId,uploadId));
export async function deleteUploadFile(workspaceId:string,uploadId:string){await unlink(pathFor(workspaceId,uploadId)).catch(()=>undefined);}
