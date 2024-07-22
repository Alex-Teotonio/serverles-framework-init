import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { client } from "../lib/dynamoClient";

exports.handler = async () => {
  const command = new ScanCommand({
    TableName: "ProductsTable",
  });
  const { Items } = await client.send(command);

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: Items,
    }),
  };
};
