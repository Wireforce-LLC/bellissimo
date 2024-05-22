import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import _ from "lodash";
import moment from "moment";
import { useState, useEffect, useCallback } from "react";
import BigInput from "~/components/BigInput";
import Button from "~/components/Button";
import Card from "~/components/Card";
import GrayWrapper from "~/components/GrayWrapper";
import Input from "~/components/Input";
import Label from "~/components/Label";
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

  const [modelResourceId, setModelResourceId] = useState<string|undefined>();
  const [modelDriver, setModelDriver] = useState<string|undefined>();
  const [modelFileUri, setModelFileUri] = useState<string|undefined>();
  const [modelContent, setModelContent] = useState<string|undefined>();

  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);

  const [availableDrivers] = useState([
    {name: "JSON", value: "json"},
    {name: "HTML", value: "html"},
    {name: "JavaScipt Redirect", value: "redirect::javascript"},
    {name: "Meta Redirect", value: "redirect::meta"},
    {name: "HTML Proxy", value: "proxy::html"},
  ])

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
    data.append("file_path", modelFileUri || "");
    data.append("raw_data", modelContent || "");

    webConfig.axiosFactory("PRIVATE").then(i => {
      i.post(webConfig.apiEndpointFactory(ApiPathEnum.CreateResources), data).then(res => {
        if (res.status == 201) {
          setIsModalCreateVisible(false)
          fether()
        }
      })
    })

  }, [modelContent, modelDriver, modelFileUri, modelResourceId])

  return (
    <DashboardLayout
      subTitle={string("dashboard.subtitle.resources")}
      currentLeftActiveBarItem={LeftActiveBarItem.RESOURCES}
    >
      { isModalCreateVisible && <Modal title="Resources" onClose={() => {
        setIsModalCreateVisible(false)
      }}>
        <div className="space-y-4">
          <Input label="Resource ID" value={modelResourceId} onChangeValue={setModelResourceId}/>
      
          <Select label="Driver" values={availableDrivers} value={modelDriver} onChangeValue={setModelDriver}/>
          <Input label="File URI" value={modelFileUri} onChangeValue={setModelFileUri}/>
          <BigInput label="RAW Content" value={modelContent} onChangeValue={setModelContent}/>

          <Button onPress={onCreateResource}>Create</Button>
        </div>
      </Modal> }

      <SubNavbar
        title={string("dashboard.subtitle.resources")} 
        onCreateAction={() => setIsModalCreateVisible(true)}/>

      <Table headers={["Resource ID", "Params", "Content", "File path"]} data={
        data
      } />

    </DashboardLayout>
  );
}
