import type { MetaFunction } from "@remix-run/node";
import classNames from "classnames";
import humanizeString from "humanize-string";
import _ from "lodash";
import moment from "moment";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Button from "~/components/Button";
import ErrorString from "~/components/ErrorString";
import FirstRecordPlease from "~/components/FirstRecordPlease";
import Input from "~/components/Input";
import Modal from "~/components/Modal";
import Select from "~/components/Select";
import SubNavbar from "~/components/SubNavbar";
import Table from "~/components/Table";
import ViewRouteEmbed from "~/embed/ViewRoute";
import DashboardLayout, { LeftActiveBarItem } from "~/layouts/DashboardLayout";
import string from "~/localization/polyglot";
import webConfig, { ApiPathEnum } from "~/web.config";
import routerImage from "/router.png";
import BigInput from "~/components/BigInput";
import EditRouterParamsEmbed from "~/embed/EditRouterParams";
import CreateRouteEmbed from "~/embed/CreateRoute";

export const meta: MetaFunction = () => {
  return [{ title: string("meta.title.routes") }];
};


export default function Routes() {
  const [data, setData] = useState<any[] | undefined>(undefined);
  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);


  const [host, setHost] = useState<string | undefined>();
  const [protocol, setProtocol] = useState<string | undefined>("http");

  const [isModalOverviewData, setModalOverviewData] = useState<any>();

  useEffect(() => {
    setHost(window.location.hostname);
    setProtocol(window.location.protocol.replace(":", ""));
  }, []);

  useEffect(() => {
    fether();
  }, []);

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Routes)).then((res) => {
        setData(res.data.value);
      });
    });
  }, []);

 

  // useEffect(() => {
  //   if (filters && resources) {
  //     setModelFilterId(filters[0]?.value);
  //     setModelResourceId(resources[0]?.value);
  //   }
  // }, [filters, resources]);


  return (
    <>
      {isModalOverviewData && (
        <Modal
          isNoPadding
          isBigModal
          onClose={() => {
            setModalOverviewData(undefined)
            fether();
          }}
          title="Overview route"
        >
          <ViewRouteEmbed
            onDeleteRoute={(name) => {
              webConfig.axiosFactory("PRIVATE").then((axios) => {
                toast
                  .promise(
                    axios.delete(
                      webConfig.apiEndpointFactory(ApiPathEnum.Route) +
                        "/" +
                        name
                    ),
                    {
                      loading: "Deleting route...",
                      success: "Route deleted",
                      error: "Failed to delete route",
                    }
                  )
                  .then(() => {
                    fether();
                    setModalOverviewData(undefined);
                  });
              });
            }}
            routeName={isModalOverviewData}
          />
        </Modal>
      )}

      {isModalCreateVisible && (
        <Modal
          title="Create route"
          onClose={() => {
            setIsModalCreateVisible(false);
          }}
        >
          <CreateRouteEmbed onRouterCreated={() => {
            setIsModalCreateVisible(false);
            fether()
          }}/>
        </Modal>
      )}

      <SubNavbar
        title={string("dashboard.subtitle.routes")}
        onCreateAction={() => setIsModalCreateVisible(true)}
      />

      <FirstRecordPlease
        title="Create router"
        text="Create your first router to route traffic from different domains, different paths. Create and manage full-fledged routers"
        isVisible={_.isEmpty(data) && _.isArray(data)}
        icon={<img className="h-20" src={routerImage} alt="Server image" />}
      />

      <Table
        isNoEmptyState
        headers={
          data &&
          (!_.isEmpty(data)
            ? _.keys(_.first(data)).map((i) =>
                humanizeString(i).replace("Asn", "ASN")
              )
            : [])
        }
        data={data?.map((it) => ({
          ...it,
          params: it.params && _.values(it.params).length < 5 ? _.keys(it.params).join(", "):  <span className="text-zinc-500">{_.values(it.params).length + " params"}</span>,
          name: (
            <div className="flex flex-row items-center w-full justify-start gap-0.5">
              <span
                className="cursor-pointer"
                onClick={() => {
                  setModalOverviewData(it.name);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-3.5 text-gray-400 hover:text-blue-800"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>

              <span className="ml-2">{it.name || "-"}</span>
            </div>
          ),
          path: (
            <div className="flex flex-row gap-1.5 items-center">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M11 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-5M10 14L20 4M15 4h5v5" />
              </svg>

              <a
                className="hover:underline text-blue-500 hover:text-blue-700"
                href={
                  protocol +
                  "://" +
                  (it.domain || host).replace(" ", "") +
                  it.path
                }
                target="_blank"
              >
                {protocol +
                  "://" +
                  (it.domain || host).replace(" ", "") +
                  it.path}
              </a>
            </div>
          ),
        }))}
      />

      <div className="px-2.5 py-1">
        <small className="text-zinc-400 text-xs">
          In table <b>{_.size(data)}</b> records
        </small>
      </div>
    </>
  );
}
