import { ReactNode } from "react";
import "./styles.scss";

interface CardProps {
  children: ReactNode;
}

function Card({ children }: CardProps) {
  return <div className="basic_card">{children}</div>;
}

export default Card;
