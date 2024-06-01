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
  return [
    { title: string("meta.title.filters") }
  ];
};


export default function Resources() {
  const [data, setData] = useState<any[]|undefined>(undefined);

  const [typeOfContent, setTypeOfContent] = useState<number>(0);

  const [availableDrivers] = useState([
    {name: "JSON", description: "Return JSON data", value: "json"},
    {name: "HTML", description: "Render single HTML page", value: "html"},
    {name: "JavaScipt Redirect", description: "Redirect to other path with JS", value: "redirect::javascript"},
    {name: "Meta Redirect", description: "Redirect to other path with <meta>", value: "redirect::meta"},
    {name: "HTML Proxy", description: "Reverse proxy, like target site hosted in this resource", value: "proxy::html"},
  ])

  const [modelResourceId, setModelResourceId] = useState<string|undefined>();
  const [modelDriver, setModelDriver] = useState<string|undefined>(availableDrivers[0].value);
  const [modelFileUri, setModelFileUri] = useState<string|undefined>();
  const [modelContent, setModelContent] = useState<string|undefined>();

  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);

  useEffect(() => {
    fether()
  }, [])

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then(i => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Resources)).then(res => {
        setData(res.data.value)
      })
    })
  }, [])

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

    webConfig.axiosFactory("PRIVATE").then(i => {
      i.post(webConfig.apiEndpointFactory(ApiPathEnum.CreateResources), data).then(res => {
        if (res.status == 201) {
          setIsModalCreateVisible(false)
          fether()
        }
      })
    })

  }, [modelContent, modelDriver, modelFileUri, modelResourceId, typeOfContent])

  return (
    <DashboardLayout
      subTitle={string("dashboard.subtitle.resources")}
      currentLeftActiveBarItem={LeftActiveBarItem.RESOURCES}
    >
      { isModalCreateVisible && <Modal title="Create new resource" onClose={() => {
        setIsModalCreateVisible(false)
      }}>
        <div className="space-y-4 pt-2">
          <Input label="Resource ID" value={modelResourceId} onChangeValue={setModelResourceId}/>
      
          
          <div>
            <label className="text-xs text-gray-400 mb-[5px] block">
              Driver
            </label>
            
            <div className="grid grid-cols-3 gap-2">
              {availableDrivers.map(it => <div onClick={() => setModelDriver(it.value)} className={
                classNames("w-full cursor-pointer px-2 py-1 border border-gray-200", {
                  "border-blue-500 bg-blue-50": modelDriver == it.value
                })
              }>
                <h4 className="text-sm font-regular">{it.name}</h4>
                <p className="text-[10px] w-[80%] text-gray-400">{it.description}</p>
              </div>)}
            </div> 

            <span className="text-xs w-[75%] mt-2 text-gray-400 mb-[5px] block">
            The driver is the method by which the response will be displayed to the user when he visits the page with this resource.
            </span>
          </div>

          {
            typeOfContent == 0 && <Input label="Path to file in /public" value={modelFileUri} onChangeValue={setModelFileUri}/>
          }
          
          {
            typeOfContent == 1 && <BigInput label="Regular content" value={modelContent} onChangeValue={setModelContent}/>
          }

          <a className="text-blue-500 text-xs" href="#" onClick={() => setTypeOfContent(typeOfContent == 0 ? 1 : 0)}>
            Toogle content type
          </a>  

          <Button disabled={(!modelFileUri && !modelContent)} onPress={onCreateResource}>Create</Button>
        </div>
      </Modal> }

      <SubNavbar
        title={string("dashboard.subtitle.resources")} 
        onCreateAction={() => setIsModalCreateVisible(true)}/>

      <Table headers={["Resource ID", "Driver", "Content", "File path"]} data={
        data?.map((i: any) => ({
          ...i, 
          raw_content: i.raw_content ? _.take(i.raw_content, 64) : undefined
        }))
      } />

    </DashboardLayout>
  );
}
