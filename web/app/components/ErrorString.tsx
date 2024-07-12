import _ from "lodash";
import { ReactElement } from "react";

interface Props {
  readonly children?: String;
}


interface Props {
  readonly children?: String;
}

/**
 * Component to display an error message.
 *
 * @param {Props} props - The component props.
 * @param {string} [props.children] - The error message to display.
 * @returns {React.ReactElement | undefined} - The error message component or undefined.
 */
export default function ErrorString({ children }: Props): ReactElement | undefined {
  // If the error message is empty or undefined, return undefined.
  if (_.isEmpty(children) || !children) {
    return undefined;
  }

  // Return the error message component.
  return (
    children && (
      // The error message is wrapped in a span element with the appropriate class for styling.
      <span className="text-xs font-medium text-red-500">{children}</span>
    )
  );
}
