import classNames from "classnames";

interface Props {
  readonly children: string;
  readonly onPress?: () => void;
  readonly type?: string;
  readonly disabled?: boolean;
  readonly variant?: "primary" | "secondary" | "delete";
}

export default function Button({
  children,
  variant = "primary",
  type,
  onPress,
  disabled,
}: Props) {
  return (
    <button
      onClick={onPress}
      disabled={disabled}
      type={(type || "button") as "button" | "submit" | "reset" | undefined}
      className={classNames(
        "w-full disabled:text-[#52af59] disabled:cursor-not-allowed disabled:bg-[#e7f2e9] focus:outline focus:outline-gray-500 focus:outline-offset-2 px-2.5 py-1.5 font-medium text-xs text-white bg-[#52af59]",
        {
          "bg-red-500 text-white font-medium disabled:bg-red-300 disabled:text-white":
            variant == "delete",
        }
      )}
    >
      {/* className="w-full focus:outline focus:outline-gray-500 focus:outline-offset-2 rounded-lg px-2.5 py-1 font-medium text-sm drop-shadow shadow-gray-700 border border-gray-600 text-white bg-gray-500 hover:bg-gray-600 focus:bg-gray-700"> */}
      {children}
    </button>
  );
}
