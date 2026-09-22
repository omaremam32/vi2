import type { ShippingOption } from "@/domain/shipping";

export interface IShippingService {
  /**
   * Retrieves available shipping options for an active cart.
   */
  getShippingOptionsForCart(cartId: string): Promise<ShippingOption[]>;
}
