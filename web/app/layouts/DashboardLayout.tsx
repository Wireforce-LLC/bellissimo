import Navbar from "~/components/Navbar";
import { ReactNode, useCallback, useEffect, useState } from "react";
import webConfig, { ApiPathEnum } from "~/web.config";

import wireforceLogo from "/wireforce-logo.png";
import rightTopImage from "/top-right-01.png";
import classNames from "classnames";
import { motion } from "framer-motion";
import string from "~/localization/polyglot";

export enum LeftActiveBarItem {
  FILES = "files",
  ROUTES = "routes",
  FILTERS = "filters",
  RESOURCES = "resources",
  ASN_RECORDS = "asn-records",
  POSTBACKS = "postbacks",
  SCENARIO = "scenario",
  ADS_MANAGER = "adsmanager"
}

interface Props {
  readonly children: ReactNode;
  readonly currentPath?: string,
  readonly onMenuSelected: (it: string) => void
}

export default function DashboardLayout({
  children,
  onMenuSelected,
  currentPath
}: Props) {
  const ICON_DEFAULT_CLASSNAME = 'w-4 h-4';
  
  const [isInternetError, setInternetError] = useState(false);
  const [isSafari, setSafari] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(true);
  const [currentLeftActiveBarItem, setCurrentLeftActiveBarItem] = useState<LeftActiveBarItem|undefined>();

const getDashboardLeftBarItem = useCallback((currentActivePageId: LeftActiveBarItem | null) => {
  const list = [
    {
      id: "routes",
      classname: LeftActiveBarItem.ROUTES,
      priority: 1,
      name: string("dashboard.menu.routes"),
      href: "/routes",
      isActive: currentActivePageId == LeftActiveBarItem.ROUTES,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          height="1em"
          width="1em"
          className={classNames(ICON_DEFAULT_CLASSNAME)}
        >
          <path d="M9 2v6h2v3H5c-1.11 0-2 .89-2 2v3H1v6h6v-6H5v-3h6v3H9v6h6v-6h-2v-3h6v3h-2v6h6v-6h-2v-3c0-1.11-.89-2-2-2h-6V8h2V2H9z" />
        </svg>
      ),
      kbd: "R",
    },

    {
      id: "filters",
      classname: LeftActiveBarItem.FILTERS,
      priority: 1,
      name: string("dashboard.menu.filters"),
      href: "/filters",
      isActive: currentActivePageId == LeftActiveBarItem.FILTERS,
      icon: (
        <svg
          fill="currentColor"
          viewBox="0 0 16 16"
          height="1em"
          width="1em"
          className={classNames(ICON_DEFAULT_CLASSNAME)}
        >
          <path d="M6 10.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5zm-2-3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-2-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z" />
        </svg>
      ),
      kbd: "F",
    },

    {
      id: "resources",
      classname: LeftActiveBarItem.RESOURCES,
      priority: 1,
      name: string("dashboard.menu.resources"),
      href: "/resources",
      isActive: currentActivePageId == LeftActiveBarItem.RESOURCES,
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          className={classNames(ICON_DEFAULT_CLASSNAME)}
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <path d="M6 17.6l-2-1.1V14M4 10V7.5l2-1.1M10 4.1L12 3l2 1.1M18 6.4l2 1.1V10M20 14v2.5l-2 1.12M14 19.9L12 21l-2-1.1M12 12l2-1.1M18 8.6l2-1.1M12 12v2.5M12 18.5V21M12 12l-2-1.12M6 8.6L4 7.5" />
        </svg>
      ),
      kbd: "E",
    },

    {
      id: "scenario",
      classname: LeftActiveBarItem.SCENARIO,
      priority: 1,
      name: string("dashboard.menu.scenario"),
      href: "/scenario",
      isActive: currentActivePageId == LeftActiveBarItem.SCENARIO,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          height="1em"
          width="1em"
        >
          <path d="M12 5H9l4-4 4 4h-3v4.43c-.75.46-1.42 1.03-2 1.69V5m-1.6 10H8.5l-.7-2H4.6l-.7 2H2l3.2-9h2l3.2 9m-3.05-3.35L6.2 8l-1.15 3.65h2.3M23 11l-4-4v3a6.747 6.747 0 00-7 6.17A3.006 3.006 0 0010.17 20 3.006 3.006 0 0014 21.83 3.01 3.01 0 0015.83 18c-.3-.86-.98-1.53-1.83-1.83.47-4 4.47-4.2 4.95-4.2v3L23 11z" />
        </svg>
      )
    },

    {
      id: "files",
      classname: LeftActiveBarItem.FILES,
      priority: 1,
      name: string("dashboard.menu.files"),
      href: "/files",
      isActive: currentActivePageId == LeftActiveBarItem.FILES,
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          className={classNames(ICON_DEFAULT_CLASSNAME)}
        >
          <path d="M8 17h12a2 2 0 002-2V9a2 2 0 00-2-2h-3.93a2 2 0 01-1.66-.9l-.82-1.2a2 2 0 00-1.66-.9H8a2 2 0 00-2 2v9c0 1.1.9 2 2 2z" />
          <path d="M2 8v11c0 1.1.9 2 2 2h14" />
        </svg>
      ),
    },

    {
      id: "ads_manager",
      classname: LeftActiveBarItem.ADS_MANAGER,
      priority: 1,
      name: string("dashboard.menu.adsManager"),
      href: "/adsmanager",
      isActive: currentActivePageId == LeftActiveBarItem.ADS_MANAGER,
      icon: (
        <svg
        viewBox="0 0 858.453 1000"
        fill="currentColor"
        height="1em"
        width="1em"
        className={classNames(ICON_DEFAULT_CLASSNAME)}
      >
        <path d="M791.453 350c38.667 92 61 178 67 258s-7 126.667-39 140c-18.667 8-39 7-61-3s-43.667-23.333-65-40-54.333-30.333-99-41c-44.667-10.667-94.333-13.333-149-8-18.667 2.667-32.667 9-42 19-9.333 10-11.333 22.333-6 37 14.667 37.333 30 73.333 46 108 2.667 6.667 10.667 14 24 22s21.333 14.667 24 20c9.333 22.667 2 38-22 46a1347.833 1347.833 0 01-102 40c-20 6.667-38-7.333-54-42-21.333-50.667-40.667-94.667-58-132-4-8-15.333-13.667-34-17s-34-13.667-46-31c-20 6.667-32.667 11.333-38 14-22.667 8-47.333 4-74-12s-44.667-36-54-60c-10.667-21.333-12.333-47.667-5-79s21.667-51.667 43-61c84-34.667 155-70.667 213-108s99.333-71.667 124-103 44.333-62 59-92c14.667-30 23-56 25-78s7-41.667 15-59 20-29.333 36-36c32-13.333 75.333 10 130 70s102 136 142 228m-28 300c5.333-2.667 8.667-15.333 10-38 1.333-22.667-2.333-55.333-11-98s-22.333-85.333-41-128c-18.667-44-41-85-67-123s-48.333-66-67-84-30.667-25.667-36-23c-5.333 2.667-8.667 16.667-10 42-1.333 25.333 2 60.333 10 105s21.333 89 40 133 41.333 83.667 68 119 49.333 60.667 68 76c18.667 15.333 30.667 21.667 36 19" />
      </svg>
      )
    }
  ];
  
  return list;
}, [])

  useEffect(() => {
    setCurrentLeftActiveBarItem(currentPath?.replace("/", "") as LeftActiveBarItem.ROUTES);
  }, [currentPath]);

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
              getDashboardLeftBarItem(currentLeftActiveBarItem || null).map((item) => (
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
                  <div className="flex flex-shrink-0">
                    {item.icon}
                  </div>
  
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
