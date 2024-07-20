import EazyModal from "./EazyModal";
import classNames from "classnames";
import { ReactNode, useMemo, useState } from "react";

interface Props {
  readonly children?: ReactNode;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly className?: string | null;
  readonly isDisablePaddings?: boolean;
  readonly isCanBeFullScreen?: boolean;
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
export default function Card({
  isCanBeFullScreen,
  description,
  children,
  isDisablePaddings,
  title,
  className,
}: Props): JSX.Element {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const fragment = useMemo(() => {
    return children
  }, [children]);
  
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (children == undefined || children == null) {
    return <div
    className={classNames("bg-white border block border-gray-100", className)}
  >
      <p className="py-3 px-3 font-normal text-[12px] text-center">
        No content
      </p>
    </div>
  }

  return (
    <>
    <EazyModal isBigModal title={title || undefined} isVisible={isFullScreen} intent={toggleFullScreen}>
      {fragment}
    </EazyModal>

    <div
      className={classNames("bg-white border flex flex-col border-gray-100 w-full h-full", className)}
    >
      {(title || description || isCanBeFullScreen) && <div className="py-3 px-3">
        <div className="w-full flex flex-row justify-between items-start">
          <div>
            {title && (
              <div className="w-full m-0">
                <span className="text-sm font-medium">{title}</span>
              </div>
            )}

            {description && (
              <div className="w-full mb-2">
                <p className="text-[10px] max-w-[75%] text-zinc-500">
                  {description}
                </p>
              </div>
            )}
          </div>

          {isCanBeFullScreen && (
            <button onClick={toggleFullScreen} className="text-xs flex-shrink-0 font-medium text-gray-500 hover:text-gray-600">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="1em"
                width="1em"
                className="size-4"
              >
                <path d="M14 14h5v2h-3v3h-2v-5m-9 0h5v5H8v-3H5v-2m3-9h2v5H5V8h3V5m11 3v2h-5V5h2v3h3z" />
              </svg>
            </button>
          )}
        </div>
      </div>}

      <section
        className={classNames(className, "w-full h-full", {
          // Add default paddings if title is provided and isDisablePaddings is not true
          "px-3 pt-0.5 pb-3 block": title && !isDisablePaddings,
          // Do not add any paddings if title is not provided or isDisablePaddings is true
          block: title && isDisablePaddings,
        })}
      >
        {fragment}
      </section>
    </div>
    </>
  );
}
