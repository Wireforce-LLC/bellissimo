import Table2 from "~/components/Table2";
import _ from "lodash";
import classNames from "classnames";
import humanizeString from "humanize-string";
import moment, { Moment } from "moment";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Props {
  readonly onSelectedItem?: (index: number, item: any) => void;
  readonly date?: Moment;
  readonly country?: string;
  readonly filterKeys: string[];
  readonly skip?: number;
  readonly limit?: number;
}

const sorted = (obj: any) => _(obj).toPairs().sortBy(0).fromPairs().value();

export default function RequestsTableEmbed({
  onSelectedItem,
  date,
  country,
  filterKeys,
  skip,
  limit,
}: Props) {
  const [data, setData] = useState<any[] | undefined>(undefined);

  const tableHeaders: string[] = useMemo(() => {
    return (
      (data &&
        _.keys(_.omit(_.first(data), filterKeys)).map((key) =>
          humanizeString(key).replace("Asn", "ASN")
        )) ||
      []
    );
  }, [filterKeys, data]);

  useEffect(() => {
    fether();
  }, []);

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllASNRecords), {
        params: {
          filter_country: country,
          filter_specific_date: date?.format("ddd, DD MMM YYYY HH:mm:ss Z"),
          skip,
          limit,
        },
      }).then((res) => {
        if (_.isArray(res.data.value)) {
          const value = _.toArray(res.data.value);

          setData(value);
        }
      });
    });
  }, [country, date, skip, limit]);

  useEffect(() => {
    fether();
  }, [country, date, skip, limit]);

  const fullData = useMemo(() => data!!, [data]);

  return (
    <Table2
      onSelectedItem={onSelectedItem}
      rowClassName="text-xs font-normal py-[4px] px-3 text-ellipsis whitespace-nowrap"
      headerTransformer={{
        any(value: string) {
          return humanizeString(value);
        },
        asn_country_code: () => "Country",
        resource_id: () => "Resource",
        ip: () => "IP",
      }}
      additionalColumns={{
        ip(data, row) {
          return _.get(row, "headers.cf-connecting-ip", "N/A");
        },
      }}
      valueTransformer={{
        asn_country_code(value: any) {
          return (
            <span className="flex flex-row items-center gap-2">
              <img
                className="h-3 w-4 rounded-[4px] bg-zinc-200 object-cover"
                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${value}.svg`}
                alt=""
              />
              <span>{value}</span>
            </span>
          );
        },
        route_way(value: any) {
          let route =
            value &&
            _.get(
              Object.values(value).find((it: any) => it.use_this_way),
              "name",
              "N/A"
            );

          if (route == "default") {
            return (
              <span className="font-mono text-[10px] bg-zinc-200">{route}</span>
            );
          }

          return <span className="font-mono text-[10px]">{route}</span>;
        },
        resource_id(value: any) {
          return <span className="font-mono text-[10px]">{value}</span>;
        },
        route_name(value: string) {
          return (
            <span className="flex flex-row items-center gap-1">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="1em"
                width="1em"
              >
                <path d="M13.061 4.939l-2.122 2.122L15.879 12l-4.94 4.939 2.122 2.122L20.121 12z" />
                <path d="M6.061 19.061L13.121 12l-7.06-7.061-2.122 2.122L8.879 12l-4.94 4.939z" />
              </svg>
              {value}
            </span>
          );
        },
        headers(value: any[]) {
          return (
            <span className="flex flex-row items-center gap-1">
              <span className="font-normal">{_.size(value)}</span>
              <span className="font-light text-gray-400">HIR</span>
            </span>
          );
        },
        request_id(value: string) {
          return <span className="text-zinc-400">{value}</span>;
        },
        query(query: any) {
          return query ? (
            _.size(query) > 5 ? (
              <span>
                <span className="text-zinc-600 italic">
                  {_.keys(query).sort().splice(0, 3).join(", ")}
                </span>{" "}
                <span className="text-zinc-400">
                  and {" " + (_.size(query) - 3 + " keys")}
                </span>
              </span>
            ) : (
              <span className="italic">{_.keys(query).sort().join(", ")}</span>
            )
          ) : (
            "No"
          );
        },
        time(value: number) {
          return (
            <div className="flex flex-row items-center gap-1">
              <svg
                viewBox="0 0 920 1000"
                fill="currentColor"
                height="1em"
                width="1em"
                className="size-3 text-zinc-400"
              >
                <path d="M460 40c126.667 0 235 45 325 135s135 198.333 135 325-45 235-135 325-198.333 135-325 135-235-45-325-135S0 626.667 0 500s45-235 135-325S333.333 40 460 40m0 820c100 0 185-35.333 255-106s105-155.333 105-254c0-100-35-185-105-255S560 140 460 140c-98.667 0-183.333 35-254 105S100 400 100 500c0 98.667 35.333 183.333 106 254s155.333 106 254 106m36-620v244l150 150-50 50-170-170V240h70" />
              </svg>
              <span
                className={classNames("text-zinc-400", {
                  "text-zinc-800":
                    moment(value / 1000).diff(moment(), "d") == 0,
                })}
              >
                {moment(value / 1000).format("DD.MM.YYYY HH:mm")}
              </span>
            </div>
          );
        },
      }}
      sortColumns={["time", "asn_country_code", "resource_id"]}
      hiddenColumns={filterKeys}
      dataset={fullData}
    />
  );
}
