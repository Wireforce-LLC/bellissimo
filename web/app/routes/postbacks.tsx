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
import humanizeString from 'humanize-string';
import List, { ListItem } from "~/components/List";
import { flatten } from 'flat'

export const meta: MetaFunction = () => {
  return [
    { title: string("meta.title.filters") }
  ];
};

const hiddenCols = ["asn_description"]

export default function Postbacks() {
  const [data, setData] = useState<any[]|undefined>(undefined);
  const [modalOverviewData, setModalOverviewData] = useState<any|undefined>();

  useEffect(() => {
    fether()
  }, []);

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then(i => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllPostbacks)).then(res => {
        setData(res.data.value)
      })
    })
  }, [])
  
  // const notFoundResources = <div className="w-full flex flex-col justify-center items-center py-8">
  //   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10 mb-4">
  //     <path fillRule="evenodd" d="M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z" clipRule="evenodd" />
  //   </svg>

  //   <h1 className="text-md font-medium text-center mb-0 p-0">{string("filters.create.resourcesNotFoundTitle")}</h1>
  //   <p className="text-xs text-center font-normal opacity-50 w-72">{string("filters.create.resourcesNotFoundDescription")}</p>
  // </div> 

  return (
    <DashboardLayout
      subTitle={string("dashboard.subtitle.postbacks")}
      currentLeftActiveBarItem={LeftActiveBarItem.POSTBACKS}
    >
      {modalOverviewData && <Modal isBigModal onClose={() => setModalOverviewData(undefined)} title="Overview request">
        <Table
          data={modalOverviewData}
          headers={["Key", "Value"]}/> 
      </Modal>}

      <SubNavbar title={string("dashboard.subtitle.postbacks")} />

      <Table 
        headers={
          data && (!_.isEmpty(data) ? _.keys(_.omit(_.first(data), hiddenCols)).map(i => humanizeString(i).replace("Asn", "ASN")) : [])
        } 
        data={
          data?.map((it, index) => {
            const row = {
              ...it,
    
              request_id: <span onClick={() => {
                setModalOverviewData(_.toPairs(flatten(data[index]) || {}))
              }} className="text-gray-400 hover:underline">{it.request_id}</span>,
              time: <span className="text-gray-400">{moment(it.time / 1000).format("DD.MM.YYYY HH:mm")}</span>,
              headers: '',
              asn_country_code:
                <span className="flex items-center flex-row gap-2">
                  <img
                    className="size-3"
                    alt="United States"
                    src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${it?.asn_country_code?.toUpperCase()}.svg`}/>
    
                  <span className="font-medium">{it.asn_country_code.toUpperCase()}</span>
                </span>
            }

            return _.omit(row, hiddenCols)
          })
        }
      />

    </DashboardLayout>
  );
}
