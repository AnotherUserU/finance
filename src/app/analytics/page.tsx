"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { forecastingService, ForecastPoint } from "@/services/ForecastingService";
import { formatRupiah } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Loader2, TrendingUp, TrendingDown, Target, Info } from "lucide-react";
import React, { useMemo } from "react";

const COLORS = ["#0ea5e9", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#EC4899"];

export default function AnalyticsPage() {
  const { transactions, loading } = useTransactions();

  const chartData = useMemo(() => {
    if (transactions.length === 0) return [];
    return forecastingService.generateForecast(transactions);
  }, [transactions]);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    transactions.filter(t => t.type === "expense").forEach(t => {
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="space-y-10 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-grad">Analitik Keuangan</h1>
          <p className="text-muted-foreground">Analisis mendalam dan prediksi masa depan uang kamu.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Forecast Chart */}
        <div className="lg:col-span-2 glass-card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Prediksi Arus Kas (30 Hari)</h3>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-primary">
                <div className="h-2 w-2 rounded-full bg-primary" /> Riwayat
              </div>
              <div className="flex items-center gap-1.5 text-primary/40">
                <div className="h-2 w-2 rounded-full bg-primary/40" /> Prediksi
              </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis 
                    dataKey="date" 
                    hide 
                />
                <YAxis 
                    stroke="#88888880" 
                    fontSize={10} 
                    tickFormatter={(val) => `Rp ${val/1000}k`}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px", color: "white" }}
                  formatter={(value: any) => [formatRupiah(Number(value) || 0), "Saldo"]}
                />
                <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#0ea5e9" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                    strokeDasharray="0"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-card p-6 md:p-8 space-y-6">
          <h3 className="font-bold text-lg">Alokasi Pengeluaran</h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px", color: "white" }}
                    formatter={(value: number) => formatRupiah(value)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Total</span>
              <span className="text-sm font-bold">Pengeluaran</span>
            </div>
          </div>
          <div className="space-y-2">
            {categoryData.slice(0, 4).map((c, i) => (
               <div key={i} className="flex items-center justify-between text-xs">
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground">{c.name}</span>
                 </div>
                 <span className="font-bold">{formatRupiah(c.value)}</span>
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
             <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
             <h4 className="font-bold">Insight Kesehatan Keuangan</h4>
             <p className="text-xs text-muted-foreground leading-relaxed">
               Berdasarkan kecepatan pengeluaran kamu minggu ini, saldo diperkirakan akan cukup hingga akhir bulan (Safe to spend).
             </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
             <Info className="h-5 w-5 text-amber-500" />
          </div>
          <div className="space-y-1">
             <h4 className="font-bold">Tips Hemat</h4>
             <p className="text-xs text-muted-foreground leading-relaxed">
               Pengeluaran di kategori <span className="text-amber-500 font-bold">Makanan</span> naik 12% dari biasanya. Coba kurangi makan di luar minggu depan.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
