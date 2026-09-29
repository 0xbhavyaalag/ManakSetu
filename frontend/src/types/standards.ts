/**
 * TypeScript Data Models for SIH 2026 Problem Statement 26108:
 * AI-Powered Recommendation Engine for Identifying Applicable Indian Standards (IS) for Procurement Specifications.
 */

export type InputLanguage = 'en' | 'hi' | 'ta' | 'mr' | 'te';

export type StandardStatus = 
  | 'Current & Active' 
  | 'Active - Incorporating Amendments' 
  | 'Under Revision' 
  | 'Superseded' 
  | 'Withdrawn';

export type ComplianceScheme = 
  | 'Scheme I (ISI Mark - Mandatory QCO)' 
  | 'Scheme II (CRS - Compulsory Registration)' 
  | 'Voluntary BIS Certification' 
  | 'Verification Needed';

export type RelationshipType = 
  | 'Normative Reference' 
  | 'Test Method' 
  | 'Raw Material' 
  | 'Safety & Environmental' 
  | 'Packaging & Marking';

export interface TechnicalParameter {
  id: string;
  name: string;
  value: string;
  unit?: string;
  mandatory: boolean;
  clauseRef?: string;
}

export interface ExtractedRequirements {
  productName: string;
  productCategory: string;
  intendedApplication: string;
  technicalParameters: TechnicalParameter[];
  testMethods: string[];
  safetyAndEnvironmental: string[];
  installationContext: string[];
  rawMaterials: string[];
  confidenceScore: number;
}

export interface MatchedClause {
  clauseNumber: string;
  title: string;
  requirementMatch: string;
  standardExcerpt: string;
  matchDegree: 'Exact Match' | 'Compatible' | 'Derived Reference';
}

export interface AmendmentInfo {
  amendmentNumber: string;
  date: string;
  gazetteRef?: string;
  summary: string;
}

export interface RelatedStandard {
  isNumber: string;
  title: string;
  relationship: RelationshipType;
  importance: 'Mandatory for compliance' | 'Recommended test practice' | 'Guidance';
  notes?: string;
}

export interface StandardRecommendation {
  id: string;
  isNumber: string;
  title: string;
  category: string;
  relevanceScore: number; // Internal ranking aid (e.g. 96)
  relevanceLabel: 'High Priority Match' | 'Moderate Relevance' | 'Allied Reference' | 'Alternative Standard';
  explanation: string;
  scopeSummary: string;
  scopeExcerptAuthoritative: string;
  status: StandardStatus;
  editionYear: number;
  amendments: AmendmentInfo[];
  lastCheckedDate: string;
  sourceProvenance: {
    authority: string;
    portalUrl: string;
    bisSectionalCommittee: string;
    gazetteNotification?: string;
    lastSynced: string;
  };
  complianceInfo: {
    qcoMandatory: boolean;
    qcoOrderNumber?: string;
    qcoMinistry?: string;
    effectiveDate?: string;
    scheme: ComplianceScheme;
    verificationStatus: 'BIS Verified' | 'Verification Needed' | 'Voluntary';
    verificationNotes?: string;
  };
  matchedClauses: MatchedClause[];
  relatedStandards: RelatedStandard[];
  userFeedback?: {
    status: 'relevant' | 'not_relevant' | 'needs_correction';
    note?: string;
    timestamp?: string;
  };
  isSelected?: boolean;
}

export interface ProcurementAnalysis {
  id: string;
  title: string;
  department: string;
  tenderReference: string;
  inputText: string;
  inputLanguage: InputLanguage;
  uploadedDocument?: {
    name: string;
    size: string;
    pageCount: number;
    uploadDate: string;
  };
  extractedRequirements: ExtractedRequirements;
  recommendations: StandardRecommendation[];
  selectedStandardIds: string[];
  status: 'draft' | 'extracted' | 'analyzing' | 'completed' | 'exported';
  createdAt: string;
  lastModifiedAt: string;
}

export interface SamplePrompt {
  id: string;
  title: string;
  department: string;
  tenderRef: string;
  category: string;
  text: string;
  documentName?: string;
}
