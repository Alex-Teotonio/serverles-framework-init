import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayAuthorizerEvent } from "aws-lambda";

exports.index = async (event: APIGatewayAuthorizerEvent) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: event,
    }),
  };
};
