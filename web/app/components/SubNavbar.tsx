import string from "~/localization/polyglot";

interface Props {
  readonly title?: string;
  readonly onCreateAction?: () => void;
  readonly createActionLabel?: string;
}

export default function SubNavbar({ title, createActionLabel, onCreateAction }: Props) {
  return (
    <div className="w-full bg-white">
      <div className="w-full h-[38px] bg-white font-medium flex items-center border-b border-b-zinc-200">
        <div className="md:px-4 px-4 w-full flex flex-row justify-between items-center">
          <span className="text-xs text-gray-800  h-fit">
            {title || "Untitled"}
          </span>

          {onCreateAction && (
            <button
              onClick={onCreateAction}
              className="text-xs flex flex-row items-center gap-1.5 text-[#54b046] px-2 py-1 rounded-sm bg-[#e7f2e9]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
              </svg>

              {createActionLabel || string("dashboard.actions.create")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
