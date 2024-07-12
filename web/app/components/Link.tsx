import { ReactNode } from "react";
import { Link as HLink } from "@remix-run/react";
import classNames from "classnames";

interface Props {
  readonly children?: String | ReactNode;
  readonly isSecond?: boolean;
  readonly href: string;
  readonly isCurrentTab?: boolean;
}

/**
 * Component for rendering a link.
 *
 * @param {LinkProps} props - The properties for the Link component.
 * @returns {JSX.Element} The rendered Link component.
 */
export default function Link({
  children,
  isSecond,
  href,
  isCurrentTab,
}: Props): JSX.Element | undefined {
  // Render the link if children is provided.
  return (
    children && (
      <HLink
        // Pre-fetch the content of the link.
        prefetch="intent"
        // Set the target of the link based on if it is in the current tab or not.
        target={!isCurrentTab ? "_blank" : "_self"}
        // Set the class name of the link based on if it is secondary or not.
        className={classNames({
          "text-xs text-blue-500": !isSecond,
          "text-black border-b border-b-gray-300 hover:border-b-gray-600 border-dashed":
            isSecond,
        })}
        // Set the URL of the link.
        to={href}
      >
        {children}
      </HLink>
    ) || undefined
  );
}
