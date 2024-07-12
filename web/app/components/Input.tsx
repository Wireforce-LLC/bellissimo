import classNames from "classnames";
import _, { divide } from "lodash";

interface Props {
  readonly className?: string;
  readonly type?: string;
  readonly placeholder?: string;
  readonly isDisabled?: boolean;
  readonly label?: string;
  readonly isRequired?: boolean;
  readonly name?: string;
  readonly onChangeValue?: (value: string) => void;
  readonly value?: string;
}

/**
 * Renders an input field with an optional label.
 *
 * @param {InputProps} props - The component props.
 * @param {string} [props.className] - Additional CSS class for styling.
 * @param {string} [props.type] - The input type.
 * @param {string} [props.placeholder] - The placeholder text.
 * @param {boolean} [props.isDisabled] - Whether the input is disabled.
 * @param {string} [props.label] - The label text.
 * @param {boolean} [props.isRequired] - Whether the input is required.
 * @param {string} [props.name] - The input name.
 * @param {(value: string) => void} [props.onChangeValue] - The callback function called when the input value changes.
 * @param {string} [props.value] - The input value.
 * @returns {JSX.Element} The rendered input field.
 */
export default function Input({
  className,
  type,
  placeholder,
  isDisabled,
  label,
  isRequired,
  name,
  onChangeValue,
  value,
}: Props): JSX.Element {
  return (
    <div data-role="input-group" className="w-full">
      {label ? (
        <label className="text-xs text-gray-500 mb-[5px] block">{label}</label>
      ) : undefined}

      <input
        type={type || "text"}
        value={value}
        name={name}
        required={isRequired}
        disabled={_.isBoolean(isDisabled) ? isDisabled : false}
        onChange={(event) => {
          if (onChangeValue) {
            onChangeValue(event.target.value);
          }
        }}
        placeholder={placeholder}
        className={classNames(
          "w-full h-8 px-3 py-1 disabled:text-gray-400 text-sm placeholder-gray-400 hover:border-gray-200 focus-within:border-gray-400 border-gray-200 focus:border-gray-500 transition-colors duration-75 border-[0.115em] outline-none focus:outline-none",
          className
        )}
      />
    </div>
  );
}