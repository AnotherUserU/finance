"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { formatRupiah } from "@/lib/utils";
import { 
  Search, 
  Filter, 
  Trash2, 
  ChevronRight, 
  Receipt,
  ArrowUpCircle,
  ArrowDownCircle,
  Loader2
} from "lucide-react";
import React, { useState } from "react";

export default function TransactionsPage() {
  const { transactions, loading, deleteTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-grad">Data Transaksi</h1>
          <p className="text-muted-foreground">Kelola dan tinjau seluruh riwayat keuangan kamu.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Cari transaksi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 bg-muted/50 border-none rounded-xl pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
          <button className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="glass-card p-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Belum ada transaksi</p>
              <p className="text-sm text-muted-foreground">Mulai catat pengeluaran atau pemasukan kamu hari ini.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredTransactions.map((t) => (
              <div 
                key={t.id} 
                className="glass-card p-4 flex items-center justify-between group hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    t.type === "income" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                  }`}>
                    {t.type === "income" ? <ArrowUpCircle className="h-6 w-6" /> : <ArrowDownCircle className="h-6 w-6" />}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold truncate">{t.description}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium px-2 py-0.5 bg-muted rounded-md text-[10px] uppercase">
                        {t.category}
                      </span>
                      <span>•</span>
                      <span>{t.date.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className={`text-right font-bold text-lg ${
                    t.type === "income" ? "text-emerald-500" : "text-foreground"
                  }`}>
                    {t.type === "income" ? "+" : "-"} {formatRupiah(t.amount)}
                  </div>
                  <button 
                    onClick={() => t.id && deleteTransaction(t.id)}
                    className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <ChevronRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
