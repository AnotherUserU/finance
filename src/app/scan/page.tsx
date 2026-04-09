"use client";

import { useState } from "react";
import { 
  Camera, 
  Upload, 
  Loader2, 
  Receipt, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Plus,
  Trash2
} from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { storageService } from "@/services/StorageService";
import { ocrService, OCRResult } from "@/services/OCRService";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const { user } = useAuth();
  const { addTransaction } = useTransactions();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [step, setStep] = useState<"upload" | "scanning" | "review">("upload");
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // 1. Show preview and start scanning UI
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setStep("scanning");
    setIsProcessing(true);

    try {
      // 2. Upload to Storage
      const uploadedUrl = await storageService.uploadReceipt(user.uid, file);
      
      // 3. Analyze with OCR
      const result = await ocrService.analyzeReceipt(uploadedUrl);
      
      // 4. Update State
      setOcrResult(result);
      setStep("review");
    } catch (error) {
      console.error("Scanning failed:", error);
      alert("Gagal menganalisis struk. Silakan coba lagi.");
      setStep("upload");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (!ocrResult || !user) return;

    try {
      setIsProcessing(true);
      await addTransaction({
        amount: ocrResult.total,
        description: `Scan: ${ocrResult.items.map(i => i.name).join(", ").substring(0, 50)}...`,
        category: ocrResult.category || "Lainnya",
        type: ocrResult.type,
        date: ocrResult.date || new Date(),
        isRecurring: false,
      });
      router.push("/transactions");
    } catch (error) {
      console.error("Failed to save transaction:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-grad">Scan Struk AI</h1>
        <p className="text-muted-foreground">
          Unggah foto struk belanja kamu dan biarkan AI mendeteksi rinciannya secara otomatis.
        </p>
      </div>

      {step === "upload" && (
        <label className="relative block group cursor-pointer">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <div className="glass-card p-20 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-2 border-muted group-hover:border-primary/50 transition-all">
            <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/5">
              <Camera className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Ambil Foto atau Unggah</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Pastikan teks pada struk terlihat jelas dan berada dalam pencahayaan yang baik.
              </p>
            </div>
            <div className="h-11 px-8 rounded-xl bg-foreground text-background font-semibold flex items-center gap-2 group-hover:bg-primary group-hover:text-white transition-colors">
              <Upload className="h-4 w-4" />
              Pilih Gambar
            </div>
          </div>
        </label>
      )}

      {step === "scanning" && (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in-95 duration-500">
          <div className="relative h-48 w-48 rounded-2xl overflow-hidden shadow-2xl">
            {previewUrl && <img src={previewUrl} alt="Preview" className="h-full w-full object-cover grayscale opacity-50" />}
            <div className="absolute inset-x-0 top-0 h-1 bg-primary shadow-[0_0_15px_rgba(14,165,233,0.8)] animate-scan-line" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <h3 className="text-xl font-bold tracking-tight">Menganalisis Struk...</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              AI kami sedang mendeteksi barang, harga, dan total biaya dari gambar kamu.
            </p>
          </div>
        </div>
      )}

      {step === "review" && ocrResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Pratinjau Struk</h4>
            <div className="glass-card overflow-hidden rounded-2xl">
              {previewUrl && <img src={previewUrl} alt="Receipt" className="w-full object-contain max-h-[500px]" />}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-emerald-500 font-bold">
              <CheckCircle2 className="h-5 w-5" />
              <span>Analisis Berhasil!</span>
            </div>
            
            <div className="glass-card p-6 space-y-6">
              <div className="space-y-4">
                 <div className="h-14 bg-muted/30 rounded-xl px-4 flex items-center justify-between border border-muted">
                    <span className="text-sm font-medium">Total Terdeteksi</span>
                    <span className="text-xl font-bold">{formatRupiah(ocrResult.total)}</span>
                 </div>
                 <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Detail Barang</span>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                       {ocrResult.items.map((item, i) => (
                         <div key={i} className="flex justify-between text-sm py-2 border-b border-muted/40 last:border-0">
                            <span className="truncate pr-4">{item.name}</span>
                            <span className="font-semibold shrink-0">{formatRupiah(item.price)}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setStep("upload")}
                  disabled={isProcessing}
                  className="flex-1 h-12 rounded-xl bg-muted font-semibold hover:bg-muted/80 transition-all text-sm disabled:opacity-50"
                >
                  Ulangi
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className="flex-[2] h-12 rounded-xl grad-primary text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg shadow-primary/20 text-sm disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                    <>
                      Konfirmasi Laporan
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
              <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />
              <p className="text-[11px] text-blue-500/80 leading-relaxed italic">
                Sistem AI selalu belajar. Harap periksa kembali hasil analisis sebelum melakukan konfirmasi data ke dalam buku kas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
