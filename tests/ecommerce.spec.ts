import { test, expect } from "@playwright/test";

const CART_STORAGE_KEY = "ecommerce-cart-v1";
const WISHLIST_STORAGE_KEY = "ecommerce-wishlist-v1";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(
    ([cartKey, wishlistKey]) => {
      try {
        window.localStorage.removeItem(cartKey);
        window.localStorage.removeItem(wishlistKey);
      } catch {
        /* ignore */
      }
    },
    [CART_STORAGE_KEY, WISHLIST_STORAGE_KEY],
  );
});

test.describe("Home (product listing)", () => {
  test("loads store title and catalog heading", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Luxe Store/);
    await expect(
      page.getByRole("heading", { name: /Discover Premium Products/i }),
    ).toBeVisible();
  });

  test("shows filter bar and at least one product after data loads", async ({
    page,
  }) => {
    await page.goto("/");

    const filterBar = page.locator(".product-filter-bar");
    await expect(
      filterBar.getByRole("button", { name: "All", exact: true }),
    ).toBeVisible({
      timeout: 30_000,
    });
    await expect(
      page.getByRole("button", { name: "view product" }).first(),
    ).toBeVisible();
  });

  test("category filter updates URL and refetches (electronics)", async ({
    page,
  }) => {
    await page.goto("/");

    const filterBar = page.locator(".product-filter-bar");
    await expect(
      filterBar.getByRole("button", { name: "Electronics", exact: true }),
    ).toBeVisible({
      timeout: 30_000,
    });

    const listRequest = page.waitForResponse(
      (res) =>
        res.url().includes("fakestoreapi.com") &&
        res.url().includes("/products/category/electronics") &&
        res.status() === 200,
    );

    await filterBar.getByRole("button", { name: "Electronics", exact: true }).click();
    await listRequest;

    await expect(page).toHaveURL(/[?&]category=electronics/);
    await expect(
      page.getByRole("button", { name: "view product" }).first(),
    ).toBeVisible();
  });
});

test.describe("Product detail", () => {
  test("opens detail from listing and shows add to cart", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("button", { name: "view product" }).first(),
    ).toBeVisible({ timeout: 30_000 });

    await page.getByRole("button", { name: "view product" }).first().click();

    await expect(page).toHaveURL(/\/products\/\d+/);
    await expect(
      page.getByRole("heading", { level: 1 }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /add to cart/i }),
    ).toBeVisible();
  });

  test("back to home from product page", async ({ page }) => {
    await page.goto("/products/1");

    await expect(
      page.getByRole("button", { name: /back to products/i }),
    ).toBeVisible({ timeout: 30_000 });

    await page.getByRole("button", { name: /back to products/i }).click();

    await expect(page).toHaveURL("/");
  });
});

test.describe("Cart and footer", () => {
  test("add to cart updates footer summary", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("button", { name: "view product" }).first(),
    ).toBeVisible({ timeout: 30_000 });

    await page.getByRole("button", { name: "view product" }).first().click();
    await page.getByRole("button", { name: /add to cart/i }).click();

    const footer = page.locator("footer");
    await expect(footer.getByText("Cart Items:")).toBeVisible();
    await expect(footer.getByText("Total:")).toBeVisible();
    await expect(footer.locator(".footer__value").first()).not.toHaveText("0");
  });

  test("navbar cart link opens cart page", async ({ page }) => {
    await page.goto("/cart");

    await expect(
      page.getByRole("heading", { name: /shopping cart/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /continue shopping/i })).toBeVisible();
  });

  test("cart shows line item after adding product", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("button", { name: "view product" }).first(),
    ).toBeVisible({ timeout: 30_000 });

    await page.getByRole("button", { name: "view product" }).first().click();
    await page.getByRole("button", { name: /add to cart/i }).click();

    await page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "Cart", exact: true })
      .click();

    await expect(page.getByRole("heading", { name: /shopping cart/i })).toBeVisible();
    await expect(page.locator(".cart-line").first()).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("Products nav redirects to home", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "Products", exact: true })
      .click();

    await expect(page).toHaveURL("/");
  });
});
