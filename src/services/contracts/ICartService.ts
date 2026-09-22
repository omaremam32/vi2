import type { Cart, CartAddress } from "@/domain/cart";

export interface ICartService {
  /**
   * Retrieves an existing cart by its unique ID.
   */
  getCart(cartId: string): Promise<Cart | null>;

  /**
   * Creates a new cart in the specified region.
   */
  createCart(regionId?: string): Promise<Cart>;

  /**
   * Adds a product variant as a line item to the cart.
   */
  addItem(cartId: string, variantId: string, quantity: number): Promise<Cart>;

  /**
   * Updates an existing line item's quantity.
   */
  updateItem(cartId: string, lineItemId: string, quantity: number): Promise<Cart>;

  /**
   * Removes a line item from the cart.
   */
  removeItem(cartId: string, lineItemId: string): Promise<Cart>;

  /**
   * Updates customer contact email and delivery/billing addresses on the cart.
   */
  setAddress(
    cartId: string,
    email: string,
    shippingAddress: CartAddress,
    billingAddress?: CartAddress,
  ): Promise<Cart>;

  /**
   * Associates a shipping option method with the cart.
   */
  setShippingMethod(cartId: string, optionId: string): Promise<Cart>;

  /**
   * Applies a promotional/discount code to the cart.
   */
  applyPromotion(cartId: string, promoCode: string): Promise<Cart>;

  /**
   * Removes a promotional/discount code from the cart.
   */
  removePromotion(cartId: string, promoCode: string): Promise<Cart>;

  /**
   * Initiates payment collection and completes the cart into an order.
   */
  completeCart(
    cartId: string,
    providerId?: string,
  ): Promise<{ ok: true; orderId: string } | { ok: false; error: string }>;
}
