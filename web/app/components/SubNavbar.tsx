import string from "~/localization/polyglot";

interface Props {
  readonly title?: string;
  readonly onCreateAction?: () => void;
}

export default function SubNavbar({ title, onCreateAction }: Props) {
  return (
    <div className="w-full bg-white">
      <div className="w-full h-[38px] bg-white font-medium flex items-center border-b border-b-gray-100">
        <div className="md:px-4 px-4 w-full flex flex-row justify-between items-center">
          <span className="text-xs text-gray-800  h-fit">
            {title || "Untitled"}
          </span>

          {onCreateAction && <button onClick={onCreateAction} className="text-xs flex flex-row items-center gap-1.5 text-gray-500 hover:text-gray-500 hover:bg-gray-50 px-2 py-1 rounded-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
            </svg>

            {string("dashboard.actions.create")}
          </button>}
        </div>
      </div>
    </div>
  );
}