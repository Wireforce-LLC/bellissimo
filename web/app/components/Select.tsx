import _, { divide } from "lodash";

interface Props {
  readonly value?: string;
  readonly label?: string;
  readonly isRequired?: boolean;
  readonly isDisabled?: boolean;
  readonly name?: string;
  readonly onChangeValue?: (it: string | undefined) => void;
  readonly values?: Value[]
}

interface Value {
  readonly value: string,
  readonly name: string,
}

export default function Select({
  isDisabled,
  label,
  isRequired,
  name,
  onChangeValue,
  value,
  values
}: Props) {
  return (
    <div data-role="input-group" className="w-full">
      {label ? (
        <label className="text-xs text-gray-500 mb-[5px] block">
          {label}
        </label>
      ) : undefined}

      <select
        value={value}
        name={name}
        required={isRequired}
        disabled={_.isBoolean(isDisabled) ? isDisabled : false}
        onChange={(event) => {
          if (onChangeValue) {
            onChangeValue(event.target.value);
          }
        }}
        className="w-full h-8 px-3 py-1 text-sm placeholder-gray-400 hover:border-gray-200 focus-within:border-gray-400 border-gray-200 focus:border-gray-500 transition-colors duration-75 border-[0.115em] outline-none focus:outline-none"
      >
        {values?.map(value => <option key={value.value} value={value.value}>{value.name}</option>)}
      </select>
    </div>
  );
}
