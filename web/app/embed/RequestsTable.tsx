import humanizeString from "humanize-string";
import _, { filter } from "lodash";
import moment, { Moment } from "moment";
import { useState, useMemo, useCallback, useEffect } from "react";
import FirstRecordPlease from "~/components/FirstRecordPlease";
import Table from "~/components/Table";
import webConfig, { ApiPathEnum } from "~/web.config";
import serverImage from "/server.png";
import Modal from "~/components/Modal";
import Label from "~/components/Label";
import classNames from "classnames";
import Select from "~/components/Select";
import FilterRequests from "~/components/FilterRequests";

interface Props {
  readonly onSelectedItem?: (index: number, item: any) => void;
}

const sorted = (obj: any) => _(obj).toPairs().sortBy(0).fromPairs().value();

export default function RequestsTableEmbed({ onSelectedItem }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [isShowFilterModal, setIsShowFilterModal] = useState<boolean>(false);
  const [country, setCountry] = useState<string | undefined>();
  const [date, setDate] = useState<Moment | undefined>();

  const [filterKeys, setFilterKeys] = useState<string[]>([
    "query",
    "headers",
    "asn_description",
    "request_id",
    "asn_number",
    "is_ua_bot",
    "asn_name",
    "resource_id",
    "user_agent_client",
  ]);

  const allFilterKeys: string[] = useMemo(() => {
    return _.keys(_.first(data));
  }, [data]);

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
        },
      }).then(
        (res) => {
          if (_.isArray(res.data.value)) {
            const value = _.toArray(res.data.value);

            setData(value);
          }
        }
      );
    });
  }, [country, date]);

  useEffect(() => {
    fether();
  }, [country, date]);


  const editSortedModalContent = (
    <Modal onClose={() => setIsShowFilterModal(false)} title="Sort and filter">
      {_.toPairs(allFilterKeys).map((i) => {
        return (
          <div
            className="select-none flex py-1 flex-row items-center justify-start gap-2 cursor-pointer"
            onClick={() => {
              if (filterKeys.includes(i[1])) {
                setFilterKeys(filterKeys.filter((x) => x !== i[1]));
              } else {
                setFilterKeys([...filterKeys, i[1]]);
              }
            }}
          >
            <div
              className={classNames({
                "h-2 w-2 rounded-full bg-green-500": !filterKeys.includes(i[1]),
                "h-2 w-2 rounded-full bg-red-500": filterKeys.includes(i[1]),
              })}
            ></div>

            <Label>{i[1]}</Label>
          </div>
        );
      })}
    </Modal>
  );

  return (
    <div className="flex flex-row">
      <div className="w-full">
        {isShowFilterModal && editSortedModalContent}

        <Table
          headers={tableHeaders}
          onSelectedItem={(index, item) => {
            onSelectedItem?.(index, sorted(data[index]));
          }}
          data={data?.map((it, index) => {
            const row = {
              ...it,
              time: (
                <span
                  className={classNames("text-zinc-400", {
                    "text-zinc-800":
                      moment(it.time / 1000).diff(moment(), "d") == 0,
                  })}
                >
                  {moment(it.time / 1000).format("DD.MM.YYYY HH:mm")}
                </span>
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
              query: it.query ? "Yes" : "No",
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

      <div className="w-[200px] p-3 flex-shrink-0 border-l border-l-gray-200">
      {/* onClick={() => setIsShowFilterModal(true)} */}
        <FilterRequests 
          onChangeDate={setDate}
          onChangeCountry={setCountry}
          onFilterColumnIntent={() => setIsShowFilterModal(true)} />
      </div>
    </div>
  );
}
