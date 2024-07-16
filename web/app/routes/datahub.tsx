import DatahubClicks from "../fragments/datahub_clicks";
import DatahubDatasets from "~/fragments/datahub_datasets";
import DatahubExplorer from "../fragments/datahub_explorer";
import DatahubPostbacks from "../fragments/datahub_postbacks";
import DatahubRequests from "../fragments/datahub_requests";
import Funnels from "../fragments/datahub_funnels";
import TopTitle from "~/components/TopTitle";
import _ from "lodash";
import { MetaFunction } from "@remix-run/react";
import { ReactNode, useCallback, useMemo, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Bellissimo Datahub" }
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
        name: "Explorer",
        description: "You can create complex requests for hard analytic",
        href: "explorer",
      },
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
      {
        name: "Funnels",
        description:
          "Bellissimo creates funnels based on data from your requests. All funnels will be stored here.",
        href: "funnels",
      },
      {
        name: "Datasets",
        description: "Store for your datasets/user-data",
        href: "datasets",
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
      funnels: <Funnels />,
      explorer: <DatahubExplorer />,
      datasets: <DatahubDatasets />
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
      <div className="w-full h-full overflow-y-auto">{fragment}</div>
    </div>
  );
}