import type { MetaFunction } from "@remix-run/node";
import _ from "lodash";
import moment from "moment";
import { useState, useEffect, useCallback } from "react";
import Modal from "~/components/Modal";
import SubNavbar from "~/components/SubNavbar";
import Table from "~/components/Table";
import DashboardLayout, { LeftActiveBarItem } from "~/layouts/DashboardLayout";
import string from "~/localization/polyglot";
import webConfig, { ApiPathEnum } from "~/web.config";
import humanizeString from "humanize-string";
import { flatten } from "flat";
import FirstRecordPlease from "~/components/FirstRecordPlease";
import serverImage from "/server.png";
import {
  Sparklines,
  SparklinesLine,
  SparklinesNormalBand,
  SparklinesReferenceLine,
} from "react-sparklines";
import RequestOverviewEmbed from "~/embed/RequestOverview";

export const meta: MetaFunction = () => {
  return [{ title: string("meta.title.filters") }];
};

const hiddenCols = ["asn_description", "asn_number", "route_way"];

export default function Requests() {
  const [data, setData] = useState<any[] | undefined>(undefined);
  const [modalOverviewData, setModalOverviewData] = useState<any | undefined>();
  const [modelSummary, setModelSummary] = useState<boolean>(false);
  const [summaryRequest, setSummaryRequest] = useState<any | undefined>();

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

      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllASNRecords)).then(
        (res) => {
          setData(res.data.value);
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
              data={_.toPairs(flatten(summaryRequest))}
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

      {summaryRequest && data && (
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
      )}

      <FirstRecordPlease
        title="Received requests"
        text="When any router receives any request, you will see it here"
        isVisible={_.isEmpty(data) && _.isArray(data)}
        icon={<img className="h-20" src={serverImage} alt="Server image" />}
      />

      <Table
        headers={
          data &&
          (!_.isEmpty(data)
            ? _.keys(_.omit(_.first(data), hiddenCols)).map((i) =>
                humanizeString(i).replace("Asn", "ASN")
              )
            : [])
        }
        data={data?.map((it, index) => {
          const row = {
            ...it,

            request_id: (
              <span
                onClick={() => {
                  setModalOverviewData(data[index]);
                }}
                className="text-gray-400 hover:underline"
              >
                {it.request_id}
              </span>
            ),
            time: (
              <span className="text-gray-400">
                {moment(it.time / 1000).format("DD.MM.YYYY HH:mm")}
              </span>
            ),
            headers: (
              <span>
                <span>{_.size(it.headers)}</span>{" "}
                <span className="text-gray-400">times</span>
              </span>
            ),
            route_way: it.route_way ? "Existing" : "Unknown",
            query: it.query ? "Yes" : "No",
            asn_country_code: it?.asn_country_code && (
              <span className="flex items-center flex-row gap-2">
                <img
                  className="size-3"
                  alt="United States"
                  src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${it?.asn_country_code?.toUpperCase()}.svg`}
                />

                <span className="font-medium">
                  {it?.asn_country_code?.toUpperCase()}
                </span>
              </span>
            ),
          };

          return _.omit(row, hiddenCols);
        })}
      />
    </DashboardLayout>
  );
}
