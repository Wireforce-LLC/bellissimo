import { ReactNode } from "react"
import { Link as HLink } from "@remix-run/react";
import classNames from "classnames";

interface Props {
  readonly children?: String | ReactNode
  readonly href?: String
  readonly isSecond?: boolean
  readonly isCurrentTab?: boolean
}

export default function Link({ children, isSecond, href, isCurrentTab }: Props) {
  return (children && <HLink prefetch="intent" target={!isCurrentTab ? "_blank" : "_self"} className={classNames({ "text-xs text-blue-500": !isSecond, "text-black border-b border-b-gray-300 hover:border-b-gray-600 border-dashed": isSecond })} to={href}>{children}</HLink>)
}
