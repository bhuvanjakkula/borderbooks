import {requireApiContext,ApiError} from "@/server/api/context";
import {emptyBodySchema} from "@/server/api/schemas";
import {failure,json,optionalJson} from "@/server/api/http";
import {appUrl,stripeClient} from "@/server/billing/stripe";
export async function POST(request:Request){try{const context=await requireApiContext(request);emptyBodySchema.parse(await optionalJson(request));if(!context.workspace.stripeCustomerId)throw new ApiError(409,"NO_STRIPE_CUSTOMER","Start a subscription before opening the billing portal");const session=await stripeClient().billingPortal.sessions.create({customer:context.workspace.stripeCustomerId,return_url:`${appUrl()}/app/billing`});return json({url:session.url});}catch(error){return failure(error)}}
