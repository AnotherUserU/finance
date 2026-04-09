"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "./useAuth";
import { Transaction, TransactionCreate } from "@/models/Transaction";
import { transactionService } from "@/services/TransactionService";

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = transactionService.subscribeToTransactions(
      user.uid,
      (data) => {
        setTransactions(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const stats = useMemo(() => {
    let balance = 0;
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") {
        balance += t.amount;
        totalIncome += t.amount;
      } else {
        balance -= t.amount;
        totalExpense += t.amount;
      }
    });

    return { balance, totalIncome, totalExpense };
  }, [transactions]);

  const addTransaction = async (data: Omit<TransactionCreate, "userId">) => {
    if (!user) throw new Error("User must be logged in");
    return await transactionService.addTransaction({
      ...data,
      userId: user.uid,
    });
  };

  const deleteTransaction = async (id: string) => {
    return await transactionService.deleteTransaction(id);
  };

  return {
    transactions,
    loading,
    stats,
    addTransaction,
    deleteTransaction,
  };
}
