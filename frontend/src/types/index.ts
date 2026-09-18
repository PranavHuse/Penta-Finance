export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Transaction {
  id: string;
  legacyId: number;
  date: string;
  amount: number;
  category: "Revenue" | "Expense";
  status: "Paid" | "Pending";
  user: {
    id: string;
    name?: string;
    avatarUrl?: string;
  };
}

export interface PaginatedTransactions {
  data: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardSummary {
  balance: number;
  revenue: number;
  expenses: number;
  savings: number;
}

export interface TrendPoint {
  period: string;
  revenue: number;
  expense: number;
}

export interface DashboardTrend {
  granularity: "monthly" | "weekly";
  data: TrendPoint[];
}