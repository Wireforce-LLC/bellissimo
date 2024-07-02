import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Link as HLink } from "@remix-run/react";
import _ from "lodash";
import ButtonSecondary from "./ButtonSecondary";

interface ItemDto {
  readonly name: string;
  readonly href: string;
  readonly isActive: boolean;
}

interface Props {
  readonly className?: string;
  readonly onMenuClick: () => void;
  readonly menuIcon?: React.ReactNode;
}



export default function Navbar({
  className,
  menuIcon,
  onMenuClick
}: Props) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav
        className={classNames(
          className,
          {"w-full z-20 bg-white text-black border-b border-b-zinc-200 h-[40px] md:h-[46px]": !className},
        )}
      >
        <ul className="h-full md:px-3 hidden md:flex flex-row items-center justify-between">
          <li onClick={() => {
                onMenuClick()
              }} className="py-2 px-2 cursor-pointer pt-2.5 items-center  justify-center flex flex-row space-x-2 select-none mr-4">
            
            {menuIcon || <svg
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
            </svg>}

            <span className="text-md font-extrabold">Bell</span>
          </li>


          <li>
            <a href="/datahub" className="text-xs flex flex-row items-center justify-normal gap-2 bg-zinc-50 border border-zinc-100 py-1 px-2 outline-1 outline-offset-2 hover:outline">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="1em"
                width="1em"
                className="size-5"
              >
                <path d="M12 2.604l-.43.283L0 10.459v6.752l6.393 4.184L12 17.725l5.607 3.671L24 17.211v-6.752L12 2.604zm0 .828l5.434 3.556-2.717 1.778L12 10.545l-2.717-1.78-2.717-1.777L12 3.432zM6.39 7.104l5.434 3.556-5.408 3.54-5.434-3.557 5.409-3.54zm11.22 0l5.431 3.554-5.434 3.557-5.433-3.555 5.435-3.556zM.925 10.867l5.379 3.52a.123.08 0 00.027.013v5.647l-5.406-3.54v-5.64zm11.213.115l5.408 3.54v5.664l-5.408-3.54v-5.664z" />
              </svg>
          
              <span>DataHub</span>
            </a>
          </li>
        </ul>

        <div className="mx-auto px-4 container md:hidden flex items-center justify-between h-full">
          <div className="py-2 pt-2.5 flex flex-row space-x-2 select-none mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z" />
            </svg>
            <span className="-mt-0.5 text-sm font-semibold">Bell</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
}
