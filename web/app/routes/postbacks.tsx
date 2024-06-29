import type { MetaFunction } from "@remix-run/node";
import _ from "lodash";
import { useState, useEffect, useCallback } from "react";
import SubNavbar from "~/components/SubNavbar";
import Table from "~/components/Table";
import DashboardLayout, { LeftActiveBarItem } from "~/layouts/DashboardLayout";
import string from "~/localization/polyglot";
import webConfig, { ApiPathEnum } from "~/web.config";
import humanizeString from "humanize-string";
import Tabs from "~/components/Tabs";
import PostbackTableEmbed from "~/embed/PostbacksTable";
import ClicksTableEmbed from "~/embed/ClicksTable";

export const meta: MetaFunction = () => {
  return [{ title: string("meta.title.postbacks") }];
};

const hiddenCols = ["asn_description"];

export default function Postbacks() {
  return (
    <DashboardLayout
      subTitle={string("dashboard.subtitle.postbacks")}
      currentLeftActiveBarItem={LeftActiveBarItem.POSTBACKS}
    >
      <SubNavbar title={string("dashboard.subtitle.postbacks")} />

      <Tabs isDisablePaddings titles={["Postbacks", "Clicks"]}>
        <PostbackTableEmbed/>
        <ClicksTableEmbed/>
      </Tabs>
    </DashboardLayout>
  );
}
