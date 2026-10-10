// ==========================================
// USER & AUTH
// ==========================================
export const UserRoles = {
  ADMIN: 'ADMIN',
  COUNTY_OFFICIAL: 'COUNTY_OFFICIAL',
  NGO_STAFF: 'NGO_STAFF',
  COMMITTEE_LEADER: 'COMMITTEE_LEADER',
  TECHNICIAN: 'TECHNICIAN',
  CITIZEN: 'CITIZEN',
} as const;
export type UserRole = typeof UserRoles[keyof typeof UserRoles];

export const SupportedLocales = {
  EN: 'en',
  SW: 'sw',
} as const;
export type SupportedLocale = typeof SupportedLocales[keyof typeof SupportedLocales];

// ==========================================
// WATER INFRASTRUCTURE
// ==========================================
export const WaterPointTypes = {
  BOREHOLE: 'BOREHOLE',
  WATER_KIOSK: 'WATER_KIOSK',
  TAP_STAND: 'TAP_STAND',
  WELL: 'WELL',
  DAM: 'DAM',
  SPRING: 'SPRING',
  WATER_PAN: 'WATER_PAN',
} as const;
export type WaterPointType = typeof WaterPointTypes[keyof typeof WaterPointTypes];

export const OwnerTypes = {
  COUNTY: 'COUNTY',
  NGO: 'NGO',
  COMMUNITY: 'COMMUNITY',
  PRIVATE: 'PRIVATE',
} as const;
export type OwnerType = typeof OwnerTypes[keyof typeof OwnerTypes];

// ==========================================
// INCIDENTS & ESCALATION
// ==========================================
export const IncidentStatuses = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const;
export type IncidentStatus = typeof IncidentStatuses[keyof typeof IncidentStatuses];

export const IncidentPriorities = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;
export type IncidentPriority = typeof IncidentPriorities[keyof typeof IncidentPriorities];

export const IssueTypes = {
  BROKEN_TAP: 'BROKEN_TAP',
  NO_WATER_FLOW: 'NO_WATER_FLOW',
  PUMP_FAILURE: 'PUMP_FAILURE',
  CONTAMINATION: 'CONTAMINATION',
  OTHER: 'OTHER',
} as const;
export type IssueType = typeof IssueTypes[keyof typeof IssueTypes];

// ==========================================
// COMMUNITY VALIDATION (LIVING MAP)
// ==========================================
export const SuggestionStatuses = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;
export type SuggestionStatus = typeof SuggestionStatuses[keyof typeof SuggestionStatuses];

export const WaterPointStatuses = {
  OPERATIONAL: 'OPERATIONAL',
  DEGRADED: 'DEGRADED',
  CRITICAL: 'CRITICAL',
  OFFLINE: 'OFFLINE',
} as const;
export type WaterPointStatus = typeof WaterPointStatuses[keyof typeof WaterPointStatuses];