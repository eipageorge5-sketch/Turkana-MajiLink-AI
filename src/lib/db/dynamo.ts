import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "localDevKeyId",
    secretAccessKey: "localDevSecretAccessKey"
  }
});

export const dynamoDocClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});