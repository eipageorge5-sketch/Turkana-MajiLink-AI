import { z } from "zod";
import {
  UserRoles,
  SupportedLocales,
  WaterPointTypes,
  OwnerTypes,
  IncidentStatuses,
  IncidentPriorities,
  IssueTypes,
  SuggestionStatuses,
} from "@/lib/constants";

// ==========================================
// BASE & SHARED SCHEMAS
// ==========================================
export const LocaleSchema = z.nativeEnum(SupportedLocales);

// ==========================================
// USER SCHEMA
// ==========================================
export const UserSchema = z.object({
  PK: z.string(), // TENANT#<tenant_id>
  SK: z.string(), // USER#<user_id>
  tenantId: z.string(),
  userId: z.string(),
  role: z.nativeEnum(UserRoles),
  name: z.string(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  preferredLanguage: LocaleSchema.default(SupportedLocales.EN),
  wardId: z.string().optional(),
  subCountyId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  createdAt: z.string(), // ISO 8601
  updatedAt: z.string(),
});
export type User = z.infer<typeof UserSchema>;

// ==========================================
// WATER POINT SCHEMA
// ==========================================
export const WaterPointSchema = z.object({
  PK: z.string(), // TENANT#<tenant_id>
  SK: z.string(), // WATERPOINT#<waterpoint_id>
  GSI1PK: z.string(), // WARD#<ward_id>
  GSI1SK: z.string(), // WATERPOINT#<waterpoint_id>
  
  tenantId: z.string(),
  waterpointId: z.string(),
  name: z.string(),
  type: z.nativeEnum(WaterPointTypes),
  ownerType: z.nativeEnum(OwnerTypes),
  status: z.enum(['OPERATIONAL', 'DEGRADED', 'CRITICAL', 'OFFLINE']).default('OPERATIONAL'),
  
  latitude: z.number(),
  longitude: z.number(),
  wardId: z.string(),
  subCountyId: z.string(),
  
  healthScore: z.number().min(0).max(100).default(100),
  incidentCount: z.number().default(0),
  lastInspectionDate: z.string().optional(),
  
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type WaterPoint = z.infer<typeof WaterPointSchema>;

// ==========================================
// INCIDENT SCHEMA
// ==========================================
export const IncidentSchema = z.object({
  PK: z.string(), // TENANT#<tenant_id>
  SK: z.string(), // INCIDENT#<incident_id>
  
  GSI1PK: z.string(), // WATERPOINT#<waterpoint_id>
  GSI1SK: z.string(), // TIMESTAMP#<unix_epoch>
  GSI2PK: z.string(), // USER#<reported_by> OR TECHNICIAN#<assigned_to>
  GSI2SK: z.string(), // INCIDENT#<incident_id>
  GSI3PK: z.string(), // TRACKING#<tracking_id>
  GSI3SK: z.literal('METADATA'),
  
  tenantId: z.string(),
  incidentId: z.string(),
  trackingId: z.string(), // e.g., ML-1042
  
  waterpointId: z.string(),
  issueType: z.nativeEnum(IssueTypes),
  description: z.string().optional(),
  photos: z.array(z.string()).default([]), // S3 URLs
  
  status: z.nativeEnum(IncidentStatuses).default(IncidentStatuses.OPEN),
  priority: z.nativeEnum(IncidentPriorities).default(IncidentPriorities.LOW),
  
  reportedBy: z.string(),
  assignedTo: z.string().optional(),
  
  createdAt: z.string(),
  updatedAt: z.string(),
  resolvedAt: z.string().optional(),
});
export type Incident = z.infer<typeof IncidentSchema>;

// ==========================================
// WATER POINT SUGGESTION SCHEMA
// ==========================================
export const SuggestionSchema = z.object({
  PK: z.string(), // TENANT#<tenant_id>
  SK: z.string(), // SUGGESTION#<suggestion_id>
  
  tenantId: z.string(),
  suggestionId: z.string(),
  suggestedName: z.string(),
  
  latitude: z.number(),
  longitude: z.number(),
  wardId: z.string().optional(),
  
  status: z.nativeEnum(SuggestionStatuses).default(SuggestionStatuses.PENDING),
  photoUrl: z.string().optional(),
  
  suggestedBy: z.string(),
  verifiedBy: z.string().optional(),
  approvedBy: z.string().optional(),
  
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Suggestion = z.infer<typeof SuggestionSchema>;

// ==========================================
// NOTIFICATION TEMPLATE SCHEMA
// ==========================================
export const TemplateSchema = z.object({
  PK: z.string(), // TEMPLATE#<template_type>
  SK: z.string(), // LANG#<language_code>
  
  templateType: z.string(),
  language: LocaleSchema,
  
  subject: z.string().optional(),
  body: z.string(),
  variables: z.array(z.string()).default([]), // e.g., ["trackingId", "waterpointName"]
});
export type Template = z.infer<typeof TemplateSchema>;