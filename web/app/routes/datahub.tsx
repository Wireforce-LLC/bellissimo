import { ReactNode, useCallback, useMemo, useState } from "react";
import TopTitle from "~/components/TopTitle";
import DatahubRequests from "./datahub_requests";
import Navbar from "~/components/Navbar";
import { MetaFunction, useLocation } from "@remix-run/react";
import DatahubPostbacks from "./datahub_postbacks";
import DatahubClicks from "./datahub_clicks";
import wireforceLogo from "/wireforce-logo.png";
import rightTopImage from "/top-right-01.png";
import _ from "lodash";

export const meta: MetaFunction = () => {
  return [
    { title: "Bellissimo Datahub" },
    {
      name: "description",
      content: "Welcome to Paper Analytics! This is your dashboard",
    },
  ];
};

interface Props {}

export default function Datahub() {
  const [currentPath, setCurrentPathValue] = useState(
    () => {
      if (typeof window !== "undefined") {
        let value = window.location.hash.replace("#", '');

        if (_.isEmpty(value)) {
          return null;
        } else {
          return value;
        }
      } else {
        undefined
      }
    }
  );

  const setCurrentPath = useCallback((value: string|null) => {
    setCurrentPathValue(value);
    if (value != null) {
      location.hash = `#${value}`;
    } else {
      location.hash = `#`;
    }
  }, []);

  const items = useMemo(
    () => [
      {
        name: "Requests",
        description:
          "All HTTP requests made to existing resources in Bellissimo.",
        href: "requests",
      },
      {
        name: "Postbacks",
        description:
          "Your partnes can send postbacks to Bellissimo. All postbacks will be stored here.",
        href: "postbacks",
      },
      {
        name: "Clicks",
        description: "All registred clicks. All clicks will be stored here.",
        href: "clicks",
      },
    ],
    []
  );

  const registry: { [key: string]: ReactNode } = useMemo(() => {
    return {
      home: (
        <div className="container mx-auto py-2 md:py-4 lg:py-6">
          <div className="py-2 md:py-4 lg:py-6 px-7">
            <TopTitle
              isLeft
              title="Your Datahub"
              subtitle="Welcome to the Dynamic Data Datahub. All data that Bellissimo will produce at the time of its operation will be located here"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-8 gap-4">
              {items.map((item, index) => (
                <div
                  onClick={() => setCurrentPath(item.href)}
                  className="w-full min-h-12 bg-white py-3 px-4 border border-zinc-50 hover:outline outline-1 outline-offset-2 outline-zinc-700 cursor-pointer"
                >
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <p className="text-xs text-zinc-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      requests: <DatahubRequests />,
      postbacks: <DatahubPostbacks />,
      clicks: <DatahubClicks />,
    };
  }, []);

  const fragment = useMemo(() => {
    if (currentPath === null) {
      return registry["home"];
    }

    if (currentPath === undefined) {
      return undefined;
    }

    return registry[currentPath] || undefined;
  }, [currentPath]);

  return (
    <div className="bg-zinc-100 h-screen overflow-hidden">
      <div className="w-full bg-[#060931] h-[32px] px-4 flex flex-row items-center justify-between">
        <div className="container w-full flex flex-row items-center justify-between">
          <img src={wireforceLogo} className="h-[32px]" alt="" />
          <img src={rightTopImage} className="h-[32px]" alt="" />
        </div>
      </div>

      <Navbar
        className="w-full  z-20 bg-zinc-50 text-black border-b border-b-zinc-200 h-[40px] md:h-[46px]"
        menuIcon={
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            height="1em"
            width="1em"
            className="size-5"
          >
            <path d="M13.293 6.293L7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
          </svg>
        }
        onMenuClick={() => {
          if (currentPath === null) {
            window.location.href = "/"
            return;
          }

          setCurrentPath(null)
        }}
      />

      <div className="w-full h-full overflow-y-auto">{fragment}</div>
    </div>
  );
}