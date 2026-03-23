import type { KeyboardEvent, MouseEvent } from "react";
import "./card.scss";
import Button from "../button/button";
export type ProductCardFields = {
  cardimage?: string;
  cardcategory?: string;
  cardheading?: string;
  cardsubheading?: string;
  cardprice?: string | number;
};

type ProductCardProps = {
  product: ProductCardFields;
  productId: number;
  onView?: (id: number) => void;
};

const ArrowRightIcon = () => {
  return (
    <svg
      width="16"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4L20 12L12 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 12H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

function formatPrice(value: string | number | undefined): string {
  if (value === undefined || value === "") return "";
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }
  return String(value);
}

export default function ProductCard({
  product,
  productId,
  onView,
}: ProductCardProps) {
  const interactive = Boolean(onView);

  const handleActivate = () => {
    onView?.(productId);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onView) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onView(productId);
    }
  };

  return (
    <div
      className="product-card"
      onClick={interactive ? handleActivate : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      <div className="product-card__image">
        {product.cardimage ? (
          <img
            src={product.cardimage}
            alt={product.cardheading ?? "Product"}
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="product-card__content">
        {product.cardcategory ? (
          <div className="product-card__category">{product.cardcategory}</div>
        ) : null}
        {product.cardheading ? (
          <div className="product-card__heading">{product.cardheading}</div>
        ) : null}
        {product.cardsubheading ? (
          <div className="product-card__subheading">
            {product.cardsubheading}
          </div>
        ) : null}
        <div className="product-card__price">
          {formatPrice(product.cardprice)}
        </div>
        <div className="product-card__actions">
          <Button
            variant="primary"
            size="medium"
            icon={<ArrowRightIcon />}
            iconPosition="right"
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onView?.(productId);
            }}
          >
            view product
          </Button>
          
        </div>
      </div>
    </div>
  );
}
