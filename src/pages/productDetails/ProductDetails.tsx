import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs } from "../../component/breadcrumbs";
import { getProductById, type Product } from "../service/service";

import "./productDetails.scss";
import Button from "../../component/button/button";
import Spinner from "../../component/spinner/spinner";
import { cartActions, useCartStore } from "../../route/store/CartStore";
import { useWishlist } from "../../route/store/WishlistContext";
import { formatCategoryLabel } from "../../utils/formatCategory";

function truncateBreadcrumbTitle(title: string, max = 50): string {
  if (title.length <= max) return title;
  return `${title.slice(0, max - 1)}…`;
}

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();
  const { lines } = useCartStore();
  const { items: wishlistItems, toggle: toggleWishlist } = useWishlist();

  const inCartQty = useMemo(() => {
    if (!id) return 0;
    const line = lines.find((l) => l.productId === id);
    return line?.quantity ?? 0;
  }, [lines, id]);

  const ArrowLeftIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="22px"
      viewBox="0 -960 960 960"
      width="22px"
      fill="currentColor"
      aria-hidden
    >
      <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
    </svg>
  );

  useEffect(() => {
    setQty(1);
  }, [id]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Missing product id");
      return;
    }

    let cancelled = false;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(id);
        if (!cancelled) setProduct(data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load product");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const priceLabel =
    product != null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(product.price)
      : "";

  if (loading) {
    return <Spinner open={loading} message="Loading product…" />;
  }

  if (error) {
    return (
      <div className="product-details product-details--status product-details--error">
        <p>{error}</p>
        <div className="product-details__status-actions">
          <Link to="/">Continue shopping</Link>
          <Button
            type="button"
            icon={<ArrowLeftIcon />}
            iconPosition="left"
            onClick={() => navigate("/")}
          >
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details product-details--status">
        <p>Product not found.</p>
        <div className="product-details__status-actions">
          <Link to="/">Continue shopping</Link>
        </div>
      </div>
    );
  }

  const inWishlist = wishlistItems.some(
    (i) => i.productId === String(product.id),
  );

  const bumpQty = (delta: number) => {
    setQty((q) => Math.max(1, q + delta));
  };

  const handleAddToCart = () => {
    cartActions.add(
      String(product.id),
      qty,
      product.price,
      product.title,
      product.image,
    );
  };
  const handleWishlistToggle = () => {
    toggleWishlist({
      productId: String(product.id),
      title: product.title,
      image: product.image,
      price: product.price,
      category: product.category,
    });
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          {
            label: formatCategoryLabel(product.category),
            to: `/?category=${encodeURIComponent(product.category)}`,
          },
          { label: truncateBreadcrumbTitle(product.title) },
        ]}
      />
      <div className="back-to-products">
        <Button
          variant="primary"
          size="medium"
          icon={<ArrowLeftIcon />}
          iconPosition="left"
          onClick={() => navigate("/")}
        >
          Back to products
        </Button>
      </div>
      <div className="product-details">
        <div className="product-details__image">
          <img src={product.image} alt={product.title} loading="lazy" />
        </div>
        <div className="product-details__content">
          <p className="product-details__category">{product.category}</p>
          <h1 className="product-details__title">{product.title}</h1>
          <p className="product-details__description">{product.description}</p>
          <p className="product-details__price">{priceLabel}</p>
          {inCartQty > 0 ? (
            <p className="product-details__in-cart">
              In cart: {inCartQty}
            </p>
          ) : null}

          <div className="product-details__actions">
            <div className="product-details__quantity">
              <span className="product-details__quantity-label">Quantity</span>
              <div className="product-details__quantity-controls">
                <button
                  type="button"
                  className="product-details__qty-btn"
                  aria-label="Decrease quantity"
                  onClick={() => bumpQty(-1)}
                >
                  <ChevronLeftIcon />
                </button>
                <span className="product-details__qty-value">{qty}</span>
                <button
                  type="button"
                  className="product-details__qty-btn"
                  aria-label="Increase quantity"
                  onClick={() => bumpQty(1)}
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
            <button
              type="button"
              className="product-details__add-cart"
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
          </div>

          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`product-details__wishlist${inWishlist ? " product-details__wishlist--active" : ""}`}
            aria-pressed={inWishlist}
          >
            <HeartIcon />
            {inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          </button>
        </div>
      </div>
    </>
  );
}
