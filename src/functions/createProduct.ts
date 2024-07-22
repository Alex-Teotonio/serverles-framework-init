import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "node:crypto";
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { client } from "../lib/dynamoClient";

exports.handler = async (event: APIGatewayProxyEventV2) => {
  let body;

  // Verifique se event.body não é undefined
  if (event.body) {
    body = JSON.parse(event.body);
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Request body is missing or empty",
      }),
    };
  }
  const id = randomUUID();
  const command = new PutItemCommand({
    TableName: "ProductsTable",
    Item: {
      id: { S: id },
      name: { S: body.name },
      description: { S: body.description },
      price: { N: body.price.toString() },
    },
  });
  const response = await client.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: response,
    }),
  };
};
