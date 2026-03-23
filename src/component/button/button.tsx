import type { MouseEvent, ReactNode } from "react";
import "./-button.scss";
type ButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "tertiary";
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  iconSize?: number;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

function Button({
  children,
  className = "",
  disabled = false,
  type = "button",
  loading = false,
  icon,
  iconPosition = "right",
  iconSize = 16,
  onClick,
}: ButtonProps) {

  const iconWrap = icon ? (
    <span
      className="icon_wrap"
      style={{
        width: iconSize,
        height: iconSize,
      }}
      aria-hidden
    >
      {icon}
    </span>
  ) : null;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={[className.trim(), "custom_button"].filter(Boolean).join(" ")}
      aria-busy={loading || undefined}
    >
      {iconPosition === "left" ? iconWrap : null}
      {children}
      {iconPosition === "right" ? iconWrap : null}
    </button>
  );
}

export default Button;
