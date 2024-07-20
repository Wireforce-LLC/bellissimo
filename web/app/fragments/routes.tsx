import CreateRouteEmbed from "~/embed/CreateRoute";
import EazyModal from "~/components/EazyModal";
import EditFilterEmbed from "~/embed/EditFilter";
import EditResourceEmbed from "~/embed/EditResource";
import Modal from "~/components/Modal";
import SubNavbar from "~/components/SubNavbar";
import Table2 from "~/components/Table2";
import ViewRouteEmbed from "~/embed/ViewRoute";
import _ from "lodash";
import humanizeString from "humanize-string";
import string from "~/localization/polyglot";
import toast from "react-hot-toast";
import webConfig, { ApiPathEnum } from "~/web.config";
import type { MetaFunction } from "@remix-run/node";
import { useCallback, useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [{ title: string("meta.title.routes") }];
};

export default function Routes() {
  const [data, setData] = useState<any[] | undefined>(undefined);
  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);

  const [host, setHost] = useState<string | undefined>();
  const [protocol, setProtocol] = useState<string | undefined>("http");

  const [isModalOverviewData, setModalOverviewData] = useState<any>();

  const [modalEditResourceId, setModalEditResourceId] = useState<
    string | undefined
  >();
  const [modalEditFilterId, setModalEditFilterId] = useState<
    string | undefined
  >();

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

  return (
    <>
      {isModalOverviewData && (
        <Modal
          isNoPadding
          isBigModal
          onClose={() => {
            setModalOverviewData(undefined);
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
          <CreateRouteEmbed
            onRouterCreated={() => {
              setIsModalCreateVisible(false);
              fether();
            }}
          />
        </Modal>
      )}

      <EazyModal
        title="Edit resource"
        isVisible={!!modalEditResourceId}
        intent={() => setModalEditResourceId(undefined)}
      >
        <EditResourceEmbed resourceId={modalEditResourceId} />
      </EazyModal>

      <EazyModal
        title="Edit filter"
        isVisible={!!modalEditFilterId}
        intent={() => setModalEditFilterId(undefined)}
      >
        <div className="w-[800px] h-[500px] flex items-center justify-center">
          <EditFilterEmbed filterId={modalEditFilterId} />
        </div>
      </EazyModal>

      <SubNavbar
        title={string("dashboard.subtitle.routes")}
        onCreateAction={() => setIsModalCreateVisible(true)}
      />

      <div className="p-2">
        <Table2
          sortColumns={["name", "path", "conditions_count"]}
          headerTransformer={{
            any(value) {
              return humanizeString(value);
            },
          }}
          valueTransformer={{
            filter_id(value, row) {
              return (
                <span className="flex flex-row gap-1.5 items-center text-zinc-700">
                  <svg
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                    height="1em"
                    width="1em"
                    className="size-3"
                  >
                    <path d="M349 838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V642H349v196zm531.1-684H143.9c-24.5 0-39.8 26.7-27.5 48l221.3 376h348.8l221.3-376c12.1-21.3-3.2-48-27.7-48z" />
                  </svg>

                  <span
                    data-filter-id={row.filter_id}
                    onClick={() => setModalEditFilterId(row.filter_id)}
                    className="text-zinc-400 hover:text-indigo-500 underline decoration-dotted font-medium"
                  >
                    {value}
                  </span>
                </span>
              );
            },

            params(params, row) {
              return (
                <span
                  className="text-zinc-400 hover:text-indigo-500 underline decoration-dotted font-medium"
                  onClick={() => setModalOverviewData(row.name)}
                >
                  {params && _.values(params).length < 5
                    ? _.keys(params).join(", ")
                    : _.values(params).length + " params"}
                </span>
              );
            },

            resource_id(value, row) {
              return (
                <span
                  className="text-zinc-400 hover:text-indigo-500 underline decoration-dotted font-medium"
                  onClick={() => setModalEditResourceId(row.resource_id)}
                >
                  {value}
                </span>
              );
            },

            path(value: any, row) {
              return (
                <span className="flex flex-row gap-1.5 items-center">
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
                      (row.domain || host).replace(" ", "") +
                      row.path
                    }
                    target="_blank"
                  >
                    {protocol +
                      "://" +
                      (row.domain || host).replace(" ", "") +
                      row.path}
                  </a>
                </span>
              );
            },
          }}
          hiddenColumns={["domain"]}
          dataset={data}
        />
      </div>
    </>
  );
}
