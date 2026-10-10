'use server';
import { WaterPointType, OwnerType, WaterPointStatuses } from "@/lib/constants";
import { waterpointRepo } from "@/db/repositories/waterpoint.repo";
import { WaterPoint } from "@/db/schema";
import { revalidatePath } from "next/cache";

const TENANT_ID = "turkana";

/**
 * Server Action: Get all water points for map display
 * Returns an object with success status and data array to match the UI expectations.
 */
export async function getWaterPointsForMap(): Promise<{ success: boolean; data: WaterPoint[] }> {
  try {
    const points = await waterpointRepo.getAll(TENANT_ID, 1000);
    console.log("🗺️ [SERVER] Fetching map data. Found points:", points.length);
    return { success: true, data: points };
  } catch (error) {
    console.error("Failed to fetch water points:", error);
    return { success: false, data: [] };
  }
}
/**
 * Server Action: Create a single water point manually from the UI form.
 * Uses strict types to ensure TypeScript is happy.
 */
export async function createWaterPointAction(formData: {
  name: string;
  type: WaterPointType;
  ownerType: OwnerType;
  latitude: number;
  longitude: number;
  wardId: string;
}) {
  try {
    await waterpointRepo.create({
      tenantId: TENANT_ID,
      name: formData.name,
      type: formData.type,
      ownerType: formData.ownerType,
      latitude: formData.latitude,
      longitude: formData.longitude,
      wardId: formData.wardId,
      subCountyId: "sub-turkana-central",
      status: WaterPointStatuses.OPERATIONAL,
      healthScore: 100,
      incidentCount: 0,
      createdBy: "system-admin",
    });

    revalidatePath('/admin/assets');
    revalidatePath('/map');
    
    return { success: true, message: "Water point created successfully." };
  } catch (error) {
    console.error("Create water point error:", error);
    return { success: false, message: "Failed to create water point." };
  }
}

/**
 * Server Action: Import multiple water points from parsed CSV data.
 */
export async function importWaterPointsCSVAction(rows: any[]) {
  let successCount = 0;
  let failCount = 0;
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      // Normalize and validate CSV strings into strict enum types
      const rawType = String(row.type || "").toUpperCase().replace(" ", "_");
      const rawOwner = String(row.ownerType || "").toUpperCase().replace(" ", "_");

      const normalized = {
        tenantId: TENANT_ID,
        name: String(row.name || "").trim(),
        type: rawType as WaterPointType,
        ownerType: rawOwner as OwnerType,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        wardId: String(row.wardId || "").trim(),
        subCountyId: "sub-turkana-central",
        status: WaterPointStatuses.OPERATIONAL,
        healthScore: 100,
        incidentCount: 0,
        createdBy: "csv-import",
      };

      // Basic validation before sending to repo
      if (!normalized.name || isNaN(normalized.latitude) || isNaN(normalized.longitude)) {
        throw new Error("Missing required fields (name, lat, lng)");
      }

      await waterpointRepo.create(normalized);
      successCount++;
    } catch (error: any) {
      failCount++;
      errors.push(`Row ${i + 2}: ${error.message}`);
    }
  }

  revalidatePath('/admin/assets');
  revalidatePath('/map');

  return { 
    success: failCount === 0, 
    message: `Import complete. ${successCount} succeeded, ${failCount} failed.`,
    errors 
  };
}