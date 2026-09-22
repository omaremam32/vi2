import type {
  Customer,
  LoginCredentials,
  RegisterCredentials,
} from "@/domain/customer";

export interface IAuthService {
  /**
   * Registers a new customer and establishes an authenticated session.
   */
  register(
    credentials: RegisterCredentials,
  ): Promise<{ ok: true; customer: Customer; token: string } | { ok: false; message: string }>;

  /**
   * Signs in an existing customer via email and password.
   */
  signIn(
    credentials: LoginCredentials,
  ): Promise<{ ok: true; customer: Customer; token: string } | { ok: false; message: string }>;

  /**
   * Clears the current customer session and tokens.
   */
  signOut(): void;

  /**
   * Returns the current customer session token, if present.
   */
  getToken(): string | null;

  /**
   * Checks whether an active customer session exists.
   */
  isAuthenticated(): boolean;

  /**
   * Retrieves the currently authenticated customer profile.
   */
  getCurrentCustomer(): Promise<Customer | null>;
}
