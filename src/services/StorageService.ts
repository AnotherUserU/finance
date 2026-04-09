import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Upload an image to Firebase Storage and return the URL
   */
  public async uploadReceipt(userId: string, file: File): Promise<string> {
    const timestamp = Date.now();
    const fileName = `receipts/${userId}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);

    const uploadTask = await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(uploadTask.ref);
    
    return downloadURL;
  }
}

export const storageService = StorageService.getInstance();
