import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Prevent multiple instances of the client in development (Hot Module Reloading)
const globalForDb = globalThis as unknown as {
  dbClient: DynamoDBDocumentClient | undefined;
};

function createDbClient() {
  const rawClient = new DynamoDBClient({
    region: process.env.AWS_REGION || "af-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });

  // Configure document client to automatically handle JS types (Sets, undefined, etc.)
  return DynamoDBDocumentClient.from(rawClient, {
    marshallOptions: {
      removeUndefinedValues: true,
      convertEmptyValues: false,
    },
    unmarshallOptions: {
      wrapNumbers: false,
    },
  });
}

export const db = globalForDb.dbClient ?? createDbClient();

if (process.env.NODE_ENV !== "production") {
  globalForDb.dbClient = db;
}

export const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "MajiLink-Prod";