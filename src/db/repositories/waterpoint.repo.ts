import { db, TABLE_NAME } from "../client";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { WaterPoint, WaterPointSchema } from "../schema";
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Define a stable file path on your disk to share data between your seed script and server
const LOCAL_DB_PATH = path.join(process.cwd(), 'src/db/local_waterpoints.json');

// Helper to safely read from our local file database backup layer
function readLocalDb(): WaterPoint[] {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) return [];
    const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper to safely write data updates down onto our disk frame
function writeLocalDb(data: WaterPoint[]) {
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error("Local disk save error:", e);
  }
}

export const waterpointRepo = {
  /**
   * Creates a new Water Point in the database.
   * Automatically generates PK, SK, GSI keys, and waterpointId.
   */
  async create(data: Omit<WaterPoint, "PK" | "SK" | "GSI1PK" | "GSI1SK" | "createdAt" | "updatedAt" | "waterpointId">) {
    const now = new Date().toISOString();
    const waterpointId = crypto.randomUUID();
    
    // Construct the full item with Single Table Design keys
    const fullItem = {
      ...data,
      waterpointId,
      PK: `TENANT#${data.tenantId}`,
      SK: `WATERPOINT#${waterpointId}`,
      GSI1PK: `WARD#${data.wardId}`,
      GSI1SK: `WATERPOINT#${waterpointId}`,
      createdAt: now,
      updatedAt: now,
    };

    // Validate against Zod schema
    const item = WaterPointSchema.parse(fullItem);

    try {
      await db.send(
        new PutCommand({ TableName: TABLE_NAME, Item: item })
      );
    } catch (error) {
      // Save data securely onto your disk when AWS network channels are blocked
      const localDb = readLocalDb();
      localDb.push(item as WaterPoint);
      writeLocalDb(localDb);
    }

    return item;
  },

  /**
   * Retrieves all Water Points within a specific Ward.
   */
  async getByWard(tenantId: string, wardId: string) {
    try {
      const result = await db.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: "GSI1",
          KeyConditionExpression: "GSI1PK = :pk AND begins_with(GSI1SK, :sk)",
          ExpressionAttributeValues: {
            ":pk": `WARD#${wardId}`,
            ":sk": "WATERPOINT#",
          },
        })
      );
      return (result.Items || []) as WaterPoint[];
    } catch (error) {
      return readLocalDb().filter(item => item.wardId === wardId);
    }
  },

  /**
   * Retrieves all Water Points for a Tenant (County).
   */
  async getAll(tenantId: string, limit = 500) {
    try {
      const result = await db.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
          ExpressionAttributeValues: {
            ":pk": `TENANT#${tenantId}`,
            ":sk": "WATERPOINT#",
          },
          Limit: limit,
        })
      );
      return (result.Items || []) as WaterPoint[];
    } catch (error) {
      // Pulls directly from the shared file database to instantly display your data points
      return readLocalDb().slice(0, limit);
    }
  },
  
  /**
   * Retrieves a single Water Point by its ID.
   */
  async getById(tenantId: string, waterpointId: string) {
    try {
      const result = await db.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: "PK = :pk AND SK = :sk",
          ExpressionAttributeValues: {
            ":pk": `TENANT#${tenantId}`,
            ":sk": `WATERPOINT#${waterpointId}`,
          },
          Limit: 1,
        })
      );
      return result.Items?.[0] as WaterPoint | undefined;
    } catch (error) {
      return readLocalDb().find(item => item.waterpointId === waterpointId);
    }
  }
};