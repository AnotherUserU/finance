import { 
  Auth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User 
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export class AuthService {
  private static instance: AuthService;
  private auth: Auth;

  private constructor() {
    this.auth = auth;
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  public async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  public getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}

export const authService = AuthService.getInstance();
