import { TokenManager } from "./token-manager";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

export class HttpClient {
  private static isRefreshing = false;
  private static refreshSubscribers: Array<(token: string) => void> = [];

  private static subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  private static onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private static async refreshAccessToken(): Promise<string> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        TokenManager.clearTokens();
        window.location.href = "/login";
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      const newAccessToken = data.accessToken;

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", newAccessToken);
      }

      return newAccessToken;
    } catch (error) {
      TokenManager.clearTokens();
      window.location.href = "/login";
      throw error;
    }
  }

  static async request<T>(
    endpoint: string,
    options?: RequestInit,
    requiresAuth: boolean = true
  ): Promise<T> {
    const makeRequest = async (token?: string): Promise<Response> => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (options?.headers) {
        const customHeaders = new Headers(options.headers);
        customHeaders.forEach((value, key) => {
          headers[key] = value;
        });
      }

      if (requiresAuth) {
        const accessToken = token || TokenManager.getAccessToken();
        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }
      }

      return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    };

    let response = await makeRequest();

    if (
      response.status === 401 &&
      requiresAuth &&
      TokenManager.getRefreshToken()
    ) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        try {
          const newToken = await this.refreshAccessToken();
          this.isRefreshing = false;
          this.onTokenRefreshed(newToken);
          response = await makeRequest(newToken);
        } catch (error) {
          this.isRefreshing = false;
          TokenManager.clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          throw error;
        }
      } else {
        try {
          const newToken = await new Promise<string>((resolve, reject) => {
            this.subscribeTokenRefresh(resolve);
            setTimeout(() => reject(new Error("Token refresh timeout")), 5000);
          });
          response = await makeRequest(newToken);
        } catch (error) {
          TokenManager.clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          throw error;
        }
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }
}
