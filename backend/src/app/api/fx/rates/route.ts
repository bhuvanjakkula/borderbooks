import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { db } from "@/server/db/client";
import { fetchMidRate, fetchRateHistory } from "@/server/fx";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const claims = event.requestContext?.authorizer?.claims;
  const userId = claims?.sub;
  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
  }

  const queryParams = event.queryStringParameters || {};
  const base = (queryParams.base ?? "USD").toUpperCase();
  const quote = (queryParams.quote ?? "EUR").toUpperCase();
  const date = queryParams.date ?? undefined;
  const history = queryParams.history === "true";

  try {
    if (history) {
      const days = Math.min(365, Math.max(7, Number(queryParams.days ?? 30)));
      const rates = await fetchRateHistory(db as any, base, quote, days);
      return { statusCode: 200, body: JSON.stringify({ base, quote, history: rates }) };
    }

    const result = await fetchMidRate(db as any, base, quote, date ? new Date(date) : new Date());
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch FX rate";
    return { statusCode: 502, body: JSON.stringify({ error: message }) };
  }
};
