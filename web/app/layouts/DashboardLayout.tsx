import Navbar from "~/components/Navbar";
import { ReactNode, useCallback, useEffect, useState } from "react";
import getDatasetDashboardLeftBar from "~/dataset/DashboardLeftBar";
import webConfig, { ApiPathEnum } from "~/web.config";

import wireforceLogo from "/wireforce-logo.png";
import rightTopImage from "/top-right-01.png";
import classNames from "classnames";
import { motion } from "framer-motion";

export enum LeftActiveBarItem {
  FILES = "files",
  ROUTES = "routes",
  FILTERS = "filters",
  RESOURCES = "resources",
  ASN_RECORDS = "asn-records",
  POSTBACKS = "postbacks",
}

interface Props {
  readonly children: ReactNode;
  readonly onMenuSelected: (it: string) => void
}

export default function DashboardLayout({
  children,
  onMenuSelected
}: Props) {
  const [isInternetError, setInternetError] = useState(false);
  const [isSafari, setSafari] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(true);
  const [currentLeftActiveBarItem, setCurrentLeftActiveBarItem] = useState<LeftActiveBarItem>(LeftActiveBarItem.ROUTES);

  useEffect(() => {
    // @ts-ignore
    const isSafari =
      /constructor/i.test(String(window.HTMLElement)) ||
      (function (p) {
        return p.toString() === "[object SafariRemoteNotification]";
      })(
        // @ts-ignore
        !window["safari"] || // @ts-ignore
          (typeof window["safari"] !== "undefined" && safari?.pushNotification)
      );

    setSafari(isSafari);
  }, []);

  const pingRequest = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((data) => {
      data
        .get(webConfig.apiEndpointFactory(ApiPathEnum.Ping))
        .catch((error) => {
          if (error.code === "ERR_NETWORK") {
            setInternetError(true);
          }
        });
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      pingRequest();
    }, 5000);

    pingRequest();

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: "calc(100vh - 45px - 32px)" }}>
      {isSafari && <div className="h-[1px] w-full bg-[#060931]"></div>}

      <div className="w-full bg-[#060931] h-[32px] px-4 flex flex-row items-center justify-between">
        <div className="container w-full flex flex-row items-center justify-between">
          <img src={wireforceLogo} className="h-[32px]" alt="" />
          <img src={rightTopImage} className="h-[32px]" alt="" />
        </div>
      </div>

      <Navbar
        onMenuClick={() => setMenuOpen(!isMenuOpen)}
      />

      {isInternetError && (
        <motion.div initial={{translateY: 140}} animate={{translateY: 0}} transition={{duration: 0.1}} className="flex flex-row items-center justify-start gap-2 fixed bottom-0 left-0 text-white z-50 px-3.5 py-2 text-xs right-0 absolute bg-[#ef233c] font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4"
          >
            <path
              fillRule="evenodd"
              d="M11.484 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 0 7.877 3.08.75.75 0 0 1 .722.515 12.74 12.74 0 0 1 .635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 0 1-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 0 1 .722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75ZM12 15a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75H12Z"
              clipRule="evenodd"
            />
          </svg>

          <span>There are problems with your Internet connection.</span>
        </motion.div>
      )}

      <main className="w-full h-full bg-white flex flex-row overflow-hidden">
        {isMenuOpen && <motion.nav transition={{duration: 0.1}} className="w-[150px] flex-shrink-0 h-full bg-white border-r border-gray-200">
          <ul>
            {
              getDatasetDashboardLeftBar(currentLeftActiveBarItem || null).map((item) => (
                <li onClick={() => {
                  onMenuSelected(item.href)
                  setCurrentLeftActiveBarItem(item.classname)
                }} className={classNames(
                  "w-full px-3.5 py-2.5 cursor-pointer flex flex-row gap-2",
                  {
                    "bg-blue-50 border-r border-r-blue-500 text-blue-500": item.isActive,
                    "text-zinc-400 hover:text-blue-500": !item.isActive
                  }
                )}>
                  {item.icon}
  
                  <span className={classNames("text-xs", {
                    "font-medium": item.isActive,
                    "font-regular": !item.isActive,
                  })}>{item.name}</span>
                </li>
              ))
            } 
          </ul>
        </motion.nav>}

        <div className="w-full transition-all h-full bg-white overflow-y-auto">
          {children}
        </div>
      </main>

      {/* <DashboardBasicWrapper className="h-full">
        <DashboardArea
          menuEnabled={!isHideMenu}
          nested={[
            View({
              children: (
                <div className="h-full w-full overflow-y-auto bg-[#edf2f4] bg-opacity-50">
                  <section className="h-full w-full">{children}</section>
                </div>
              ),
            }),
            isHideMenu !== true
              ? Menu({ children: MenuElement(currentLeftActiveBarItem) })
              : undefined,
          ]}
        />
      </DashboardBasicWrapper> */}
    </div>
  );
}
