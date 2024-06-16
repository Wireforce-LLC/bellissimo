import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import {
  RemixServer,
  Outlet,
  Meta,
  Links,
  ScrollRestoration,
  Scripts,
  Link,
} from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import toast, { Toaster } from "react-hot-toast";
import _ from "lodash";
import { useEffect, useCallback, useState, useRef } from "react";
import classNames from "classnames";
import axios from "axios";
import humanizeString from "humanize-string";
import moment from "moment";
import { flatten } from "flat";
import Editor from "@monaco-editor/react";
const ABORT_DELAY = 5e3;
function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
  loadContext
) {
  return isbot(request.headers.get("user-agent") || "")
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      );
}
function handleBotRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(RemixServer, {
        context: remixContext,
        url: request.url,
        abortDelay: ABORT_DELAY,
      }),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(RemixServer, {
        context: remixContext,
        url: request.url,
        abortDelay: ABORT_DELAY,
      }),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: handleRequest,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
const stylesheet = "/assets/tailwind-D_VndJrC.css";
const links = () => [{ rel: "stylesheet", href: stylesheet }];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    className: "dark-off",
    children: [
      /* @__PURE__ */ jsxs("head", {
        children: [
          /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
          /* @__PURE__ */ jsx("meta", {
            name: "viewport",
            content: "width=device-width, initial-scale=1",
          }),
          /* @__PURE__ */ jsx(Meta, {}),
          /* @__PURE__ */ jsx(Links, {}),
        ],
      }),
      /* @__PURE__ */ jsxs("body", {
        children: [
          /* @__PURE__ */ jsx("main", { children }),
          /* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx(Toaster, {
              position: "bottom-right",
              reverseOrder: false,
            }),
          }),
          /* @__PURE__ */ jsx(ScrollRestoration, {}),
          /* @__PURE__ */ jsx(Scripts, {}),
        ],
      }),
    ],
  });
}
function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const route0 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      Layout,
      default: App,
      links,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
function Modal({ title, isBigModal, children, onClose }) {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);
  return /* @__PURE__ */ jsx("div", {
    className:
      "w-full h-full bg-black bg-opacity-55 fixed z-50 top-0 left-0 right-0 bottom-0 flex items-center justify-center",
    children: /* @__PURE__ */ jsx("div", {
      className: classNames(
        "bg-white border max-h-[80%] overflow-y-auto block border-black",
        {
          "w-[80%] h-[80%]": isBigModal,
          "md:max-w-[70%] min-w-[100px] md:min-w-[300px] lg:min-w-[40%]":
            !isBigModal,
        }
      ),
      children: /* @__PURE__ */ jsxs("div", {
        className: "w-full h-[calc(100%-32px)]",
        children: [
          /* @__PURE__ */ jsxs("div", {
            className:
              "w-full h-[32px] bg-[#f8f9fa] p-2 flex flex-row justify-between items-center border-b border-b-[#dee2e6] pb-2",
            children: [
              /* @__PURE__ */ jsx("span", {
                className: "text-xs font-medium",
                children: title,
              }),
              /* @__PURE__ */ jsx("button", {
                className: "w-4 h-4 hover:bg-gray-100",
                onClick: onClose,
                children: /* @__PURE__ */ jsx("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 20 20",
                  fill: "currentColor",
                  className: "w-4 h-4",
                  children: /* @__PURE__ */ jsx("path", {
                    d: "M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z",
                  }),
                }),
              }),
            ],
          }),
          /* @__PURE__ */ jsx("div", {
            className: "p-2 h-full w-full",
            children,
          }),
        ],
      }),
    }),
  });
}
const APP_NAME = "Bellissimo";
const en_US = {
  const: {
    nonValue: "No value",
    loadingData: "Getting content",
    loadingDataTime: "Actualy it takes a few seconds",
    zoneName: "Zone",
    userId: "UserID",
  },
  meta: {
    title: {
      filters: "Filters",
      login: `Welcome back in ${APP_NAME}`,
      createThread: "Create new thread",
      selectZone: "Select zone",
      threads: "Threads",
      visitors: "Visitors",
      events: "Events",
      traffic: "Traffic",
      pipelines: "Pipelines",
      join: `Join into ${APP_NAME} community`,
    },
    description: {
      login: `Welcome back to ${APP_NAME}`,
      join: `Create account in ${APP_NAME}`,
    },
  },
  filters: {
    create: {
      resourcesNotFoundTitle: "Resources not found",
      resourcesNotFoundDescription:
        "For create new filters please, create one or more resources. Without resources you can not create new filter conditions.",
    },
  },
  routes: {
    create: {
      mistakeStart: "Please, start with /",
      filtersNotFoundTitle: "Filters not found",
      filtersNotFoundDescription: "Please, create new filters",
      resourcesNotFoundTitle: "Resources not found",
      resourcesNotFoundDescription: "Please, create new resources",
      anyNotFoundTitle: "Filters and resources not found",
      anyNotFoundDescription: "Please, create new filters and resources",
    },
  },
  login: {
    form: {
      title: `Welcome to ${APP_NAME}`,
      description:
        "Welcome back! New data about the analyst is already waiting for you",
      login: "Login or email",
      password: "Password",
      youNewUser: "You is a new user?",
      loading: `Let's start preparing your account`,
      wait: "Redirecting..",
      submit: "Login",
    },
  },
  join: {
    form: {
      title: `Create account in ${APP_NAME}`,
      description: `Start collecting analytics from any projects and devices: websites, mobile applications, IoT devices, TV.`,
      loading: `Creating your new, universal ${APP_NAME} account`,
      login: "Login",
      firstname: "First name",
      lastname: "Last name",
      email: "Email",
      password: "Password",
      password2: "Repeat password",
      readyHasAccount: "Ready has account?",
      wait: "Redirecting..",
      submit: "Create free account",
    },
  },
  thread: {
    title: "Integration methods",
    h1: "Events registration options",
    subtitle:
      "You can collect data from wherever it is convenient for you. Even from a satellite on Mars",
    topTabs: ["Overview", "Analytic", "Intergrations", "Export Data"],
    visitor: {
      h1: "Visitor registration methods",
      subtitle:
        "You can specify information about each user that you were able to identify in order to assign a series of events to him",
    },
    export: {
      google: {
        title: "Export events to Google ADs via HTTPs",
      },
    },
    cards: {
      countEvents: {
        title: "Volume of registered events",
      },
      countVisitors: {
        title: "Volume of visitors",
      },
    },
    tabs: {
      c: {
        tip: "To successfully compile the code, use the following command: g++ FILE.cpp -lcurl -o FILE This command compiles the source file FILE.cpp into an executable file named FILE using the GNU C++ (g++) compiler.The - lcurl flag tells the compiler to include the libcurl library when compiling, which is necessary to use the functionality from this library.",
      },
    },
  },
  visitor: {
    title: "Visitor overview",
    topTabs: ["Overview", "Events", "User-As-Object"],
  },
  zone: {
    title: "Choose the optimal data storage area",
    subtitle:
      "If it is important to your business or your personal needs that data be stored on specific servers in specific countries, please select the appropriate zone.",
    details: {
      SHARED: {
        text: "Common zone. Small amount of data, but at the same time it is fast enough",
        location: "Switzerland",
        provider: "Internal",
      },
      DEVELOPMENT: {
        text: "Data zone for debugging your scripts and mechanisms. You can only store so much data in this zone, but you will have virtually no cache latency. Great for debugging",
        location: "Switzerland",
        provider: "Internal",
      },
    },
  },
  navbar: {
    pipelines: "Pipelines",
    dashboard: "Dashboard",
    traffic: "Traffic",
    cloudObject: "Cloud Object",
  },
  traffic: {
    cards: {
      mainStat: {
        title: "Main Stat",
      },
      sourcesStat: {
        title: "Sources",
      },
    },
  },
  trafficLink: {
    form: {
      username: "Username",
      password: "Password",
      host: "Hostname",
      submit: "Create integration",
      connected: {
        title: "Yes",
        text: "Yes1",
      },
    },
  },
  createThread: {
    hint: {
      events: "Events",
      title: "FAQ: Creating a new thread",
      text: "With threads, you separate the events that come to your panel. Each event comes in its own flow. You can work with streams from any system that has access to the Internet: from a website or application to an IoT device",
    },
    form: {
      threadName: "Thread name",
      threadSlug: "Thread slug",
      threadGroup: "Thread group",
      threadType: "Thread type",
      threadTypes: {
        REACT_NATIVE_APPLICATION: "React Native Application",
        FLUTTER_APPLICATION: "Flutter Application",
        EXPO_APPLICATION: "Expo Application",
        IOT_DEVICE: "IoT device",
        IOS_APPLICAION: "iOS Application",
        ANDROID_APPLICATION: "Android Application",
        WINDOWS_APPLICATION: "Windows Application",
        LINUX_APPLICATION: "Linux Application",
        MACOS_APPLICATION: "MacOS Application",
        WEBSITE: "Website",
        REACT_WEBSITE: "React Website",
        VUE_WEBSITE: "Vue Website",
        NATIVE_HTTP_API: "HTTP",
        S2S_POSTBACK: "S2S postback",
        TRAFFIC_LIGHT_TUNNEL: "TrafficLight Tunnel",
      },
      submit: "Create thread",
      created: {
        title: "New thread created",
        text: "You have successfully created a new data stream. You can get instructions for installing ThreadPixel or setting up the integration on the thread page, accessible from the Threads page.",
      },
      notCreated: {
        title: "New thread created",
        text: "Couldn't create a new thread for you",
      },
    },
  },
  events: {
    grid: {
      grouped: {
        title: "Events by name",
      },
      latest: {
        title: "Latest events",
      },
    },
  },
  dashboard: {
    actions: {
      create: "Create",
    },
    visitors: {
      table: {
        header: {
          uuid: "UUID",
          threadSlug: "Thread",
          sex: "Sex",
          age: "Age",
          country: "Country",
        },
      },
    },
    threads: {
      table: {
        header: {
          name: "Name",
          slug: "Slug",
          group: "Group",
        },
      },
    },
    events: {
      table: {
        header: {
          name: "Name",
          time: "Time",
          value: "Value",
        },
      },
    },
    subtitle: {
      routes: "Routes",
      filters: "Filters",
      resources: "Resources",
      asnRecords: "Requests",
      postbacks: "Postbacks",
      createThread: "Create new thread",
      events: "Events",
      threads: "Threads",
      thread: "Thread",
      visitors: "Visitors",
      traffic: "Traffic",
      zone: "Database Zone",
      files: "Files",
    },
    menu: {
      files: "Files",
      routes: "Routes",
      filters: "Filters",
      resources: "Resources",
      asnRecords: "Requests",
      postbacks: "Postbacks",
      threads: "Threads",
      events: "Events",
      routers: "Routers",
      visitors: "Visitors",
      traffic: "Traffic",
    },
  },
};
const POLYGLOT_LANGUAGE_KEY = "polyglot_language";
const POLYGLOT_DEFAULT_LANGUAGE = "en_US";
const POLYGLOT_SUPPORTED_LANGUAGES = ["en_US"];
function getCurrentSessionLanguage() {
  let windowLanguageData = void 0;
  let sessionLanguageData = null;
  if (typeof window != "undefined") {
    windowLanguageData = _.get(window, POLYGLOT_LANGUAGE_KEY);
  }
  if (typeof sessionStorage != "undefined") {
    sessionLanguageData = sessionStorage.getItem(POLYGLOT_LANGUAGE_KEY);
  }
  const language =
    windowLanguageData || sessionLanguageData || POLYGLOT_DEFAULT_LANGUAGE;
  if (POLYGLOT_SUPPORTED_LANGUAGES.includes(language)) {
    return language;
  }
  return POLYGLOT_DEFAULT_LANGUAGE;
}
const polyglotRegistry = {
  en_US,
};
function string(path, language = void 0) {
  return _.get(
    _.get(polyglotRegistry, language || getCurrentSessionLanguage()),
    path,
    path
  );
}
function SubNavbar({ title, createActionLabel, onCreateAction }) {
  return /* @__PURE__ */ jsx("div", {
    className: "w-full bg-white",
    children: /* @__PURE__ */ jsx("div", {
      className:
        "w-full h-[38px] bg-white font-medium flex items-center border-b border-b-zinc-200",
      children: /* @__PURE__ */ jsxs("div", {
        className:
          "md:px-4 px-4 w-full flex flex-row justify-between items-center",
        children: [
          /* @__PURE__ */ jsx("span", {
            className: "text-xs text-gray-800  h-fit",
            children: title || "Untitled",
          }),
          onCreateAction &&
            /* @__PURE__ */ jsxs("button", {
              onClick: onCreateAction,
              className:
                "text-xs flex flex-row items-center gap-1.5 text-[#54b046] px-2 py-1 rounded-sm bg-[#e7f2e9]",
              children: [
                /* @__PURE__ */ jsx("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 16 16",
                  fill: "currentColor",
                  className: "w-4 h-4",
                  children: /* @__PURE__ */ jsx("path", {
                    d: "M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z",
                  }),
                }),
                createActionLabel || string("dashboard.actions.create"),
              ],
            }),
        ],
      }),
    }),
  });
}
function LoadingActivity({ text, className }) {
  return /* @__PURE__ */ jsxs("div", {
    className: classNames(
      "flex items-center justify-center flex-col space-y-2",
      className
    ),
    children: [
      /* @__PURE__ */ jsxs("svg", {
        className: "text-gray-300 animate-spin",
        viewBox: "0 0 64 64",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        children: [
          /* @__PURE__ */ jsx("path", {
            d: "M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z",
            stroke: "currentColor",
            "stroke-width": "5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
          /* @__PURE__ */ jsx("path", {
            d: "M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762",
            stroke: "currentColor",
            "stroke-width": "5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            className: "text-gray-900",
          }),
        ],
      }),
      /* @__PURE__ */ jsx("span", {
        className: "font-medium text-black text-xs",
        children: text,
      }),
    ],
  });
}
function ErrorString({ children }) {
  return (
    children &&
    /* @__PURE__ */ jsx("span", {
      className: "text-xs font-medium text-red-500",
      children,
    })
  );
}
function Table({ headers, data, onSelectedItem }) {
  const safeValue = useCallback((value) => {
    return value;
  }, []);
  return data
    ? /* @__PURE__ */ jsxs("table", {
        className: "w-full bg-white",
        children: [
          /* @__PURE__ */ jsx("thead", {
            children: /* @__PURE__ */ jsx("tr", {
              className:
                "bg-gray-300 border-b divide-x divide-zinc-200 border-zinc-200 sticky top-0 bg-white",
              children:
                headers == null
                  ? void 0
                  : headers.map((text) =>
                      /* @__PURE__ */ jsx("th", {
                        scope: "col",
                        className:
                          "px-3 py-1.5 text-xs text-black bg-gray-50 text-left font-medium",
                        children: text,
                      })
                    ),
            }),
          }),
          /* @__PURE__ */ jsxs("tbody", {
            children: [
              _.isArray(data) &&
                data.map((item, index) =>
                  /* @__PURE__ */ jsx("tr", {
                    className:
                      "border-b z-0 divide-x divide-zinc-200 border-zinc-200 cursor-pointer hover:bg-gray-100 hover:bg-opacity-25",
                    children: Object.values(item || []).map((value) =>
                      value
                        ? /* @__PURE__ */ jsx("td", {
                            className: "px-3 py-1.5 text-xs font-normal",
                            children: _.isBoolean(value)
                              ? value
                                ? "Yes"
                                : "No"
                              : safeValue(value),
                          })
                        : /* @__PURE__ */ jsx("td", {
                            className:
                              "px-3 py-1.5 text-xs text-[#adb5bd] text-opacity-75",
                            children: /* @__PURE__ */ jsx("div", {
                              className: "text-wrap w-full block",
                              children: string("const.nonValue"),
                            }),
                          })
                    ),
                  })
                ),
              !_.isArray(data) &&
                /* @__PURE__ */ jsx(ErrorString, {
                  children:
                    "The data set you are using to build the table is not supported. This table only supports drawing lists",
                }),
            ],
          }),
        ],
      })
    : /* @__PURE__ */ jsx("div", {
        className: "w-full bg-white py-12 border-b border-b-gray-100",
        children: /* @__PURE__ */ jsx(LoadingActivity, {
          text: string("const.loadingData"),
        }),
      });
}
function getDatasetNavbar(currentActivePageId) {
  return [
    // {
    //   name: string("navbar.dashboard"),
    //   href: "/dashboard",
    //   isActive: currentActivePageId == PageIdEnum.DASHBOARD,
    // },
    // {
    //   name: string("navbar.pipelines"),
    //   href: "/pipelines",
    //   isActive: currentActivePageId == PageIdEnum.PIPELINES,
    // },
    // {
    //   name: string("navbar.cloudObject"),
    //   href: "/cloudObject",
    //   isActive: currentActivePageId == PageIdEnum.CLOUD_OBJECT,
    // },
  ];
}
var NavbarModeEnum = /* @__PURE__ */ ((NavbarModeEnum2) => {
  NavbarModeEnum2[(NavbarModeEnum2["IN_DASHBOARD"] = 0)] = "IN_DASHBOARD";
  NavbarModeEnum2[(NavbarModeEnum2["UNKNOWN_USER"] = 1)] = "UNKNOWN_USER";
  return NavbarModeEnum2;
})(NavbarModeEnum || {});
var PageIdEnum = /* @__PURE__ */ ((PageIdEnum2) => {
  PageIdEnum2[(PageIdEnum2["DASHBOARD"] = 0)] = "DASHBOARD";
  PageIdEnum2[(PageIdEnum2["TRAFFIC"] = 1)] = "TRAFFIC";
  PageIdEnum2[(PageIdEnum2["CLOUD_OBJECT"] = 2)] = "CLOUD_OBJECT";
  PageIdEnum2[(PageIdEnum2["PIPELINES"] = 3)] = "PIPELINES";
  return PageIdEnum2;
})(PageIdEnum || {});
function Navbar({ currentActivePageId, className, mode: mode2, moneyVolume }) {
  const [items, setItems] = useState(getDatasetNavbar());
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    setItems(getDatasetNavbar());
  }, [currentActivePageId]);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsxs("nav", {
        className: classNames(
          "w-full bg-white border-b border-b-zinc-200 h-[40px] md:h-[46px]",
          className
        ),
        children: [
          /* @__PURE__ */ jsxs("ul", {
            className:
              "h-full md:px-3 hidden md:flex flex-row items-center justify-between",
            children: [
              /* @__PURE__ */ jsxs("li", {
                className:
                  "py-2 px-2 pt-2.5 flex flex-row space-x-2 select-none mr-4",
                children: [
                  /* @__PURE__ */ jsx("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 24 24",
                    fill: "currentColor",
                    className: "w-4 h-4",
                    children: /* @__PURE__ */ jsx("path", {
                      d: "M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z",
                    }),
                  }),
                  /* @__PURE__ */ jsx("span", {
                    className: "-mt-0.5 text-sm font-extrabold",
                    children: "Bell",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxs("li", {
                className: "flex gap-4 flex-row items-center justify-between",
                children: [
                  /* @__PURE__ */ jsxs("div", {
                    className: "",
                    children: [
                      /* @__PURE__ */ jsxs("span", {
                        className: "block text-sm",
                        children: [
                          /* @__PURE__ */ jsx("span", {
                            className: "text-xs font-medium text-gray-600",
                            children: "Earned today",
                          }),
                          " ",
                          /* @__PURE__ */ jsx("span", {
                            className:
                              "text-sm text-black font-semibold text-lime-600",
                            children:
                              _.isNumber(moneyVolume) &&
                              new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(moneyVolume),
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsx("span", {
                        className: "block text-[8px] text-gray-600 font-light",
                        children: "Based by postbacks",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsx("div", {
                    className:
                      "text-gray-600 cursor-pointer hover:bg-gray-200 p-[1px] rounded-full",
                    children: /* @__PURE__ */ jsx("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      viewBox: "0 0 24 24",
                      fill: "currentColor",
                      className: "size-7 rounded-full bg-white",
                      children: /* @__PURE__ */ jsx("path", {
                        fillRule: "evenodd",
                        d: "M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z",
                        clipRule: "evenodd",
                      }),
                    }),
                  }),
                ],
              }),
              mode2 == 0
                ? items == null
                  ? void 0
                  : items.flatMap((item) =>
                      /* @__PURE__ */ jsx("li", {
                        children: /* @__PURE__ */ jsx(Link, {
                          to: item.href,
                          prefetch: "intent",
                          role: "link",
                          className: classNames(
                            "cursor-pointer px-2 py-2 text-xs",
                            {
                              "text-gray-400 hover:text-black font-normal":
                                !item.isActive,
                              "text-black font-medium": item.isActive,
                            }
                          ),
                          "aria-readonly": true,
                          "aria-description": `Navigate to '${item.name}'`,
                          children: item.name,
                        }),
                      })
                    )
                : void 0,
            ],
          }),
          /* @__PURE__ */ jsxs("div", {
            className:
              "mx-auto px-4 container md:hidden flex items-center justify-between h-full",
            children: [
              /* @__PURE__ */ jsxs("div", {
                className:
                  "py-2 pt-2.5 flex flex-row space-x-2 select-none mr-4",
                children: [
                  /* @__PURE__ */ jsx("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 24 24",
                    fill: "currentColor",
                    className: "w-4 h-4",
                    children: /* @__PURE__ */ jsx("path", {
                      d: "M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z",
                    }),
                  }),
                  /* @__PURE__ */ jsx("span", {
                    className: "-mt-0.5 text-sm font-semibold",
                    children: "Bell",
                  }),
                ],
              }),
              /* @__PURE__ */ jsx("button", {
                onClick: () => setMobileMenuOpen(!isMobileMenuOpen),
                className: "cursor-pointer",
                children: /* @__PURE__ */ jsx("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  "stroke-width": "1.5",
                  stroke: "currentColor",
                  className: "w-6 h-6",
                  children: /* @__PURE__ */ jsx("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5",
                  }),
                }),
              }),
            ],
          }),
        ],
      }),
      isMobileMenuOpen &&
        /* @__PURE__ */ jsx("div", {
          className:
            "h-screen w-full drop-shadow-sm backdrop-blur-sm absolute bg-white bg-opacity-10",
          children: /* @__PURE__ */ jsx("ul", {
            className:
              "absolute bg-white z-10 w-full border-b border-b-gray-200 drop-shadow-sm",
            children:
              items == null
                ? void 0
                : items.flatMap((item) =>
                    /* @__PURE__ */ jsx("li", {
                      className:
                        "px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium text-sm",
                      children: /* @__PURE__ */ jsx("a", {
                        href: item.href,
                        role: "link",
                        "aria-readonly": true,
                        "aria-description": `Navigate to '${item.name}'`,
                        children: item.name,
                      }),
                    })
                  ),
          }),
        }),
    ],
  });
}
function Menu({ children }) {
  return {
    name: "Menu",
    component: children,
  };
}
function View({ children }) {
  return {
    name: "View",
    component: children,
  };
}
function DashboardArea({ menuEnabled, nested }) {
  var _a, _b;
  return /* @__PURE__ */ jsx("div", {
    className: "w-full h-full",
    children: /* @__PURE__ */ jsx("div", {
      className: "md:px-0 h-full",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col h-full md:flex-row",
        children: [
          menuEnabled &&
            /* @__PURE__ */ jsx("div", {
              className:
                "flex-shrink-0 min-w-full md:h-full md:min-w-[150px] md:border-r md:border-r-zinc-200 bg-white",
              children:
                (_a = _.find(
                  nested,
                  (item) => (item == null ? void 0 : item.name) == "Menu"
                )) == null
                  ? void 0
                  : _a.component,
            }),
          /* @__PURE__ */ jsx("div", {
            className: "flex-shrink w-full overflow-y-auto overflow-x-hidden",
            children:
              (_b = _.find(
                nested,
                (item) => (item == null ? void 0 : item.name) == "View"
              )) == null
                ? void 0
                : _b.component,
          }),
        ],
      }),
    }),
  });
}
function DashboardMenuItem({ name, isActive, href, priority, icon, kbd }) {
  return /* @__PURE__ */ jsxs(Link, {
    to: href,
    prefetch: "intent",
    "data-priority": priority,
    "data-href": href,
    "data-name": name,
    "data-is-active": isActive,
    className: classNames(
      "flex px-2 pl-4 h-[37px] justify-between flex-row items-center gap-2.5 cursor-pointer",
      {
        "text-[#060931] bg-[#ebecfd] font-medium": isActive,
        "text-gray-400 hover:bg-[#f3f4fe] hover:text-gray-500": !isActive,
      }
    ),
    children: [
      /* @__PURE__ */ jsxs("div", {
        className: "flex justify-between gap-2",
        children: [
          /* @__PURE__ */ jsx("div", { role: "img", children: icon }),
          /* @__PURE__ */ jsx("span", { className: "text-xs", children: name }),
        ],
      }),
      kbd &&
        /* @__PURE__ */ jsx("kbd", {
          className:
            "px-1.5 py-1 text-[8px] font-semibold text-gray-800 bg-gray-50 border border-gray-100 rounded-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500",
          children: kbd,
        }),
    ],
  });
}
function DashboardMenuHolder({ children }) {
  return /* @__PURE__ */ jsx("div", {
    role: "menu",
    className: "divide-y divide-gray-100",
    children: _.isArray(children)
      ? _.orderBy(children, (i) => _.get(i, "props.priority", 0))
      : children,
  });
}
function DashboardBasicWrapper({ children, className }) {
  return /* @__PURE__ */ jsx("div", {
    className: classNames("", className),
    children,
  });
}
const ICON_DEFAULT_CLASSNAME = "w-4 h-4";
function getDatasetDashboardLeftBar(currentActivePageId) {
  return [
    {
      id: "routes",
      classname: LeftActiveBarItem.ROUTES,
      priority: 1,
      name: string("dashboard.menu.routes"),
      href: "/routes",
      isActive: currentActivePageId == LeftActiveBarItem.ROUTES,
      icon: /* @__PURE__ */ jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 20 20",
        fill: "currentColor",
        className: classNames(ICON_DEFAULT_CLASSNAME),
        children: /* @__PURE__ */ jsx("path", {
          d: "M16.555 5.412a8.028 8.028 0 0 0-3.503-2.81 14.899 14.899 0 0 1 1.663 4.472 8.547 8.547 0 0 0 1.84-1.662ZM13.326 7.825a13.43 13.43 0 0 0-2.413-5.773 8.087 8.087 0 0 0-1.826 0 13.43 13.43 0 0 0-2.413 5.773A8.473 8.473 0 0 0 10 8.5c1.18 0 2.304-.24 3.326-.675ZM6.514 9.376A9.98 9.98 0 0 0 10 10c1.226 0 2.4-.22 3.486-.624a13.54 13.54 0 0 1-.351 3.759A13.54 13.54 0 0 1 10 13.5c-1.079 0-2.128-.127-3.134-.366a13.538 13.538 0 0 1-.352-3.758ZM5.285 7.074a14.9 14.9 0 0 1 1.663-4.471 8.028 8.028 0 0 0-3.503 2.81c.529.638 1.149 1.199 1.84 1.66ZM17.334 6.798a7.973 7.973 0 0 1 .614 4.115 13.47 13.47 0 0 1-3.178 1.72 15.093 15.093 0 0 0 .174-3.939 10.043 10.043 0 0 0 2.39-1.896ZM2.666 6.798a10.042 10.042 0 0 0 2.39 1.896 15.196 15.196 0 0 0 .174 3.94 13.472 13.472 0 0 1-3.178-1.72 7.973 7.973 0 0 1 .615-4.115ZM10 15c.898 0 1.778-.079 2.633-.23a13.473 13.473 0 0 1-1.72 3.178 8.099 8.099 0 0 1-1.826 0 13.47 13.47 0 0 1-1.72-3.178c.855.151 1.735.23 2.633.23ZM14.357 14.357a14.912 14.912 0 0 1-1.305 3.04 8.027 8.027 0 0 0 4.345-4.345c-.953.542-1.971.981-3.04 1.305ZM6.948 17.397a8.027 8.027 0 0 1-4.345-4.345c.953.542 1.971.981 3.04 1.305a14.912 14.912 0 0 0 1.305 3.04Z",
        }),
      }),
      kbd: "R",
    },
    {
      id: "filters",
      classname: LeftActiveBarItem.FILTERS,
      priority: 1,
      name: string("dashboard.menu.filters"),
      href: "/filters",
      isActive: currentActivePageId == LeftActiveBarItem.FILTERS,
      icon: /* @__PURE__ */ jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor",
        className: classNames(ICON_DEFAULT_CLASSNAME),
        children: /* @__PURE__ */ jsx("path", {
          d: "M14 2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2.172a2 2 0 0 0 .586 1.414l2.828 2.828A2 2 0 0 1 6 9.828v4.363a.5.5 0 0 0 .724.447l2.17-1.085A2 2 0 0 0 10 11.763V9.829a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 0 14 4.172V2Z",
        }),
      }),
      kbd: "F",
    },
    {
      id: "resources",
      classname: LeftActiveBarItem.RESOURCES,
      priority: 1,
      name: string("dashboard.menu.resources"),
      href: "/resources",
      isActive: currentActivePageId == LeftActiveBarItem.RESOURCES,
      icon: /* @__PURE__ */ jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 20 20",
        fill: "currentColor",
        className: classNames(ICON_DEFAULT_CLASSNAME),
        children: /* @__PURE__ */ jsx("path", {
          fillRule: "evenodd",
          d: "M2 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Zm0 4.5h16l-.811 7.71a2 2 0 0 1-1.99 1.79H4.802a2 2 0 0 1-1.99-1.79L2 7.5ZM10 9a.75.75 0 0 1 .75.75v2.546l.943-1.048a.75.75 0 1 1 1.114 1.004l-2.25 2.5a.75.75 0 0 1-1.114 0l-2.25-2.5a.75.75 0 1 1 1.114-1.004l.943 1.048V9.75A.75.75 0 0 1 10 9Z",
          clipRule: "evenodd",
        }),
      }),
      kbd: "E",
    },
    {
      id: "ecords",
      classname: LeftActiveBarItem.ASN_RECORDS,
      priority: 1,
      name: string("dashboard.menu.asnRecords"),
      href: "/requests",
      isActive: currentActivePageId == LeftActiveBarItem.ASN_RECORDS,
      icon: /* @__PURE__ */ jsx("svg", {
        className: classNames(ICON_DEFAULT_CLASSNAME),
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 20 20",
        fill: "currentColor",
        children: /* @__PURE__ */ jsx("path", {
          fillRule: "evenodd",
          d: "M13.2 2.24a.75.75 0 0 0 .04 1.06l2.1 1.95H6.75a.75.75 0 0 0 0 1.5h8.59l-2.1 1.95a.75.75 0 1 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 0 0-1.06.04Zm-6.4 8a.75.75 0 0 0-1.06-.04l-3.5 3.25a.75.75 0 0 0 0 1.1l3.5 3.25a.75.75 0 1 0 1.02-1.1l-2.1-1.95h8.59a.75.75 0 0 0 0-1.5H4.66l2.1-1.95a.75.75 0 0 0 .04-1.06Z",
          clipRule: "evenodd",
        }),
      }),
    },
    {
      id: "postbacks",
      classname: LeftActiveBarItem.POSTBACKS,
      priority: 1,
      name: string("dashboard.menu.postbacks"),
      href: "/postbacks",
      isActive: currentActivePageId == LeftActiveBarItem.POSTBACKS,
      icon: /* @__PURE__ */ jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        className: classNames(ICON_DEFAULT_CLASSNAME),
        children: /* @__PURE__ */ jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z",
        }),
      }),
      kbd: "P",
    },
    {
      id: "files",
      classname: LeftActiveBarItem.FILES,
      priority: 1,
      name: string("dashboard.menu.files"),
      href: "/files",
      isActive: currentActivePageId == LeftActiveBarItem.FILES,
      icon: /* @__PURE__ */ jsx("svg", {
        className: classNames(ICON_DEFAULT_CLASSNAME),
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        children: /* @__PURE__ */ jsx("path", {
          d: "M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z",
        }),
      }),
    },
  ];
}
const production = {
  // API_HOST: "http://94.247.42.124/"
  API_HOST: "http://localhost:8000/",
};
var ApiPathEnum = /* @__PURE__ */ ((ApiPathEnum2) => {
  ApiPathEnum2["Ping"] = "/ping";
  ApiPathEnum2["GetAllFiles"] = "/api/file/list/all";
  ApiPathEnum2["GetFile"] = "/api/file/read";
  ApiPathEnum2["WriteFile"] = "/api/file/write";
  ApiPathEnum2["Routes"] = "/api/route/list";
  ApiPathEnum2["Filters"] = "/api/filter/list";
  ApiPathEnum2["Resources"] = "/api/resource/list";
  ApiPathEnum2["Resource"] = "/api/resource/";
  ApiPathEnum2["Route"] = "/api/route/";
  ApiPathEnum2["GetAllFilesShort"] = "/api/file/list/short";
  ApiPathEnum2["GetMoneyVolumeByPostbacks"] = "/api/postback/24h-amount";
  ApiPathEnum2["CreateRoutes"] = "/api/route/create";
  ApiPathEnum2["CreateResources"] = "/api/resource/create";
  ApiPathEnum2["CreateFilters"] = "/api/filter/create";
  ApiPathEnum2["GetAllASNRecords"] = "/api/requests/asn/list";
  ApiPathEnum2["GetAllPostbacks"] = "/api/postback/list";
  ApiPathEnum2["GetAllResourceDrivers"] = "/api/resource/driver/list";
  ApiPathEnum2["GetAllFilterPlugins"] = "/api/filter/plugin/list";
  return ApiPathEnum2;
})(ApiPathEnum || {});
const API_ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : production.API_HOST;
axios.create({
  baseURL: "/",
  headers: {
    "X-Database-Zone": "",
  },
});
async function getPrivateAxiosInstance() {
  return axios.create({
    baseURL: "/",
    headers: {},
  });
}
const webConfig = {
  apiEndpoint: API_ENDPOINT,
  apiEndpointFactory(pathWithoutHost) {
    return API_ENDPOINT + pathWithoutHost;
  },
  async axiosFactory(mode2 = "PUBLIC") {
    switch (mode2) {
      case "PRIVATE":
        return await getPrivateAxiosInstance();
      case "PUBLIC":
        return axios.create({
          baseURL: "/",
          headers: {},
        });
    }
  },
};
const wireforceLogo = "/assets/wireforce-logo-DE2n0Ifj.png";
const rightTopImage = "/assets/top-right-01-CRlffadx.png";
function MenuElement(currentLeftActiveBarItem) {
  const [items, setItems] = useState(getDatasetDashboardLeftBar(null));
  useEffect(() => {
    if (currentLeftActiveBarItem) {
      setItems(getDatasetDashboardLeftBar(currentLeftActiveBarItem));
    }
  }, [currentLeftActiveBarItem]);
  return /* @__PURE__ */ jsx(DashboardMenuHolder, {
    children:
      items == null
        ? void 0
        : items.map((item) =>
            /* @__PURE__ */ jsx(
              DashboardMenuItem,
              {
                isActive: item.classname == currentLeftActiveBarItem,
                href: item.href,
                priority: item.priority,
                icon: item.icon,
                name: item.name,
                kbd: item.kbd,
              },
              item.id
            )
          ),
  });
}
var LeftActiveBarItem = /* @__PURE__ */ ((LeftActiveBarItem2) => {
  LeftActiveBarItem2["FILES"] = "files";
  LeftActiveBarItem2["ROUTES"] = "routes";
  LeftActiveBarItem2["FILTERS"] = "filters";
  LeftActiveBarItem2["RESOURCES"] = "resources";
  LeftActiveBarItem2["ASN_RECORDS"] = "asn-records";
  LeftActiveBarItem2["POSTBACKS"] = "postbacks";
  LeftActiveBarItem2["THREADS"] = "threads";
  LeftActiveBarItem2["VISITORS"] = "visitors";
  LeftActiveBarItem2["EVENTS"] = "events";
  LeftActiveBarItem2["TRAFFIC"] = "traffic";
  return LeftActiveBarItem2;
})(LeftActiveBarItem || {});
function DashboardLayout({ children, isHideMenu, currentLeftActiveBarItem }) {
  const [isInternetError, setInternetError] = useState(false);
  const [isSafari, setSafari] = useState(false);
  const [moneyVolume, setMoneyVolume] = useState(0);
  useEffect(() => {
    webConfig.axiosFactory("PRIVATE").then((data) => {
      data
        .get(
          webConfig.apiEndpointFactory(ApiPathEnum.GetMoneyVolumeByPostbacks)
        )
        .then((response) => {
          setMoneyVolume(response.data.value);
        });
    });
  }, []);
  useEffect(() => {
    const isSafari2 =
      /constructor/i.test(String(window.HTMLElement)) ||
      (function (p) {
        return p.toString() === "[object SafariRemoteNotification]";
      })(
        !window["safari"] ||
          (typeof window["safari"] !== "undefined" &&
            (safari == null ? void 0 : safari.pushNotification))
      );
    setSafari(isSafari2);
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
    }, 5e3);
    pingRequest();
    return () => clearInterval(interval);
  }, []);
  return /* @__PURE__ */ jsxs("div", {
    style: { height: "calc(100vh - 45px - 32px)" },
    children: [
      isSafari &&
        /* @__PURE__ */ jsx("div", {
          className: "h-[1px] w-full bg-[#060931]",
        }),
      /* @__PURE__ */ jsx("div", {
        className:
          "w-full bg-[#060931] h-[32px] px-4 flex flex-row items-center justify-between",
        children: /* @__PURE__ */ jsxs("div", {
          className:
            "container w-full flex flex-row items-center justify-between",
          children: [
            /* @__PURE__ */ jsx("img", {
              src: wireforceLogo,
              className: "h-[28px]",
              alt: "",
            }),
            /* @__PURE__ */ jsx("img", {
              src: rightTopImage,
              className: "h-[32px]",
              alt: "",
            }),
          ],
        }),
      }),
      /* @__PURE__ */ jsx(Navbar, {
        mode: NavbarModeEnum.IN_DASHBOARD,
        currentActivePageId: PageIdEnum.DASHBOARD,
        moneyVolume,
      }),
      isInternetError &&
        /* @__PURE__ */ jsxs("div", {
          className:
            "flex flex-row items-center justify-start gap-2 fixed bottom-0 left-0 text-white z-50 px-3.5 py-2 text-xs right-0 absolute bg-[#ef233c] font-medium",
          children: [
            /* @__PURE__ */ jsx("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "currentColor",
              className: "size-4",
              children: /* @__PURE__ */ jsx("path", {
                fillRule: "evenodd",
                d: "M11.484 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 0 7.877 3.08.75.75 0 0 1 .722.515 12.74 12.74 0 0 1 .635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 0 1-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 0 1 .722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75ZM12 15a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75H12Z",
                clipRule: "evenodd",
              }),
            }),
            /* @__PURE__ */ jsx("span", {
              children: "There are problems with your Internet connection.",
            }),
          ],
        }),
      /* @__PURE__ */ jsx(DashboardBasicWrapper, {
        className: "h-full",
        children: /* @__PURE__ */ jsx(DashboardArea, {
          menuEnabled: !isHideMenu,
          nested: [
            View({
              children: /* @__PURE__ */ jsx("div", {
                className:
                  "h-full w-full overflow-y-auto bg-[#edf2f4] bg-opacity-50",
                children: /* @__PURE__ */ jsx("section", {
                  className: "",
                  children,
                }),
              }),
            }),
            isHideMenu !== true
              ? Menu({ children: MenuElement(currentLeftActiveBarItem) })
              : void 0,
          ],
        }),
      }),
    ],
  });
}
const meta$6 = () => {
  return [{ title: string("meta.title.filters") }];
};
const hiddenCols$2 = ["asn_description"];
function Postbacks() {
  const [data, setData] = useState(void 0);
  const [modalOverviewData, setModalOverviewData] = useState();
  useEffect(() => {
    fether();
  }, []);
  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllPostbacks)).then(
        (res) => {
          setData(res.data.value);
        }
      );
    });
  }, []);
  return /* @__PURE__ */ jsxs(DashboardLayout, {
    subTitle: string("dashboard.subtitle.postbacks"),
    currentLeftActiveBarItem: LeftActiveBarItem.POSTBACKS,
    children: [
      modalOverviewData &&
        /* @__PURE__ */ jsx(Modal, {
          isBigModal: true,
          onClose: () => setModalOverviewData(void 0),
          title: "Overview request",
          children: /* @__PURE__ */ jsx(Table, {
            data: modalOverviewData,
            headers: ["Key", "Value"],
          }),
        }),
      /* @__PURE__ */ jsx(SubNavbar, {
        title: string("dashboard.subtitle.postbacks"),
      }),
      /* @__PURE__ */ jsxs("div", {
        className:
          "w-full flex flex-col justify-center items-start px-4 pt-2 pb-2.5 bg-white border-b border-b-gray-200",
        children: [
          /* @__PURE__ */ jsxs("h2", {
            className: "text-sm font-bold",
            children: [
              "How to send postbacks ",
              /* @__PURE__ */ jsx("span", {
                className: "text-gray-400",
                children: "(webhooks)",
              }),
              "?",
            ],
          }),
          /* @__PURE__ */ jsx("p", {
            className: "text-xs font-normal text-gray-500",
            children:
              "Sending postbacks is very easy. Set up a posbek link in your affiliate program as follows:",
          }),
          typeof window !== "undefined" &&
            /* @__PURE__ */ jsxs("p", {
              className: "text-xs font-normal text-blue-500 block mt-2",
              children: [
                window.location.protocol,
                "//",
                window.location.hostname,
                "/service/postback?",
                `uuid={uuid}&date={date}&status={status}&ip={ip}&amount={amount}&stream={stream}&currency={currency}&time={time}`,
              ],
            }),
        ],
      }),
      /* @__PURE__ */ jsx(Table, {
        headers:
          data &&
          (!_.isEmpty(data)
            ? _.keys(_.omit(_.first(data), hiddenCols$2)).map((i) =>
                humanizeString(i).replace("Asn", "ASN")
              )
            : []),
        data,
      }),
    ],
  });
}
const route1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: Postbacks,
      meta: meta$6,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
function BigInput({
  placeholder,
  isDisabled,
  label,
  isRequired,
  name,
  onChangeValue,
  value,
}) {
  return /* @__PURE__ */ jsxs("div", {
    "data-role": "input-group",
    children: [
      label
        ? /* @__PURE__ */ jsx("label", {
            className: "text-xs text-gray-500 mb-[5px] block",
            children: label,
          })
        : void 0,
      /* @__PURE__ */ jsx("textarea", {
        value,
        name,
        rows: 6,
        required: isRequired,
        disabled: _.isBoolean(isDisabled) ? isDisabled : false,
        onChange: (event) => {
          if (onChangeValue) {
            onChangeValue(event.target.value);
          }
        },
        placeholder,
        className:
          "w-full px-3 py-1 text-sm placeholder-gray-400 hover:border-gray-200 focus-within:border-gray-400 border-gray-200 focus:border-gray-500 transition-colors duration-75 border-[0.115em] outline-none focus:outline-none",
      }),
    ],
  });
}
function Button({ children, variant = "primary", onPress, disabled }) {
  return /* @__PURE__ */ jsx("button", {
    onClick: onPress,
    disabled,
    className: classNames(
      "w-full disabled:text-[#52af59] disabled:cursor-not-allowed disabled:bg-[#e7f2e9] focus:outline focus:outline-gray-500 focus:outline-offset-2 px-2.5 py-1.5 font-medium text-xs text-white bg-[#52af59]",
      {
        "bg-red-500 text-white font-medium disabled:bg-red-300 disabled:text-white":
          variant == "delete",
      }
    ),
    children,
  });
}
function Input({
  className,
  type,
  placeholder,
  isDisabled,
  label,
  isRequired,
  name,
  onChangeValue,
  value,
}) {
  return /* @__PURE__ */ jsxs("div", {
    "data-role": "input-group",
    className: "w-full",
    children: [
      label
        ? /* @__PURE__ */ jsx("label", {
            className: "text-xs text-gray-500 mb-[5px] block",
            children: label,
          })
        : void 0,
      /* @__PURE__ */ jsx("input", {
        type: type || "text",
        value,
        name,
        required: isRequired,
        disabled: _.isBoolean(isDisabled) ? isDisabled : false,
        onChange: (event) => {
          if (onChangeValue) {
            onChangeValue(event.target.value);
          }
        },
        placeholder,
        className: classNames(
          "w-full h-8 px-3 py-1 text-sm placeholder-gray-400 hover:border-gray-200 focus-within:border-gray-400 border-gray-200 focus:border-gray-500 transition-colors duration-75 border-[0.115em] outline-none focus:outline-none",
          className
        ),
      }),
    ],
  });
}
function Select({
  isDisabled,
  label,
  isRequired,
  name,
  onChangeValue,
  value,
  values,
}) {
  return /* @__PURE__ */ jsxs("div", {
    "data-role": "input-group",
    className: "w-full",
    children: [
      label
        ? /* @__PURE__ */ jsx("label", {
            className: "text-xs text-gray-500 mb-[5px] block",
            children: label,
          })
        : void 0,
      /* @__PURE__ */ jsx("select", {
        value,
        name,
        required: isRequired,
        disabled: _.isBoolean(isDisabled) ? isDisabled : false,
        onChange: (event) => {
          if (onChangeValue) {
            onChangeValue(event.target.value);
          }
        },
        className:
          "w-full h-8 px-3 py-1 text-sm placeholder-gray-400 hover:border-gray-200 focus-within:border-gray-400 border-gray-200 focus:border-gray-500 transition-colors duration-75 border-[0.115em] outline-none focus:outline-none",
        children:
          values == null
            ? void 0
            : values.map((value2) =>
                /* @__PURE__ */ jsx(
                  "option",
                  { value: value2.value, children: value2.name },
                  value2.value
                )
              ),
      }),
    ],
  });
}
const meta$5 = () => {
  return [{ title: string("meta.title.filters") }];
};
const defaultDrivers = [
  {
    name: "JSON",
    description: "Return JSON data",
    value: "json",
    rules: {
      valueType: "any",
    },
  },
  {
    name: "HTML",
    description: "Render single HTML page",
    value: "html",
    rules: {
      valueType: "file",
    },
  },
  {
    name: "JavaScript Redirect",
    description: "Redirect to other path with JS",
    value: "redirect::javascript",
    rules: {
      valueType: "raw",
    },
  },
  {
    name: "Meta Redirect",
    description: "Redirect to other path with <meta>",
    value: "redirect::meta",
    rules: {
      valueType: "raw",
    },
  },
  {
    name: "HTML Proxy",
    description: "Reverse proxy, like target site hosted in this resource",
    value: "proxy::html",
    rules: {
      valueType: "raw",
    },
  },
  {
    name: "PHP",
    description: "Render PHP page",
    value: "php",
    rules: {
      valueType: "file",
    },
  },
  {
    name: "HTTP Status Page",
    description: "Render HTTP status page with message",
    value: "http_status_page",
    rules: {
      valueType: "raw",
    },
  },
];
function Resources() {
  const [data, setData] = useState(void 0);
  const [filesPlaceholder, setFilesPlaceholder] = useState(void 0);
  const [typeOfContent, setTypeOfContent] = useState(0);
  const [availableDrivers, setAvailableDrivers] = useState(defaultDrivers);
  const [modelResourceId, setModelResourceId] = useState();
  const [modelDriver, setModelDriver] = useState(availableDrivers[0].value);
  const [modelFileUri, setModelFileUri] = useState();
  const [modelContent, setModelContent] = useState();
  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);
  useEffect(() => {
    fether();
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllFilesShort)).then(
        (res) => {
          setFilesPlaceholder(res.data.value);
          if (res.data.value) {
            setModelFileUri(_.first(res.data.value));
          }
        }
      );
    });
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(
        webConfig.apiEndpointFactory(ApiPathEnum.GetAllResourceDrivers)
      ).then((res) => {
        const driversList = defaultDrivers.concat(
          res.data.value.map((i2) => {
            return {
              name: i2,
              description: "Driver from other suppliers",
              value: i2,
            };
          })
        );
        const uniqDriversList = _.uniqBy(driversList, "value");
        setAvailableDrivers(uniqDriversList);
      });
    });
  }, []);
  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Resources)).then((res) => {
        setData(res.data.value);
      });
    });
  }, []);
  const onCreateResource = useCallback(() => {
    let data2 = new FormData();
    if (!modelResourceId) {
      return;
    }
    data2.append("resource_id", modelResourceId || "");
    data2.append("driver", modelDriver || "");
    if (typeOfContent == 0) {
      data2.append("file_path", modelFileUri || "");
    }
    if (typeOfContent == 1) {
      data2.append("raw_data", modelContent || "");
    }
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.post(webConfig.apiEndpointFactory(ApiPathEnum.CreateResources), data2)
        .then((res) => {
          if (res.status == 201) {
            setIsModalCreateVisible(false);
            fether();
            toast.success("Resource created");
          } else {
            toast.error("Resource not created");
          }
        })
        .catch(() => {
          toast.error("Resource not created");
        });
    });
  }, [modelContent, modelDriver, modelFileUri, modelResourceId, typeOfContent]);
  return /* @__PURE__ */ jsxs(DashboardLayout, {
    subTitle: string("dashboard.subtitle.resources"),
    currentLeftActiveBarItem: LeftActiveBarItem.RESOURCES,
    children: [
      isModalCreateVisible &&
        /* @__PURE__ */ jsx(Modal, {
          title: "Create new resource",
          onClose: () => {
            setIsModalCreateVisible(false);
          },
          children: /* @__PURE__ */ jsxs("div", {
            className: "space-y-4 pt-2",
            children: [
              /* @__PURE__ */ jsx(Input, {
                label: "Resource ID",
                value: modelResourceId,
                onChangeValue: setModelResourceId,
              }),
              /* @__PURE__ */ jsxs("div", {
                children: [
                  /* @__PURE__ */ jsx("label", {
                    className: "text-xs text-gray-400 mb-[5px] block",
                    children: "Driver",
                  }),
                  /* @__PURE__ */ jsx("div", {
                    className: "grid grid-cols-3 gap-2",
                    children: availableDrivers.map((it) =>
                      /* @__PURE__ */ jsxs("div", {
                        onClick: () => setModelDriver(it.value),
                        className: classNames(
                          "w-full cursor-pointer px-2 py-1 border border-gray-200",
                          {
                            "border-blue-500 bg-blue-50":
                              modelDriver == it.value,
                          }
                        ),
                        children: [
                          /* @__PURE__ */ jsx("h4", {
                            className: "text-sm font-regular",
                            children: it.name,
                          }),
                          /* @__PURE__ */ jsx("p", {
                            className: "text-[10px] w-[80%] text-gray-400",
                            children: it.description,
                          }),
                        ],
                      })
                    ),
                  }),
                  /* @__PURE__ */ jsx("span", {
                    className:
                      "text-xs w-[75%] mt-2 text-gray-400 mb-[5px] block",
                    children:
                      "The driver is the method by which the response will be displayed to the user when he visits the page with this resource.",
                  }),
                ],
              }),
              typeOfContent == 0 &&
                /* @__PURE__ */ jsx(Select, {
                  label: "Content type",
                  values:
                    (filesPlaceholder == null
                      ? void 0
                      : filesPlaceholder.map((i) => ({ name: i, value: i }))) ||
                    [],
                  value: modelFileUri,
                  onChangeValue: setModelFileUri,
                }),
              typeOfContent == 1 &&
                /* @__PURE__ */ jsx(BigInput, {
                  label: "Regular content",
                  value: modelContent,
                  onChangeValue: setModelContent,
                }),
              /* @__PURE__ */ jsx("a", {
                className: "text-blue-500 text-xs",
                href: "#",
                onClick: () => setTypeOfContent(typeOfContent == 0 ? 1 : 0),
                children: "Toogle content type",
              }),
              /* @__PURE__ */ jsx(Button, {
                disabled: !modelFileUri && !modelContent,
                onPress: onCreateResource,
                children: "Create",
              }),
            ],
          }),
        }),
      /* @__PURE__ */ jsx(SubNavbar, {
        title: string("dashboard.subtitle.resources"),
        onCreateAction: () => setIsModalCreateVisible(true),
      }),
      /* @__PURE__ */ jsx(Table, {
        headers: ["Resource ID", "Driver", "Content", "File path"],
        data:
          data == null
            ? void 0
            : data.map((i) => ({
                ...i,
                driver: /* @__PURE__ */ jsxs(Fragment, {
                  children: [
                    !(defaultDrivers == null
                      ? void 0
                      : defaultDrivers
                          .map((i2) => i2.value)
                          .includes(i.driver)) &&
                      /* @__PURE__ */ jsxs("div", {
                        className: "flex flex-row items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsx("svg", {
                            viewBox: "0 0 20 20",
                            fill: "currentColor",
                            height: "1em",
                            width: "1em",
                            children: /* @__PURE__ */ jsx("path", {
                              d: "M20 14v4a2 2 0 01-2 2h-4v-2a2 2 0 00-2-2 2 2 0 00-2 2v2H6a2 2 0 01-2-2v-4H2a2 2 0 01-2-2 2 2 0 012-2h2V6c0-1.1.9-2 2-2h4V2a2 2 0 012-2 2 2 0 012 2v2h4a2 2 0 012 2v4h-2a2 2 0 00-2 2 2 2 0 002 2h2z",
                            }),
                          }),
                          /* @__PURE__ */ jsx("span", { children: i.driver }),
                        ],
                      }),
                    i.driver == "json" &&
                      /* @__PURE__ */ jsxs("div", {
                        className: "flex flex-row items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsx("svg", {
                            viewBox: "0 0 24 24",
                            fill: "currentColor",
                            height: "1em",
                            width: "1em",
                            children: /* @__PURE__ */ jsx("path", {
                              d: "M5 3h2v2H5v5a2 2 0 01-2 2 2 2 0 012 2v5h2v2H5c-1.07-.27-2-.9-2-2v-4a2 2 0 00-2-2H0v-2h1a2 2 0 002-2V5a2 2 0 012-2m14 0a2 2 0 012 2v4a2 2 0 002 2h1v2h-1a2 2 0 00-2 2v4a2 2 0 01-2 2h-2v-2h2v-5a2 2 0 012-2 2 2 0 01-2-2V5h-2V3h2m-7 12a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1m-4 0a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1m8 0a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1z",
                            }),
                          }),
                          /* @__PURE__ */ jsx("span", { children: "JSON" }),
                        ],
                      }),
                    i.driver == "php" &&
                      /* @__PURE__ */ jsxs("div", {
                        className: "flex flex-row items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsx("svg", {
                            viewBox: "0 0 24 24",
                            fill: "currentColor",
                            height: "1em",
                            width: "1em",
                            children: /* @__PURE__ */ jsx("path", {
                              d: "M12 18.08c-6.63 0-12-2.72-12-6.08s5.37-6.08 12-6.08S24 8.64 24 12s-5.37 6.08-12 6.08m-5.19-7.95c.54 0 .91.1 1.09.31.18.2.22.56.13 1.03-.1.53-.29.87-.58 1.09-.28.22-.71.33-1.29.33h-.87l.53-2.76h.99m-3.5 5.55h1.44l.34-1.75h1.23c.54 0 .98-.06 1.33-.17.35-.12.67-.31.96-.58.24-.22.43-.46.58-.73.15-.26.26-.56.31-.88.16-.78.05-1.39-.33-1.82-.39-.44-.99-.65-1.82-.65H4.59l-1.28 6.58m7.25-8.33l-1.28 6.58h1.42l.74-3.77h1.14c.36 0 .6.06.71.18.11.12.13.34.07.66l-.57 2.93h1.45l.59-3.07c.13-.62.03-1.07-.27-1.36-.3-.27-.85-.4-1.65-.4h-1.27L12 7.35h-1.44M18 10.13c.55 0 .91.1 1.09.31.18.2.22.56.13 1.03-.1.53-.29.87-.57 1.09-.29.22-.72.33-1.3.33h-.85l.5-2.76h1m-3.5 5.55h1.44l.34-1.75h1.22c.55 0 1-.06 1.35-.17.35-.12.65-.31.95-.58.24-.22.44-.46.58-.73.15-.26.26-.56.32-.88.15-.78.04-1.39-.34-1.82-.36-.44-.99-.65-1.82-.65h-2.75l-1.29 6.58z",
                            }),
                          }),
                          /* @__PURE__ */ jsx("span", { children: "PHP" }),
                        ],
                      }),
                    i.driver == "html" &&
                      /* @__PURE__ */ jsxs("div", {
                        className: "flex flex-row items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsx("svg", {
                            viewBox: "0 0 384 512",
                            fill: "currentColor",
                            height: "1em",
                            width: "1em",
                            children: /* @__PURE__ */ jsx("path", {
                              d: "M0 32l34.9 395.8L191.5 480l157.6-52.2L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z",
                            }),
                          }),
                          /* @__PURE__ */ jsx("span", {
                            children: "Single HTML",
                          }),
                        ],
                      }),
                    i.driver == "redirect::javascript" &&
                      /* @__PURE__ */ jsxs("div", {
                        className: "flex flex-row items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsx("svg", {
                            viewBox: "0 0 24 24",
                            fill: "currentColor",
                            height: "1em",
                            width: "1em",
                            children: /* @__PURE__ */ jsx("path", {
                              d: "M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-1.002l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z",
                            }),
                          }),
                          /* @__PURE__ */ jsx("svg", {
                            fill: "currentColor",
                            viewBox: "0 0 16 16",
                            height: "1em",
                            width: "1em",
                            children: /* @__PURE__ */ jsx("path", {
                              d: "M2 2a2 2 0 00-2 2v1a2 2 0 002 2h5.5v3A1.5 1.5 0 006 11.5H.5a.5.5 0 000 1H6A1.5 1.5 0 007.5 14h1a1.5 1.5 0 001.5-1.5h5.5a.5.5 0 000-1H10A1.5 1.5 0 008.5 10V7H14a2 2 0 002-2V4a2 2 0 00-2-2H2zm.5 3a.5.5 0 110-1 .5.5 0 010 1zm2 0a.5.5 0 110-1 .5.5 0 010 1z",
                            }),
                          }),
                          /* @__PURE__ */ jsx("span", {
                            children: "JavaScript Redirect",
                          }),
                        ],
                      }),
                    i.driver == "redirect::meta" &&
                      /* @__PURE__ */ jsxs("div", {
                        className: "flex flex-row items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsx("svg", {
                            viewBox: "0 0 16 16",
                            fill: "currentColor",
                            height: "1em",
                            width: "1em",
                            children: /* @__PURE__ */ jsx("path", {
                              fill: "currentColor",
                              d: "M.946 0L2.23 14.4 7.992 16l5.777-1.602L15.055 0H.947zM12.26 4.71H5.502l.161 1.809H12.1l-.485 5.422-3.623 1.004-3.618-1.004-.247-2.774H5.9l.126 1.41 1.967.53.004-.001 1.968-.531.204-2.29H4.048l-.476-5.341h8.847l-.158 1.766z",
                            }),
                          }),
                          /* @__PURE__ */ jsx("svg", {
                            fill: "currentColor",
                            viewBox: "0 0 16 16",
                            height: "1em",
                            width: "1em",
                            children: /* @__PURE__ */ jsx("path", {
                              d: "M2 2a2 2 0 00-2 2v1a2 2 0 002 2h5.5v3A1.5 1.5 0 006 11.5H.5a.5.5 0 000 1H6A1.5 1.5 0 007.5 14h1a1.5 1.5 0 001.5-1.5h5.5a.5.5 0 000-1H10A1.5 1.5 0 008.5 10V7H14a2 2 0 002-2V4a2 2 0 00-2-2H2zm.5 3a.5.5 0 110-1 .5.5 0 010 1zm2 0a.5.5 0 110-1 .5.5 0 010 1z",
                            }),
                          }),
                          /* @__PURE__ */ jsx("span", {
                            children: "Meta Redirect",
                          }),
                        ],
                      }),
                    i.driver == "proxy::html" &&
                      /* @__PURE__ */ jsxs("div", {
                        className: "flex flex-row items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsx("svg", {
                            viewBox: "0 0 24 24",
                            fill: "currentColor",
                            height: "1em",
                            width: "1em",
                            children: /* @__PURE__ */ jsx("path", {
                              d: "M12 0L1.605 6v12L12 24l10.395-6V6L12 0zm6 16.59c0 .705-.646 1.29-1.529 1.29-.631 0-1.351-.255-1.801-.81l-6-7.141v6.66c0 .721-.57 1.29-1.274 1.29H7.32c-.721 0-1.29-.6-1.29-1.29V7.41c0-.705.63-1.29 1.5-1.29.646 0 1.38.255 1.83.81l5.97 7.141V7.41c0-.721.6-1.29 1.29-1.29h.075c.72 0 1.29.6 1.29 1.29v9.18H18z",
                            }),
                          }),
                          /* @__PURE__ */ jsx("span", {
                            children: "Proxy Rewrite",
                          }),
                        ],
                      }),
                  ],
                }),
                raw_content: i.raw_content ? _.take(i.raw_content, 64) : void 0,
              })),
      }),
    ],
  });
}
const route2 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: Resources,
      meta: meta$5,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
const meta$4 = () => {
  return [{ title: string("meta.title.filters") }];
};
const hiddenCols$1 = ["asn_description", "asn_number", "route_way"];
function Requests() {
  const [data, setData] = useState(void 0);
  const [modalOverviewData, setModalOverviewData] = useState();
  useEffect(() => {
    fether();
  }, []);
  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllASNRecords)).then(
        (res) => {
          setData(res.data.value);
        }
      );
    });
  }, []);
  return /* @__PURE__ */ jsxs(DashboardLayout, {
    subTitle: string("dashboard.subtitle.asnRecords"),
    currentLeftActiveBarItem: LeftActiveBarItem.ASN_RECORDS,
    children: [
      modalOverviewData &&
        /* @__PURE__ */ jsx(Modal, {
          isBigModal: true,
          onClose: () => setModalOverviewData(void 0),
          title: "Overview request",
          children: /* @__PURE__ */ jsx("div", {
            className: "w-full overflow-hidden",
            children: /* @__PURE__ */ jsx(Table, {
              data: modalOverviewData.map(([key, value]) => {
                if (key == "route_way") {
                  return {
                    key,
                    value: "Data is corrupted",
                  };
                }
                if (key == "query") {
                  return {
                    key,
                    value: "Data is corrupted",
                  };
                }
                return {
                  key,
                  value,
                };
              }),
              headers: ["Key", "Value"],
            }),
          }),
        }),
      /* @__PURE__ */ jsx(SubNavbar, {
        title: string("dashboard.subtitle.asnRecords"),
      }),
      /* @__PURE__ */ jsx(Table, {
        headers:
          data &&
          (!_.isEmpty(data)
            ? _.keys(_.omit(_.first(data), hiddenCols$1)).map((i) =>
                humanizeString(i).replace("Asn", "ASN")
              )
            : []),
        data:
          data == null
            ? void 0
            : data.map((it, index) => {
                var _a, _b;
                const row = {
                  ...it,
                  request_id: /* @__PURE__ */ jsx("span", {
                    onClick: () => {
                      setModalOverviewData(
                        _.toPairs(flatten(data[index]) || {})
                      );
                    },
                    className: "text-gray-400 hover:underline",
                    children: it.request_id,
                  }),
                  time: /* @__PURE__ */ jsx("span", {
                    className: "text-gray-400",
                    children: moment(it.time / 1e3).format("DD.MM.YYYY HH:mm"),
                  }),
                  headers: /* @__PURE__ */ jsxs("span", {
                    children: [
                      /* @__PURE__ */ jsx("span", {
                        children: _.size(it.headers),
                      }),
                      " ",
                      /* @__PURE__ */ jsx("span", {
                        className: "text-gray-400",
                        children: "times",
                      }),
                    ],
                  }),
                  route_way: it.route_way ? "Existing" : "Unknown",
                  query: it.query ? "Yes" : "No",
                  asn_country_code:
                    (it == null ? void 0 : it.asn_country_code) &&
                    /* @__PURE__ */ jsxs("span", {
                      className: "flex items-center flex-row gap-2",
                      children: [
                        /* @__PURE__ */ jsx("img", {
                          className: "size-3",
                          alt: "United States",
                          src: `http://purecatamphetamine.github.io/country-flag-icons/3x2/${
                            (_a = it == null ? void 0 : it.asn_country_code) ==
                            null
                              ? void 0
                              : _a.toUpperCase()
                          }.svg`,
                        }),
                        /* @__PURE__ */ jsx("span", {
                          className: "font-medium",
                          children:
                            (_b = it == null ? void 0 : it.asn_country_code) ==
                            null
                              ? void 0
                              : _b.toUpperCase(),
                        }),
                      ],
                    }),
                };
                return _.omit(row, hiddenCols$1);
              }),
      }),
    ],
  });
}
const route3 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: Requests,
      meta: meta$4,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
const facebook = [
  "facebook",
  "fb",
  "facebookexternalhit",
  "facebookexternalhit/1.1",
  "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
];
const bing = ["bingbot", "bingpreview", "bingbot/2.0", "bing"];
const baidu = ["baidu"];
const yandex = ["yandex"];
const amazon = [
  "amazon",
  "amazon-adsystem",
  "amazon-adsystem.com",
  "amazon-adsystem.com/3.0",
];
const google = [
  "google",
  "googlebot",
  "googlebot-news",
  "googlebot-image",
  "googlebot-video",
  "googlebot-mobile",
  "googlebot-sitemaps",
  "googlebot-mobile-sitemaps",
  "googlebot-ads",
  "googlebot-ads-sitemaps",
  "googleusercontent",
  "google-sitemap-generator",
  "google-sitemap",
  "google-sitemaps",
  "google-sitemap-xml",
  "google-sitemap-generator",
  "google-sitemap-generator-xml",
];
const instagram = ["instagram"];
const pinterest = ["pinterest"];
const twitter = ["twitter"];
const vk = ["vk"];
const msn = ["msn"];
const w3c = ["w3c", "w3c-validator"];
const microsoft = [
  "bingpreview",
  "bingbot/2.0",
  "bingbot",
  "bingbot-news",
  "bingbot-image",
  "bingbot-video",
  "bingbot-mobile",
  "bingbot-sitemaps",
  "bingbot-mobile-sitemaps",
  "bingbot-ads",
  "bingbot-ads-sitemaps",
  "bing",
];
const yahoo = ["yahoo"];
const mozilla = ["mozilla"];
const duckduckgo = ["duckduckbot"];
const coccoc = ["coccoc"];
const reddit = [
  "reddit",
  "redditbot",
  "redditbot/1.0",
  "redditbot/1.0 (http://www.reddit.com/bots)",
];
const asnGroups = {
  facebook,
  bing,
  baidu,
  yandex,
  amazon,
  google,
  instagram,
  pinterest,
  twitter,
  vk,
  msn,
  w3c,
  microsoft,
  yahoo,
  mozilla,
  duckduckgo,
  coccoc,
  reddit,
};
const meta$3 = () => {
  return [{ title: string("meta.title.filters") }];
};
const defaultPlugins = [
  { name: "IP", value: "ip" },
  { name: "ASN Owner", value: "asn::owner" },
  { name: "User Agent", value: "ua" },
  { name: "Referrer", value: "referrer" },
  { name: "Domain", value: "domain" },
  { name: "Country by IP", value: "ip::country_code" },
  { name: "Country by ASN", value: "asn::country_code" },
  { name: "Cookies", value: "cookie::string" },
  { name: "Headers", value: "header::string" },
  { name: "Session ID", value: "session_id" },
  { name: "BotDetect by User Agent", value: "ua::bot" },
];
function Filters() {
  const REPLACATE_FILTER = {
    name: "",
    value: "",
    operator: "==",
    plugin: "",
    resourceId: "",
  };
  const [data, setData] = useState(void 0);
  const [resources, setResources] = useState(void 0);
  const [step, setStep] = useState(0);
  const [plugins, setPlugins] = useState([]);
  const [operators] = useState([
    { name: "==", value: "==" },
    { name: "!=", value: "!=" },
    { name: "~", value: "~" },
    { name: "in", value: "in" },
  ]);
  const [modelFilterName, setModelFilterName] = useState();
  const [modelFilterId, setModelFilterId] = useState();
  const [modelFilters, setModelFilters] = useState([REPLACATE_FILTER]);
  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);
  useEffect(() => {
    fether();
  }, []);
  useEffect(() => {
    fetherResources();
  }, [isModalCreateVisible]);
  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Filters)).then((res) => {
        setData(res.data.value);
      });
    });
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllFilterPlugins)).then(
        (res) => {
          if (_.isArray(res.data.value)) {
            setPlugins(
              res.data.value.map((it) => {
                var _a;
                return {
                  name:
                    ((_a = defaultPlugins.find((p) => p.value === it)) == null
                      ? void 0
                      : _a.name) || it,
                  value: it,
                };
              })
            );
          }
        }
      );
    });
  }, []);
  const fetherResources = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Resources)).then((res) => {
        setResources(res.data.value);
      });
    });
  }, []);
  const filterValue = (pluginName, value, onChangeValue) => {
    switch (pluginName) {
      case "asn::groups":
        return /* @__PURE__ */ jsx(Select, {
          label: "Filter value",
          values: Object.keys(asnGroups).map((key) => ({
            name: key,
            value: key,
          })),
          value,
          onChangeValue,
        });
      case "asn::owner":
        return /* @__PURE__ */ jsx(Select, {
          label: "Filter value",
          values: [{ value: "d", name: "d" }],
          value,
          onChangeValue,
        });
      default:
        return /* @__PURE__ */ jsx(Input, {
          label: "Filter value",
          className: "w-full",
          value,
          onChangeValue,
        });
    }
  };
  const onCreateFilter = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      let data2 = new FormData();
      data2.append("name", modelFilterName);
      data2.append("filter_id", modelFilterId);
      modelFilters == null
        ? void 0
        : modelFilters.forEach((filter, index) => {
            data2.append(`conditions[${index}][name]`, filter.name);
            data2.append(`conditions[${index}][value]`, filter.value);
            data2.append(`conditions[${index}][operator]`, filter.operator);
            data2.append(`conditions[${index}][plugin]`, filter.plugin);
            data2.append(
              `conditions[${index}][resource_id]`,
              filter.resourceId
            );
          });
      i.post(
        webConfig.apiEndpointFactory(ApiPathEnum.CreateFilters),
        data2
      ).then((res) => {
        if (res.status == 201) {
          fether();
          setIsModalCreateVisible(false);
          setModelFilters([REPLACATE_FILTER]);
          setModelFilterId(void 0);
          setModelFilterName(void 0);
        }
      });
    });
  }, [modelFilterId, modelFilterName, modelFilters]);
  const notFoundResources = /* @__PURE__ */ jsxs("div", {
    className: "w-full flex flex-col justify-center items-center py-8",
    children: [
      /* @__PURE__ */ jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        className: "size-10 mb-4",
        children: /* @__PURE__ */ jsx("path", {
          fillRule: "evenodd",
          d: "M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z",
          clipRule: "evenodd",
        }),
      }),
      /* @__PURE__ */ jsx("h1", {
        className: "text-md font-medium text-center mb-0 p-0",
        children: string("filters.create.resourcesNotFoundTitle"),
      }),
      /* @__PURE__ */ jsx("p", {
        className: "text-xs text-center font-normal opacity-50 w-72",
        children: string("filters.create.resourcesNotFoundDescription"),
      }),
    ],
  });
  return /* @__PURE__ */ jsxs(DashboardLayout, {
    subTitle: string("dashboard.subtitle.filters"),
    currentLeftActiveBarItem: LeftActiveBarItem.FILTERS,
    children: [
      isModalCreateVisible &&
        /* @__PURE__ */ jsx(Modal, {
          isBigModal: true,
          title: "Create new filter",
          onClose: () => setIsModalCreateVisible(false),
          children: /* @__PURE__ */ jsxs("div", {
            className: "relative h-full w-full",
            children: [
              step == 0 &&
                /* @__PURE__ */ jsx("div", {
                  className: "w-full h-full flex items-center justify-center",
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center justify-center flex-col",
                    children: [
                      /* @__PURE__ */ jsx("img", {
                        src: "/filter.png",
                        alt: "",
                        className: "h-40",
                      }),
                      /* @__PURE__ */ jsxs("h2", {
                        className: "text-lg font-medium",
                        children: [
                          /* @__PURE__ */ jsx("b", {
                            children: "FilterEngine.",
                          }),
                          " Factory of new filters.",
                        ],
                      }),
                      /* @__PURE__ */ jsx("p", {
                        className:
                          "text-xs text-gray-500 text-center w-[400px]",
                        children:
                          "Creating a filter to distribute traffic between resources. In the future, you will be able to reference the same filter multiple times",
                      }),
                      /* @__PURE__ */ jsxs("div", {
                        className: "space-y-2 w-1/2 min-w-[400px] mt-8",
                        children: [
                          /* @__PURE__ */ jsx(Input, {
                            label: "Filter ID",
                            value: modelFilterId,
                            onChangeValue: setModelFilterId,
                          }),
                          /* @__PURE__ */ jsx(Input, {
                            label: "Filter name",
                            value: modelFilterName,
                            onChangeValue: setModelFilterName,
                          }),
                          /* @__PURE__ */ jsx(Button, {
                            onPress: () => {
                              if (modelFilterId && modelFilterName) {
                                setStep(1);
                              }
                            },
                            children: "Next",
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              step == 1 &&
                /* @__PURE__ */ jsx(Fragment, {
                  children: /* @__PURE__ */ jsxs("div", {
                    className:
                      "w-full h-full absolute top-0 left-0 right-0 bottom-0 flex flex-col overflow-y-auto pb-32 overflow-x-auto space-y-4",
                    children: [
                      !resources && notFoundResources,
                      resources &&
                        (modelFilters == null
                          ? void 0
                          : modelFilters.map((filter, index) =>
                              /* @__PURE__ */ jsx("div", {
                                children: /* @__PURE__ */ jsxs("div", {
                                  className:
                                    "flex flex-row justify-between items-center space-x-2 h-14 w-full",
                                  children: [
                                    /* @__PURE__ */ jsx(Input, {
                                      label: "Filter name",
                                      value:
                                        filter == null ? void 0 : filter.name,
                                      onChangeValue: (it) => {
                                        const from = _.clone(modelFilters);
                                        from[index].name = it;
                                        setModelFilters(from);
                                      },
                                    }),
                                    /* @__PURE__ */ jsx(Select, {
                                      label: "Plugin",
                                      values: plugins,
                                      value:
                                        filter == null ? void 0 : filter.plugin,
                                      onChangeValue: (it) => {
                                        const from = _.clone(modelFilters);
                                        from[index].plugin = it;
                                        setModelFilters(from);
                                      },
                                    }),
                                    /* @__PURE__ */ jsx(Select, {
                                      label: "Operator",
                                      values: operators,
                                      value:
                                        filter == null
                                          ? void 0
                                          : filter.operator,
                                      onChangeValue: (it) => {
                                        const from = _.clone(modelFilters);
                                        from[index].operator = it;
                                        setModelFilters(from);
                                      },
                                    }),
                                    filterValue(
                                      filter == null ? void 0 : filter.plugin,
                                      filter == null ? void 0 : filter.value,
                                      (it) => {
                                        const from = _.clone(modelFilters);
                                        from[index].value = it;
                                        setModelFilters(from);
                                      }
                                    ),
                                    /* @__PURE__ */ jsx(Select, {
                                      label: "Resource",
                                      values:
                                        resources == null
                                          ? void 0
                                          : resources.map((it) => ({
                                              name:
                                                it == null
                                                  ? void 0
                                                  : it.resource_id,
                                              value:
                                                it == null
                                                  ? void 0
                                                  : it.resource_id,
                                            })),
                                      value:
                                        filter == null
                                          ? void 0
                                          : filter.resourceId,
                                      onChangeValue: (it) => {
                                        const from = _.clone(modelFilters);
                                        from[index].resourceId = it;
                                        setModelFilters(from);
                                      },
                                    }),
                                    /* @__PURE__ */ jsx("svg", {
                                      onClick: () => {
                                        if (modelFilters.length > 1) {
                                          const from = _.clone(modelFilters);
                                          delete from[index];
                                          setModelFilters(_.compact(from));
                                        } else {
                                          setModelFilters([REPLACATE_FILTER]);
                                        }
                                      },
                                      xmlns: "http://www.w3.org/2000/svg",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      strokeWidth: 1.5,
                                      stroke: "currentColor",
                                      className:
                                        "w-6 h-6 flex-shrink-0 hover:text-red-800 hover:bg-red-100 cursor-pointer p-1 text-red-500",
                                      children: /* @__PURE__ */ jsx("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        d: "M6 18 18 6M6 6l12 12",
                                      }),
                                    }),
                                  ],
                                }),
                              })
                            )),
                      resources &&
                        /* @__PURE__ */ jsx("button", {
                          className:
                            "w-full text-[#003049] bg-zinc-100 text-xs font-medium cursor-pointer py-2",
                          onClick: () => {
                            setModelFilters([
                              ...modelFilters,
                              REPLACATE_FILTER,
                            ]);
                          },
                          children: "Add filter",
                        }),
                    ],
                  }),
                }),
              step == 1 &&
                /* @__PURE__ */ jsx("div", {
                  className: "bottom-0 absolute left-0 right-0",
                  children: /* @__PURE__ */ jsx(Button, {
                    onPress: () => onCreateFilter(),
                    children: "Create",
                  }),
                }),
            ],
          }),
        }),
      /* @__PURE__ */ jsx(SubNavbar, {
        title: string("dashboard.subtitle.filters"),
        onCreateAction: () => setIsModalCreateVisible(true),
      }),
      /* @__PURE__ */ jsx(Table, {
        headers: ["Name", "Filter ID", "Conditions count"],
        data:
          data == null
            ? void 0
            : data.map((it) => {
                return { ...it, conditions: it.conditions.length };
              }),
      }),
    ],
  });
}
const route4 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: Filters,
      meta: meta$3,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
function GrayWrapper({ children, className }) {
  return /* @__PURE__ */ jsx("div", {
    className: classNames("bg-gray-50 bg-opacity-75 rounded-lg p-2", className),
    children,
  });
}
const meta$2 = () => {
  return [
    { title: "Bellissimo" },
    {
      name: "description",
      content: "Welcome to Paper Analytics! This is your dashboard",
    },
  ];
};
function Dashboard() {
  return /* @__PURE__ */ jsx(DashboardLayout, {
    currentLeftActiveBarItem: LeftActiveBarItem.THREADS,
    children: /* @__PURE__ */ jsx(GrayWrapper, {
      className: "py-12",
      children: /* @__PURE__ */ jsx(LoadingActivity, { text: "Redirecting" }),
    }),
  });
}
const route5 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: Dashboard,
      meta: meta$2,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
const meta$1 = () => {
  return [{ title: string("meta.title.routes") }];
};
const hiddenCols = [""];
function Routes() {
  const [data, setData] = useState(void 0);
  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);
  const [modelName, setModelName] = useState();
  const [modelPath, setModelPath] = useState();
  const [modelDomain, setModelDomain] = useState();
  const [modelFilterId, setModelFilterId] = useState();
  const [modelResourceId, setModelResourceId] = useState();
  const [filters, setFilters] = useState(void 0);
  const [resources, setResources] = useState(void 0);
  const [host, setHost] = useState();
  const [protocol, setProtocol] = useState("http");
  const [isModalOverviewData, setModalOverviewData] = useState();
  const [lastOpenOverviewData, setLastOpenOverviewData] = useState(0);
  const [time, setTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().unix());
    }, 1e3);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    setHost(window.location.hostname);
    setProtocol(window.location.protocol.replace(":", ""));
  }, []);
  useEffect(() => {
    fether();
  }, []);
  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Routes)).then((res) => {
        setData(res.data.value);
      });
    });
  }, []);
  useEffect(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Filters)).then((res) => {
        setFilters(
          res.data.value.map((i2) => {
            return {
              value: i2["filter_id"],
              name: i2["name"] || i2["filter_id"] || "Without Name",
            };
          })
        );
      });
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Resources)).then((res) => {
        setResources(
          res.data.value.map((it) => ({
            value: it["resource_id"],
            name: `[${it["driver"] || "Without Driver"}] ` + it["resource_id"],
          }))
        );
      });
    });
  }, []);
  useEffect(() => {
    var _a, _b;
    if (filters && resources) {
      setModelFilterId((_a = filters[0]) == null ? void 0 : _a.value);
      setModelResourceId((_b = resources[0]) == null ? void 0 : _b.value);
    }
  }, [filters, resources]);
  const onCreateResource = useCallback(() => {
    if (modelPath == null ? void 0 : modelPath.startsWith("/")) {
      return;
    }
    let data2 = new FormData();
    data2.append("name", modelName);
    data2.append("path", "/" + modelPath);
    data2.append("domain", modelDomain);
    data2.append("filter_id", modelFilterId);
    data2.append("resource_id", modelResourceId);
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.post(
        webConfig.apiEndpointFactory(ApiPathEnum.CreateRoutes),
        data2
      ).then((res) => {
        if (res.status == 201) {
          setIsModalCreateVisible(false);
          fether();
        }
      });
    });
  }, [modelFilterId, modelPath, modelName, modelResourceId]);
  const notFoundResources = /* @__PURE__ */ jsxs("div", {
    className: "w-full flex flex-col justify-center items-center py-8",
    children: [
      /* @__PURE__ */ jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        className: "size-10 mb-4",
        children: /* @__PURE__ */ jsx("path", {
          fillRule: "evenodd",
          d: "M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z",
          clipRule: "evenodd",
        }),
      }),
      /* @__PURE__ */ jsx("h1", {
        className: "text-md font-medium text-center mb-0 p-0",
        children: string("routes.create.resourcesNotFoundTitle"),
      }),
      /* @__PURE__ */ jsx("p", {
        className: "text-xs text-center font-normal opacity-50",
        children: string("routes.create.resourcesNotFoundDescription"),
      }),
    ],
  });
  const notFoundFilters = /* @__PURE__ */ jsxs("div", {
    className: "w-full flex flex-col justify-center items-center py-8",
    children: [
      /* @__PURE__ */ jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        className: "size-10 mb-4",
        children: /* @__PURE__ */ jsx("path", {
          fillRule: "evenodd",
          d: "M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z",
          clipRule: "evenodd",
        }),
      }),
      /* @__PURE__ */ jsx("h1", {
        className: "text-md font-medium text-center mb-0 p-0",
        children: string("routes.create.filtersNotFoundTitle"),
      }),
      /* @__PURE__ */ jsx("p", {
        className: "text-xs text-center font-normal opacity-50",
        children: string("routes.create.filtersNotFoundDescription"),
      }),
    ],
  });
  const notFoundAnything = /* @__PURE__ */ jsxs("div", {
    className: "w-full flex flex-col justify-center items-center py-8",
    children: [
      /* @__PURE__ */ jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        className: "size-10 mb-4",
        children: /* @__PURE__ */ jsx("path", {
          fillRule: "evenodd",
          d: "M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z",
          clipRule: "evenodd",
        }),
      }),
      /* @__PURE__ */ jsx("h1", {
        className: "text-md font-medium text-center mb-0 p-0",
        children: string("routes.create.anyNotFoundTitle"),
      }),
      /* @__PURE__ */ jsx("p", {
        className: "text-xs text-center font-normal opacity-50",
        children: string("routes.create.anyNotFoundDescription"),
      }),
    ],
  });
  return /* @__PURE__ */ jsxs(DashboardLayout, {
    subTitle: string("dashboard.subtitle.routes"),
    currentLeftActiveBarItem: LeftActiveBarItem.ROUTES,
    children: [
      isModalOverviewData &&
        /* @__PURE__ */ jsxs(Modal, {
          onClose: () => setModalOverviewData(void 0),
          title: "Overview route",
          children: [
            /* @__PURE__ */ jsxs("div", {
              className: "w-full overflow-hidden mb-4",
              children: [
                /* @__PURE__ */ jsx("h2", {
                  className: "text-xl font-medium text-left mb-0 p-0",
                  children:
                    isModalOverviewData == null
                      ? void 0
                      : isModalOverviewData.name,
                }),
                /* @__PURE__ */ jsxs("p", {
                  className: "flex flex-row items-center mb-4",
                  children: [
                    /* @__PURE__ */ jsx("span", {
                      className: "text-xs text-left font-normal text-blue-500",
                      children:
                        isModalOverviewData == null
                          ? void 0
                          : isModalOverviewData.domain,
                    }),
                    /* @__PURE__ */ jsx("span", {
                      className: "text-xs text-left font-normal text-blue-500",
                      children:
                        isModalOverviewData == null
                          ? void 0
                          : isModalOverviewData.path,
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxs("div", {
                  className:
                    "w-full flex flex-row justify-start items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsx("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      viewBox: "0 0 20 20",
                      fill: "currentColor",
                      className: "size-3",
                      children: /* @__PURE__ */ jsx("path", {
                        fillRule: "evenodd",
                        d: "M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z",
                        clipRule: "evenodd",
                      }),
                    }),
                    /* @__PURE__ */ jsx("span", {
                      className: "text-xs text-left font-normal text-black",
                      children:
                        isModalOverviewData == null
                          ? void 0
                          : isModalOverviewData.filter_id,
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxs("div", {
                  className:
                    "w-full flex flex-row justify-start items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsx("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      viewBox: "0 0 20 20",
                      fill: "currentColor",
                      className: "size-3",
                      children: /* @__PURE__ */ jsx("path", {
                        fillRule: "evenodd",
                        d: "M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z",
                        clipRule: "evenodd",
                      }),
                    }),
                    /* @__PURE__ */ jsx("span", {
                      className: "text-xs text-left font-normal text-black",
                      children:
                        isModalOverviewData == null
                          ? void 0
                          : isModalOverviewData.resource_id,
                    }),
                  ],
                }),
              ],
            }),
            /* @__PURE__ */ jsx(Button, {
              variant: "delete",
              disabled: !(time - lastOpenOverviewData > 3),
              onPress: () => {
                console.log(isModalOverviewData);
                webConfig.axiosFactory("PRIVATE").then((axios2) => {
                  axios2
                    .delete(
                      webConfig.apiEndpointFactory(ApiPathEnum.Route) +
                        isModalOverviewData.name
                    )
                    .then(() => {
                      setModalOverviewData(void 0);
                    });
                });
              },
              children: "Delete",
            }),
          ],
        }),
      isModalCreateVisible &&
        /* @__PURE__ */ jsxs(Modal, {
          title: "Create route",
          onClose: () => {
            setIsModalCreateVisible(false);
          },
          children: [
            _.isEmpty(filters) && !_.isEmpty(resources) && notFoundFilters,
            !_.isEmpty(filters) && _.isEmpty(resources) && notFoundResources,
            _.isEmpty(filters) && _.isEmpty(resources) && notFoundAnything,
            !_.isEmpty(filters) &&
              !_.isEmpty(resources) &&
              /* @__PURE__ */ jsxs("div", {
                className: "space-y-4",
                children: [
                  /* @__PURE__ */ jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxs("div", {
                        className: "grid grid-cols-2 gap-2",
                        children: [
                          /* @__PURE__ */ jsx(Input, {
                            label: "Domain",
                            value: modelDomain,
                            className: classNames("outline-none w-full", {
                              "text-red-500 font-semibold":
                                (modelDomain == null
                                  ? void 0
                                  : modelDomain.startsWith("http://")) ||
                                (modelDomain == null
                                  ? void 0
                                  : modelDomain.startsWith("https://")),
                            }),
                            onChangeValue: setModelDomain,
                          }),
                          /* @__PURE__ */ jsxs("div", {
                            children: [
                              /* @__PURE__ */ jsx("label", {
                                className:
                                  "text-xs text-gray-500 mb-[5px] block",
                                children: "Path",
                              }),
                              /* @__PURE__ */ jsxs("div", {
                                className:
                                  "w-full flex flex-row h-8 px-3 py-1 text-sm placeholder-gray-400 hover:border-gray-200 focus-within:border-gray-400 border-gray-200 focus:border-gray-500 transition-colors duration-75 border-[0.115em] outline-none focus:outline-none",
                                children: [
                                  /* @__PURE__ */ jsxs("span", {
                                    children: [modelDomain || host, "/"],
                                  }),
                                  /* @__PURE__ */ jsx("input", {
                                    value: modelPath,
                                    onChange: (e) =>
                                      setModelPath(e.target.value),
                                    type: "text",
                                    placeholder: "any-path",
                                    className: classNames(
                                      "outline-none w-full",
                                      {
                                        "text-red-500 font-semibold":
                                          modelPath == null
                                            ? void 0
                                            : modelPath.startsWith("/"),
                                        "text-zinc-500": !(modelPath == null
                                          ? void 0
                                          : modelPath.startsWith("/")),
                                      }
                                    ),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsx("span", {
                        className:
                          "text-xs w-[75%] mt-2 text-gray-400 mb-[5px] block",
                        children:
                          'Along this path, your traffic will be sent to the filter. The path can be nested, for example "/level1/level2"',
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsx(Input, {
                    label: "Name",
                    value: modelName,
                    onChangeValue: setModelName,
                  }),
                  /* @__PURE__ */ jsx(Select, {
                    label: "Resource",
                    value: modelResourceId,
                    values: resources,
                    onChangeValue: setModelResourceId,
                  }),
                  /* @__PURE__ */ jsx(Select, {
                    label: "Filter",
                    value: modelFilterId,
                    values: filters,
                    onChangeValue: setModelFilterId,
                  }),
                  /* @__PURE__ */ jsx(Button, {
                    onPress: onCreateResource,
                    children: "Create",
                  }),
                ],
              }),
          ],
        }),
      /* @__PURE__ */ jsx(SubNavbar, {
        title: string("dashboard.subtitle.routes"),
        onCreateAction: () => setIsModalCreateVisible(true),
      }),
      /* @__PURE__ */ jsx(Table, {
        headers:
          data &&
          (!_.isEmpty(data)
            ? _.keys(_.omit(_.first(data), hiddenCols)).map((i) =>
                humanizeString(i).replace("Asn", "ASN")
              )
            : []),
        data:
          data == null
            ? void 0
            : data.map((it) => ({
                ...it,
                name: /* @__PURE__ */ jsx("span", {
                  onClick: () => {
                    webConfig.axiosFactory("PRIVATE").then((i) => {
                      i.get(
                        webConfig.apiEndpointFactory(ApiPathEnum.Route) +
                          it.name
                      ).then((i2) => {
                        setModalOverviewData(i2.data.value);
                        setLastOpenOverviewData(moment().unix());
                      });
                    });
                  },
                  className: "text-gray-400 hover:underline",
                  children: it.name,
                }),
                path: /* @__PURE__ */ jsxs("div", {
                  className: "flex flex-row gap-1.5 items-center",
                  children: [
                    /* @__PURE__ */ jsxs("svg", {
                      fill: "none",
                      stroke: "currentColor",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      viewBox: "0 0 24 24",
                      height: "1em",
                      width: "1em",
                      children: [
                        /* @__PURE__ */ jsx("path", {
                          stroke: "none",
                          d: "M0 0h24v24H0z",
                        }),
                        /* @__PURE__ */ jsx("path", {
                          d: "M11 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-5M10 14L20 4M15 4h5v5",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsx("a", {
                      className: "hover:underline",
                      href:
                        protocol +
                        "://" +
                        (it.domain || host).replace(" ", "") +
                        it.path,
                      target: "_blank",
                      children:
                        protocol +
                        "://" +
                        (it.domain || host).replace(" ", "") +
                        it.path,
                    }),
                  ],
                }),
              })),
      }),
    ],
  });
}
const route6 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: Routes,
      meta: meta$1,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
const meta = () => {
  return [{ title: string("meta.title.files") }];
};
function Files() {
  var _a;
  const [data, setData] = useState(void 0);
  const [rawContent, setRawContent] = useState("");
  const [currentPwd, setCurrentPwd] = useState("/");
  const [cursorOnFile, setCursorOnFile] = useState();
  const [rawLanguage, setRawLanguage] = useState("html");
  const editorRef = useRef(null);
  useEffect(() => {
    let ext = String(
      cursorOnFile == null ? void 0 : cursorOnFile.split(".").pop()
    ).toLowerCase();
    switch (ext) {
      case "js":
        setRawLanguage("javascript");
        break;
      default:
        setRawLanguage(ext);
        break;
    }
  }, [rawContent]);
  useEffect(() => {
    fether();
  }, [currentPwd]);
  useEffect(() => {
    setCursorOnFile(void 0);
  }, [currentPwd]);
  useEffect(() => {
    if (cursorOnFile) {
      setRawContent("Loading... 😈");
      webConfig.axiosFactory("PRIVATE").then((i) => {
        i.get(
          webConfig.apiEndpointFactory(ApiPathEnum.GetFile) +
            "?path=" +
            cursorOnFile
        ).then((res) => {
          setRawContent(res.data.value);
        });
      });
    }
  }, [cursorOnFile]);
  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(
        webConfig.apiEndpointFactory(ApiPathEnum.GetAllFiles) +
          "?path=" +
          currentPwd
      ).then((res) => {
        setData(res.data.value);
      });
    });
  }, [currentPwd]);
  return /* @__PURE__ */ jsxs(DashboardLayout, {
    subTitle: string("dashboard.subtitle.files"),
    currentLeftActiveBarItem: LeftActiveBarItem.FILES,
    children: [
      /* @__PURE__ */ jsx(SubNavbar, {
        createActionLabel: "Save file",
        onCreateAction: () => {
          if (_.isEmpty(rawContent)) {
            return;
          }
          let data2 = new FormData();
          data2.append("content", rawContent);
          webConfig.axiosFactory("PRIVATE").then((i) => {
            toast.promise(
              i.post(
                webConfig.apiEndpointFactory(ApiPathEnum.WriteFile) +
                  "?path=" +
                  cursorOnFile,
                data2
              ),
              {
                loading: "Saving...",
                success: "File saved!",
                error: "Could not save.",
              }
            );
          });
        },
        title: string("dashboard.subtitle.files"),
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "w-full h-full bg-white overflow-hidden flex flex-row",
        children: [
          /* @__PURE__ */ jsx("div", {
            className: "w-[200px] h-full divide-y divide-zinc-200 border-r ",
            children: _.orderBy(data || [], "is_file").map((it) =>
              /* @__PURE__ */ jsxs("div", {
                onClick: () => {
                  if (!it.is_file) {
                    setCurrentPwd(it.path);
                  } else {
                    setCursorOnFile(it.path);
                  }
                },
                className:
                  "w-full cursor-pointer flex flex-row items-center gap-2 bg-white py-1 px-2",
                children: [
                  !it.is_file
                    ? /* @__PURE__ */ jsx("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 20 20",
                        fill: "currentColor",
                        className: "size-3 fill-yellow-500",
                        children: /* @__PURE__ */ jsx("path", {
                          d: "M3.75 3A1.75 1.75 0 0 0 2 4.75v3.26a3.235 3.235 0 0 1 1.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0 0 16.25 5h-4.836a.25.25 0 0 1-.177-.073L9.823 3.513A1.75 1.75 0 0 0 8.586 3H3.75ZM3.75 9A1.75 1.75 0 0 0 2 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0 0 18 15.25v-4.5A1.75 1.75 0 0 0 16.25 9H3.75Z",
                        }),
                      })
                    : /* @__PURE__ */ jsxs("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 24 24",
                        fill: "currentColor",
                        className: "size-3 fill-gray-500",
                        children: [
                          /* @__PURE__ */ jsx("path", {
                            d: "M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z",
                          }),
                          /* @__PURE__ */ jsx("path", {
                            d: "M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z",
                          }),
                        ],
                      }),
                  /* @__PURE__ */ jsx("span", {
                    className: "text-xs",
                    children: _.last(_.split(it.path, "/")),
                  }),
                ],
              })
            ),
          }),
          /* @__PURE__ */ jsx("div", {
            className: "overflow-hidden w-full h-full",
            ref: editorRef,
            children:
              typeof window !== "undefined" &&
              /* @__PURE__ */ jsx(Editor, {
                width:
                  (_a = editorRef.current) == null ? void 0 : _a.clientWidth,
                line: 0,
                height: "calc(100vh - 120px)",
                defaultLanguage: "html",
                language: rawLanguage,
                value: rawContent,
                theme: "vs-light",
                options: {
                  formatOnType: true,
                  formatOnPaste: true,
                },
                onChange: (it) => {
                  if (it) {
                    setRawContent(it);
                  }
                },
              }),
          }),
        ],
      }),
    ],
  });
}
const route7 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      default: Files,
      meta,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
const serverManifest = {
  entry: {
    module: "/assets/entry.client-1bbS-aaJ.js",
    imports: ["/assets/components-Be_8OGgv.js"],
    css: [],
  },
  routes: {
    root: {
      id: "root",
      parentId: void 0,
      path: "",
      index: void 0,
      caseSensitive: void 0,
      hasAction: false,
      hasLoader: false,
      hasClientAction: false,
      hasClientLoader: false,
      hasErrorBoundary: false,
      module: "/assets/root-DDE2CRoi.js",
      imports: ["/assets/components-Be_8OGgv.js", "/assets/index-kUoaJ0iR.js"],
      css: [],
    },
    "routes/postbacks": {
      id: "routes/postbacks",
      parentId: "root",
      path: "postbacks",
      index: void 0,
      caseSensitive: void 0,
      hasAction: false,
      hasLoader: false,
      hasClientAction: false,
      hasClientLoader: false,
      hasErrorBoundary: false,
      module: "/assets/postbacks-B3SY_Pmd.js",
      imports: [
        "/assets/components-Be_8OGgv.js",
        "/assets/DashboardLayout-CHVXsdWb.js",
        "/assets/LoadingActivity-D2AtNIzl.js",
        "/assets/Table-DZl5MJvO.js",
        "/assets/SubNavbar-C-X8dpKw.js",
        "/assets/index-BXCooODB.js",
      ],
      css: [],
    },
    "routes/resources": {
      id: "routes/resources",
      parentId: "root",
      path: "resources",
      index: void 0,
      caseSensitive: void 0,
      hasAction: false,
      hasLoader: false,
      hasClientAction: false,
      hasClientLoader: false,
      hasErrorBoundary: false,
      module: "/assets/resources-C6cKc5tE.js",
      imports: [
        "/assets/components-Be_8OGgv.js",
        "/assets/DashboardLayout-CHVXsdWb.js",
        "/assets/LoadingActivity-D2AtNIzl.js",
        "/assets/index-kUoaJ0iR.js",
        "/assets/Select-D-8QOF0t.js",
        "/assets/Table-DZl5MJvO.js",
        "/assets/SubNavbar-C-X8dpKw.js",
      ],
      css: [],
    },
    "routes/requests": {
      id: "routes/requests",
      parentId: "root",
      path: "requests",
      index: void 0,
      caseSensitive: void 0,
      hasAction: false,
      hasLoader: false,
      hasClientAction: false,
      hasClientLoader: false,
      hasErrorBoundary: false,
      module: "/assets/requests-DOkEApXM.js",
      imports: [
        "/assets/components-Be_8OGgv.js",
        "/assets/DashboardLayout-CHVXsdWb.js",
        "/assets/LoadingActivity-D2AtNIzl.js",
        "/assets/moment-C5S46NFB.js",
        "/assets/Table-DZl5MJvO.js",
        "/assets/SubNavbar-C-X8dpKw.js",
        "/assets/index-BXCooODB.js",
      ],
      css: [],
    },
    "routes/filters": {
      id: "routes/filters",
      parentId: "root",
      path: "filters",
      index: void 0,
      caseSensitive: void 0,
      hasAction: false,
      hasLoader: false,
      hasClientAction: false,
      hasClientLoader: false,
      hasErrorBoundary: false,
      module: "/assets/filters-d7DqgXJo.js",
      imports: [
        "/assets/components-Be_8OGgv.js",
        "/assets/DashboardLayout-CHVXsdWb.js",
        "/assets/LoadingActivity-D2AtNIzl.js",
        "/assets/Select-D-8QOF0t.js",
        "/assets/Table-DZl5MJvO.js",
        "/assets/SubNavbar-C-X8dpKw.js",
      ],
      css: [],
    },
    "routes/_index": {
      id: "routes/_index",
      parentId: "root",
      path: void 0,
      index: true,
      caseSensitive: void 0,
      hasAction: false,
      hasLoader: false,
      hasClientAction: false,
      hasClientLoader: false,
      hasErrorBoundary: false,
      module: "/assets/_index-Bs52jN6x.js",
      imports: [
        "/assets/components-Be_8OGgv.js",
        "/assets/DashboardLayout-CHVXsdWb.js",
        "/assets/LoadingActivity-D2AtNIzl.js",
      ],
      css: [],
    },
    "routes/routes": {
      id: "routes/routes",
      parentId: "root",
      path: "routes",
      index: void 0,
      caseSensitive: void 0,
      hasAction: false,
      hasLoader: false,
      hasClientAction: false,
      hasClientLoader: false,
      hasErrorBoundary: false,
      module: "/assets/routes-DDyEBLq5.js",
      imports: [
        "/assets/components-Be_8OGgv.js",
        "/assets/DashboardLayout-CHVXsdWb.js",
        "/assets/LoadingActivity-D2AtNIzl.js",
        "/assets/index-BXCooODB.js",
        "/assets/moment-C5S46NFB.js",
        "/assets/Select-D-8QOF0t.js",
        "/assets/Table-DZl5MJvO.js",
        "/assets/SubNavbar-C-X8dpKw.js",
      ],
      css: [],
    },
    "routes/files": {
      id: "routes/files",
      parentId: "root",
      path: "files",
      index: void 0,
      caseSensitive: void 0,
      hasAction: false,
      hasLoader: false,
      hasClientAction: false,
      hasClientLoader: false,
      hasErrorBoundary: false,
      module: "/assets/files-qiFXuFGK.js",
      imports: [
        "/assets/components-Be_8OGgv.js",
        "/assets/DashboardLayout-CHVXsdWb.js",
        "/assets/SubNavbar-C-X8dpKw.js",
        "/assets/index-kUoaJ0iR.js",
      ],
      css: [],
    },
  },
  url: "/assets/manifest-eb58ff36.js",
  version: "eb58ff36",
};
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = {
  v3_fetcherPersist: false,
  v3_relativeSplatPath: false,
  v3_throwAbortReason: false,
  unstable_singleFetch: false,
};
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0,
  },
  "routes/postbacks": {
    id: "routes/postbacks",
    parentId: "root",
    path: "postbacks",
    index: void 0,
    caseSensitive: void 0,
    module: route1,
  },
  "routes/resources": {
    id: "routes/resources",
    parentId: "root",
    path: "resources",
    index: void 0,
    caseSensitive: void 0,
    module: route2,
  },
  "routes/requests": {
    id: "routes/requests",
    parentId: "root",
    path: "requests",
    index: void 0,
    caseSensitive: void 0,
    module: route3,
  },
  "routes/filters": {
    id: "routes/filters",
    parentId: "root",
    path: "filters",
    index: void 0,
    caseSensitive: void 0,
    module: route4,
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route5,
  },
  "routes/routes": {
    id: "routes/routes",
    parentId: "root",
    path: "routes",
    index: void 0,
    caseSensitive: void 0,
    module: route6,
  },
  "routes/files": {
    id: "routes/files",
    parentId: "root",
    path: "files",
    index: void 0,
    caseSensitive: void 0,
    module: route7,
  },
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes,
};
