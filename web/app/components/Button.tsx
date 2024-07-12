import classNames from "classnames";
import { Ref } from "react";

interface Props {
  readonly children: string;
  readonly onPress?: () => void;
  readonly type?: string;
  readonly disabled?: boolean;
  readonly variant?: "primary" | "secondary" | "delete";
  readonly ref?: Ref<HTMLButtonElement>
}

/**
 * Button component.
 *
 * @param {Props} props - The component props.
 * @param {string} props.children - The button text.
 * @param {"primary" | "secondary" | "delete"} [props.variant="primary"] - The button variant.
 * @param {string} [props.type] - The button type.
 * @param {() => void} [props.onPress] - The button press event handler.
 * @param {boolean} [props.disabled=false] - Indicates if the button is disabled.
 * @returns {JSX.Element} The button component.
 */
export default function Button({
  children,
  variant = "primary",
  type,
  ref,
  onPress,
  disabled = false,
}: Props) {
  return (
    // Button element
    <button
      ref={ref}
      onClick={onPress} // Button press event handler
      disabled={disabled} // Indicates if the button is disabled
      type={(type || "button") as "button" | "submit" | "reset" | undefined} // Button type
      className={classNames(
        "w-full disabled:cursor-not-allowed focus:outline disabled:bg-[#e7f2e9] disabled:text-[#52af59] focus:outline-gray-500 focus:outline-offset-2 px-2.5 py-1.5 font-medium text-xs bg-[#52af59]",
        {
          // Button variant styles
          "bg-red-500 text-white font-medium disabled:bg-red-300 disabled:text-white":
            variant === "delete",
          "bg-zinc-100 border border-gray-200 text-black font-medium disabled:bg-zinc-50 disabled:text-black":
            variant === "secondary",
          "text-white": variant === "primary" || !variant,
        }
      )}
    >
      {/* className="w-full focus:outline focus:outline-gray-500 focus:outline-offset-2 rounded-lg px-2.5 py-1 font-medium text-sm drop-shadow shadow-gray-700 border border-gray-600 text-white bg-gray-500 hover:bg-gray-600 focus:bg-gray-700"> */}
      {children} 
    </button>
  );
}
