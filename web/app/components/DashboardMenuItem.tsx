import { ReactNode } from "react";
import classNames from "classnames";
import { Link as HLink } from "@remix-run/react";

interface Props {
  readonly name: string;
  readonly priority: number;
  readonly icon: ReactNode;
  readonly isActive: boolean;
  readonly href: string;
  readonly kbd?: string;
}

export default function DashboardMenuItem({
  name,
  isActive,
  href,
  priority,
  icon,
  kbd,
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
        "flex px-2 pl-4 h-[37px] justify-between flex-row items-center gap-2.5 cursor-pointer",
        {
          "text-black bg-gray-300 font-medium bg-opacity-20": isActive,
          "text-gray-400 hover:bg-gray-200 hover:bg-opacity-15 hover:text-gray-500":
            !isActive,
        }
      )}
    >
      <div className="flex justify-between gap-2">
        <div role="img">{icon}</div>
        <span className="text-xs">{name}</span>
      </div>

      {kbd && (
        <kbd className="px-1.5 py-1 text-[8px] font-semibold text-gray-800 bg-gray-50 border border-gray-100 rounded-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
          {kbd}
        </kbd>
      )}
    </HLink>
  );
}
