import { useSyncExternalStore } from "react";

export type CartLine = {
  productId: string;
  quantity: number;
  /** Unit price in USD (e.g. 89.99) */
  unitPrice: number;
  title: string;
  image: string;
};

type CartState = {
  lines: CartLine[];
};

const STORAGE_KEY = "ecommerce-cart-v1";

function parseStoredLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const lines: CartLine[] = [];
  for (const item of raw) {
    if (item === null || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    if (typeof o.productId !== "string") continue;
    if (
      typeof o.quantity !== "number" ||
      !Number.isFinite(o.quantity) ||
      o.quantity < 1
    ) {
      continue;
    }
    if (typeof o.unitPrice !== "number" || !Number.isFinite(o.unitPrice)) {
      continue;
    }
    if (typeof o.title !== "string") continue;
    if (typeof o.image !== "string") continue;
    lines.push({
      productId: o.productId,
      quantity: Math.floor(o.quantity),
      unitPrice: o.unitPrice,
      title: o.title,
      image: o.image,
    });
  }
  return lines;
}

function loadInitialLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw == null || raw === "") return [];
    return parseStoredLines(JSON.parse(raw) as unknown);
  } catch {
    return [];
  }
}

function persistLines(lines: CartLine[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // ignore quota / private mode
  }
}

let state: CartState = { lines: loadInitialLines() };
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): CartState {
  return state;
}

function setState(next: CartState) {
  state = next;
  persistLines(state.lines);
  emit();
}

function mergeLine(
  lines: CartLine[],
  productId: string,
  quantity: number,
  unitPrice: number,
  title: string,
  image: string,
): CartLine[] {
  const idx = lines.findIndex((l) => l.productId === productId);
  if (idx === -1) {
    return [...lines, { productId, quantity, unitPrice, title, image }];
  }
  const next = [...lines];
  const prev = next[idx];
  next[idx] = {
    productId,
    quantity: prev.quantity + quantity,
    unitPrice: prev.unitPrice,
    title,
    image,
  };
  return next;
}

export const cartActions = {
  add(
    productId: string,
    quantity = 1,
    unitPrice = 0,
    title = "",
    image = "",
  ) {
    if (quantity <= 0) return;
    setState({
      lines: mergeLine(state.lines, productId, quantity, unitPrice, title, image),
    });
  },

  setQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      cartActions.remove(productId);
      return;
    }
    setState({
      lines: state.lines.map((l) =>
        l.productId === productId ? { ...l, quantity } : l,
      ),
    });
  },

  decrement(productId: string) {
    const line = state.lines.find((l) => l.productId === productId);
    if (!line) return;
    if (line.quantity <= 1) {
      cartActions.remove(productId);
      return;
    }
    setState({
      lines: state.lines.map((l) =>
        l.productId === productId ? { ...l, quantity: l.quantity - 1 } : l,
      ),
    });
  },

  remove(productId: string) {
    setState({
      lines: state.lines.filter((l) => l.productId !== productId),
    });
  },

  clear() {
    setState({ lines: [] });
  },
};

export function getCartItemCount(): number {
  return state.lines.reduce((n, line) => n + line.quantity, 0);
}

export function getCartTotal(): number {
  return state.lines.reduce(
    (sum, line) => sum + line.quantity * line.unitPrice,
    0,
  );
}

export function getCartState(): CartState {
  return state;
}

export function useCartStore(): CartState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
