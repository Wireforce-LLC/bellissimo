import classNames from "classnames";
import { ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly className?: string | null;
  readonly isDisablePaddings?: boolean;
}

/**
 * @description A generic component for rendering a card.
 * @param description Optional description to be displayed below the title.
 * @param children The content of the card.
 * @param isDisablePaddings Whether to disable default paddings.
 * @param title Optional title to be displayed at the top of the card.
 * @param className Additional CSS classes to be applied to the card.
 * @returns JSX.Element A card component.
 */
export default function Card({ description, children, isDisablePaddings, title, className }: Props): JSX.Element {
  return (
    <div
      className={classNames("bg-white border block border-gray-100", className)}
    >
      {/* Render the title and description if they are provided */}
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

      {/* Render the content of the card */}
      <section
        className={classNames(className, {
          // Add default paddings if title is provided and isDisablePaddings is not true
          "px-3 pt-0.5 pb-3 block": title && !isDisablePaddings,
          // Do not add any paddings if title is not provided or isDisablePaddings is true
          "block": title && isDisablePaddings,
        })}
      >
        {children}
      </section>
    </div>
  );
}
