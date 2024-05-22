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
    { title: string("meta.title.filters") }
  ];
};


export default function Filters() {
  const REPLACATE_FILTER = {name: "", value:"", operator: "==", plugin: "", resourceId: ""}

  const [data, setData] = useState<any[]|undefined>(undefined);
  const [resources, setResources] = useState<any[]|undefined>(undefined);


  const [plugins] = useState([
    { name: "IP", value: "ip" },
    { name: "ASN Owner", value: "asn::owner" }
  ]);
  const [operators] = useState([
    { name: "==", value: "==" }
  ])

  const [modelFilterName, setModelFilterName] = useState<string|undefined>();
  const [modelFilterId, setModelFilterId] = useState<string|undefined>();

  const [modelFilters, setModelFilters] = useState<any[]|undefined>([
    REPLACATE_FILTER
  ]);

  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);

  useEffect(() => {
    fether()
  }, [])

  useEffect(() => {
    fetherResources()
  }, [isModalCreateVisible])

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then(i => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Filters)).then(res => {
        setData(res.data.value)
      })
    })
  }, [])

  const fetherResources = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then(i => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Resources)).then(res => {
        setResources(res.data.value)
      })
    })
  }, [])

  const onCreateFilter = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then(i => {
      let data = new FormData();

      data.append("name", modelFilterName!!);
      data.append("filter_id", modelFilterId!!);
      
      modelFilters?.forEach((filter, index) => {
        data.append(`conditions[${index}][name]`, filter.name);
        data.append(`conditions[${index}][value]`, filter.value);
        data.append(`conditions[${index}][operator]`, filter.operator);
        data.append(`conditions[${index}][plugin]`, filter.plugin);
        data.append(`conditions[${index}][resource_id]`, filter.resourceId);
      })

      i.post(webConfig.apiEndpointFactory(ApiPathEnum.CreateFilters), data).then(res => {
        if (res.status == 201) {
          fether()
          setIsModalCreateVisible(false)
          setModelFilters([REPLACATE_FILTER])
          setModelFilterId(undefined)
          setModelFilterName(undefined)
        }
      })
    })
  }, [modelFilterId, modelFilterName, modelFilters]);

  return (
    <DashboardLayout
      subTitle={string("dashboard.subtitle.filters")}
      currentLeftActiveBarItem={LeftActiveBarItem.FILTERS}
    >

      { isModalCreateVisible && <Modal isBigModal title="Filters" onClose={() => setIsModalCreateVisible(false)}>
        <div className="flex flex-row w-full h-full divide-x divide-gray-100">
          <div className="space-y-4 px-2 w-full h-full">
            <Input label="Filter ID" value={modelFilterId} onChangeValue={setModelFilterId}/>
            <Input label="Filter name" value={modelFilterName} onChangeValue={setModelFilterName}/>  

            <Button onPress={() => onCreateFilter()}>Create</Button>
          </div>

          <div className="divide-y divide-gray-200 px-2 w-full h-full">
            {
              modelFilters?.map((filter, index) => (
                <div className="space-y-2 py-4 relative">
                  <svg onClick={() => { 
                    if (modelFilters.length > 1) {
                      const from = _.clone(modelFilters)
                      delete from[index]
                      setModelFilters(from) 
                    } else {
                      setModelFilters([REPLACATE_FILTER])
                    }
                  }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:text-red-800 hover:bg-red-100 cursor-pointer p-1 text-red-500 absolute top-2 right-0">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>


                  <Input label="Filter name" value={filter?.name} onChangeValue={(it) => {
                    const from = _.clone(modelFilters)
                    from[index].name = it
                    setModelFilters(from)
                  }}/>
                  
                  <div className="flex flex-row space-x-2 w-full">
                    <Select label="Plugin" values={plugins} value={filter?.plugin} onChangeValue={(it) => {
                    const from = _.clone(modelFilters)
                    from[index].plugin = it
                    setModelFilters(from)
                  }}/>  
                    <Select label="Operator" values={operators} value={filter?.operator} onChangeValue={(it) => {
                    const from = _.clone(modelFilters)
                    from[index].operator = it
                    setModelFilters(from)
                  }}/>  
                    <Input label="Filter value" className="w-full"  value={filter?.value} onChangeValue={(it) => {
                    const from = _.clone(modelFilters)
                    from[index].value = it
                    setModelFilters(from)
                  }}/>
                  </div>

                  <Select label="To this resource" values={resources?.map((it) => ({name: it?.resource_id, value: it?.resource_id}))}  value={filter?.resourceId} onChangeValue={(it) => {
                    const from = _.clone(modelFilters)
                    from[index].resourceId = it
                    setModelFilters(from)
                  }}/>
                </div>
              ))
            }

            <Button onPress={() => {
              setModelFilters([...modelFilters!!, REPLACATE_FILTER])
            }}>
              Add filter
            </Button>
          </div>
        </div>
      </Modal> }

      <SubNavbar
        title={string("dashboard.subtitle.filters")} 
        onCreateAction={() => setIsModalCreateVisible(true)}/>

      <Table headers={["Name", "Filter ID", "Conditions count"]} data={
        data?.map(it => {
          return {...it, conditions: it.conditions.length}
        })
      } />

    </DashboardLayout>
  );
}
