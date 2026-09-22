import type { ShippingOption } from "@/domain/shipping";
import type { IShippingService } from "@/services/contracts/IShippingService";
import { medusa } from "@/lib/medusa-client";

export class MedusaShippingService implements IShippingService {
  public async getShippingOptionsForCart(
    cartId: string,
  ): Promise<ShippingOption[]> {
    try {
      const response = await medusa.store.fulfillment.listCartOptions({
        cart_id: cartId,
      });

      const options = response.shipping_options || [];

      if (options.length === 0) {
        // Fallback default options for Egypt region if not configured in admin
        return [
          {
            id: process.env.MEDUSA_SHIPPING_STANDARD_ID || "so_standard",
            name: "Standard Delivery (2-3 business days)",
            amount: 85,
          },
          {
            id: process.env.MEDUSA_SHIPPING_EXPRESS_ID || "so_express",
            name: "Express Delivery (Next day)",
            amount: 140,
          },
        ];
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return options.map((opt: any) => ({
        id: opt.id,
        name: opt.name || "Delivery",
        amount: (opt.amount ?? 0) / 100,
        isCalculatedPrice: opt.is_calculated_price,
        data: opt.data,
      }));
    } catch {
      // Graceful fallback to standard delivery
      return [
        {
          id: process.env.MEDUSA_SHIPPING_STANDARD_ID || "so_standard",
          name: "Standard Delivery",
          amount: 85,
        },
      ];
    }
  }
}
