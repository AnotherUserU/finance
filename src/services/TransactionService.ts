import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  updateDoc, 
  Timestamp,
  QuerySnapshot,
  DocumentData
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Transaction, TransactionCreate } from "@/models/Transaction";

export class TransactionService {
  private static instance: TransactionService;
  private collectionName = "transactions";

  private constructor() {}

  public static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  /**
   * Add a new transaction to Firestore
   */
  public async addTransaction(data: TransactionCreate): Promise<string> {
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...data,
      date: Timestamp.fromDate(data.date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  }

  /**
   * Subscribe to real-time transaction updates for a specific user
   */
  public subscribeToTransactions(
    userId: string, 
    callback: (transactions: Transaction[]) => void
  ) {
    const q = query(
      collection(db, this.collectionName),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );

    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const transactions = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          date: (data.date as Timestamp).toDate(),
          createdAt: (data.createdAt as Timestamp).toDate(),
          updatedAt: (data.updatedAt as Timestamp).toDate(),
        } as Transaction;
      });
      callback(transactions);
    });
  }

  /**
   * Delete a transaction
   */
  public async deleteTransaction(id: string): Promise<void> {
    await deleteDoc(doc(db, this.collectionName, id));
  }

  /**
   * Update an existing transaction
   */
  public async updateTransaction(id: string, data: Partial<Transaction>): Promise<void> {
    const updateData: any = {
      ...data,
      updatedAt: Timestamp.now(),
    };
    
    if (data.date) {
      updateData.date = Timestamp.fromDate(data.date);
    }

    await updateDoc(doc(db, this.collectionName, id), updateData);
  }
}

export const transactionService = TransactionService.getInstance();
