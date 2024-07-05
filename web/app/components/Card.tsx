import classNames from "classnames";
import { ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly className?: string | null;
  readonly isDisablePaddings?: boolean;
}

export default function Card({ description, children, isDisablePaddings, title, className }: Props) {
  return (
    <div
      className={classNames("bg-white border block border-gray-100", className)}
    >
      <div className="w-full py-0.5  px-3">
      {title && (
        <div className="w-full m-0">
          <span className="text-sm font-medium">{title}</span>
        </div>
      )}

      {
        description && (
          <div className="w-full mb-2">
            <p className="text-[10px] max-w-[75%] text-zinc-500">{description}</p>
          </div>
        )
      }
      </div>

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
