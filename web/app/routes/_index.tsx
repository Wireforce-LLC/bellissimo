import {
  type MetaFunction,
} from "@remix-run/node";
import DashboardLayout from "~/layouts/DashboardLayout";
import _ from "lodash";
import { ReactNode, Suspense, useCallback, useMemo, useState } from "react";
import Routes from "./routes";
import Files from "./files";
import Filters from "./filters";
import Resources from "./resources";

export const meta: MetaFunction = () => {
  return [
    { title: "Bellissimo" },
    {
      name: "description",
      content: "Welcome to Paper Analytics! This is your dashboard",
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
    }
  }, []);

  const fragment = useMemo(() => {
    if (currentPath == null) {
      return registry["/routes"];
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
