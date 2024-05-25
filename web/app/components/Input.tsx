import classNames from "classnames";
import _, { divide } from "lodash";

interface Props {
  readonly className?: string,
  readonly type?: string;
  readonly placeholder?: string;
  readonly value?: string;
  readonly label?: string;
  readonly isRequired?: boolean;
  readonly isDisabled?: boolean;
  readonly name?: string;
  readonly onChangeValue?: (it: string | undefined) => void;
}

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
}: Props) {
  return (
    <div data-role="input-group" className="w-full">
      {label ? (
        <label className="text-xs text-gray-500 mb-[5px] block">
          {label}
        </label>
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
        // className="w-full px-3 py-1 border border-black outline-none focus:outline-none"
        // className="w-full rounded-lg px-3 py-1 font-medium text-sm placeholder-gray-400 hover:border-gray-400 focus-within:border-gray-400 border-gray-300 focus:border-black transition-colors duration-75 border-2 outline-none focus:outline-none"
        className={
          classNames("w-full h-8 px-3 py-1 text-sm placeholder-gray-400 hover:border-gray-200 focus-within:border-gray-400 border-gray-200 focus:border-gray-500 transition-colors duration-75 border-[0.115em] outline-none focus:outline-none",
            className
          )
        }
      />
    </div>
  );
}
