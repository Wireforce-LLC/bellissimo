import React, { ReactNode } from "react";

interface Props {
  readonly title?: string;
  readonly text?: string;
  readonly icon?: ReactNode;
  readonly isVisible?: boolean;
}

/**
 * Component for displaying a message when there are no records to display.
 *
 * @param {Props} props - The component props.
 * @param {string} [props.title] - The title of the message.
 * @param {string} [props.text] - The text of the message.
 * @param {ReactNode} [props.icon] - The icon to display.
 * @param {boolean} [props.isVisible] - Whether the message is visible.
 * @returns {JSX.Element | null} The rendered component or null.
 */
export default function FirstRecordPlease({
  isVisible = false,
  title,
  text,
  icon,
}: Props): JSX.Element | null {
  // Render the component only if isVisible is true.
  return (
    isVisible ? (
      <div className="text-center flex flex-col items-center py-8 bg-white">
        {/* Display the icon */}
        <div className="mx-auto mb-4 select-none">{icon}</div>

        {/* Display the title */}
        <h1 className="text-lg font-bold w-96">{title}</h1>

        {/* Display the text */}
        <p className="text-xs text-gray-500 w-[36 0px]">{text}</p>
      </div>
    ) : null
  );
}
