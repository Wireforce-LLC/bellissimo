import classNames from "classnames";
import { ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
  readonly title?: string | null;
  readonly className?: string | null;
  readonly isDisablePaddings?: boolean;
}

export default function Card({ children, isDisablePaddings, title, className }: Props) {
  return (
    <div
      className={classNames("bg-white border block border-gray-100", className)}
    >
      {title && (
        <div className="w-full px-3 py-0.5">
          <span className="text-xs font-medium">{title}</span>
        </div>
      )}

      <section
        className={classNames(className, {
          "px-3 pt-0.5 pb-3 block": title && !isDisablePaddings,
          "block": title && isDisablePaddings,
        })}
      >
        {children}
      </section>
    </div>
  );
}
