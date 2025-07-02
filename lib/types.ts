import { 
  User, 
  Scholarship, 
  ScholarshipApplication, 
  Document, 
  ApplicationStatus, 
  DocumentType, 
  DocumentStatus
} from "@prisma/client";

// Manual types from schema that aren't auto-generated
export enum AdmissionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED", 
  REJECTED = "REJECTED"
}

export enum ServiceContractStatus {
  NOT_SIGNED = "NOT_SIGNED",
  SENT = "SENT",
  SIGNED = "SIGNED", 
  TERMINATED = "TERMINATED"
}

export type ServiceContract = {
  id: number;
  userId: string;
  status: ServiceContractStatus;
  contractVersion: string;
  signedAt: Date | null;
  contractDocumentUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ScholarshipDocumentRequirement = {
  id: number;
  scholarshipId: number;
  documentType: DocumentType;
  notes: string | null;
};

// === EXTENDED USER TYPES ===
export type UserWithDetails = User & {
  scholarshipApplications?: ScholarshipApplicationWithDetails[];
  documents?: DocumentWithDetails[];
  serviceContract?: ServiceContract;
};

export type UserProfile = {
  fullName?: string;
  phone?: string;
  email?: string;
  age?: number;
  nationality?: string;
};

// === SCHOLARSHIP TYPES ===
export type ScholarshipWithDetails = Scholarship & {
  documentRequirements?: ScholarshipDocumentRequirement[];
  applications?: ScholarshipApplicationWithDetails[];
  _count?: {
    applications: number;
  };
};

export type ScholarshipSearchFilters = {
  programType?: "bachelor" | "master" | "phd";
  major?: string;
  city?: string;
  university?: string;
  languageProgram?: boolean;
  hskRequired?: number;
  ieltsRequired?: number;
  minAge?: number;
  maxAge?: number;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
};

// === APPLICATION TYPES ===
export type ScholarshipApplicationWithDetails = ScholarshipApplication & {
  user?: User;
  scholarship?: Scholarship;
  documents?: DocumentWithDetails[];
};

export type ApplicationFormData = {
  scholarshipId: number;
  hskLevel?: number;
  ieltsScore?: number;
  previousEducation?: string;
  motivationLetter?: string;
};

export type ApplicationUpdateData = {
  status?: ApplicationStatus;
  collegeAdmissionStatus?: AdmissionStatus;
  hskLevel?: number;
  ieltsScore?: number;
  previousEducation?: string;
  motivationLetter?: string;
  admissionOfficerNotes?: string;
  contractSigned?: boolean;
};

// === DOCUMENT TYPES ===
export type DocumentWithDetails = Document & {
  user?: User;
  application?: ScholarshipApplication;
};

export type DocumentUploadData = {
  documentType: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  applicationId?: number;
};

// === SERVICE CONTRACT TYPES ===
export type ServiceContractWithDetails = ServiceContract & {
  user?: User;
};

// === DASHBOARD TYPES ===
export type StudentDashboard = {
  profile: UserWithDetails;
  applicationSummary: {
    total: number;
    draft: number;
    submitted: number;
    underReview: number;
    approved: number;
    rejected: number;
  };
  recentApplications: ScholarshipApplicationWithDetails[];
  recommendedScholarships: ScholarshipWithDetails[];
  contractStatus: ServiceContract | null;
  documentsRequired: number;
  documentsUploaded: number;
};

// === FORM TYPES ===
export type ScholarshipFormData = {
  scholarshipId: number;
  hskLevel?: number;
  ieltsScore?: number;
  previousEducation?: string;
  motivationLetter?: string;
};

export type ProfileFormData = {
  fullName?: string;
  phone?: string;
  email?: string;
  age?: number;
  nationality?: string;
};

// === API RESPONSE TYPES ===
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// === STATISTICS TYPES ===
export type ScholarshipStats = {
  totalScholarships: number;
  activeScholarships: number;
  totalApplications: number;
  successRate: number;
  popularCities: Array<{ city: string; count: number }>;
  popularMajors: Array<{ major: string; count: number }>;
  popularUniversities: Array<{ university: string; count: number }>;
};

// === FILTER AND SEARCH TYPES ===
export type SortOption = {
  field: string;
  direction: "asc" | "desc";
  label: string;
};

export type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

// === MATCHING AND RECOMMENDATION TYPES ===
export type ScholarshipMatch = {
  scholarship: ScholarshipWithDetails;
  matchScore: number;
  eligibilityScore: number;
  reasonsToApply: string[];
  missingRequirements: string[];
  deadline?: string;
};

// Re-export Prisma enums for convenience
export { 
  ApplicationStatus, 
  DocumentType, 
  DocumentStatus
} from "@prisma/client";

// AdmissionStatus and ServiceContractStatus are already exported above

// === COMPONENT PROP TYPES ===
export type ScholarshipCardProps = {
  scholarship: ScholarshipWithDetails;
  showApplyButton?: boolean;
  onApply?: (scholarshipId: number) => void;
};

export type ApplicationCardProps = {
  application: ScholarshipApplicationWithDetails;
  onStatusUpdate?: (applicationId: string, status: ApplicationStatus) => void;
};

export type DocumentCardProps = {
  document: DocumentWithDetails;
  onDelete?: (documentId: number) => void;
  onReupload?: (documentId: number) => void;
};

// === UTILITY TYPES ===
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// === CONSTANTS ===
export const PROGRAM_TYPES = {
  bachelor: "Bachelor's Degree",
  master: "Master's Degree", 
  phd: "PhD/Doctorate"
} as const;

export const APPLICATION_STATUS_LABELS = {
  [ApplicationStatus.DRAFT]: "Draft",
  [ApplicationStatus.SUBMITTED]: "Submitted",
  [ApplicationStatus.UNDER_REVIEW]: "Under Review",
  [ApplicationStatus.APPROVED]: "Approved",
  [ApplicationStatus.REJECTED]: "Rejected",
  [ApplicationStatus.CONTRACT_SENT]: "Contract Sent",
  [ApplicationStatus.CONTRACT_SIGNED]: "Contract Signed",
  [ApplicationStatus.ENROLLED]: "Enrolled"
} as const;

export const DOCUMENT_TYPE_LABELS = {
  [DocumentType.PASSPORT]: "Passport",
  [DocumentType.NATIONAL_ID]: "National ID",
  [DocumentType.HIGH_SCHOOL_CERTIFICATE]: "High School Certificate",
  [DocumentType.MARRIAGE_CERTIFICATE]: "Marriage Certificate",
  [DocumentType.ACCEPTANCE_LETTER]: "University Acceptance Letter",
  [DocumentType.HSK_CERTIFICATE]: "HSK Certificate",
  [DocumentType.IELTS_CERTIFICATE]: "IELTS Certificate",
  [DocumentType.SIGNED_CONTRACT]: "Signed Service Contract",
  [DocumentType.OTHER]: "Other Document"
} as const;

export const SERVICE_CONTRACT_STATUS_LABELS = {
  [ServiceContractStatus.NOT_SIGNED]: "Not Signed",
  [ServiceContractStatus.SENT]: "Sent to Student",
  [ServiceContractStatus.SIGNED]: "Signed",
  [ServiceContractStatus.TERMINATED]: "Terminated"
} as const; 