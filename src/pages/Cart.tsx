import { useMemo } from "react";
import { Link } from "react-router-dom";
import Button from "../component/button/button";
import { cartActions, useCartStore } from "../route/store/CartStore";
import "./Cart.scss";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Cart() {
  const { lines } = useCartStore();

  const subtotal = useMemo(
    () =>
      lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0),
    [lines],
  );

  const shipping = 0;
  const total = subtotal + shipping;

  if (lines.length === 0) {
    return (
      <div className="cart-page cart-page--empty">
        <h1 className="cart-page__heading">Shopping cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__layout">
        <div className="cart-page__main">
          <header className="cart-page__head">
            <h1 className="cart-page__heading">Shopping cart</h1>
            <Button
              type="button"
              className="cart-page__clear "
              onClick={() => cartActions.clear()}
            >
              Clear cart
            </Button>
          </header>

          <ul className="cart-page__lines">
            {lines.map((line) => (
              <li key={line.productId} className="cart-line">
                <button
                  type="button"
                  className="cart-line__dismiss"
                  aria-label={`Remove ${line.title}`}
                  onClick={() => cartActions.remove(line.productId)}
                >
                  ×
                </button>
                <img
                  className="cart-line__thumb"
                  src={line.image}
                  alt=""
                  loading="lazy"
                />
                <div className="cart-line__info">
                  <h2 className="cart-line__title">{line.title}</h2>
                  <p className="cart-line__unit">
                    {money.format(line.unitPrice)}
                  </p>
                </div>
                <div className="cart-line__quantity-block">
                  <span className="cart-line__qty-label">Quantity</span>
                  <div className="cart-line__qty">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => cartActions.decrement(line.productId)}
                    >
                      <span className="cart-line__chev" aria-hidden>
                        ‹
                      </span>
                    </button>
                    <span aria-live="polite">{line.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() =>
                        cartActions.setQuantity(
                          line.productId,
                          line.quantity + 1,
                        )
                      }
                    >
                      <span className="cart-line__chev" aria-hidden>
                        ›
                      </span>
                    </button>
                  </div>
                </div>
                <p className="cart-line__subtotal">
                  {money.format(line.quantity * line.unitPrice)}
                </p>
              </li>
            ))}
          </ul>

          <Link className="cart-page__back" to="/">
            ← Continue shopping
          </Link>
        </div>

        <aside className="cart-summary" aria-labelledby="cart-summary-title">
          <h2 id="cart-summary-title" className="cart-summary__title">
            Cart totals
          </h2>
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>{money.format(subtotal)}</span>
          </div>
          <div className="cart-summary__row cart-summary__row--muted">
            <span>Shipping</span>
            <span>Free shipping</span>
          </div>
          <div className="cart-summary__divider" />
          <div className="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <span>{money.format(total)}</span>
          </div>
          <button
            type="button"
            className="cart-summary__checkout "
            onClick={() => {
              alert("Your order are checking out");
            }}
          >
            Proceed to checkout
          </button>
        </aside>
      </div>
    </div>
  );
}
