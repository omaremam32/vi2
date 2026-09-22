import type { Order, OrderPaymentStatus, OrderStatus } from "@/domain/order";
import type { IOrderService } from "@/services/contracts/IOrderService";
import { defaultApiClient } from "./MedusaApiClient";

const ORDER_FIELDS =
  "*items,*items.variant,*items.product,*shipping_address,*shipping_methods";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMedusaOrder(o: any): Order {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = (o.items || []).map((item: any) => {
    const product = item.product || {};
    const meta = product.metadata || item.metadata || {};
    const unitPrice = (item.unit_price ?? 0) / 100;
    const itemTotal =
      item.total !== undefined ? item.total / 100 : unitPrice * item.quantity;

    return {
      id: item.id,
      productId: item.product_id || product.id || "",
      variantId: item.variant_id || item.variant?.id || "",
      name: item.title || product.title || "",
      brand: String(meta.brand || "Vi2"),
      image: item.thumbnail || product.thumbnail || String(meta.image || ""),
      slug: product.handle || String(meta.slug || ""),
      price: unitPrice,
      quantity: item.quantity,
      total: itemTotal,
    };
  });

  return {
    id: o.id,
    displayId: o.display_id,
    reference: o.metadata?.vi2_reference || `VI2-${o.display_id || o.id.slice(-6)}`,
    status: (o.status || "pending") as OrderStatus,
    paymentStatus: (o.payment_status || "not_paid") as OrderPaymentStatus,
    currencyCode: (o.currency_code || "EGP").toUpperCase(),
    email: o.email || "",
    items,
    shippingAddress: o.shipping_address
      ? {
          firstName: o.shipping_address.first_name || "",
          lastName: o.shipping_address.last_name || "",
          address1: o.shipping_address.address_1 || "",
          city: o.shipping_address.city || "",
          countryCode: o.shipping_address.country_code || "eg",
          phone: o.shipping_address.phone || undefined,
        }
      : undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shippingMethods: (o.shipping_methods || []).map((sm: any) => ({
      id: sm.id,
      shippingOptionId: sm.shipping_option_id,
      name: sm.name || "Delivery",
      amount: (sm.amount || 0) / 100,
    })),
    itemSubtotal: (o.item_subtotal ?? o.subtotal ?? 0) / 100,
    shippingTotal: (o.shipping_total ?? 0) / 100,
    discountTotal: (o.discount_total ?? 0) / 100,
    taxTotal: (o.tax_total ?? 0) / 100,
    total: (o.total ?? 0) / 100,
    createdAt: o.created_at || new Date().toISOString(),
  };
}

export class MedusaOrderService implements IOrderService {
  private apiClient = defaultApiClient;

  public async getCustomerOrders(limit = 20): Promise<Order[]> {
    const token = this.apiClient.getToken();
    if (!token) return [];

    try {
      const data = await this.apiClient.request<{ orders?: unknown[] }>(
        `/store/orders?limit=${limit}&fields=${ORDER_FIELDS}`,
      );
      const orders = data.orders || [];
      return orders.map(mapMedusaOrder);
    } catch {
      return [];
    }
  }

  public async getOrder(orderId: string): Promise<Order | null> {
    try {
      const data = await this.apiClient.request<{ order?: unknown }>(
        `/store/orders/${orderId}?fields=${ORDER_FIELDS}`,
      );
      if (!data.order) return null;
      return mapMedusaOrder(data.order);
    } catch {
      return null;
    }
  }
}
