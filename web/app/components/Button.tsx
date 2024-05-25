interface Props {
  readonly children: string;
  readonly onPress?: () => void;
  readonly disabled?: boolean;
}

export default function Button({ children, onPress, disabled }: Props) {
  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className="w-full disabled:bg-zinc-500 focus:outline focus:outline-gray-500 focus:outline-offset-2 px-2.5 py-1.5 font-medium text-xs drop-shadow shadow-gray-700 border border-gray-600 text-white bg-black">
      {/* className="w-full focus:outline focus:outline-gray-500 focus:outline-offset-2 rounded-lg px-2.5 py-1 font-medium text-sm drop-shadow shadow-gray-700 border border-gray-600 text-white bg-gray-500 hover:bg-gray-600 focus:bg-gray-700"> */}
      {children}
    </button>
  );
}
