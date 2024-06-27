import _ from "lodash";

interface Props {
  readonly progress?: Number;
  readonly value?: Number;
  readonly bgColor: String;
  readonly label?: String | null;
}

export default function ProgressMini({ progress, value, bgColor, label = null }: Props) {
  return (
    <div className="w-full h-[22px] flex flex-row justify-center items-center gap-2">
      <div className="w-full h-1 rounded-md overflow-hidden bg-gray-100">
        <div
          className="h-full rounded-md"
          style={{
            width: (progress || 0) + "%",
            backgroundColor: bgColor ? String(bgColor) : undefined,
          }}
        ></div>
      </div>
      <span className="text-xs text-gray-400 hover:text-black transition-colors duration-75 text-opacity-75 font-medium">
        {String(label || value)}
      </span>
    </div>
  );
}
