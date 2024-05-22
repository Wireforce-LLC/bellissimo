import { ReactNode } from "react";
import classNames from "classnames";

interface Props {
  readonly children: ReactNode;
  readonly className?: string;
}

export default function DashboardBasicWrapper({ children, className }: Props) {
  return <div className={classNames("", className)}>{children}</div>;
}
