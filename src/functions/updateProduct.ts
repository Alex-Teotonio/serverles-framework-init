import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { client } from "../lib/dynamoClient";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  if (!event.pathParameters || !event.pathParameters.productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing or invalid path parameter: productId",
      }),
    };
  }

  const { productId } = event.pathParameters;
  let body;

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

  const updateExpression: string[] = [];
  const expressionAttributeValues: { [key: string]: any } = {};
  const expressionAttributeNames: { [key: string]: string } = {};

  if (body.name) {
    updateExpression.push("#name = :name");
    expressionAttributeValues[":name"] = { S: body.name };
    expressionAttributeNames["#name"] = "name";
  }

  if (body.description) {
    updateExpression.push("#description = :description");
    expressionAttributeValues[":description"] = { S: body.description };
    expressionAttributeNames["#description"] = "description";
  }

  if (body.price) {
    updateExpression.push("#price = :price");
    expressionAttributeValues[":price"] = { N: body.price.toString() };
    expressionAttributeNames["#price"] = "price";
  }

  const command = new UpdateItemCommand({
    TableName: "ProductsTable",
    Key: {
      id: { S: productId },
    },
    UpdateExpression: `SET ${updateExpression.join(", ")}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
  });

  try {
    const result = await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Product updated successfully",
        updatedAttributes: result.Attributes,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to update product",
        error: error.message,
      }),
    };
  }
};
