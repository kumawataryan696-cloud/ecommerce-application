import { api } from "../../config/api";

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
    rating: {
        rate: number;
        count: number;
    };
}

function normalizeProductList(raw: unknown): Product[] {
  if (Array.isArray(raw)) {
    return raw as Product[];
  }
  if (
    raw !== null &&
    typeof raw === "object" &&
    "products" in raw &&
    Array.isArray((raw as { products: unknown }).products)
  ) {
    return (raw as { products: Product[] }).products;
  }
  console.warn("getProductList: expected an array, got:", raw);
  return [];
}

export const getProductList = async (): Promise<Product[]> => {
  try {
    const response = await api.get<unknown>("/products");
    return normalizeProductList(response.data);
  } catch (error) {
    console.error("Error fetching product list:", error);
    throw error;
  }
};

export const getProductById = async (
  id: string | number,
): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};