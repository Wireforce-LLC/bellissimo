import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import DashboardLayout, { LeftActiveBarItem } from "~/layouts/DashboardLayout";
import _ from "lodash";
import SuccessActivity from "~/components/SuccessActivity";
import LoadingActivity from "~/components/LoadingActivity";
import GrayWrapper from "~/components/GrayWrapper";
import { ReactNode, Suspense, useMemo, useState } from "react";
import Routes from "./routes";
import Files from "./files";
import Filters from "./filters";
import Postbacks from "./postbacks";
import Requests from "./requests";
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
      "/postbacks": <Postbacks/>,
      "/requests": <Requests/>,
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
