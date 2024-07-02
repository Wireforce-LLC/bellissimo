import humanizeString from "humanize-string";
import _ from "lodash";
import moment, { Moment } from "moment";
import { useState, useMemo, useCallback, useEffect } from "react";
import Table from "~/components/Table";
import webConfig, { ApiPathEnum } from "~/web.config";
import Modal from "~/components/Modal";
import Label from "~/components/Label";
import classNames from "classnames";

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
  const [data, setData] = useState<any[]|undefined>(undefined);

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
    <div className="flex flex-row">
      <div className="w-full">
        <Table
          headers={tableHeaders}
          doKey={(index, item) => {
            return fullData[index].request_id || fullData[index].time;
          }}
          onSelectedItem={(index, item) => {
            onSelectedItem?.(index, sorted(fullData[index]));
          }}
          data={data?.map((it, index) => {
            const row = {
              ...it,
              request_id: (
                <div className="flex flex-row items-start">
                  <svg
                    viewBox="0 0 21 21"
                    fill="currentColor"
                    height="1em"
                    width="1em"
                    className="size-4"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M13.5 5.5l-2 10M9.5 5.5l-2 10M6.5 8.5h9M5.5 12.5h9" />
                    </g>
                  </svg>
                  <span>{it.request_id}</span>
                </div>
              ),
              time: (
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
                        moment(it.time / 1000).diff(moment(), "d") == 0,
                    })}
                  >
                    {moment(it.time / 1000).format("DD.MM.YYYY HH:mm")}
                  </span>
                </div>
              ),
              headers: (
                <span>
                  <span>{_.size(it.headers)}</span>{" "}
                  <span className="text-gray-400">HIR</span>
                </span>
              ),
              user_agent_client: it.user_agent_client?.device?.family,
              route_way:
                it.route_way &&
                (it.route_way.find((it: any) => it.use_this_way)?.name ||
                  undefined),
              query: it.query ? (
                _.size(it.query) > 5 ? (
                  <span>
                    <span>
                      {_.keys(it.query).sort().splice(0, 3).join(", ")}
                    </span>{" "}
                    <span className="text-zinc-400">
                      and {" " + (_.size(it.query) - 3 + " keys")}
                    </span>
                  </span>
                ) : (
                  _.keys(it.query).sort().join(", ")
                )
              ) : (
                "No"
              ),

              asn_country_code: it?.asn_country_code && (
                <span className="flex items-center flex-row gap-2">
                  <img
                    className="size-3"
                    alt="United States"
                    src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${it?.asn_country_code?.toUpperCase()}.svg`}
                  />

                  <span className="font-medium">
                    {it?.asn_country_code?.toUpperCase()}
                  </span>
                </span>
              ),
            };

            return _.omit(row, filterKeys);
          })}
        />
      </div>
    </div>
  );
}
