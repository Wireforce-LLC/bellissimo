import {
  type MetaFunction,
} from "@remix-run/node";
import DashboardLayout from "~/layouts/DashboardLayout";
import _ from "lodash";
import { ReactNode, Suspense, useMemo, useState } from "react";
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
  const [route, setRoute] = useState("/routes")

  const registry: { [key: string]: ReactNode } = useMemo(() => {
    return {
      "/routes": <Routes/>,
      "/files": <Files/>,
      "/filters": <Filters/>,
      "/resources": <Resources/>,
    }
  }, []);

  const fragment = useMemo(() => {
    return registry[route] || undefined;
  }, [route]);

  return (
    <DashboardLayout onMenuSelected={setRoute}>
      <Suspense>
        {fragment}
      </Suspense>
    </DashboardLayout>
  );
}
