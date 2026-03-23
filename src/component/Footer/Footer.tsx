import { useMemo } from "react";
import { useCartStore } from "../../route/store/CartStore";
import "./footer.scss";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function Footer() {
  const { lines } = useCartStore();

  const { itemCount, total } = useMemo(() => {
    let count = 0;
    let sum = 0;
    for (const line of lines) {
      count += line.quantity;
      sum += line.quantity * line.unitPrice;
    }
    return { itemCount: count, total: sum };
  }, [lines]);

  return (
    <footer className="footer footer--store">
      <p className="footer__copyright">
        © 2026 LUXE STORE · All rights reserved
      </p>
      <div className="footer__cart-summary" aria-live="polite">
        <span className="footer__stat">
          <span className="footer__label">Cart Items:</span>
          <strong className="footer__value">{itemCount}</strong>
        </span>
        <span className="footer__divider" aria-hidden="true">
          |
        </span>
        <span className="footer__stat">
          <span className="footer__label">Total:</span>
          <strong className="footer__value">{money.format(total)}</strong>
        </span>
      </div>
    </footer>
  );
}
