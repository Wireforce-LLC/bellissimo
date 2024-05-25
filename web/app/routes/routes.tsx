import type { MetaFunction } from "@remix-run/node";
import _ from "lodash";
import { useState, useEffect, useCallback } from "react";
import Button from "~/components/Button";
import ErrorString from "~/components/ErrorString";
import Input from "~/components/Input";
import Modal from "~/components/Modal";
import Select from "~/components/Select";
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

  useEffect(() => {
    if (filters && resources) {
      setModelFilterId(filters[0].value)
      setModelResourceId(resources[0].value)
    }
  }, [filters, resources])

  const onCreateResource = useCallback(() => {
    if (!modelPath?.startsWith("/")) {
      return 
    }

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

  const notFoundResources = <div className="w-full flex flex-col justify-center items-center py-8">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10 mb-4">
      <path fillRule="evenodd" d="M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z" clipRule="evenodd" />
    </svg>

    <h1 className="text-md font-medium text-center mb-0 p-0">{string("routes.create.resourcesNotFoundTitle")}</h1>
    <p className="text-xs text-center font-normal opacity-50">{string("routes.create.resourcesNotFoundDescription")}</p>
  </div> 

  const notFoundFilters = <div className="w-full flex flex-col justify-center items-center py-8">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10 mb-4">
      <path fillRule="evenodd" d="M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z" clipRule="evenodd" />
    </svg>

    <h1 className="text-md font-medium text-center mb-0 p-0">{string("routes.create.filtersNotFoundTitle")}</h1>
    <p className="text-xs text-center font-normal opacity-50">{string("routes.create.filtersNotFoundDescription")}</p>
  </div> 

  const notFoundAnything = <div className="w-full flex flex-col justify-center items-center py-8">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10 mb-4">
      <path fillRule="evenodd" d="M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z" clipRule="evenodd" />
    </svg>

    <h1 className="text-md font-medium text-center mb-0 p-0">{string("routes.create.anyNotFoundTitle")}</h1>
    <p className="text-xs text-center font-normal opacity-50">{string("routes.create.anyNotFoundDescription")}</p>
  </div> 


  return (
    <DashboardLayout
      subTitle={string("dashboard.subtitle.routes")}
      currentLeftActiveBarItem={LeftActiveBarItem.ROUTES}
    >
      { isModalCreateVisible && <Modal title="Create route" onClose={() => {
        setIsModalCreateVisible(false)
      }}>

        {(_.isEmpty(filters) && !_.isEmpty(resources)) && notFoundFilters}

        {(!_.isEmpty(filters) && _.isEmpty(resources)) && notFoundResources}

        {(_.isEmpty(filters) && _.isEmpty(resources)) && notFoundAnything}

        {(!_.isEmpty(filters) && !_.isEmpty(resources)) && <div className="space-y-4">
          <Input label="Name" value={modelName} onChangeValue={setModelName}/>

          <div>
            <Input label="Path" value={modelPath} onChangeValue={setModelPath}/>

            {!modelPath?.startsWith("/") ? <div>
              <ErrorString>
                {string("routes.create.mistakeStart")}
              </ErrorString>
            </div> : <a className="text-blue-500 text-xs" href="#">
              {window?.location?.protocol}//{window?.location?.host}{modelPath}
            </a>}
          </div>

          <Select label="Resource" value={modelResourceId} values={resources} onChangeValue={setModelResourceId}/>
          <Select label="Filter" value={modelFilterId} values={filters} onChangeValue={setModelFilterId}/>

          <Button onPress={onCreateResource}>Create</Button>
        </div>}
      
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
