import _ from "lodash";

interface Props {
  readonly progress?: Number;
  readonly value?: Number;
  readonly bgColor: String;
  readonly label?: String | null;
}

/**
 * Component that displays a mini progress bar.
 *
 * @param {Object} props - The component props.
 * @param {Number} [props.progress] - The progress of the bar (0-100).
 * @param {Number} [props.value] - The value of the progress (shown next to the progress bar if label is not provided).
 * @param {String} props.bgColor - The background color of the progress bar.
 * @param {String | null} [props.label] - The label to be shown next to the progress bar.
 * @returns {JSX.Element} The mini progress bar component.
 */
export default function ProgressMini({
  progress,
  value,
  bgColor,
  label = null,
}: Props) {
  return (
    // Main container for the progress bar and label
    <div className="w-full h-[22px] flex flex-row justify-center items-center gap-2">
      {/* The progress bar */}
      <div className="w-full h-1 rounded-md overflow-hidden bg-gray-100">
        <div
          className="h-full rounded-md"
          style={{
            width: `${(progress || 0)}%`, // Use template literals for easier concatenation
            backgroundColor: bgColor ? String(bgColor) : undefined, // Use ternary operator for cleaner code
          }}
        ></div>
      </div>
      {/* The label */}
      <span className="text-xs text-gray-400 hover:text-black transition-colors duration-75 text-opacity-75 font-medium">
        {/* Use template literals for easier concatenation */}
        {`${label || value}`}
      </span>
    </div>
  );
}
