import {z} from "zod";
import {requireApiContext} from "@/server/api/context";
import {failure,json} from "@/server/api/http";
import {persistUpload} from "@/server/api/uploads";
const uploadSchema=z.object({kind:z.enum(["invoices","payments"]),file:z.instanceof(File)});
export async function POST(request:Request){try{const context=await requireApiContext(request),form=await request.formData(),body=uploadSchema.parse({kind:form.get("kind"),file:form.get("file")}),bytes=Buffer.from(await body.file.arrayBuffer());if(bytes.byteLength===0)throw new Error(`File ${body.file.name} is empty (0 bytes). Check your upload.`);const result=await persistUpload(context,body.kind,body.file.name,bytes);if(result.rowCount===0)throw new Error(`File ${body.file.name} parsed successfully but contained 0 valid rows.`);return json(result,201);}catch(error){return failure(error);}}
export async function GET(request:Request){try{const context=await requireApiContext(request),uploads=await context.db.fileUpload.findMany({where:{workspaceId:context.workspace.id},orderBy:{createdAt:"desc"}});return json({uploads});}catch(error){return failure(error);}}
