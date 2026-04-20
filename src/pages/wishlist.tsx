import { Link } from "react-router-dom";
import Button from "../component/button/button";
import { useWishlist } from "../route/store/WishlistContext";
import "./wishlist.scss";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function WishlistEmptyRows() {
  return (
    <div className="wishlist-empty__rows" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className="wishlist-empty__row">
          <div className="wishlist-empty__row-thumb" />
          <div className="wishlist-empty__row-body">
            <div className="wishlist-empty__row-line" />
            <div className="wishlist-empty__row-line wishlist-empty__row-line--short" />
          </div>
          <div className="wishlist-empty__row-price" />
        </div>
      ))}
    </div>
  );
}

export default function Wishlist() {
  const { items, clear, remove } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="wishlist-page">
        <h1 className="wishlist-page__heading">Wishlist</h1>
        <div className="wishlist-empty">
          <div className="wishlist-empty__intro">
            <p className="wishlist-empty__title">No saved items yet</p>
            <p className="wishlist-empty__text">
              Tap &quot;Add to wishlist&quot; on a product to save it here. Your
              list is stored on this device only.
            </p>
          </div>
          <WishlistEmptyRows />
          <div className="wishlist-empty__cta">
            <Link className="wishlist-empty__cta-link" to="/">
              Browse products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <header className="wishlist-page__head">
        <div>
          <h1 className="wishlist-page__heading">Wishlist</h1>
          <p className="wishlist-page__sub">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        <Button
          type="button"
          className="wishlist-page__clear custom_button"
          onClick={() => clear()}
        >
          Clear wishlist
        </Button>
      </header>

      <ul className="wishlist-page__lines">
        {items.map((item) => (
          <li key={item.productId} className="wishlist-line">
            <img
              className="wishlist-line__thumb"
              src={item.image}
              alt=""
              loading="lazy"
            />
            <div className="wishlist-line__info">
              <p className="wishlist-line__category">{item.category}</p>
              <h2 className="wishlist-line__title">
                <Link
                  className="wishlist-line__link"
                  to={`/products/${item.productId}`}
                >
                  {item.title}
                </Link>
              </h2>
              <p className="wishlist-line__price">{money.format(item.price)}</p>
            </div>
            <div className="wishlist-line__actions">
              <Link
                className="wishlist-line__view"
                to={`/products/${item.productId}`}
              >
                View
              </Link>
              <button
                type="button"
                className="wishlist-line__remove"
                onClick={() => remove(item.productId)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Link className="wishlist-page__back" to="/">
        ← Continue shopping
      </Link>
    </div>
  );
}
