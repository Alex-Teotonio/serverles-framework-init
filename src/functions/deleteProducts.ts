import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { client } from "../lib/dynamoClient";

export async function handler(event: APIGatewayProxyEventV2) {
  if (!event.pathParameters || !event.pathParameters.productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing or invalid path parameter",
      }),
    };
  }
  const { productId } = event.pathParameters;
  const command = new DeleteItemCommand({
    TableName: "ProductsTable",
    Key: {
      id: { S: productId },
    },
  });

  await client.send(command);

  return {
    statusCode: 204,
  };
}
