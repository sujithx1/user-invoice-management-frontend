export type UserRole = "SUPER_ADMIN" | "ADMIN" | "UNIT_MANAGER" | "USER";

export interface User_Tyeps {
  readonly userId: string;
  readonly id: string;
  name: string;
  email: string;
  role: UserRole;
  createdBy: string;
  TimeZone: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  groupId?: string;
}

export interface User_create_types {
  name: string;
  email: string;
  role: UserRole;
  password:string
  createdBy: string;
  TimeZone:string
}
export interface InitialState_types {
  user: User_Tyeps | null;
  users: User_Tyeps[];
      isAuthenticated:boolean;

  loading: boolean;
  error: string | null;
}

export interface UserLogin_types {
  email: string;
  password: string;
  timezone: string;
}

export interface ErrorPayload {
  message: string;
  status?: number;
}

export interface User {
  userId: string;
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  createdBy: string;
  isActive: boolean;
  TimeZone?: string;
  createdAt?: Date;
  updatedAt?: Date;
  groupId?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  TimeZone?: string;
  groupId?: string;
}

export interface UpdateUserRequest {
  id?:string
  name?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
  TimeZone?: string;
  groupId?: string;
}

export interface UserStats {
  totalUsers: number;
  superAdmins: number;
  admins: number;
  unitManagers: number;
  regularUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

export interface UserFilters {
  role: UserRole | "ALL";
  status: "ALL" | "ACTIVE" | "INACTIVE";
  searchTerm: string;
}

export interface Invoice {
  id?:string,
  invoiceId: string
  invoiceNumber: string
  invoiceDate: Date
  invoiceAmount: number
  financialYear: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED"
  customerName?: string
  customerEmail?: string
  description?: string
  dueDate?: Date
}

export interface CreateInvoiceRequest {
  invoiceNumber: string
  invoiceDate: Date
  invoiceAmount: number
  customerName?: string
  customerEmail?: string
  description?: string
  dueDate?: Date
}

export interface UpdateInvoiceRequest {
  id?:string;
  invoiceNumber?: string
  invoiceDate?: Date
  invoiceAmount?: number
  customerName?: string
  customerEmail?: string
  description?: string
  dueDate?: Date
  status?: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED"
}

export interface InvoiceFilters {
  financialYear: string | "ALL"
  status: string | "ALL"
  searchTerm: string
  dateRange: {
    startDate: string
    endDate: string
  }
}

export interface InvoiceStats {
  totalInvoices: number
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  overdueCount: number
  draftCount: number
}

export interface ValidationError {
  field: string
  message: string
}
