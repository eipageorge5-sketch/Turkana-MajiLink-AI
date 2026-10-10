import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";

// Force a totally local dummy client structure to bypass your Mac's cached expired profile tokens
const client = new DynamoDBClient({
  region: "local",
  credentials: {
    accessKeyId: "dummyHackathonKeyId",
    secretAccessKey: "dummyHackathonSecretAccessKey"
  }
});

async function run() {
  console.log("⏳ Initializing MajiLink-Prod table provisioning...");
  const command = new CreateTableCommand({
    TableName: "MajiLink-Prod",
    AttributeDefinitions: [
      { AttributeName: "PK", AttributeType: "S" },
      { AttributeName: "SK", AttributeType: "S" },
      { AttributeName: "GSI1PK", AttributeType: "S" },
      { AttributeName: "GSI1SK", AttributeType: "S" },
      { AttributeName: "GSI2PK", AttributeType: "S" },
      { AttributeName: "GSI2SK", AttributeType: "S" },
      { AttributeName: "GSI3PK", AttributeType: "S" },
      { AttributeName: "GSI3SK", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "PK", KeyType: "HASH" },
      { AttributeName: "SK", KeyType: "RANGE" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "GSI1",
        KeySchema: [
          { AttributeName: "GSI1PK", KeyType: "HASH" },
          { AttributeName: "GSI1SK", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
      },
      {
        IndexName: "GSI2",
        KeySchema: [
          { AttributeName: "GSI2PK", KeyType: "HASH" },
          { AttributeName: "GSI2SK", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
      },
      {
        IndexName: "GSI3",
        KeySchema: [
          { AttributeName: "GSI3PK", KeyType: "HASH" },
          { AttributeName: "GSI3SK", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
      },
    ],
    BillingMode: "PAY_PER_REQUEST",
  });

  try {
    const result = await client.send(command);
    console.log("✅ MajiLink-Prod table configuration built! Status:", result.TableDescription?.TableStatus);
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
  }
}

run();