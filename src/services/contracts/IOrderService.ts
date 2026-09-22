import type { Order } from "@/domain/order";

export interface IOrderService {
  /**
   * Retrieves paginated order history for the authenticated customer.
   */
  getCustomerOrders(limit?: number): Promise<Order[]>;

  /**
   * Retrieves a single order by its ID.
   */
  getOrder(orderId: string): Promise<Order | null>;
}
