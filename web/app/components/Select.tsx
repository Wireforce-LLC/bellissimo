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
  useEffect(() => {
    if (value && _.isArray(values) && !_.isEmpty(values) && values?.find(v => v.value == value) == undefined) {
      onChangeValue?.(values?.[0]?.value);
    }
  }, [values, value, onChangeValue]);
  
  return (
    <div data-role="input-group" className={classNames(className, {"w-full": !className})}>
      {label ? (
        <label className="text-xs text-gray-500 mb-[5px] block">{label}</label>
      ) : undefined}

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
        {placeholder ? <option value={placeholder} disabled selected>{placeholder}</option> : undefined}
        {values?.map((it) => (
          <option key={it.value} selected={!placeholder && value == it.value} value={it.value}>
            {it.name}
          </option>
        ))}
      </select>
    </div>
  );
}
