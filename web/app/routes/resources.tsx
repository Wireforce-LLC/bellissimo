import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import classNames from "classnames";
import _ from "lodash";
import moment from "moment";
import { useState, useEffect, useCallback } from "react";
import BigInput from "~/components/BigInput";
import Button from "~/components/Button";
import Card from "~/components/Card";
import GrayWrapper from "~/components/GrayWrapper";
import Input from "~/components/Input";
import Label from "~/components/Label";
import Link from "~/components/Link";
import LoadingActivity from "~/components/LoadingActivity";
import Modal from "~/components/Modal";
import ProgressMini from "~/components/ProgressMini";
import Select from "~/components/Select";
import SharedCardEventsGroup from "~/components/SharedCardEventsGroup";
import SubNavbar from "~/components/SubNavbar";
import Table from "~/components/Table";
import DashboardLayout, { LeftActiveBarItem } from "~/layouts/DashboardLayout";
import string from "~/localization/polyglot";
import webConfig, { ApiPathEnum } from "~/web.config";

export const meta: MetaFunction = () => {
  return [{ title: string("meta.title.filters") }];
};

const defaultDrivers = [
  { name: "JSON", description: "Return JSON data", value: "json" },
  { name: "HTML", description: "Render single HTML page", value: "html" },
  {
    name: "JavaScipt Redirect",
    description: "Redirect to other path with JS",
    value: "redirect::javascript",
  },
  {
    name: "Meta Redirect",
    description: "Redirect to other path with <meta>",
    value: "redirect::meta",
  },
  {
    name: "HTML Proxy",
    description: "Reverse proxy, like target site hosted in this resource",
    value: "proxy::html",
  },
];

export default function Resources() {
  const [data, setData] = useState<any[] | undefined>(undefined);

  const [typeOfContent, setTypeOfContent] = useState<number>(0);

  const [availableDrivers, setAvailableDrivers] = useState(defaultDrivers);

  const [modelResourceId, setModelResourceId] = useState<string | undefined>();
  const [modelDriver, setModelDriver] = useState<string | undefined>(
    availableDrivers[0].value
  );
  const [modelFileUri, setModelFileUri] = useState<string | undefined>();
  const [modelContent, setModelContent] = useState<string | undefined>();

  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);

  useEffect(() => {
    fether();

    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllResourceDrivers)).then((res) => {
        const driversList = defaultDrivers.concat(
          res.data.value.map((i: string) => {
            return {
              name: i,
              description: "Driver from other suppliers",
              value: i,
            };
          })
        );

        const uniqDriversList = _.uniqBy(driversList, "value");
        
        setAvailableDrivers(uniqDriversList);
      });
    })
  }, []);

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Resources)).then((res) => {
        setData(res.data.value);
      });
    });
  }, []);

  const onCreateResource = useCallback(() => {
    let data = new FormData();

    data.append("resource_id", modelResourceId || "");
    data.append("driver", modelDriver || "");

    if (typeOfContent == 0) {
      data.append("file_path", modelFileUri || "");
    }

    if (typeOfContent == 1) {
      data.append("raw_data", modelContent || "");
    }

    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.post(
        webConfig.apiEndpointFactory(ApiPathEnum.CreateResources),
        data
      ).then((res) => {
        if (res.status == 201) {
          setIsModalCreateVisible(false);
          fether();
        }
      });
    });
  }, [modelContent, modelDriver, modelFileUri, modelResourceId, typeOfContent]);

  return (
    <DashboardLayout
      subTitle={string("dashboard.subtitle.resources")}
      currentLeftActiveBarItem={LeftActiveBarItem.RESOURCES}
    >
      {isModalCreateVisible && (
        <Modal
          title="Create new resource"
          onClose={() => {
            setIsModalCreateVisible(false);
          }}
        >
          <div className="space-y-4 pt-2">
            <Input
              label="Resource ID"
              value={modelResourceId}
              onChangeValue={setModelResourceId}
            />

            <div>
              <label className="text-xs text-gray-400 mb-[5px] block">
                Driver
              </label>

              <div className="grid grid-cols-3 gap-2">
                {availableDrivers.map((it) => (
                  <div
                    onClick={() => setModelDriver(it.value)}
                    className={classNames(
                      "w-full cursor-pointer px-2 py-1 border border-gray-200",
                      {
                        "border-blue-500 bg-blue-50": modelDriver == it.value,
                      }
                    )}
                  >
                    <h4 className="text-sm font-regular">{it.name}</h4>
                    <p className="text-[10px] w-[80%] text-gray-400">
                      {it.description}
                    </p>
                  </div>
                ))}
              </div>

              <span className="text-xs w-[75%] mt-2 text-gray-400 mb-[5px] block">
                The driver is the method by which the response will be displayed
                to the user when he visits the page with this resource.
              </span>
            </div>

            {typeOfContent == 0 && (
              <Input
                label="Path to file in /public"
                value={modelFileUri}
                onChangeValue={setModelFileUri}
              />
            )}

            {typeOfContent == 1 && (
              <BigInput
                label="Regular content"
                value={modelContent}
                onChangeValue={setModelContent}
              />
            )}

            <a
              className="text-blue-500 text-xs"
              href="#"
              onClick={() => setTypeOfContent(typeOfContent == 0 ? 1 : 0)}
            >
              Toogle content type
            </a>

            <Button
              disabled={!modelFileUri && !modelContent}
              onPress={onCreateResource}
            >
              Create
            </Button>
          </div>
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
          driver: <>
            {!defaultDrivers?.map(i => i.value).includes(i.driver) && (
              <div className="flex flex-row items-center gap-2">
               <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  height="1em"
                  width="1em"
                >
                  <path d="M20 14v4a2 2 0 01-2 2h-4v-2a2 2 0 00-2-2 2 2 0 00-2 2v2H6a2 2 0 01-2-2v-4H2a2 2 0 01-2-2 2 2 0 012-2h2V6c0-1.1.9-2 2-2h4V2a2 2 0 012-2 2 2 0 012 2v2h4a2 2 0 012 2v4h-2a2 2 0 00-2 2 2 2 0 002 2h2z" />
                </svg>

                <span>
                  {i.driver}
                </span>
              </div>
            )}

            {i.driver == 'json' && (
              <div className="flex flex-row items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="1em"
                  width="1em"
                >
                  <path d="M5 3h2v2H5v5a2 2 0 01-2 2 2 2 0 012 2v5h2v2H5c-1.07-.27-2-.9-2-2v-4a2 2 0 00-2-2H0v-2h1a2 2 0 002-2V5a2 2 0 012-2m14 0a2 2 0 012 2v4a2 2 0 002 2h1v2h-1a2 2 0 00-2 2v4a2 2 0 01-2 2h-2v-2h2v-5a2 2 0 012-2 2 2 0 01-2-2V5h-2V3h2m-7 12a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1m-4 0a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1m8 0a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1z" />
                </svg>

                <span>
                  JSON
                </span>
              </div>
            )}

            {i.driver == 'html' && (
              <div className="flex flex-row items-center gap-2">
                 <svg
                  viewBox="0 0 384 512"
                  fill="currentColor"
                  height="1em"
                  width="1em"
                >
                  <path d="M0 32l34.9 395.8L191.5 480l157.6-52.2L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z" />
                </svg>

                <span>
                  Single HTML
                </span>
              </div>
            )}

            {i.driver == 'redirect::javascript' && (
              <div className="flex flex-row items-center gap-2">
                 <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="1em"
                  width="1em"
                >
                  <path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-1.002l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z" />
                </svg>

                <svg
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  height="1em"
                  width="1em"
                >
                  <path d="M2 2a2 2 0 00-2 2v1a2 2 0 002 2h5.5v3A1.5 1.5 0 006 11.5H.5a.5.5 0 000 1H6A1.5 1.5 0 007.5 14h1a1.5 1.5 0 001.5-1.5h5.5a.5.5 0 000-1H10A1.5 1.5 0 008.5 10V7H14a2 2 0 002-2V4a2 2 0 00-2-2H2zm.5 3a.5.5 0 110-1 .5.5 0 010 1zm2 0a.5.5 0 110-1 .5.5 0 010 1z" />
                </svg>

                <span>
                  JavaScript Redirect
                </span>
              </div>
            )}

            {i.driver == 'redirect::meta' && (
              <div className="flex flex-row items-center gap-2">
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  height="1em"
                  width="1em"
                >
                  <path
                    fill="currentColor"
                    d="M.946 0L2.23 14.4 7.992 16l5.777-1.602L15.055 0H.947zM12.26 4.71H5.502l.161 1.809H12.1l-.485 5.422-3.623 1.004-3.618-1.004-.247-2.774H5.9l.126 1.41 1.967.53.004-.001 1.968-.531.204-2.29H4.048l-.476-5.341h8.847l-.158 1.766z"
                  />
                </svg>

                <svg
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  height="1em"
                  width="1em"
                >
                  <path d="M2 2a2 2 0 00-2 2v1a2 2 0 002 2h5.5v3A1.5 1.5 0 006 11.5H.5a.5.5 0 000 1H6A1.5 1.5 0 007.5 14h1a1.5 1.5 0 001.5-1.5h5.5a.5.5 0 000-1H10A1.5 1.5 0 008.5 10V7H14a2 2 0 002-2V4a2 2 0 00-2-2H2zm.5 3a.5.5 0 110-1 .5.5 0 010 1zm2 0a.5.5 0 110-1 .5.5 0 010 1z" />
                </svg>

                <span>
                  Meta Redirect
                </span>
              </div>
            )}

            {i.driver == 'proxy::html' && (
              <div className="flex flex-row items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="1em"
                  width="1em"
                >
                  <path d="M12 0L1.605 6v12L12 24l10.395-6V6L12 0zm6 16.59c0 .705-.646 1.29-1.529 1.29-.631 0-1.351-.255-1.801-.81l-6-7.141v6.66c0 .721-.57 1.29-1.274 1.29H7.32c-.721 0-1.29-.6-1.29-1.29V7.41c0-.705.63-1.29 1.5-1.29.646 0 1.38.255 1.83.81l5.97 7.141V7.41c0-.721.6-1.29 1.29-1.29h.075c.72 0 1.29.6 1.29 1.29v9.18H18z" />
                </svg>

                <span>
                  Proxy Rewrite
                </span>
              </div>
            )}
          </>,
          raw_content: i.raw_content ? _.take(i.raw_content, 64) : undefined,
        }))}
      />
    </DashboardLayout>
  );
}
