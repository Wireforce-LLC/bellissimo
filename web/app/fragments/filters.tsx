import BuildFilterEmbed, { FilterRow } from "~/embed/BuildFilter";
import CreateFilterNameEmbed from "~/embed/CreateFilterName";
import EditFilterEmbed from "~/embed/EditFilter";
import FirstFilterEmbed from "~/embed/FirstFIlter";
import Modal from "~/components/Modal";
import SubNavbar from "~/components/SubNavbar";
import Table2 from "~/components/Table2";
import _ from "lodash";
import string from "~/localization/polyglot";
import webConfig, { ApiPathEnum } from "~/web.config";
import type { MetaFunction } from "@remix-run/node";
import { useCallback, useEffect, useState } from "react";

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


  return (
    <>
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
          onClose={() => {
            setEditModelFilterId(undefined)
          }}
        >
          <EditFilterEmbed
            filterId={editModelFilterId}
            onSaved={(rows:  FilterRow[], filterId?: string) => {
              setEditModelFilterId(undefined);
              fether();
            }}
          />
        </Modal>
      )}

      <SubNavbar
        title={string("dashboard.subtitle.filters")}
        onCreateAction={() => setIsModalCreateVisible(true)}
      />

      <div className="p-2">
        <Table2
          dataset={data}
          sortColumns={["name", "filter_id", "conditions_count"]}
          headerTransformer={{
            name: () => "Name",
            filter_id: () => "Filter ID",
            conditions: () => "Conditions count",
          }}
          onSelectedItem={(index, it) => setEditModelFilterId(it?.filter_id)}
          valueTransformer={{
            conditions(value: any) {
              const conditions = Object.values(value)

              return conditions.length <= 5 ?  <span className="text-zinc-700 italic">{conditions.map((it: any) => it.name).join(", ")}</span> : <span className="text-zinc-700 italic">{_.take(conditions, 5).map((it: any) => it.name).join(", ")} and {(conditions.length - 5) + " conditions"}</span>
            },

            filter_id(value, row) {
              return (
                <span className="flex flex-row gap-1.5 items-center text-zinc-700">
                  <svg
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                    height="1em"
                    width="1em"
                    className="size-3"
                  >
                    <path d="M349 838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V642H349v196zm531.1-684H143.9c-24.5 0-39.8 26.7-27.5 48l221.3 376h348.8l221.3-376c12.1-21.3-3.2-48-27.7-48z" />
                  </svg>

                  <span data-filter-id={row.filter_id} className="text-zinc-400 underline decoration-dotted font-medium">
                  {value}
                  </span>
                </span>
              );
            },
          }}
        />
      </div>
    </>
  );
}
