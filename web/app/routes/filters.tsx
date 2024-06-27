import type { MetaFunction } from "@remix-run/node";
import _ from "lodash";
import { useState, useEffect, useCallback } from "react";
import Modal from "~/components/Modal";
import SubNavbar from "~/components/SubNavbar";
import Table from "~/components/Table";
import DashboardLayout, { LeftActiveBarItem } from "~/layouts/DashboardLayout";
import string from "~/localization/polyglot";
import webConfig, { ApiPathEnum } from "~/web.config";
import CreateFilterNameEmbed from "~/embed/CreateFilterName";
import BuildFilterEmbed, { FilterRow } from "~/embed/BuildFilter";
import FirstFilterEmbed from "~/embed/FirstFIlter";
import EditFilterEmbed from "~/embed/EditFilter";

export const meta: MetaFunction = () => {
  return [{ title: string("meta.title.filters") }];
};

export default function Filters() {
  const [data, setData] = useState<any[] | undefined>(undefined);
  const [startFilters, setStartFilters] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);

  const [modelFilterName, setModelFilterName] = useState<string | undefined>();
  const [modelFilterId, setModelFilterId] = useState<string | undefined>();
  const [modelFilters, setModelFilters] = useState<any[]>([]);
  const [editModelFilterId, setEditModelFilterId] = useState<
    string | undefined
  >();

  useEffect(() => {
    fether();
  }, []);

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Filters)).then((res) => {
        setData(res.data.value);
      });
    });
  }, []);

  const onCreateFilter = useCallback(
    (filterRows: FilterRow[]) => {
      webConfig.axiosFactory("PRIVATE").then((i) => {
        let data = new FormData();

        data.append("name", modelFilterName!!);
        data.append("filter_id", modelFilterId!!);

        filterRows?.forEach((filter, index) => {
          data.append(`conditions[${index}][name]`, filter.name!!);
          data.append(`conditions[${index}][value]`, filter.value!!);
          data.append(`conditions[${index}][operator]`, filter.operator!!);
          data.append(`conditions[${index}][plugin]`, filter.plugin!!);
          data.append(`conditions[${index}][resource_id]`, filter.resourceId!!);
        });

        i.post(webConfig.apiEndpointFactory(ApiPathEnum.CreateFilters), data)
          .then((res) => {
            if (res.status == 201) {
              fether();
              setIsModalCreateVisible(false);
              setModelFilterName(undefined);
              setModelFilterId(undefined);
              setModelFilters([]);
            } else {
              alert(res.data.error);
            }
          })
          .catch((err) => {
            if (err.response.data && err.response.data.error) {
              alert(err.response.data.error);
            }
          });
      });
    },
    [modelFilters, modelFilterName, modelFilterId]
  );

  const onEditFilter = useCallback(
    (filterRows: FilterRow[], filterId?: string) => {
      if (filterId == undefined) {
        return;
      }

      webConfig.axiosFactory("PRIVATE").then((i) => {
        let data = new FormData();

        data.append("name", "any name");
        data.append("filter_id", filterId);

        filterRows?.forEach((filter, index) => {
          data.append(`conditions[${index}][name]`, filter.name!!);
          data.append(`conditions[${index}][value]`, filter.value!!);
          data.append(`conditions[${index}][operator]`, filter.operator!!);
          data.append(`conditions[${index}][plugin]`, filter.plugin!!);
          data.append(`conditions[${index}][resource_id]`, filter.resourceId!!);
        });

        i.put(webConfig.apiEndpointFactory(ApiPathEnum.UpdateFilter), data);
      });
    },
    []
  );

  return (
    <DashboardLayout
      subTitle={string("dashboard.subtitle.filters")}
      currentLeftActiveBarItem={LeftActiveBarItem.FILTERS}
    >
      {isModalCreateVisible && (
        <Modal
          isBigModal
          title={
            !modelFilterName
              ? "Create new filter"
              : "Edit new filter " + modelFilterName
          }
          onClose={() => setIsModalCreateVisible(false)}
        >
          <div className="relative h-full w-full">
            {step == 0 && (
              <CreateFilterNameEmbed
                onSubmit={(it) => {
                  setModelFilterName(it.filterName);
                  setModelFilterId(it.filterId);

                  setStep(1);
                }}
              />
            )}

            {step == 1 && (
              <div>
                <FirstFilterEmbed
                  onSubmit={(filter) => {
                    setStep(2);
                    setStartFilters(filter);
                  }}
                />
              </div>
            )}

            {step == 2 && (
              <BuildFilterEmbed
                startFilters={startFilters}
                onSubmit={onCreateFilter}
              />
            )}
          </div>
        </Modal>
      )}

      {editModelFilterId && (
        <Modal
          isBigModal
          title={"Edit filter " + editModelFilterId}
          onClose={() => setEditModelFilterId(undefined)}
        >
          <EditFilterEmbed
            filterId={editModelFilterId}
            onEditFilter={onEditFilter}
          />
        </Modal>
      )}

      <SubNavbar
        title={string("dashboard.subtitle.filters")}
        onCreateAction={() => setIsModalCreateVisible(true)}
      />

      <Table
        headers={["Name", "Filter ID", "Conditions count"]}
        data={data?.map((it) => {
          return {
            ...it,
            name: (
              <div className="flex flex-row items-center w-full justify-start gap-2">
                <span
                  className="cursor-pointer"
                  onClick={() => setEditModelFilterId(it.filter_id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-4 text-gray-400 hover:text-gray-700 hover:bg-gray-200 p-0.5 rounded"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span>{it.name || "-"}</span>
              </div>
            ),
            conditions: it.conditions.length,
          };
        })}
      />
    </DashboardLayout>
  );
}
