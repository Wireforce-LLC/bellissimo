import { ReactNode } from "react";
import classNames from "classnames";
import { Link as HLink } from "@remix-run/react";

interface Props {
  readonly name: string;
  readonly priority: number;
  readonly icon: ReactNode;
  readonly isActive: boolean;
  readonly href: string;
}

export default function DashboardMenuItem({
  name,
  isActive,
  href,
  priority,
  icon,
}: Props) {
  return (
    <HLink
      to={href}
      prefetch="intent"
      data-priority={priority}
      data-href={href}
      data-name={name}
      data-is-active={isActive}
      className={classNames(
        "flex px-4 h-[37px] flex-row items-center gap-2.5 cursor-pointer",
        {
          "text-black bg-gray-300 font-medium bg-opacity-20": isActive,
          "text-gray-400 hover:bg-gray-200 hover:bg-opacity-15 hover:text-gray-500": !isActive,
        }
      )}
    >
      <div role="img">{icon}</div>

      <span className="text-xs">{name}</span>
    </HLink>
  );
}
