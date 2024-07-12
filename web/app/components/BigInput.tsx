import _, { divide } from "lodash";

interface Props {
  readonly placeholder?: string;
  readonly value?: string;
  readonly label?: string;
  readonly isRequired?: boolean;
  readonly isDisabled?: boolean;
  readonly name?: string;
  readonly onChangeValue?: (it: string | undefined) => void;
}

/**
 * Renders a textarea input component with an optional label.
 *
 * @param {Props} props - The component props.
 * @param {string} [props.placeholder] - The input placeholder text.
 * @param {boolean} [props.isDisabled] - Whether the input is disabled.
 * @param {string} [props.label] - The input label text.
 * @param {boolean} [props.isRequired] - Whether the input is required.
 * @param {string} [props.name] - The input name attribute.
 * @param {Function} [props.onChangeValue] - The callback function called when the input value changes.
 * @param {string} [props.value] - The input value.
 * @returns {JSX.Element} - The rendered textarea input component.
 */
export default function BigInput({
  placeholder,
  isDisabled,
  label,
  isRequired,
  name,
  onChangeValue,
  value,
}: Props) {
  return (
    // The outer div wraps the input group and serves as a container for styling purposes.
    <div data-role="input-group">
      {/* Render the label if it exists */}
      {label ? (
        <label className="text-xs text-gray-500 mb-[5px] block">{label}</label>
      ) : undefined}

      {/* Render the textarea input */}
      <textarea
        // Set the value of the input
        value={value}
        // Set the name attribute of the input
        name={name}
        // Set the number of rows in the textarea
        rows={6}
        // Set the required attribute if isRequired is true
        required={isRequired}
        // Disable the input if isDisabled is true
        disabled={_.isBoolean(isDisabled) ? isDisabled : false}
        // Call the onChangeValue callback function when the input value changes
        onChange={(event) => {
          if (onChangeValue) {
            onChangeValue(event.target.value);
          }
        }}
        // Set the placeholder text of the input
        placeholder={placeholder}
        // Set the CSS class of the input
        className="w-full px-3 py-1 text-sm placeholder-gray-400 hover:border-gray-200 focus-within:border-gray-400 border-gray-200 focus:border-gray-500 transition-colors duration-75 border-[0.115em] outline-none focus:outline-none"
      />
    </div>
  );
}
