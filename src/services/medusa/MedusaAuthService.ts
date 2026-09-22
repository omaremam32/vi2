import type {
  Customer,
  LoginCredentials,
  RegisterCredentials,
} from "@/domain/customer";
import type { IAuthService } from "@/services/contracts/IAuthService";
import { defaultApiClient } from "./MedusaApiClient";

export class MedusaAuthService implements IAuthService {
  private apiClient = defaultApiClient;

  public getToken(): string | null {
    return this.apiClient.getToken();
  }

  public isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  public signOut(): void {
    this.apiClient.clearToken();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("vi2-auth-change"));
    }
  }

  public async register(
    credentials: RegisterCredentials,
  ): Promise<{ ok: true; customer: Customer; token: string } | { ok: false; message: string }> {
    try {
      // Step 1: Create auth identity in Medusa
      const authData = await this.apiClient.request<{ token: string }>(
        "/auth/customer/emailpass",
        {
          method: "POST",
          body: JSON.stringify({
            email: credentials.email.trim(),
            password: credentials.password,
          }),
        },
      );

      const token = authData.token;
      this.apiClient.setToken(token);

      // Step 2: Create customer profile
      let customer: Customer;
      try {
        const customerData = await this.apiClient.request<{ customer: Record<string, unknown> }>(
          "/store/customers",
          {
            method: "POST",
            body: JSON.stringify({
              first_name: credentials.firstName.trim(),
              last_name: credentials.lastName.trim(),
              ...(credentials.phone ? { phone: credentials.phone.trim() } : {}),
            }),
          },
        );

        customer = {
          id: (customerData.customer.id as string) || "",
          email: credentials.email.trim(),
          firstName: credentials.firstName.trim(),
          lastName: credentials.lastName.trim(),
          phone: credentials.phone?.trim(),
          hasAccount: true,
        };
      } catch {
        // Auth succeeded, profile fallback
        customer = {
          id: "",
          email: credentials.email.trim(),
          firstName: credentials.firstName.trim(),
          lastName: credentials.lastName.trim(),
          phone: credentials.phone?.trim(),
          hasAccount: true,
        };
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("vi2-auth-change"));
      }

      return { ok: true, customer, token };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed. Please try again.";
      return { ok: false, message };
    }
  }

  public async signIn(
    credentials: LoginCredentials,
  ): Promise<{ ok: true; customer: Customer; token: string } | { ok: false; message: string }> {
    try {
      const data = await this.apiClient.request<{ token: string }>(
        "/auth/customer/emailpass",
        {
          method: "POST",
          body: JSON.stringify({
            email: credentials.email.trim(),
            password: credentials.password,
          }),
        },
      );

      this.apiClient.setToken(data.token);

      const customer = await this.getCurrentCustomer();
      if (!customer) {
        throw new Error("Could not retrieve customer details after login.");
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("vi2-auth-change"));
      }

      return { ok: true, customer, token: data.token };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password.";
      return { ok: false, message };
    }
  }

  public async getCurrentCustomer(): Promise<Customer | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const data = await this.apiClient.request<{
        customer?: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone?: string;
          has_account?: boolean;
        };
      }>("/store/customers/me");

      if (!data.customer) return null;

      return {
        id: data.customer.id,
        email: data.customer.email,
        firstName: data.customer.first_name,
        lastName: data.customer.last_name,
        phone: data.customer.phone,
        hasAccount: data.customer.has_account ?? true,
      };
    } catch {
      return null;
    }
  }
}
