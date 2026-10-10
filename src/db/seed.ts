import { waterpointRepo } from "./repositories/waterpoint.repo";
import { WaterPointTypes, OwnerTypes } from "@/lib/constants";
import crypto from "crypto";

const TENANT_ID = "turkana";

// Realistic Wards in Turkana County
const wards = [
  { id: "ward-kanamkemer", name: "Kanamkemer", subCountyId: "sub-turkana-central" },
  { id: "ward-kerio", name: "Kerio Delta", subCountyId: "sub-turkana-central" },
  { id: "ward-kalokol", name: "Kalokol", subCountyId: "sub-turkana-central" },
  { id: "ward-lodwar", name: "Lodwar", subCountyId: "sub-turkana-central" },
  { id: "ward-kaeris", name: "Kaeris", subCountyId: "sub-turkana-north" },
  { id: "ward-kibish", name: "Kibish", subCountyId: "sub-turkana-north" },
  { id: "ward-kaputir", name: "Kaputir", subCountyId: "sub-turkana-south" },
  { id: "ward-lokichar", name: "Lokichar", subCountyId: "sub-turkana-south" },
  { id: "ward-kakuma", name: "Kakuma", subCountyId: "sub-turkana-west" },
  { id: "ward-lokitaung", name: "Lokitaung", subCountyId: "sub-turkana-north" },
];

const baseNames = [
  "Napetet", "Kakuma", "Lokichoggio", "Kalokol", "Lodwar", "Kerio", "Turkwel", 
  "Lokitaung", "Nariokotome", "Kibish", "Kaeris", "Kaputir", "Lokichar", "Kanamkemer",
  "Lobokat", "Sigor", "Kotaruk", "Nakalale", "Kapedo", "Lokori"
];

const types = Object.values(WaterPointTypes);
const owners = Object.values(OwnerTypes);

async function seed() {
  console.log("🌱 Starting seed process for Turkana MajiLink AI...");
  console.log(`📍 Target Table: MajiLink-Prod | Tenant: ${TENANT_ID}`);
  
  const promises: Promise<any>[] = [];
  const totalPoints = 150;

  for (let i = 1; i <= totalPoints; i++) {
    const ward = wards[Math.floor(Math.random() * wards.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const owner = owners[Math.floor(Math.random() * owners.length)];
    const baseName = baseNames[Math.floor(Math.random() * baseNames.length)];
    
    // Generate realistic coordinates for Turkana (approx bounds)
    // Latitude: 2.8 to 3.8
    // Longitude: 35.2 to 36.0
    const lat = 2.8 + Math.random() * 1.0; 
    const lng = 35.2 + Math.random() * 0.8; 

    const waterpointId = crypto.randomUUID();

    // Randomly assign a health score (mostly healthy, some degraded for demo)
    const healthRoll = Math.random();
    let healthScore = 100;
    if (healthRoll > 0.8) healthScore = Math.floor(Math.random() * 30) + 30; // 30-59 (Critical)
    else if (healthRoll > 0.6) healthScore = Math.floor(Math.random() * 30) + 60; // 60-89 (Warning)

    const data = {
      PK: `TENANT#${TENANT_ID}`,
      SK: `WATERPOINT#${waterpointId}`,
      GSI1PK: `WARD#${ward.id}`,
      GSI1SK: `WATERPOINT#${waterpointId}`,
      
      tenantId: TENANT_ID,
      waterpointId, // Kept your original field string name parameter
      id: waterpointId, // ADDED: Aligns explicitly with Repository expectations
      name: `${baseName} ${type.replace('_', ' ')} ${i}`,
      type: type as any,
      ownerType: owner,
      
      // MODIFIED: Maps the status to match repository enum layout structure requirements
      status: (healthScore < 60 ? 'CRITICAL' : healthScore < 90 ? 'DEGRADED' : 'OPERATIONAL') as any,
      
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6)),
      wardId: ward.id,
      subCountyId: ward.subCountyId,
      
      populationServed: Math.floor(1000 + Math.random() * 5000), // ADDED: Mandatory repo property parameter
      lastUpdated: new Date().toISOString(), // ADDED: Mandatory repo timing metric parameter
      
      healthScore,
      incidentCount: healthScore < 90 ? Math.floor(Math.random() * 10) + 1 : 0,
      
      createdBy: "system-seed",
    };

    promises.push(waterpointRepo.create(data));
    
    // Batch in chunks of 25 to avoid overwhelming the DB connection
    if (promises.length >= 25) {
      await Promise.all(promises);
      console.log(`✅ Inserted batch... (${i}/${totalPoints})`);
      promises.length = 0; // Clear array
    }
  }

  // Insert any remaining items
  if (promises.length > 0) {
    await Promise.all(promises);
  }

  console.log("🎉 Seed process completed successfully!");
  console.log(`🗺️  ${totalPoints} water points are now ready on the map.`);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});