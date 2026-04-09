export type TransactionType = "income" | "expense";

export interface Transaction {
  id?: string;
  userId: string;
  amount: number;
  description: string;
  date: Date;
  category: string;
  type: TransactionType;
  isRecurring: boolean;
  recurrenceInterval?: "weekly" | "monthly" | "yearly" | null;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionCreate = Omit<Transaction, "id" | "createdAt" | "updatedAt">;

export const CATEGORIES = {
  income: ["Gaji", "Bonus", "Investasi", "Lainnya"],
  expense: [
    "Makanan & Minuman",
    "Transportasi",
    "Belanja",
    "Hiburan",
    "Kesehatan",
    "Tagihan",
    "Pendidikan",
    "Lainnya",
  ],
};
