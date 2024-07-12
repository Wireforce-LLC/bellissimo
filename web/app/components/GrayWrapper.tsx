import classNames from "classnames";
import { ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * A wrapper component that renders a gray background with a rounded border and padding.
 *
 * @param {GrayWrapperProps} props - The component props.
 * @param {ReactNode} props.children - The content to be rendered inside the wrapper.
 * @param {string} [props.className] - Additional CSS classes to be applied to the wrapper.
 * @returns {JSX.Element} The wrapper component.
 */
export default function GrayWrapper({ children, className }: Props): JSX.Element {
  return (
    <div
      className={classNames(
        "bg-gray-50 bg-opacity-75 rounded-lg p-2",
        className as string
      )}
    >
      {children}
    </div>
  );
}
