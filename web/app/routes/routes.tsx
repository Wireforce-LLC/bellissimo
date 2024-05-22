import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import _ from "lodash";
import moment from "moment";
import { useState, useEffect } from "react";
import Card from "~/components/Card";
import GrayWrapper from "~/components/GrayWrapper";
import Label from "~/components/Label";
import LoadingActivity from "~/components/LoadingActivity";
import ProgressMini from "~/components/ProgressMini";
import SharedCardEventsGroup from "~/components/SharedCardEventsGroup";
import SubNavbar from "~/components/SubNavbar";
import Table from "~/components/Table";
import DashboardLayout, { LeftActiveBarItem } from "~/layouts/DashboardLayout";
import string from "~/localization/polyglot";
import webConfig, { ApiPathEnum } from "~/web.config";

export const meta: MetaFunction = () => {
  return [
    { title: string("meta.title.events") }
  ];
};

export default function Routes() {
  const [data, setData] = useState<any[]|undefined>(undefined);

  useEffect(() => {
    webConfig.axiosFactory("PRIVATE").then(i => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Routes)).then(res => {
        setData(res.data.value)
      })
    })
  }, [])

  return (
    <DashboardLayout
      subTitle={string("dashboard.subtitle.routes")}
      currentLeftActiveBarItem={LeftActiveBarItem.ROUTES}
    >
      <SubNavbar
        title={string("dashboard.subtitle.routes")}
        onCreateAction={() => {}} />

      <Table headers={["Time", "ID", "Name", "Value", "Thread"]} data={
        data
      } />

    </DashboardLayout>
  );
}
