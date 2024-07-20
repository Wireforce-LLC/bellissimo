import classNames from "classnames";

interface Props {
  readonly className?: string;
  readonly onMenuClick: () => void;
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
export default function Navbar({ className, onMenuClick }: Props) {
  return (
    <nav
      className={classNames(className, {
        "w-full z-20 bg-white text-black border-b border-b-zinc-200 h-[40px] md:h-[46px]":
          !className,
      })}
    >
      <ul className="h-full md:px-3 flex flex-row items-center justify-between">
        <li className="py-2 px-2 cursor-pointer pt-2.5 items-center justify-center flex flex-row space-x-2 select-none mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            className="icon size-6"
            version="1.1"
          >
            <path
              d="M768 704H256a254.688 254.688 0 0 1-64-8.416V928a32 32 0 0 0 32 32h576a32 32 0 0 0 32-32v-232.416A254.688 254.688 0 0 1 768 704z"
              fill="#EAEAEA"
            />
            <path
              d="M792.928 193.248A287.68 287.68 0 0 1 800 256a286.4 286.4 0 0 1-53.888 167.328c13.984-31.648 21.888-66.56 21.888-103.328a256 256 0 0 0-512 0c0 36.768 7.904 71.68 21.888 103.328A286.4 286.4 0 0 1 224 256c0-21.568 2.56-42.528 7.072-62.752A256 256 0 0 0 256 704h512a256 256 0 0 0 24.928-510.752z"
              fill="#B2BEC3"
            />
            <path
              d="M802.08 701.504l-3.04 0.416A261.056 261.056 0 0 1 768 704H256c-10.528 0-20.864-0.864-31.072-2.08l-3.04-0.416A256.64 256.64 0 0 1 192 695.808V736h640v-40.192a255.872 255.872 0 0 1-29.92 5.696z"
              fill=""
            />
          </svg>
          <span className="text-md font-extrabold logotype-bellissimo">Bellissimo</span>
        </li>

        <li>
          <button
            onClick={() => onMenuClick()}
            className="py-1 px-2 cursor-pointer items-center justify-center flex flex-row space-x-2 select-none font-medium text-sm hover:bg-zinc-100 bg-zinc-50 hover:outline outline-black outline-offset-2"
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              className="size-5"
            >
              <path
                fill="currentColor"
                d="M4 4h4v4H4V4zM4 10h4v4H4v-4zM8 16H4v4h4v-4zM10 4h4v4h-4V4zM14 10h-4v4h4v-4zM10 16h4v4h-4v-4zM20 4h-4v4h4V4zM16 10h4v4h-4v-4zM20 16h-4v4h4v-4z"
              />
            </svg>
            <span>Menu</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
