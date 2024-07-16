import classNames from "classnames";

interface ItemDto {
  readonly name: string;
  readonly href: string;
  readonly isActive: boolean;
}

interface Props {
  readonly className?: string;
  readonly onMenuClick: () => void;
  readonly menuIcon?: React.ReactNode;
  readonly isShowDatasetButton?: boolean;
}

/**
 * The Navbar component renders a navigation bar with a menu icon and the word "Bell".
 * If the `isShowDatasetButton` prop is truthy, it also renders a link to the DataHub page.
 *
 * @param {Props} props - The props object containing the following properties:
 *   @param {string} [props.className] - The class name for the navbar.
 *   @param {() => void} props.onMenuClick - The function to be called when the menu icon is clicked.
 *   @param {React.ReactNode} [props.menuIcon] - The custom menu icon.
 *   @param {boolean} [props.isShowDatasetButton=true] - Whether to show the DataHub link.
 * @returns {JSX.Element} The rendered navigation bar.
 */
export default function Navbar({
  className,
  menuIcon,
  onMenuClick,
  isShowDatasetButton = true,
}: Props) {
  return (
    <nav
      className={classNames(className, {
        "w-full z-20 bg-white text-black border-b border-b-zinc-200 h-[40px] md:h-[46px]":
          !className,
      })}
    >
      <ul className="h-full md:px-3 flex flex-row items-center justify-between">
        {/* The menu icon */}
        <li
          onClick={() => {
            onMenuClick();
          }}
          className="py-2 px-2 cursor-pointer pt-2.5 items-center justify-center flex flex-row space-x-2 select-none mr-4"
        >
          {menuIcon || (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}

          {/* The word "Bell" */}
          <span className="text-md font-extrabold">Bell</span>
        </li>
      </ul>
    </nav>
  );
}
