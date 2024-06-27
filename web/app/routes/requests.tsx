import type { MetaFunction } from "@remix-run/node";
import _ from "lodash";
import { useState, useEffect, useCallback } from "react";
import Modal from "~/components/Modal";
import SubNavbar from "~/components/SubNavbar";
import Table from "~/components/Table";
import DashboardLayout, { LeftActiveBarItem } from "~/layouts/DashboardLayout";
import string from "~/localization/polyglot";
import webConfig, { ApiPathEnum } from "~/web.config";
import { flatten } from "flat";
import RequestOverviewEmbed from "~/embed/RequestOverview";
import Tabs from "~/components/Tabs";
import RequestsSelectorCard from "~/embed/RequestsSelectorCard";
import RequestsTableEmbed from "~/embed/RequestsTable";
import UsersTableEmbed from "~/embed/UsersTable";

export const meta: MetaFunction = () => {
  return [{ title: string("meta.title.requests") }];
};

export default function Requests() {
  const [modalOverviewData, setModalOverviewData] = useState<any | undefined>();
  const [modelSummary, setModelSummary] = useState<boolean>(false);
  const [summaryRequest, setSummaryRequest] = useState<{[key: string]: any}>({});
  
  useEffect(() => {
    fether();
  }, []);

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetSummaryRequests)).then(
        (res) => {
          setSummaryRequest(res.data.value);
        }
      );
    });
  }, []);

  return (
    <DashboardLayout
      subTitle={string("dashboard.subtitle.asnRecords")}
      currentLeftActiveBarItem={LeftActiveBarItem.ASN_RECORDS}
    >
      {modalOverviewData && (
        <Modal
          isBigModal
          isNoPadding
          onClose={() => setModalOverviewData(undefined)}
          title="Overview request"
        >
          <RequestOverviewEmbed requestBody={modalOverviewData} />
        </Modal>
      )}

      {modelSummary && (
        <Modal
          isNoPadding
          onClose={() => setModelSummary(false)}
          title="Summary request"
        >
          <div className="w-full overflow-hidden">
            <Table
              //@ts-ignore
              data={_.toPairs(flatten(summaryRequest)) as any[]}
              headers={["Key", "Value"]}
            />
          </div>
        </Modal>
      )}

      <SubNavbar
        createActionLabel="Show summary"
        onCreateAction={() => setModelSummary(true)}
        createActionIcon={<></>}
        title={string("dashboard.subtitle.asnRecords")}
      />

      <Tabs isDisableBorders isDisablePaddings titles={["Overview", "Ads Campaigns", "Users segments", "Flow"]}>
        <div>
          {/* {summaryRequest && data && (
          <div className="bg-white grid grid-cols-1 lg:grid-cols-5 gap-2 border-b border-gray-200 p-2">
            <div className="h-26">
              {summaryRequest?.requests_per_day && (
                <Sparklines
                  data={_.orderBy(
                    _.take(_.toPairs(summaryRequest.requests_per_day), 5),
                    0,
                    "asc"
                  ).map((i) => i[1])}
                >
                  <SparklinesLine color="green" />
                  <SparklinesReferenceLine type="mean" />
                  <SparklinesNormalBand />
                </Sparklines>
              )}

              <p className="text-black mt-2 text-xs font-medium">
                Requests per day
              </p>
            </div>

            <div className="h-26 flex flex-col">
              <div className="flex flex-row h-full gap-2">
                <div className="bg-gradient-to-r w-full from-gray-100 to-gray-200 h-full rounded-lg flex flex-row gap-2 items-center justify-center">
                  <span className="text-gray-400 font-black text-3xl">
                    {summaryRequest.ua_bots.is_bot}
                  </span>
                </div>

                <div className="bg-gradient-to-r from-lime-300 to-lime-400 w-full h-full rounded-lg flex flex-row gap-2 items-center justify-center">
                  <span className="text-white font-black text-3xl">
                    {summaryRequest.ua_bots.is_not_bot}
                  </span>
                </div>
              </div>

              <p className="text-black mt-2 text-xs font-medium">
                Bot traffic (UserAgent Detect)
              </p>
            </div>
          </div>
        )} */}

        <RequestsTableEmbed onSelectedItem={(index, item) => {
          setModalOverviewData(item);
        }}/>

        </div>

        <Tabs isDisablePaddings isDisableBorders titles={["By source", "By campaign", "By term", "By medium"]}>
          <RequestsSelectorCard key="utm_source" title="By source" selector="utm_source"/>
          <RequestsSelectorCard key="utm_campaign" title="By campaign" selector="utm_campaign"/>
          <RequestsSelectorCard key="utm_term" title="By term" selector="utm_term"/>
          <RequestsSelectorCard key="utm_medium" title="By medium" selector="utm_medium"/>
        </Tabs>

        <UsersTableEmbed/>
      </Tabs>
    </DashboardLayout>
  );
}
