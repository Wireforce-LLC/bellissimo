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
  onSetFilterKeys
}: Props) {
  const [country, setCountry] = useState<string | undefined>();
  const [date, setDate] = useState<string | undefined>();

  const [filter, setFitler] = useState<any[]>([
    {name: "ASN Name", key: "asn_record", value: false},
    {name: "Time", key: "time", value: false},
  ]);

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

      {
        filter.map((it, index) => {
          return (
            <div key={index}>
              <button onClick={() => {
                setFitler(filter.map((thisIt, index) => {
                  if (thisIt.key == it.key) {
                    return {...thisIt, value:!thisIt.value};
                  } else {
                    return thisIt;
                  }
                }));
              }} className={classNames("px-2 py-1 text-xs", {
                "bg-zinc-100": !it.value,
                "bg-lime-100 text-lime-900 font-medium": it.value,
              })}>
                {it.name}
              </button>
            </div>
          );
        }) 
      }
      
    </div>
  );
}
