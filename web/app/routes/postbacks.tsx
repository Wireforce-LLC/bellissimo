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
import EazyModal from "~/components/EazyModal";

export const meta: MetaFunction = () => {
  return [{ title: string("meta.title.postbacks") }];
};

const hiddenCols = ["asn_description"];

export default function Postbacks() {
  const [onAppendModal, setOnAppendModal] = useState(false);

  return (
    <>

      <EazyModal isVisible={onAppendModal} intent={setOnAppendModal}>
        <h2 className="text-sm font-bold">
            How to send postbacks{" "}
            <span className="text-gray-400">(webhooks)</span>?
          </h2>
          <p className="text-xs font-normal text-gray-500">
            Sending postbacks is very easy. Set up a posbek link in your affiliate
            program as follows:
          </p>

          {typeof window !== "undefined" && (
            <p className="text-xs font-normal text-blue-500 block mt-2">
              {window.location.protocol}//{window.location.hostname}
              /service/postback?
              {`uuid={uuid}&date={date}&status={status}&ip={ip}&amount={amount}&stream={stream}&currency={currency}&time={time}`}
            </p>
          )}
      </EazyModal>

      <SubNavbar title={string("dashboard.subtitle.postbacks")} onCreateAction={() => {
        setOnAppendModal(true)
      }} />

      <PostbackTableEmbed/>
    </>
  );
}
