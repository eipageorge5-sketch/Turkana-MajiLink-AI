import { db, TABLE_NAME } from "../client";
import { PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { Incident, IncidentSchema } from "../schema";

export const incidentRepo = {
  /**
   * Creates a new incident in the database.
   */
  async create(data: Omit<Incident, "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    const item = IncidentSchema.parse({
      ...data,
      createdAt: now,
      updatedAt: now,
    });

    await db.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );
    return item;
  },

  /**
   * Retrieves all incidents assigned to a specific technician.
   * Uses GSI2 for efficient querying.
   */
  async getByTechnician(tenantId: string, technicianId: string) {
    const result = await db.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "GSI2",
        KeyConditionExpression: "GSI2PK = :pk AND begins_with(GSI2SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": `TECHNICIAN#${technicianId}`,
          ":sk": "INCIDENT#",
        },
      })
    );
    return (result.Items || []) as Incident[];
  },

  /**
   * Updates the status of an incident (e.g., OPEN -> IN_PROGRESS -> RESOLVED).
   */
  async updateStatus(
    tenantId: string,
    incidentId: string,
    status: string,
    assignedTo?: string,
    resolvedAt?: string
  ) {
    const now = new Date().toISOString();
    const updateExpressions: string[] = ["set #status = :status, updatedAt = :updatedAt"];
    const expressionAttributeNames: Record<string, string> = {
      "#status": "status",
    };
    const expressionAttributeValues: Record<string, any> = {
      ":status": status,
      ":updatedAt": now,
    };

    if (assignedTo) {
      updateExpressions.push("assignedTo = :assignedTo");
      expressionAttributeValues[":assignedTo"] = assignedTo;
    }

    if (resolvedAt) {
      updateExpressions.push("resolvedAt = :resolvedAt");
      expressionAttributeValues[":resolvedAt"] = resolvedAt;
    }

    await db.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `TENANT#${tenantId}`,
          SK: `INCIDENT#${incidentId}`,
        },
        UpdateExpression: updateExpressions.join(", "),
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
    );
  },
};