import AdsManager from "~/fragments/ads_manager";
import DashboardLayout from "~/layouts/DashboardLayout";
import Datahub from "./datahub";
import DatahubDatasets from "~/fragments/datahub_datasets";
import DatahubExplorer from "~/fragments/datahub_explorer";
import DatahubRequests from "~/fragments/datahub_requests";
import Files from "../fragments/files";
import Filters from "../fragments/filters";
import Funnels from "~/fragments/datahub_funnels";
import Resources from "../fragments/resources";
import Routes from "../fragments/routes";
import Scenario from "~/fragments/scenario";
import _ from "lodash";
import { ReactNode, Suspense, useCallback, useMemo, useState } from "react";

import {
  type MetaFunction,
} from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Bellissimo" },
    {
      name: "description",
      content: "Fa una zuppa meravigliosa!",
    },
  ];
};

export default function Dashboard() {
  // const [route, setRoute] = useState("/routes")
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


  const registry: { [key: string]: ReactNode } = useMemo(() => {
    return {
      "/routes": <Routes/>,
      "/files": <Files/>,
      "/filters": <Filters/>,
      "/resources": <Resources/>,
      "/scenario": <Scenario/>,
      "/adsmanager": <AdsManager/>,
      "/datahub": <Datahub/>,
      "/datahub/explorer": <DatahubExplorer/>,
      "/datahub/requests": <DatahubRequests/>,
      "/datahub/datasets": <DatahubDatasets/>,
      "/datahub/funnels": <Funnels/>
    }
  }, []);

  const fragment = useMemo(() => {
    if (currentPath === null) {
      return registry["/routes"];
    }

    if (currentPath === undefined) {
      return undefined;
    }

    return registry[currentPath] || undefined;
  }, [currentPath]);

  return (
    <DashboardLayout currentPath={currentPath || undefined} onMenuSelected={setCurrentPath}>
      <Suspense>
        {fragment}
      </Suspense>
    </DashboardLayout>
  );
}
