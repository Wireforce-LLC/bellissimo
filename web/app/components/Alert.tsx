import classNames from "classnames";

interface Props {
  readonly title?: string;
  readonly text?: string;
  readonly type: "SUCCESS";
}

export default function Alert({ text, type, title }: Props) {
  return (
    <div
      className={classNames(
        "w-full py-2.5 px-4 rounded-lg flex flex-row items-center space-x-3.5",
        {
          "bg-lime-50 border border-lime-200 text-lime-700 fill-lime-600":
            type == "SUCCESS",
        }
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path
          fill-rule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
          clip-rule="evenodd"
        />
      </svg>

      <div className="flex flex-col">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-xs font-medium">{text}</span>
      </div>
    </div>
  );
}
