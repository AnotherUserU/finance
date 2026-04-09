"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { forecastingService } from "@/services/ForecastingService";
import { formatRupiah } from "@/lib/utils";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Plus, 
  Wallet,
  Loader2,
  X,
  Receipt
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { TransactionForm } from "@/components/features/TransactionForm";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, loading, addTransaction, transactions } = useTransactions();
  const [showAddModal, setShowAddModal] = useState(false);

  const chartData = useMemo(() => {
    if (transactions.length === 0) return [];
    return forecastingService.generateForecast(transactions);
  }, [transactions]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="relative space-y-10 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-grad">
            Halo, {user?.displayName?.split(" ")[0] || "Teman"}!
          </h1>
          <p className="text-muted-foreground">
            Berikut ringkasan keuangan kamu hari ini.
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 grad-primary h-12 px-6 rounded-2xl text-white font-semibold transition-all hover:scale-[1.05] shadow-lg shadow-primary/20 group"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          Tambah Transaksi
        </button>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Saldo</span>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{formatRupiah(stats.balance)}</h2>
            <p className="text-xs text-primary font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Berdasarkan data terkini
            </p>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pemasukan</span>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-emerald-500">{formatRupiah(stats.totalIncome)}</h2>
            <p className="text-xs text-muted-foreground mt-1 tracking-wide">Total seluruh waktu</p>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pengeluaran</span>
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <ArrowDownLeft className="h-5 w-5 text-destructive" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-destructive">{formatRupiah(stats.totalExpense)}</h2>
            <p className="text-xs text-muted-foreground mt-1 tracking-wide">Total seluruh waktu</p>
          </div>
        </div>
      </div>

      {/* Live Forecast Chart */}
      <div className="glass-card p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-grad">Prediksi Aliran Kas</h3>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
             <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-primary" /> Riwayat</div>
             <div className="flex items-center gap-1.5 opacity-50"><div className="h-2 w-2 rounded-full bg-primary" /> Prediksi (30 Hari)</div>
          </div>
        </div>
        
        {chartData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBalanceDash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888810" />
                <XAxis dataKey="date" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px", color: "white" }}
                  formatter={(value: any) => [formatRupiah(Number(value) || 0), "Saldo"]}
                />
                <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorBalanceDash)" 
                    strokeDasharray="0"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4">
             <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Receipt className="h-6 w-6 text-muted-foreground" />
             </div>
             <p className="text-sm text-muted-foreground">Tambah transaksi untuk melihat grafik prediksi.</p>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg glass-card p-6 md:p-10 relative shadow-2xl shadow-primary/10">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute right-6 top-6 h-10 w-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-grad">Tambah Transaksi</h2>
              <p className="text-muted-foreground text-sm">Catat detail pemasukan atau pengeluaran kamu.</p>
            </div>

            <TransactionForm 
              onSubmit={addTransaction}
              onSuccess={() => setShowAddModal(false)}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
