"use client";

import React, { useState } from "react";
import { CATEGORIES, TransactionType } from "@/models/Transaction";
import { Plus, X, Loader2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface TransactionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function TransactionForm({ onSuccess, onCancel, onSubmit }: TransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digits
    const value = e.target.value.replace(/\D/g, "");
    setAmount(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    try {
      setLoading(true);
      await onSubmit({
        amount: parseInt(amount),
        description,
        category,
        type,
        date: new Date(date),
        isRecurring: false, // Default for manual entry
      });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to add transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex p-1 bg-muted rounded-xl w-full max-w-[200px] mx-auto">
        <button
          type="button"
          onClick={() => { setType("expense"); setCategory(CATEGORIES.expense[0]); }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            type === "expense" ? "bg-destructive text-white shadow-sm" : "text-muted-foreground"
          }`}
        >
          Pengeluaran
        </button>
        <button
          type="button"
          onClick={() => { setType("income"); setCategory(CATEGORIES.income[0]); }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            type === "income" ? "bg-emerald-500 text-white shadow-sm" : "text-muted-foreground"
          }`}
        >
          Pemasukan
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
          Nominal (Rupiah)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">Rp</span>
          <input
            autoFocus
            type="text"
            inputMode="numeric"
            value={amount ? parseInt(amount).toLocaleString("id-ID") : ""}
            onChange={handleAmountChange}
            placeholder="0"
            className="w-full h-14 bg-muted/50 border-none rounded-2xl pl-12 pr-4 text-2xl font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
            Keterangan
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nasi Goreng, Gaji, dll."
            className="w-full h-12 bg-muted/50 border-none rounded-xl px-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-12 bg-muted/50 border-none rounded-xl px-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
            >
              {(type === "income" ? CATEGORIES.income : CATEGORIES.expense).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Tanggal
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-12 bg-muted/50 border-none rounded-xl px-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-12 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-all"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-[2] h-12 rounded-xl grad-primary text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Simpan Transaksi
            </>
          )}
        </button>
      </div>
    </form>
  );
}
