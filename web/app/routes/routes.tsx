import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import _ from "lodash";
import moment from "moment";
import { useState, useEffect, useCallback } from "react";
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
    { title: string("meta.title.events") }
  ];
};

export default function Routes() {
  const [data, setData] = useState<any[]|undefined>(undefined);
  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);

  const [modelName, setModelName] = useState<string|undefined>();
  const [modelPath, setModelPath] = useState<string|undefined>();
  const [modelFilterId, setModelFilterId] = useState<string|undefined>();
  const [modelResourceId, setModelResourceId] = useState<string|undefined>();
  
  const [filters, setFilters] = useState<any[]|undefined>(undefined);
  const [resources, setResources] = useState<any[]|undefined>(undefined);


  useEffect(() => {
    fether()
  }, [])

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then(i => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Routes)).then(res => {
        setData(res.data.value)
      })
    })
  }, [])

  useEffect(() => {
    webConfig.axiosFactory("PRIVATE").then(i => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Filters)).then(res => {
        setFilters(res.data.value.map((i: any) => {
          return {value: i["filter_id"], name: i["name"] || i["filter_id"] || "Without Name"}
        }))
      })

      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Resources)).then(res => {
        setResources(res.data.value.map((i: any) => {
          return {value: i["resource_id"], name: `[${i["driver"] || "Without Driver"}] ` + i["resource_id"]}
        }))
      })
    })
  }, [])

  const onCreateResource = useCallback(() => {
    let data = new FormData();
    
    data.append("name", modelName!)
    data.append("path", modelPath!)
    data.append("filter_id", modelFilterId!)
    data.append("resource_id", modelResourceId!)

    webConfig.axiosFactory("PRIVATE").then(i => {
      i.post(webConfig.apiEndpointFactory(ApiPathEnum.CreateRoutes), data).then(res => {
        if (res.status == 201) {
          setIsModalCreateVisible(false)
          fether()
        }
      })
    })

  }, [modelFilterId, modelPath, modelName, modelResourceId])

  

  return (
    <DashboardLayout
      subTitle={string("dashboard.subtitle.routes")}
      currentLeftActiveBarItem={LeftActiveBarItem.ROUTES}
    >
      { isModalCreateVisible && <Modal title="Create route" onClose={() => {
        setIsModalCreateVisible(false)
      }}>
        <div className="space-y-4">
          <Input label="Name" value={modelName} onChangeValue={setModelName}/>
          <Input label="Path" value={modelPath} onChangeValue={setModelPath}/>

          <Select label="Resource" value={modelResourceId} values={resources} onChangeValue={setModelResourceId}/>
          <Select label="Filter" value={modelFilterId} values={filters} onChangeValue={setModelFilterId}/>

          <Button onPress={onCreateResource}>Create</Button>
        </div>
      </Modal> }
      
      <SubNavbar
        title={string("dashboard.subtitle.routes")}
        onCreateAction={() => setIsModalCreateVisible(true)} />

      <Table headers={["Name", "Path", "Params", "Resource", "Filter"]} data={
        data
      } />

    </DashboardLayout>
  );
}
