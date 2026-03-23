import { Link } from "react-router-dom";
import "./Checkout.scss";

export default function Checkout() {
  return (
    <div className="checkout-page">
      <h1 className="checkout-page__title">Checkout</h1>
      <p className="checkout-page__hint">
        Checkout is not connected yet. Your cart is unchanged.
      </p>
      <Link className="checkout-page__link" to="/cart">
        Back to cart
      </Link>
    </div>
  );
}
