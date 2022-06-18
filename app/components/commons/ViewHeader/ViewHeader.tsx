import { ReactNode } from "react";
import "./styles.scss";

interface ViewHeaderProps {
  title: string;
  icon?: ReactNode;
  children?: ReactNode;
}

function ViewHeader({ title, icon, children }: ViewHeaderProps) {
  return (
    <div className="view_header_wrapper">
      <div className="center_vertically">
        {icon && (
          <div style={{ marginRight: 4 }} className="center_vertically">
            {icon}
          </div>
        )}
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

export default ViewHeader;
