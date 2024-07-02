import type { MetaFunction } from "@remix-run/node";
import classNames from "classnames";
import _, { functions } from "lodash";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import BigInput from "~/components/BigInput";
import Button from "~/components/Button";
import ButtonSecondary from "~/components/ButtonSecondary";
import DriverBadge from "~/components/DriverBadge";
import Input from "~/components/Input";
import Modal from "~/components/Modal";
import Select from "~/components/Select";
import SubNavbar from "~/components/SubNavbar";
import Table from "~/components/Table";
import CreateResourceEmbed from "~/embed/CreateResource";
import EditResourceEmbed from "~/embed/EditResource";
import DashboardLayout, { LeftActiveBarItem } from "~/layouts/DashboardLayout";
import string from "~/localization/polyglot";
import webConfig, { ApiPathEnum, DRIVERS } from "~/web.config";

export const meta: MetaFunction = () => {
  return [
    { title: string("meta.title.resources") },
  ];
};

function ToolIconByResourceId({ resourceId }: { resourceId: string }) {
  const tools = ["webmanifest"];

  if (_.includes(tools, resourceId)) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="size-3 text-gray-500"
      >
        <path
          fillRule="evenodd"
          d="M6.955 1.45A.5.5 0 0 1 7.452 1h1.096a.5.5 0 0 1 .497.45l.17 1.699c.484.12.94.312 1.356.562l1.321-1.081a.5.5 0 0 1 .67.033l.774.775a.5.5 0 0 1 .034.67l-1.08 1.32c.25.417.44.873.561 1.357l1.699.17a.5.5 0 0 1 .45.497v1.096a.5.5 0 0 1-.45.497l-1.699.17c-.12.484-.312.94-.562 1.356l1.082 1.322a.5.5 0 0 1-.034.67l-.774.774a.5.5 0 0 1-.67.033l-1.322-1.08c-.416.25-.872.44-1.356.561l-.17 1.699a.5.5 0 0 1-.497.45H7.452a.5.5 0 0 1-.497-.45l-.17-1.699a4.973 4.973 0 0 1-1.356-.562L4.108 13.37a.5.5 0 0 1-.67-.033l-.774-.775a.5.5 0 0 1-.034-.67l1.08-1.32a4.971 4.971 0 0 1-.561-1.357l-1.699-.17A.5.5 0 0 1 1 8.548V7.452a.5.5 0 0 1 .45-.497l1.699-.17c.12-.484.312-.94.562-1.356L2.629 4.107a.5.5 0 0 1 .034-.67l.774-.774a.5.5 0 0 1 .67-.033L5.43 3.71a4.97 4.97 0 0 1 1.356-.561l.17-1.699ZM6 8c0 .538.212 1.026.558 1.385l.057.057a2 2 0 0 0 2.828-2.828l-.058-.056A2 2 0 0 0 6 8Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  return <></>;
}

export default function Resources() {
  const [data, setData] = useState<any[] | undefined>(undefined);
  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);
  const [modalEditResourceId, setModalEditResourceId] = useState<
    string | undefined
  >();

  useEffect(() => {
    fether();
  }, []);

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Resources)).then((res) => {
        setData(res.data.value);
      });
    });
  }, []);

  return (
    <>
      {modalEditResourceId && (
        <Modal
          title="Edit resource"
          onClose={() => {
            setModalEditResourceId(undefined);
          }}
        >
          <EditResourceEmbed
            onDeletedResource={() => {
              fether();
            }}
            onEditResource={(intent) => {
              let data = new FormData();

              if (intent.content) {
                data.append("raw_data", intent.content);
              }

              if (intent.fileUri) {
                data.append("file_path", intent.fileUri);
              }

              if (intent.driver) {
                data.append("driver", intent.driver);
              }

              if (intent.resourceId) {
                data.append("resource_id", intent.resourceId);
              }

              webConfig.axiosFactory("PRIVATE").then((i) => {
                i.put(
                  webConfig.apiEndpointFactory(ApiPathEnum.Resource) +
                    "/" +
                    intent.resourceId,
                  data
                )
                  .then((res) => {
                    if (res.status == 200) {
                      fether();

                      toast.success("Resource updated");
                    } else {
                      toast.error("Resource not updated");
                    }
                  })
                  .catch(() => {
                    toast.error("Resource not updated");
                  });
              });
            }}
            resourceId={modalEditResourceId}
          />
        </Modal>
      )}
      {isModalCreateVisible && (
        <Modal
          title="Create new resource"
          onClose={() => {
            setIsModalCreateVisible(false);
          }}
        >
          <CreateResourceEmbed
            onCreateResource={(intent) => {
              let data = new FormData();

              if (intent.content) {
                data.append("raw_data", intent.content);
              }

              if (intent.fileUri) {
                data.append("file_path", intent.fileUri);
              }

              if (intent.driver) {
                data.append("driver", intent.driver);
              }

              if (intent.resourceId) {
                data.append("resource_id", intent.resourceId);
              }

              webConfig.axiosFactory("PRIVATE").then((i) => {
                i.post(
                  webConfig.apiEndpointFactory(ApiPathEnum.CreateResources),
                  data
                )
                  .then((res) => {
                    if (res.status == 201) {
                      setIsModalCreateVisible(false);
                      fether();

                      toast.success("Resource created");
                    } else {
                      toast.error("Resource not created");
                    }
                  })
                  .catch(() => {
                    toast.error("Resource not created");
                  });
              });
            }}
          />
        </Modal>
      )}

      <SubNavbar
        title={string("dashboard.subtitle.resources")}
        onCreateAction={() => setIsModalCreateVisible(true)}
      />

      <Table
        headers={["Resource ID", "Driver", "Content", "File path"]}
        data={data?.map((i: any) => ({
          ...i,
          resource_id: (
            <div className="flex flex-row items-center w-full justify-start gap-2">
              <span
                className="cursor-pointer"
                onClick={() => setModalEditResourceId(i.resource_id)}
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
              <span>{i.resource_id || "-"}</span>
              <ToolIconByResourceId resourceId={i.resource_id} />
            </div>
          ),
          file_path: i.file_path ? <div className="flex flex-row items-center justify-start gap-2">
            <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      className="size-3.5 text-gray-400 hover:text-blue-800"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={48}
        d="M200.66 352H144a96 96 0 010-192h55.41M312.59 160H368a96 96 0 010 192h-56.66"
      />
    </svg>
    <span className="text-zinc-400 underline">{i.file_path}</span></div> : undefined,
          driver: <DriverBadge driver={i.driver} />,
          raw_content: i.raw_content ? _.take(i.raw_content, 64) : undefined,
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
