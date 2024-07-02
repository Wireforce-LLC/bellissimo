import string from "~/localization/polyglot";
import { LeftActiveBarItem } from "~/layouts/DashboardLayout";
import classNames from "classnames";

const ICON_DEFAULT_CLASSNAME = "w-4 h-4";

export default function getDatasetDashboardLeftBar(
  currentActivePageId: LeftActiveBarItem | null
) {
  return [
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

    // {
    //   id: "records",
    //   classname: LeftActiveBarItem.ASN_RECORDS,
    //   priority: 1,
    //   name: string("dashboard.menu.asnRecords"),
    //   href: "/requests",
    //   isActive: currentActivePageId == LeftActiveBarItem.ASN_RECORDS,
    //   icon: (
    //     <svg
    //       viewBox="0 0 512 512"
    //       fill="currentColor"
    //       height="1em"
    //       width="1em"
    //       className={classNames(ICON_DEFAULT_CLASSNAME)}
    //     >
    //       <path
    //         fill="none"
    //         stroke="currentColor"
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={32}
    //         d="M176 96 A48 48 0 0 1 128 144 A48 48 0 0 1 80 96 A48 48 0 0 1 176 96 z"
    //       />
    //       <path
    //         fill="none"
    //         stroke="currentColor"
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={32}
    //         d="M304 416 A48 48 0 0 1 256 464 A48 48 0 0 1 208 416 A48 48 0 0 1 304 416 z"
    //       />
    //       <path
    //         fill="none"
    //         stroke="currentColor"
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={32}
    //         d="M256 256v112"
    //       />
    //       <path
    //         fill="none"
    //         stroke="currentColor"
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={32}
    //         d="M432 96 A48 48 0 0 1 384 144 A48 48 0 0 1 336 96 A48 48 0 0 1 432 96 z"
    //       />
    //       <path
    //         fill="none"
    //         stroke="currentColor"
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={32}
    //         d="M128 144c0 74.67 68.92 112 128 112M384 144c0 74.67-68.92 112-128 112"
    //       />
    //     </svg>
    //   ),
    // },

    // {
    //   id: "postbacks",
    //   classname: LeftActiveBarItem.POSTBACKS,
    //   priority: 1,
    //   name: string("dashboard.menu.postbacks"),
    //   href: "/postbacks",
    //   isActive: currentActivePageId == LeftActiveBarItem.POSTBACKS,
    //   icon: (
    //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={classNames(ICON_DEFAULT_CLASSNAME)}>
    //       <path d="M12 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-1ZM6.5 6a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V6ZM2 9a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9Z" />
    //     </svg>
    //   ),
    //   kbd: "P",
    // },

    // {
    //   id: "data_hub",
    //   classname: LeftActiveBarItem.POSTBACKS,
    //   priority: 1,
    //   name: string("dashboard.menu.datahub"),
    //   href: "/datahub",
    //   isActive: currentActivePageId == LeftActiveBarItem.POSTBACKS,
    //   icon: (
    //     <svg
    //       viewBox="0 0 24 24"
    //       fill="currentColor"
    //       height="1em"
    //       width="1em"
    //       className={classNames(ICON_DEFAULT_CLASSNAME)}
    //     >
    //       <path d="M12 2.604l-.43.283L0 10.459v6.752l6.393 4.184L12 17.725l5.607 3.671L24 17.211v-6.752L12 2.604zm0 .828l5.434 3.556-2.717 1.778L12 10.545l-2.717-1.78-2.717-1.777L12 3.432zM6.39 7.104l5.434 3.556-5.408 3.54-5.434-3.557 5.409-3.54zm11.22 0l5.431 3.554-5.434 3.557-5.433-3.555 5.435-3.556zM.925 10.867l5.379 3.52a.123.08 0 00.027.013v5.647l-5.406-3.54v-5.64zm11.213.115l5.408 3.54v5.664l-5.408-3.54v-5.664z" />
    //     </svg>
    //   ),
    //   kbd: "P",
    // },

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
  ];
}
