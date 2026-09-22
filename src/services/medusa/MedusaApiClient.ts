export class MedusaApiError extends Error {
  public status: number;
  public details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "MedusaApiError";
    this.status = status;
    this.details = details;
  }
}

export class MedusaApiClient {
  private baseUrl: string;
  private publishableKey: string;
  private tokenKey = "vi2-medusa-token";

  constructor(baseUrl?: string, publishableKey?: string) {
    this.baseUrl =
      baseUrl ||
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
      "http://localhost:9000";
    this.publishableKey =
      publishableKey ||
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
      "";
  }

  public getToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(this.tokenKey);
  }

  public setToken(token: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(this.tokenKey, token);
  }

  public clearToken(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(this.tokenKey);
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(this.publishableKey
        ? { "x-publishable-api-key": this.publishableKey }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    };

    const res = await fetch(url, {
      ...options,
      headers,
    });

    const text = await res.text();
    let data: Record<string, unknown> = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      // Non-JSON response
    }

    if (!res.ok) {
      const message =
        (data.message as string) ||
        (data.error as string) ||
        `Medusa API request failed (${res.status})`;
      throw new MedusaApiError(message, res.status, data);
    }

    return data as T;
  }
}

export const defaultApiClient = new MedusaApiClient();
