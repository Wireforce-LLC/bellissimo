import classNames from "classnames";
import { ReactNode } from "react";

interface Props {
  readonly children: ReactNode,
  readonly className?: string
}

export default function GrayWrapper({ children, className }: Props) {
  return <div className={classNames("bg-gray-50 bg-opacity-75 rounded-lg p-2", className)}>
    {children}
  </div>
}
