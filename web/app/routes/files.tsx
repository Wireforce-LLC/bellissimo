import type { MetaFunction } from "@remix-run/node";
import _ from "lodash";
import { useState, useEffect, useCallback } from "react";
import Modal from "~/components/Modal";
import SubNavbar from "~/components/SubNavbar";
import DashboardLayout, { LeftActiveBarItem } from "~/layouts/DashboardLayout";
import string from "~/localization/polyglot";
import webConfig, { ApiPathEnum } from "~/web.config";
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import Button from "~/components/Button";

export const meta: MetaFunction = () => {
  return [{ title: string("meta.title.files") }];
};

const hiddenCols = ["asn_description"];

export default function Files() {
  const [data, setData] = useState<any[] | undefined>(undefined);
  const [modalOverviewData, setModalOverviewData] = useState<any | undefined>();

  const [currentPwd, setCurrentPwd] = useState("/");
  const [cursorOnFile, setCursorOnFile] = useState<string|undefined>();

  useEffect(() => {
    fether();
  }, [currentPwd]);

  useEffect(() => {
    setCursorOnFile(undefined);
  }, [currentPwd]);
  
  useEffect(() => {
    setModalOverviewData("Loading... 😈");

    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetFile) + '?path=' + cursorOnFile).then(
        (res) => {
          setModalOverviewData(res.data.value);
        }
      );
    });
  }, [cursorOnFile]);

  // useEffect(() => {
  //   Prism.highlightAll()
  // }, [modalOverviewData])

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllFiles) + '?path=' + currentPwd).then(
        (res) => {
          setData(res.data.value);
        }
      );
    });
  }, [currentPwd]);

  // const notFoundResources = <div className="w-full flex flex-col justify-center items-center py-8">
  //   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10 mb-4">
  //     <path fillRule="evenodd" d="M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z" clipRule="evenodd" />
  //   </svg>

  //   <h1 className="text-md font-medium text-center mb-0 p-0">{string("filters.create.resourcesNotFoundTitle")}</h1>
  //   <p className="text-xs text-center font-normal opacity-50 w-72">{string("filters.create.resourcesNotFoundDescription")}</p>
  // </div>

  return (
    <DashboardLayout
      subTitle={string("dashboard.subtitle.files")}
      currentLeftActiveBarItem={LeftActiveBarItem.FILES}
    >
      {cursorOnFile && (
        <Modal
          isBigModal
          onClose={() => setCursorOnFile(undefined)}
          title="Overview file"
        >
          <div className="w-full overflow-hidden">
            <Editor height="70vh" defaultLanguage="html" defaultValue="// some comment" value={modalOverviewData} onChange={it => setModalOverviewData(it)} />
          </div>

          <Button onPress={() => {
            if (_.isEmpty(modalOverviewData)) {
              return
            }
            
            let data = new FormData();

            data.append("content", modalOverviewData);

            webConfig.axiosFactory("PRIVATE").then((i) => {
              i.post(
                webConfig.apiEndpointFactory(ApiPathEnum.WriteFile) + '?path=' + cursorOnFile,
                data
              ).then(
                (res) => {
                  setCursorOnFile(undefined);
                }
              );
            })
          }}>
            Save file
          </Button>
        </Modal>
      )}

      <SubNavbar title={string("dashboard.subtitle.files")} />

      <div className="w-full">
        <div className="w-full px-4 py-2 bg-gray-100 border-b border-b-gray-200 flex flex-row items-center justify-between">
          <p className="text-xs text-gray-400 font-medium">{currentPwd}</p>
        </div>
      </div>

      <div className="grid gap-2 p-2 grid-cols-6">
        {data?.map((it) => (
          <div onClick={() => {
            if (!it.is_file) {
              setCurrentPwd(it.path)
            } else {
              setCursorOnFile(it.path);
            }
          }} className="w-full cursor-pointer border flex flex-row items-center gap-2 border-gray-200 bg-white py-2 px-4">
            {!it.is_file && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path d="M3.75 3A1.75 1.75 0 0 0 2 4.75v3.26a3.235 3.235 0 0 1 1.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0 0 16.25 5h-4.836a.25.25 0 0 1-.177-.073L9.823 3.513A1.75 1.75 0 0 0 8.586 3H3.75ZM3.75 9A1.75 1.75 0 0 0 2 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0 0 18 15.25v-4.5A1.75 1.75 0 0 0 16.25 9H3.75Z" />
            </svg>}

            <span className="text-sm">{it.path}</span>
          </div>
        ))}
      </div>
      
    </DashboardLayout>
  );
}
