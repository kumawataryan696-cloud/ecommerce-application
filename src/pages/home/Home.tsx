import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard, {
  type ProductCardFields,
} from "../../component/card";
import {
  ProductFilterBar,
  type SortKey,
} from "../../component/productFilterBar";
import { getProductList, type Product } from "../service/service";
import "./home.scss";
import Spinner from "../../component/spinner/spinner";

function mapProductToCard(p: Product): ProductCardFields {
  return {
    cardimage: p.image,
    cardcategory: p.category,
    cardheading: p.title,
    cardprice: p.price,
  };
}

function deriveCategories(products: Product[]): string[] {
  const set = new Set<string>();
  for (const p of products) set.add(p.category);
  return [...set].sort((a, b) => a.localeCompare(b));
}

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("featured");

  const categories = useMemo(
    () => deriveCategories(products),
    [products],
  );

  const selectedCategory = useMemo((): "all" | string => {
    if (!categoryParam) return "all";
    if (categories.length === 0) return categoryParam;
    return categories.includes(categoryParam) ? categoryParam : "all";
  }, [categoryParam, categories]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductList();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const filtered = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortKey) {
      case "featured":
        return arr;
      case "price-asc":
        return arr.sort((a, b) => a.price - b.price);
      case "price-desc":
        return arr.sort((a, b) => b.price - a.price);
      case "name-az":
        return arr.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return arr;
    }
  }, [filtered, sortKey]);

  const handleCategoryChange = useCallback(
    (category: "all" | string) => {
      if (category === "all") {
        setSearchParams({}, { replace: true });
      } else {
        setSearchParams({ category }, { replace: true });
      }
    },
    [setSearchParams],
  );

  const handleSortChange = useCallback((key: SortKey) => {
    setSortKey(key);
  }, []);

  const handleView = useCallback(
    (id: number) => {
      void navigate(`/products/${id}`);
    },
    [navigate],
  );

  return (
    <div className="home-page">
      <h1 className="home-page__title">Discover Premium Products</h1>
      <p className="home-page__hint">
        Curated collections, delivered to your door.
      </p>

      {loading ? <Spinner open={loading} message="Loading products..." /> : null}
      {error ? <p className="home-page__status home-page__status--error">{error}</p> : null}

      {!loading && !error && products.length > 0 ? (
        <ProductFilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          sortKey={sortKey}
          onSortChange={handleSortChange}
        />
      ) : null}

      <div className="home-page__grid">
        {sorted.map((product) => (
          <ProductCard
            key={product.id}
            productId={product.id}
            product={mapProductToCard(product)}
            onView={handleView}
          />
        ))}
      </div>
    </div>
  );
}
