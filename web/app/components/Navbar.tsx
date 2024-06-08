import React, { useEffect, useState } from "react";
import classNames from "classnames";
import getDatasetNavbar from "~/dataset/Navbar";
import { Link as HLink } from "@remix-run/react";
import _ from "lodash";

interface ItemDto {
  readonly name: string;
  readonly href: string;
  readonly isActive: boolean;
}

interface Props {
  readonly currentActivePageId: PageIdEnum | null;
  readonly mode: NavbarModeEnum | null;
  readonly className?: string;
  readonly moneyVolume?: number;
}

export enum NavbarModeEnum {
  IN_DASHBOARD,
  UNKNOWN_USER,
}

export enum PageIdEnum {
  DASHBOARD,
  TRAFFIC,
  CLOUD_OBJECT,
  PIPELINES,
}

export default function Navbar({
  currentActivePageId,
  className,
  mode,
  moneyVolume,
}: Props) {
  const [items, setItems] = useState<ItemDto[]>(getDatasetNavbar(null));

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setItems(getDatasetNavbar(currentActivePageId));
  }, [currentActivePageId]);

  return (
    <>
      <nav
        className={classNames(
          "w-full bg-white border-b border-b-zinc-200 h-[40px] md:h-[46px]",
          className
        )}
      >
        <ul className="h-full md:px-3 hidden md:flex flex-row items-center justify-between">
          <li className="py-2 px-2 pt-2.5 flex flex-row space-x-2 select-none mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z" />
            </svg>
            <span className="-mt-0.5 text-sm font-extrabold">Bell</span>
          </li>
          
          <li>
            <div className="">
              <span className="block text-sm">
                <span className="text-xs font-medium text-gray-600">Earned today</span> <span className="text-sm text-black font-semibold text-lime-600">
                  {
                    _.isNumber(moneyVolume) && new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                      moneyVolume,
                    )
                  }
                </span>
              </span>

              <span className="block text-[8px] text-gray-600 font-light">
                Based by postbacks
              </span>
            </div>
          </li>


          {mode == NavbarModeEnum.IN_DASHBOARD
            ? items?.flatMap((item) => (
                <li>
                  {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props,jsx-a11y/no-redundant-roles */}
                  <HLink
                    to={item.href}
                    prefetch="intent"
                    role="link"
                    className={classNames("cursor-pointer px-2 py-2 text-xs", {
                      "text-gray-400 hover:text-black font-normal":
                        !item.isActive,
                      "text-black font-medium": item.isActive,
                    })}
                    aria-readonly
                    aria-description={`Navigate to '${item.name}'`}
                  >
                    {item.name}
                  </HLink>
                </li>
              ))
            : undefined}
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

      {isMobileMenuOpen && (
        <div className="h-screen w-full drop-shadow-sm backdrop-blur-sm absolute bg-white bg-opacity-10">
          <ul className="absolute bg-white z-10 w-full border-b border-b-gray-200 drop-shadow-sm">
            {items?.flatMap((item) => (
              <li className="px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium text-sm">
                {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props,jsx-a11y/no-redundant-roles */}
                <a
                  href={item.href}
                  role="link"
                  aria-readonly
                  aria-description={`Navigate to '${item.name}'`}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
