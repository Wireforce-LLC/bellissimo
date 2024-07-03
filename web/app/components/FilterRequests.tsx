import { useEffect, useMemo, useState } from "react";
import Select from "./Select";
import { countries } from "countries-list";
import _ from "lodash";
import Input from "./Input";
import moment, { Moment } from "moment";
import classNames from "classnames";

interface Props {
  readonly onChangeCountry: (value: string | undefined) => void;
  readonly onChangeDate: (value: Moment | undefined) => void;
  readonly onSetSkip: (value: number) => void;
  readonly onSetLimit: (value: number) => void;
  readonly onSetFilterKeys?: (value: string[]) => void;
  readonly filterKeys: any[],
  readonly skip?: number;
  readonly limit?: number;
}

export default function FilterRequests({
  skip,
  limit,
  onSetSkip,
  onSetLimit,
  onChangeCountry,
  onChangeDate,
  onSetFilterKeys,
  filterKeys
}: Props) {
  const [country, setCountry] = useState<string | undefined>();
  const [date, setDate] = useState<string | undefined>();

  //  // "query",
  //   // "headers",
  //   "asn_description",
  //   // "request_id",
  //   "asn_number",
  //   "is_ua_bot",
  //   "asn_name",
  //   // "resource_id",
  //   "user_agent_client",

  const [filter, setFitler] = useState<any[]>(() => [
    {name: "ASN Name", key: "asn_name", value: null},
    {name: "Time", key: "time", value: null},
    {name: "GET Query", key: "query", value: null},
    {name: "Headers", key: "headers", value: null},
    {name: "User Agent", key: "user_agent_client", value: null},
    {name: "Resource ID", key: "resource_id", value: null},
    {name: "Request ID", key: "request_id", value: null},
    {name: "ASN Number", key: "asn_number", value: null},
    {name: "ASN Description", key: "asn_description", value: null},
    {name: "ASN Country Code", key: "asn_country_code", value: null},
    {name: "Is UA Bot", key: "is_ua_bot", value: null},
    {name: "Route name", key: "route_name", value: null},
    {name: "Route way", key: "route_way", value: null},
    {name: "Resource ID", key: "resource_id", value: null},
  ].map(it => {
    return {...it, value: !filterKeys.includes(it.key)};
  }));

  useEffect(() => {
    onSetFilterKeys?.(filter.filter(it => !it.value).map(it => it.key));
  }, [filter])

  const countriesList = useMemo(() => {
    const list = _.toPairs(countries).map((item) => {
      return {
        value: item[0],
        name: item[1].name + " (" + item[0] + ")",
      };
    });

    return _.orderBy(list, ["name"], ["asc"]);
  }, []);

  return (
    <div className="sticky top-2 space-y-4">
      <Select
        label="Country"
        value={country}
        onChangeValue={(it) => {
          setCountry(it);
          onChangeCountry(it);
        }}
        values={countriesList}
      />

      <Input
        label="Date"
        type="date"
        onChangeValue={(it) => {
          setDate(it);
          onChangeDate(moment(it).isValid() ? moment(it) : undefined);
        }}
        value={date}
      />

      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Skip"
          placeholder="0"
          type="number"
          value={String(skip || 0)}
          onChangeValue={(it) => {
            onSetSkip?.(parseInt(it || "0"));
          }}
        />

        <Input
          label="Limit"
          placeholder="0"
          type="number"
          value={String(limit || 0)}
          onChangeValue={(it) => {
            const val = parseInt(it || "0");

            if (val <= 500) {
              onSetLimit?.(val);
            } else {
              onSetLimit?.(500);
            }
          }}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
      {
        filter.map((it, index) => {
          return (
           
            <button key={index} onClick={() => {
              setFitler(filter.map((thisIt, index) => {
                if (thisIt.key == it.key) {
                  return {...thisIt, value:!thisIt.value};
                } else {
                  return thisIt;
                }
              }));
            }} className={classNames("px-2 py-1 text-xs w-full", {
              "bg-zinc-100": !it.value,
              "bg-lime-100 text-lime-900 font-medium": it.value,
            })}>
              {it.name}
            </button>
          );
        }) 
      }
      </div>
      
    </div>
  );
}
