import Navbar from "~/components/Navbar";
import classNames from "classnames";
import rightTopImage from "/top-right-01.png";
import string from "~/localization/polyglot";
import wireforceLogo from "/wireforce-logo.png";
import { motion } from "framer-motion";
import { ReactNode, useCallback, useEffect, useState } from "react";

export enum LeftActiveBarItem {
  WIDGETS = "widgets",
  FILES = "files",
  ROUTES = "routes",
  FILTERS = "filters",
  RESOURCES = "resources",
  ASN_RECORDS = "asn-records",
  POSTBACKS = "postbacks",
  FUNCTIONS = "functions",
  ADS_MANAGER = "adsmanager",
  DATAHUB = "datahub",
  DATAHUB_EXPLORER = "datahub/explorer",
  DATAHUB_REQUESTS = "datahub/requests",
  DATAHUB_POSTBACKS = "datahub/postbacks",
  DATAHUB_CLICKS = "datahub/clicks",
  DATAHUB_FUNNELS = "datahub/funnels",
  DATAHUB_DATASETS = "datahub/datasets",
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
      id: "functions",
      classname: LeftActiveBarItem.FUNCTIONS,
      priority: 1,
      name: string("dashboard.menu.functions"),
      href: "/functions",
      isActive: currentActivePageId == LeftActiveBarItem.FUNCTIONS,
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
    },

    {
      id: "datahub-exlorer",
      classname: LeftActiveBarItem.DATAHUB_EXPLORER,
      priority: 1,
      name: string("dashboard.menu.datahub.explorer"),
      href: "/datahub/explorer",
      isActive: currentActivePageId == LeftActiveBarItem.DATAHUB_EXPLORER,
      icon: (
        <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        height="1em"
        width="1em"
        className={classNames(ICON_DEFAULT_CLASSNAME)}
      >
        <path d="M9 9h6v6H9m-2 2h10V7H7m8-2h2V3h-2m0 18h2v-2h-2m4-2h2v-2h-2m0-6h2V7h-2m0 14a2 2 0 002-2h-2m0-6h2v-2h-2m-8 10h2v-2h-2M9 3H7v2h2M3 17h2v-2H3m2 6v-2H3a2 2 0 002 2M19 3v2h2a2 2 0 00-2-2m-6 0h-2v2h2M3 9h2V7H3m4 14h2v-2H7m-4-6h2v-2H3m0-6h2V3a2 2 0 00-2 2z" />
      </svg>
      )
    },

    {
      id: "datahub-requests",
      classname: LeftActiveBarItem.DATAHUB_REQUESTS,
      priority: 1,
      name: string("dashboard.menu.datahub.requests"),
      href: "/datahub/requests",
      isActive: currentActivePageId == LeftActiveBarItem.DATAHUB_REQUESTS,
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
        <path d="M21 18 A3 3 0 0 1 18 21 A3 3 0 0 1 15 18 A3 3 0 0 1 21 18 z" />
        <path d="M9 6 A3 3 0 0 1 6 9 A3 3 0 0 1 3 6 A3 3 0 0 1 9 6 z" />
        <path d="M13 6h3a2 2 0 012 2v7M6 9v12" />
      </svg>
      )
    },

    {
      id: "datahub-widgets",
      classname: LeftActiveBarItem.WIDGETS,
      priority: 1,
      name: string("dashboard.menu.datahub.widgets"),
      href: "/widgets",
      isActive: currentActivePageId == LeftActiveBarItem.WIDGETS,
      icon: (
        <svg
        viewBox="0 0 1024 1024"
        fill="currentColor"
        height="1em"
        width="1em"
        className={classNames(ICON_DEFAULT_CLASSNAME)}
      >
        <path d="M336.7 586h350.6l84.9-148H251.8zm543.4-432H143.9c-24.5 0-39.8 26.7-27.5 48L215 374h594l98.7-172c12.2-21.3-3.1-48-27.6-48zM349 838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V650H349v188z" />
      </svg>
      )
    },

    {
      id: "datahub-datasets",
      classname: LeftActiveBarItem.DATAHUB_DATASETS,
      priority: 1,
      name: string("dashboard.menu.datahub.datasets"),
      href: "/datahub/datasets",
      isActive: currentActivePageId == LeftActiveBarItem.DATAHUB_DATASETS,
      icon: (
        <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        height="1em"
        width="1em"
        className={classNames(ICON_DEFAULT_CLASSNAME)}
      >
        <path d="M12 3C8.59 3 5.69 4.07 4.54 5.57l5.25 5.25c.71.11 1.43.18 2.21.18 4.42 0 8-1.79 8-4s-3.58-4-8-4M3.92 7.08L2.5 8.5 5 11H0v2h5l-2.5 2.5 1.42 1.42L8.84 12M20 9c0 2.21-3.58 4-8 4-.66 0-1.3-.05-1.91-.13l-2.47 2.47c1.26.41 2.76.66 4.38.66 4.42 0 8-1.79 8-4m0 2c0 2.21-3.58 4-8 4-2.28 0-4.33-.5-5.79-1.25l-1.68 1.68C5.68 19.93 8.59 21 12 21c4.42 0 8-1.79 8-4" />
      </svg>
      )
    },
  
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

  return (
    <div style={{ height: "calc(100vh - 45px - 32px)", width: '100%'}}>
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

      <main className="w-screen h-full bg-white flex flex-row overflow-hidden">
        {isMenuOpen && <motion.nav transition={{duration: 0.1}} className="w-[165px] flex-shrink-0 h-full bg-white border-r border-gray-200">
          <ul>
            {
              getDashboardLeftBarItem(currentLeftActiveBarItem || null).map((item) => (
                <li onClick={() => {
                  onMenuSelected(item.href)
                  setCurrentLeftActiveBarItem(item.classname)
                }} key={item.id} className={classNames(
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

        <div className="w-full h-full bg-zinc-100 overflow-y-auto overflow-x-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
