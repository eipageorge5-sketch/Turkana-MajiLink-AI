'use server';

import { incidentRepo } from "@/db/repositories/incident.repo";
import { IncidentPriorities, IncidentStatuses } from "@/lib/constants";
import { generateTrackingId } from "@/lib/utils";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

const TENANT_ID = "turkana";

// ==========================================
// 🎪 CONFERENCE DEMO MODE (NO AWS REQUIRED)
// ==========================================
const DEMO_MODE = true; // Set to false when you have real AWS credentials

/**
 * Allows a public user (citizen) to report an incident directly from the map.
 */
export async function createPublicIncidentAction(formData: {
  waterpointId: string;
  waterpointName: string;
  issueType: string;
  description: string;
}) {
  if (DEMO_MODE) {
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const demoTrackingId = "ML-" + Math.floor(1000 + Math.random() * 9000);
    
    return { 
      success: true, 
      trackingId: demoTrackingId, 
      message: "Report submitted successfully! (Demo Mode)" 
    };
  }

  // REAL AWS CODE (Only runs when DEMO_MODE = false)
  try {
    const incidentId = crypto.randomUUID();
    const trackingId = generateTrackingId();
    const timestamp = Date.now().toString();

    const item = await incidentRepo.create({
      PK: `TENANT#${TENANT_ID}`,
      SK: `INCIDENT#${incidentId}`,
      GSI1PK: `WATERPOINT#${formData.waterpointId}`,
      GSI1SK: `TIMESTAMP#${timestamp}`,
      GSI2PK: `TECHNICIAN#tech-001`,
      GSI2SK: `INCIDENT#${incidentId}`,
      GSI3PK: `TRACKING#${trackingId}`,
      GSI3SK: "METADATA",
      
      tenantId: TENANT_ID,
      incidentId,
      trackingId,
      waterpointId: formData.waterpointId,
      issueType: formData.issueType as any,
      description: formData.description,
      photos: [],
      
      status: IncidentStatuses.OPEN,
      priority: IncidentPriorities.LOW,
      
      reportedBy: "public-citizen",
      assignedTo: "tech-001",
    });

    return { success: true, trackingId: item.trackingId, message: "Report submitted successfully!" };
  } catch (error) {
    console.error("Public incident creation error:", error);
    return { success: false, message: "Failed to submit report. Please try again." };
  }
}

/**
 * Fetches all incidents assigned to a specific technician.
 * In DEMO MODE, returns realistic mock data.
 */
export async function getTechnicianIncidentsAction(technicianId: string) {
  if (DEMO_MODE) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Return realistic mock incidents for the demo
    const mockIncidents = [
      {
        incidentId: "demo-1",
        trackingId: "ML-4821",
        waterpointId: "WATERPOINT#borehole-lodwar-central",
        issueType: "PUMP_FAILURE",
        description: "The pump is making loud grinding noises and water flow has reduced significantly.",
        priority: "CRITICAL",
        status: "OPEN",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        assignedTo: technicianId,
      },
      {
        incidentId: "demo-2",
        trackingId: "ML-3947",
        waterpointId: "WATERPOINT#kiosk-kakuma",
        issueType: "PIPE_LEAK",
        description: "Major pipe leak near the distribution point. Water wasting.",
        priority: "HIGH",
        status: "IN_PROGRESS",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        assignedTo: technicianId,
      },
      {
        incidentId: "demo-3",
        trackingId: "ML-2103",
        waterpointId: "WATERPOINT#tap-stand-ward-5",
        issueType: "NO_WATER_FLOW",
        description: "No water coming out since yesterday morning.",
        priority: "MEDIUM",
        status: "RESOLVED",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        assignedTo: technicianId,
      },
    ];
    
    return { success: true, data: mockIncidents };
  }

  // REAL AWS CODE
  try {
    const incidents = await incidentRepo.getByTechnician(TENANT_ID, technicianId);
    
    const priorityWeight: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    incidents.sort((a, b) => {
      if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    return { success: true, data: incidents };
  } catch (error) {
    console.error("Failed to fetch technician incidents:", error);
    return { success: false, data: [] };
  }
}

/**
 * Allows a technician to update the status of an incident.
 */
export async function updateIncidentStatusAction(
  incidentId: string,
  status: string,
  technicianId: string,
  resolvedAt?: string
) {
  if (DEMO_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    revalidatePath('/technician');
    return { success: true, message: "Incident status updated successfully. (Demo Mode)" };
  }

  // REAL AWS CODE
  try {
    await incidentRepo.updateStatus(
      TENANT_ID,
      incidentId,
      status,
      technicianId,
      resolvedAt
    );
    
    revalidatePath('/technician');
    return { success: true, message: "Incident status updated successfully." };
  } catch (error) {
    console.error("Failed to update incident status:", error);
    return { success: false, message: "Failed to update incident." };
  }
}