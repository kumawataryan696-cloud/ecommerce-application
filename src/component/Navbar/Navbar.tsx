import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCartStore } from "../../route/store/CartStore";
import { useWishlist } from "../../route/store/WishlistContext";
import "./navbar.scss";

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </>
      ) : (
        <>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </>
      )}
    </svg>
  );
}

type NavbarMobileMenusProps = { cartCount: number; wishlistCount: number };

/** Remounts on navigation (`key={location.key}`) so the menu closes without an effect. */
function NavbarMobileMenus({ cartCount, wishlistCount }: NavbarMobileMenusProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const firstDrawerLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (menuOpen) {
      firstDrawerLinkRef.current?.focus();
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev;
    }
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((o) => !o);
  const closeMenu = () => setMenuOpen(false);

  const drawerLinkClass = ({ isActive }: { isActive: boolean }) =>
    `navbar__drawer-link${isActive ? " navbar__drawer-link--active" : ""}`;

  return (
    <>
      <button
        type="button"
        className="navbar__menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="navbar-mobile-drawer"
        onClick={toggleMenu}
      >
        <span className="navbar__menu-toggle-icon">
          <MenuIcon open={menuOpen} />
        </span>
        <span className="navbar__sr-only">
          {menuOpen ? "Close menu" : "Open menu"}
        </span>
      </button>

      {menuOpen ? (
        <button
          type="button"
          className="navbar__drawer-backdrop"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      ) : null}

      <aside
        id="navbar-mobile-drawer"
        className={`navbar__drawer-panel${menuOpen ? " navbar__drawer-panel--open" : ""}`}
        aria-hidden={!menuOpen}
        aria-modal={menuOpen ? true : undefined}
        role={menuOpen ? "dialog" : undefined}
      >
        <div className="navbar__drawer-inner">
          <p className="navbar__drawer-title">Menu</p>
          <ul className="navbar__drawer-list">
            <li>
              <NavLink
                ref={firstDrawerLinkRef}
                to="/"
                end
                className={drawerLinkClass}
                onClick={closeMenu}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={drawerLinkClass}
                onClick={closeMenu}
              >
                Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wishlist"
                className={drawerLinkClass}
                onClick={closeMenu}
              >
                Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/cart"
                className={drawerLinkClass}
                onClick={closeMenu}
              >
                Cart
              </NavLink>
            </li>
          </ul>
          <div className="navbar__drawer-footer">
            <Link
              to="/cart"
              className="navbar__drawer-cart"
              onClick={closeMenu}
            >
              <span className="navbar__cart-icon">
                <CartIcon />
              </span>
              <span>View cart ({cartCount})</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export function Navbar() {
  const location = useLocation();
  const { lines } = useCartStore();
  const { items: wishlistItems } = useWishlist();

  const wishlistCount = wishlistItems.length;

  const cartCount = useMemo(
    () => lines.reduce((n, line) => n + line.quantity, 0),
    [lines],
  );

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `navbar__link${isActive ? " navbar__link--active" : ""}`;

  return (
    <nav className="navbar navbar--store" aria-label="Main">
      <NavbarMobileMenus
        key={location.key}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />

      <Link to="/" className="navbar__logo">
        Luxe Store
      </Link>

      <ul className="navbar__links">
        <li>
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/wishlist" className={navLinkClass}>
            Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
          </NavLink>
        </li>
        <li>
          <NavLink to="/cart" className={navLinkClass}>
            Cart
          </NavLink>
        </li>
      </ul>

      <Link
        to="/cart"
        className="navbar__cart"
        aria-label={`My Cart, ${cartCount} items`}
      >
        <span className="navbar__cart-icon">
          <CartIcon />
        </span>
        <span className="navbar__cart-label">My Cart</span>
        <span className="navbar__badge">{cartCount}</span>
      </Link>
    </nav>
  );
}
