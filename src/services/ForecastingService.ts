import { Transaction } from "@/models/Transaction";

export interface ForecastPoint {
  date: string;
  balance: number;
  isProjected: boolean;
}

export class ForecastingService {
  private static instance: ForecastingService;

  private constructor() {}

  public static getInstance(): ForecastingService {
    if (!ForecastingService.instance) {
      ForecastingService.instance = new ForecastingService();
    }
    return ForecastingService.instance;
  }

  /**
   * Calculate balance history and project future cash flow
   */
  public generateForecast(
    transactions: Transaction[], 
    daysAhead: number = 30
  ): ForecastPoint[] {
    if (transactions.length === 0) return [];

    // 1. Sort transactions by date
    const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // 2. Calculate historical daily balance
    const points: ForecastPoint[] = [];
    let runningBalance = 0;
    
    // Group transactions by day for historical data
    const historyMap = new Map<string, number>();
    sorted.forEach(t => {
      const dateKey = t.date.toISOString().split("T")[0];
      const amount = t.type === "income" ? t.amount : -t.amount;
      historyMap.set(dateKey, (historyMap.get(dateKey) || 0) + amount);
    });

    // Generate historical points
    const firstDate = sorted[0].date;
    const today = new Date();
    const currDate = new Date(firstDate);
    
    while (currDate <= today) {
      const dateKey = currDate.toISOString().split("T")[0];
      runningBalance += historyMap.get(dateKey) || 0;
      points.push({
        date: dateKey,
        balance: runningBalance,
        isProjected: false
      });
      currDate.setDate(currDate.getDate() + 1);
    }

    // 3. Simple linear projection for forecasting
    // Calculate average daily burn rate from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const last30DaysTransactions = transactions.filter(t => t.date >= thirtyDaysAgo);
    let net30Days = 0;
    last30DaysTransactions.forEach(t => {
      net30Days += t.type === "income" ? t.amount : -t.amount;
    });
    
    const dailyRate = net30Days / 30;

    // Generate projected points
    for (let i = 1; i <= daysAhead; i++) {
        const projDate = new Date(today);
        projDate.setDate(today.getDate() + i);
        runningBalance += dailyRate;
        points.push({
            date: projDate.toISOString().split("T")[0],
            balance: Math.max(0, runningBalance),
            isProjected: true
        });
    }

    return points;
  }
}

export const forecastingService = ForecastingService.getInstance();
