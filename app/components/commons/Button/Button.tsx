import { ReactNode } from "react";
import "./styles.scss";
import { Spinner } from "../index";

export interface ButtonProps {
  onClick?: () => void;
  label?: string;
  variant?: "main" | "secondary" | "transparent";
  icon?: ReactNode;
  className?: string;
  type?: "submit" | "reset" | "button";
  loading?: boolean;
  disabled?: boolean;
  dataTestId?: string;
}

function Button({
  label = "",
  icon,
  variant = "main",
  className = "",
  onClick,
  type = "button",
  loading = false,
  disabled = false,
  dataTestId = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`basic_button basic_button_${variant} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      data-testid={dataTestId}
    >
      <>
        {loading ? (
          <Spinner />
        ) : (
          icon && <div style={{ marginRight: 8 }}>{icon}</div>
        )}
        {label}
      </>
    </button>
  );
}

export default Button;
