import { formatCategoryLabel } from "../../utils/formatCategory";
import "./productFilterBar.scss";

export type SortKey = "featured" | "price-asc" | "price-desc" | "name-az";

export type ProductFilterBarProps = {
  categories: string[];
  selectedCategory: "all" | string;
  onCategoryChange: (category: "all" | string) => void;
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
};

export function ProductFilterBar({
  categories,
  selectedCategory,
  onCategoryChange,
  sortKey,
  onSortChange,
}: ProductFilterBarProps) {
  return (
    <div className="product-filter-bar">
      <div className="product-filter-bar__filters">
        <span className="product-filter-bar__label" id="filter-category-label">
          Filter:
        </span>
        <div
          className="product-filter-bar__pills"
          role="group"
          aria-labelledby="filter-category-label"
        >
          <button
            type="button"
            className={`product-filter-bar__pill${selectedCategory === "all" ? " product-filter-bar__pill--active" : ""}`}
            aria-pressed={selectedCategory === "all"}
            onClick={() => onCategoryChange("all")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`product-filter-bar__pill${selectedCategory === cat ? " product-filter-bar__pill--active" : ""}`}
              aria-pressed={selectedCategory === cat}
              onClick={() => onCategoryChange(cat)}
            >
              {formatCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>
      <div className="product-filter-bar__sort">
        <label className="product-filter-bar__sort-label" htmlFor="catalog-sort">
          Sort:
        </label>
        <select
          id="catalog-sort"
          className="product-filter-bar__select"
          value={sortKey}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          aria-label="Sort products"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low–High</option>
          <option value="price-desc">Price: High–Low</option>
          <option value="name-az">Name A–Z</option>
        </select>
      </div>
    </div>
  );
}
