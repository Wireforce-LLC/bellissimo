import { ReactElement } from "react";

interface Props {
  readonly children?: String;
}

/**
 * Label component.
 * Renders a label with the given children.
 *
 * @param {Props} props - The component props.
 * @param {String} [props.children] - The text to be displayed in the label.
 * @returns {ReactElement | undefined} - The label component or undefined.
 */
export default function Label({ children }: Props): ReactElement | undefined {
  // If the children is empty or undefined, return undefined.
  if (!children) {
    return undefined;
  }

  // Return the label component.
  return (
    <label className="text-xs font-medium uppercase text-black">
      {/* The text to be displayed in the label */}
      {children}
    </label>
  );
}
