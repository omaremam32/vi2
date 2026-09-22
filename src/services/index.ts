import { ICartService } from "./contracts/ICartService";
import { IAuthService } from "./contracts/IAuthService";
import { IShippingService } from "./contracts/IShippingService";
import { IOrderService } from "./contracts/IOrderService";

import { MedusaCartService } from "./medusa/MedusaCartService";
import { MedusaAuthService } from "./medusa/MedusaAuthService";
import { MedusaShippingService } from "./medusa/MedusaShippingService";
import { MedusaOrderService } from "./medusa/MedusaOrderService";

/**
 * ServiceContainer (Dependency Injection Registry)
 * Exposes singleton instances of domain service contracts.
 * Allows effortless swapping to mocks or test doubles in testing environments.
 */
class ServiceContainer {
  private _cartService: ICartService | null = null;
  private _authService: IAuthService | null = null;
  private _shippingService: IShippingService | null = null;
  private _orderService: IOrderService | null = null;

  public get cartService(): ICartService {
    if (!this._cartService) {
      this._cartService = new MedusaCartService();
    }
    return this._cartService;
  }

  public setCartService(service: ICartService): void {
    this._cartService = service;
  }

  public get authService(): IAuthService {
    if (!this._authService) {
      this._authService = new MedusaAuthService();
    }
    return this._authService;
  }

  public setAuthService(service: IAuthService): void {
    this._authService = service;
  }

  public get shippingService(): IShippingService {
    if (!this._shippingService) {
      this._shippingService = new MedusaShippingService();
    }
    return this._shippingService;
  }

  public setShippingService(service: IShippingService): void {
    this._shippingService = service;
  }

  public get orderService(): IOrderService {
    if (!this._orderService) {
      this._orderService = new MedusaOrderService();
    }
    return this._orderService;
  }

  public setOrderService(service: IOrderService): void {
    this._orderService = service;
  }
}

export const services = new ServiceContainer();
export * from "./contracts/ICartService";
export * from "./contracts/IAuthService";
export * from "./contracts/IShippingService";
export * from "./contracts/IOrderService";
