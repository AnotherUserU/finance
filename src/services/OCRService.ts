import { TransactionType } from "@/models/Transaction";

export interface OCRResult {
  items: Array<{
    name: string;
    price: number;
  }>;
  total: number;
  date?: Date;
  category?: string;
  type: TransactionType;
}

export class OCRService {
  private static instance: OCRService;

  private constructor() {}

  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  /**
   * Analyze a receipt image using Vision AI (Simulated for Demo)
   * In a production environment, this would call a Firebase Cloud Function
   * that interfaces with the Google Cloud Vision API.
   */
  public async analyzeReceipt(imageUrl: string): Promise<OCRResult> {
    // Simulated delay to show AI processing
    await new Promise((resolve) => setTimeout(resolve, 3500));

    // Mock result based on common receipt patterns
    // This is where you would normally parse the Vision API JSON response
    return {
      items: [
        { name: "Susu UHT Full Cream", price: 21500 },
        { name: "Roti Tawar Gandum", price: 18000 },
        { name: "Kopi Kenangan Mantan", price: 24000 },
        { name: "Indomie Goreng (5pcs)", price: 15500 },
      ],
      total: 79000,
      date: new Date(),
      category: "Belanja",
      type: "expense",
    };
  }
}

export const ocrService = OCRService.getInstance();
