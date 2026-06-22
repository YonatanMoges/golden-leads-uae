export type LeadStatus = "Hot" | "Warm" | "Cold";
export type PipelineStage =
  | "New Lead"
  | "Contacted"
  | "Viewing Scheduled"
  | "Offer Made"
  | "Closed";
export type PropertyType = "Apartment" | "Villa" | "Townhouse" | "Penthouse" | "Office";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  budget: number; // AED
  interest: string; // location / development
  propertyType: PropertyType;
  status: LeadStatus;
  stage: PipelineStage;
  agent: string;
  source: string;
  createdAt: string; // ISO
  lastContact: string; // ISO
  nextFollowUp?: string; // ISO
  notes?: string;
}

const fmtAED = (n: number) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(n);

export const formatAED = fmtAED;

export const leads: Lead[] = [
  {
    id: "L-1042",
    name: "Ahmed Al Mansouri",
    email: "ahmed.mansouri@gmail.com",
    phone: "+971 50 234 8821",
    nationality: "UAE",
    budget: 4_500_000,
    interest: "Downtown Dubai · Burj Vista",
    propertyType: "Apartment",
    status: "Hot",
    stage: "Offer Made",
    agent: "Layla Hassan",
    source: "Property Finder",
    createdAt: "2026-05-22",
    lastContact: "2026-06-15",
    nextFollowUp: "2026-06-18",
    notes: "Negotiating on 2BR unit, wants Burj view.",
  },
  {
    id: "L-1041",
    name: "Priya Sharma",
    email: "priya.sharma@outlook.com",
    phone: "+971 55 119 4402",
    nationality: "India",
    budget: 1_850_000,
    interest: "JVC · Belgravia Heights",
    propertyType: "Apartment",
    status: "Hot",
    stage: "Viewing Scheduled",
    agent: "Omar Khalil",
    source: "Bayut",
    createdAt: "2026-06-02",
    lastContact: "2026-06-14",
    nextFollowUp: "2026-06-17",
  },
  {
    id: "L-1040",
    name: "James O'Connor",
    email: "j.oconnor@me.com",
    phone: "+971 52 778 2210",
    nationality: "UK",
    budget: 12_000_000,
    interest: "Palm Jumeirah · Signature Villa",
    propertyType: "Villa",
    status: "Hot",
    stage: "Contacted",
    agent: "Layla Hassan",
    source: "Referral",
    createdAt: "2026-06-08",
    lastContact: "2026-06-16",
    nextFollowUp: "2026-06-19",
  },
  {
    id: "L-1039",
    name: "Mohammed Al Suwaidi",
    email: "m.suwaidi@emirates.net.ae",
    phone: "+971 50 901 3340",
    nationality: "UAE",
    budget: 8_200_000,
    interest: "Saadiyat Island · Mamsha Al Saadiyat",
    propertyType: "Penthouse",
    status: "Warm",
    stage: "New Lead",
    agent: "Sara Ibrahim",
    source: "Website",
    createdAt: "2026-06-12",
    lastContact: "2026-06-13",
    nextFollowUp: "2026-06-18",
  },
  {
    id: "L-1038",
    name: "Elena Volkova",
    email: "elena.v@yandex.ru",
    phone: "+971 56 220 7711",
    nationality: "Russia",
    budget: 6_500_000,
    interest: "Dubai Marina · Marina Gate",
    propertyType: "Apartment",
    status: "Hot",
    stage: "Offer Made",
    agent: "Omar Khalil",
    source: "Instagram",
    createdAt: "2026-05-18",
    lastContact: "2026-06-16",
    nextFollowUp: "2026-06-17",
  },
  {
    id: "L-1037",
    name: "Chen Wei",
    email: "chen.wei@qq.com",
    phone: "+971 58 446 1290",
    nationality: "China",
    budget: 3_200_000,
    interest: "Business Bay · Peninsula",
    propertyType: "Apartment",
    status: "Warm",
    stage: "Contacted",
    agent: "Sara Ibrahim",
    source: "Property Finder",
    createdAt: "2026-06-05",
    lastContact: "2026-06-12",
    nextFollowUp: "2026-06-20",
  },
  {
    id: "L-1036",
    name: "Fatima Al Zaabi",
    email: "f.alzaabi@gmail.com",
    phone: "+971 50 332 8890",
    nationality: "UAE",
    budget: 15_000_000,
    interest: "Emirates Hills · Sector W",
    propertyType: "Villa",
    status: "Hot",
    stage: "Viewing Scheduled",
    agent: "Layla Hassan",
    source: "Referral",
    createdAt: "2026-06-01",
    lastContact: "2026-06-15",
    nextFollowUp: "2026-06-18",
  },
  {
    id: "L-1035",
    name: "Robert Mitchell",
    email: "rmitchell@gmail.com",
    phone: "+971 54 778 1102",
    nationality: "USA",
    budget: 2_400_000,
    interest: "Arabian Ranches · Camellia",
    propertyType: "Townhouse",
    status: "Cold",
    stage: "New Lead",
    agent: "Omar Khalil",
    source: "Dubizzle",
    createdAt: "2026-06-14",
    lastContact: "2026-06-14",
    nextFollowUp: "2026-06-22",
  },
  {
    id: "L-1034",
    name: "Yusuf Demir",
    email: "yusuf.demir@hotmail.com",
    phone: "+971 55 880 2231",
    nationality: "Turkey",
    budget: 5_600_000,
    interest: "Dubai Hills · Golf Place",
    propertyType: "Villa",
    status: "Warm",
    stage: "Closed",
    agent: "Sara Ibrahim",
    source: "Bayut",
    createdAt: "2026-04-20",
    lastContact: "2026-06-10",
  },
  {
    id: "L-1033",
    name: "Sophie Laurent",
    email: "s.laurent@orange.fr",
    phone: "+971 52 119 4477",
    nationality: "France",
    budget: 3_900_000,
    interest: "JBR · Bahar",
    propertyType: "Apartment",
    status: "Hot",
    stage: "Closed",
    agent: "Layla Hassan",
    source: "Website",
    createdAt: "2026-04-12",
    lastContact: "2026-06-08",
  },
  {
    id: "L-1032",
    name: "Khalid Al Nahyan",
    email: "k.nahyan@adnoc.ae",
    phone: "+971 50 667 3321",
    nationality: "UAE",
    budget: 22_000_000,
    interest: "Al Reem Island · Sky Tower",
    propertyType: "Penthouse",
    status: "Hot",
    stage: "Offer Made",
    agent: "Layla Hassan",
    source: "Referral",
    createdAt: "2026-05-30",
    lastContact: "2026-06-16",
    nextFollowUp: "2026-06-17",
  },
  {
    id: "L-1031",
    name: "Anna Schmidt",
    email: "anna.schmidt@gmx.de",
    phone: "+971 56 220 1908",
    nationality: "Germany",
    budget: 2_100_000,
    interest: "Town Square · Hayat Boulevard",
    propertyType: "Townhouse",
    status: "Warm",
    stage: "Contacted",
    agent: "Omar Khalil",
    source: "Property Finder",
    createdAt: "2026-06-09",
    lastContact: "2026-06-13",
    nextFollowUp: "2026-06-19",
  },
  {
    id: "L-1030",
    name: "Hassan Karimi",
    email: "h.karimi@yahoo.com",
    phone: "+971 58 901 4423",
    nationality: "Iran",
    budget: 7_800_000,
    interest: "Bluewaters · Residences",
    propertyType: "Apartment",
    status: "Hot",
    stage: "Viewing Scheduled",
    agent: "Sara Ibrahim",
    source: "Instagram",
    createdAt: "2026-06-04",
    lastContact: "2026-06-15",
    nextFollowUp: "2026-06-18",
  },
  {
    id: "L-1029",
    name: "Olivia Bennett",
    email: "o.bennett@gmail.com",
    phone: "+971 54 332 7765",
    nationality: "Australia",
    budget: 4_200_000,
    interest: "City Walk · Building 11",
    propertyType: "Apartment",
    status: "Warm",
    stage: "New Lead",
    agent: "Omar Khalil",
    source: "Website",
    createdAt: "2026-06-15",
    lastContact: "2026-06-15",
    nextFollowUp: "2026-06-21",
  },
  {
    id: "L-1028",
    name: "Rajesh Patel",
    email: "rajesh.patel@gmail.com",
    phone: "+971 50 445 9912",
    nationality: "India",
    budget: 9_500_000,
    interest: "Jumeirah Golf Estates · Earth",
    propertyType: "Villa",
    status: "Hot",
    stage: "Closed",
    agent: "Layla Hassan",
    source: "Referral",
    createdAt: "2026-03-28",
    lastContact: "2026-06-02",
  },
  {
    id: "L-1027",
    name: "Maria Gonzalez",
    email: "m.gonzalez@gmail.com",
    phone: "+971 55 778 2244",
    nationality: "Spain",
    budget: 1_600_000,
    interest: "Dubai South · Urbana",
    propertyType: "Townhouse",
    status: "Cold",
    stage: "Contacted",
    agent: "Sara Ibrahim",
    source: "Dubizzle",
    createdAt: "2026-06-07",
    lastContact: "2026-06-11",
    nextFollowUp: "2026-06-20",
  },
];

export const pipelineStages: PipelineStage[] = [
  "New Lead",
  "Contacted",
  "Viewing Scheduled",
  "Offer Made",
  "Closed",
];

// Analytics aggregates
export const monthlyPerformance = [
  { month: "Jan", leads: 84, deals: 6, revenue: 28 },
  { month: "Feb", leads: 96, deals: 8, revenue: 41 },
  { month: "Mar", leads: 112, deals: 11, revenue: 58 },
  { month: "Apr", leads: 108, deals: 9, revenue: 47 },
  { month: "May", leads: 134, deals: 14, revenue: 72 },
  { month: "Jun", leads: 121, deals: 12, revenue: 65 },
];

export const leadSources = [
  { source: "Property Finder", value: 34 },
  { source: "Bayut", value: 28 },
  { source: "Referral", value: 18 },
  { source: "Website", value: 12 },
  { source: "Instagram", value: 8 },
];

export const agentPerformance = [
  { agent: "Layla Hassan", deals: 14, revenue: 78 },
  { agent: "Omar Khalil", deals: 9, revenue: 41 },
  { agent: "Sara Ibrahim", deals: 7, revenue: 33 },
  { agent: "Yousef Rahim", deals: 5, revenue: 22 },
];

export interface ActivityEvent {
  id: string;
  type: "New Lead" | "Contacted" | "Viewing Scheduled" | "Offer Submitted" | "Deal Closed";
  leadName: string;
  detail: string;
  timestamp: string; // ISO
  agent: string;
}

export const leadSourcesChart = [
  { source: "Property Finder", count: 48 },
  { source: "Bayut", count: 36 },
  { source: "Referral", count: 22 },
  { source: "Website", count: 24 },
  { source: "WhatsApp", count: 18 },
  { source: "Manual Entry", count: 12 },
];

export const leadSourcePerformance = [
  { source: "Property Finder", totalLeads: 48, hotLeads: 14, conversionRate: "12.5%" },
  { source: "Bayut", totalLeads: 36, hotLeads: 10, conversionRate: "11.1%" },
  { source: "Website", totalLeads: 24, hotLeads: 6, conversionRate: "12.5%" },
  { source: "WhatsApp", totalLeads: 18, hotLeads: 5, conversionRate: "11.1%" },
  { source: "Referral", totalLeads: 22, hotLeads: 9, conversionRate: "22.7%" },
  { source: "Manual Entry", totalLeads: 12, hotLeads: 3, conversionRate: "8.3%" },
];

export const recentActivity: ActivityEvent[] = [
  {
    id: "A-1042",
    type: "Offer Submitted",
    leadName: "Ahmed Al Mansouri",
    detail: "Offer made on Downtown Dubai 2BR unit",
    timestamp: "2026-06-21T10:30:00",
    agent: "Layla Hassan",
  },
  {
    id: "A-1036",
    type: "Viewing Scheduled",
    leadName: "Fatima Al Zaabi",
    detail: "Viewing scheduled for Emirates Hills villa",
    timestamp: "2026-06-21T09:15:00",
    agent: "Layla Hassan",
  },
  {
    id: "A-1043",
    type: "New Lead",
    leadName: "Rashid Al Nuaimi",
    detail: "Enquiry via WhatsApp for Palm Jumeirah villa",
    timestamp: "2026-06-21T08:45:00",
    agent: "Omar Khalil",
  },
  {
    id: "A-1030",
    type: "Contacted",
    leadName: "Hassan Karimi",
    detail: "Follow-up call completed, viewing confirmed",
    timestamp: "2026-06-20T16:20:00",
    agent: "Sara Ibrahim",
  },
  {
    id: "A-1033",
    type: "Deal Closed",
    leadName: "Sophie Laurent",
    detail: "AED 3.9M deal closed at JBR · Bahar",
    timestamp: "2026-06-20T14:00:00",
    agent: "Layla Hassan",
  },
  {
    id: "A-1044",
    type: "New Lead",
    leadName: "Nadia Fakhoury",
    detail: "Website enquiry for Business Bay apartment",
    timestamp: "2026-06-20T11:10:00",
    agent: "Sara Ibrahim",
  },
  {
    id: "A-1038",
    type: "Offer Submitted",
    leadName: "Elena Volkova",
    detail: "Offer submitted for Dubai Marina penthouse",
    timestamp: "2026-06-19T15:45:00",
    agent: "Omar Khalil",
  },
  {
    id: "A-1032",
    type: "Contacted",
    leadName: "Khalid Al Nahyan",
    detail: "Initial consultation call completed",
    timestamp: "2026-06-19T10:00:00",
    agent: "Layla Hassan",
  },
];

export interface AgentPerformanceRow {
  agent: string;
  leads: number;
  viewings: number;
  deals: number;
}

export const agentPerformanceTable: AgentPerformanceRow[] = [
  { agent: "Ahmed Khan", leads: 23, viewings: 8, deals: 2 },
  { agent: "Sarah Malik", leads: 19, viewings: 7, deals: 3 },
  { agent: "Omar Hassan", leads: 15, viewings: 5, deals: 1 },
  { agent: "Fatima Al Nuaimi", leads: 12, viewings: 4, deals: 1 },
];

export const pipelineValueCards = [
  { label: "Total Pipeline", value: 12_400_000, tone: "primary" as const, hint: "Active deals across all stages" },
  { label: "Closed This Month", value: 2_100_000, tone: "success" as const, hint: "June 2026 closed-won" },
  { label: "Average Deal Size", value: 1_050_000, tone: "gold" as const, hint: "Trailing 90 days" },
  { label: "At-Risk Pipeline", value: 4_500_000, tone: "hot" as const, hint: "Stalled or overdue follow-up" },
];

export const todayActivity = [
  { id: "T-01", time: "10:32 AM", type: "Lead Added" as const, detail: "New enquiry — Rashid Al Nuaimi · Palm Jumeirah villa", agent: "Omar Khalil" },
  { id: "T-02", time: "10:35 AM", type: "Follow Up Sent" as const, detail: "WhatsApp sent to Priya Sharma · JVC Belgravia Heights", agent: "Omar Khalil" },
  { id: "T-03", time: "11:10 AM", type: "Viewing Scheduled" as const, detail: "Fatima Al Zaabi · Emirates Hills Sector W villa", agent: "Layla Hassan" },
  { id: "T-04", time: "12:20 PM", type: "Offer Submitted" as const, detail: "Ahmed Al Mansouri · Downtown Dubai Burj Vista 2BR", agent: "Layla Hassan" },
  { id: "T-05", time: "02:45 PM", type: "Deal Closed" as const, detail: "Sophie Laurent · JBR Bahar AED 3.9M signed", agent: "Layla Hassan" },
];
