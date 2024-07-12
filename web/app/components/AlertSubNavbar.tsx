import string from "~/localization/polyglot";

interface Props {
  readonly title?: string;
  readonly type?: "blue" | "green" | "yellow";
}

/**
 * The `AlertSubNavbar` component is used to display a sub-navbar with an alert icon
 * and a title.
 *
 * @param title - The title of the sub-navbar. Defaults to "Untitled".
 * @param type - The type of the alert. Can be "blue", "green", or "yellow".
 * Defaults to "blue".
 */
export default function AlertSubNavbar({ title, type = "blue" }: Props) {
  return (
    <div className="w-full bg-white">
      <div
        className={`w-full h-[37px] bg-${type}-50 font-medium flex items-center border-b border-b-${type}-100`}
      >
        <div className="md:px-4 px-4 w-full flex flex-row justify-start gap-2 items-center">
          {/* The alert icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className={`w-4 h-4 text-${type}-500 flex-shrink-0`}
          >
            {/* The path for the alert icon */}
            <path
              fill-rule="evenodd"
              d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z"
              clip-rule="evenodd"
            />
          </svg>

          {/* The title of the sub-navbar */}
          <span className={`text-xs text-${type}-800  h-fit`}>
            {title || string("Untitled")}
          </span>
        </div>
      </div>
    </div>
  );
}
