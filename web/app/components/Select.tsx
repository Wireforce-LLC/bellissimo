import classNames from "classnames";
import _, { divide } from "lodash";
import { useEffect } from "react";

interface Props {
  readonly value?: string;
  readonly label?: string;
  readonly isRequired?: boolean;
  readonly isDisabled?: boolean;
  readonly name?: string;
  readonly placeholder?: string;
  readonly className?: string;
  readonly onChangeValue?: (it: string | undefined) => void;
  readonly values?: Value[];
}

interface Value {
  readonly value: string;
  readonly name: string;
}

/**
 * The Select component is a dropdown menu for selecting one option from a list of values.
 *
 * @param {Props} props - The component props.
 * @param {string} [props.value] - The selected value.
 * @param {string} [props.label] - The label text.
 * @param {boolean} [props.isRequired] - Whether the input is required.
 * @param {boolean} [props.isDisabled] - Whether the input is disabled.
 * @param {string} [props.name] - The input name.
 * @param {string} [props.placeholder] - The placeholder text.
 * @param {string} [props.className] - Additional CSS class for styling.
 * @param {function(string | undefined): void} [props.onChangeValue] - The callback function called when the selected value changes.
 * @param {Value[]} [props.values] - The list of values to select from.
 * @returns {JSX.Element} The rendered Select component.
 */
export default function Select({
  isDisabled,
  label,
  isRequired,
  name,
  onChangeValue,
  value,
  values,
  className,
  placeholder
}: Props) {
  // Set the initial value to the first value in the list if it is not provided by the user.
  useEffect(() => {
    if (value && _.isArray(values) && !_.isEmpty(values) && values?.find(v => v.value == value) == undefined) {
      onChangeValue?.(values?.[0]?.value);
    }
  }, [values, value, onChangeValue]);
  
  return (
    <div data-role="input-group" className={classNames(className, {"w-full": !className})}>
      {/* Render the label if it exists */}
      {label ? (
        <label className="text-xs text-gray-500 mb-[5px] block">{label}</label>
      ) : undefined}

      {/* Render the select element */}
      <select
        value={value}
        name={name}
        required={isRequired}
        disabled={_.isBoolean(isDisabled) ? isDisabled : false}
        onInput={event => {
          onChangeValue?.(event.currentTarget.value);
        }}
        onChange={(event) => {
          onChangeValue?.(event.target.value);
        }}
        className="w-full h-8 px-3 py-1 text-sm placeholder-gray-400 hover:border-gray-200 focus-within:border-gray-400 border-gray-200 focus:border-gray-500 transition-colors duration-75 border-[0.115em] outline-none focus:outline-none"
      >
        {/* Render the placeholder option if it exists */}
        {placeholder ? <option value={placeholder} disabled selected>{placeholder}</option> : undefined}
        {/* Render the options based on the values */}
        {values?.map((it) => (
          <option key={it.value} selected={!placeholder && value == it.value} value={it.value}>
            {it.name}
          </option>
        ))}
      </select>
    </div>
  );
}
