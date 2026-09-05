import type { HydrateCart } from "../services/cartService.ts";
import type { User } from "./index.ts";

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
      cart?: HydrateCart | null;
      cartId?: number | null;
    }
  }
}
