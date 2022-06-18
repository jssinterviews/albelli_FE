import "./styles.scss";
import { ReactNode } from "react";

interface ViewLayoutProps {
  children: ReactNode;
}

function ViewLayout({ children }: ViewLayoutProps) {
  return <div className="view_layout">{children}</div>;
}

export default ViewLayout;
