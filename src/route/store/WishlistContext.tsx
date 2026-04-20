import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type WishlistItem = {
  productId: string;
  title: string;
  image: string;
  price: number;
  category: string;
};

export const WISHLIST_STORAGE_KEY = "ecommerce-wishlist-v1";

function parseStoredItems(raw: unknown): WishlistItem[] {
  if (!Array.isArray(raw)) return [];
  const items: WishlistItem[] = [];
  for (const entry of raw) {
    if (entry === null || typeof entry !== "object") continue;
    const o = entry as Record<string, unknown>;
    if (typeof o.productId !== "string") continue;
    if (typeof o.title !== "string") continue;
    if (typeof o.image !== "string") continue;
    if (typeof o.price !== "number" || !Number.isFinite(o.price)) continue;
    if (typeof o.category !== "string") continue;
    items.push({
      productId: o.productId,
      title: o.title,
      image: o.image,
      price: o.price,
      category: o.category,
    });
  }
  return items;
}

function loadInitialItems(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (raw == null || raw === "") return [];
    return parseStoredItems(JSON.parse(raw) as unknown);
  } catch {
    return [];
  }
}

function persistItems(items: WishlistItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota / private mode
  }
}

export type WishlistContextValue = {
  items: WishlistItem[];
  add: (item: WishlistItem) => void;
  remove: (productId: string) => void;
  toggle: (item: WishlistItem) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(loadInitialItems);

  useEffect(() => {
    persistItems(items);
  }, [items]);

  const add = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.productId === item.productId)) return prev;
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const toggle = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.productId === item.productId)) {
        return prev.filter((i) => i.productId !== item.productId);
      }
      return [...prev, item];
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({ items, add, remove, toggle, clear }),
    [items, add, remove, toggle, clear],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (ctx == null) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return ctx;
}
