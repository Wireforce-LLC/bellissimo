import humanizeString from "humanize-string";
import _, { filter } from "lodash";
import moment from "moment";
import { useState, useMemo, useCallback, useEffect } from "react";
import FirstRecordPlease from "~/components/FirstRecordPlease";
import Table from "~/components/Table";
import webConfig, { ApiPathEnum } from "~/web.config";
import serverImage from "/server.png";
import Modal from "~/components/Modal";
import Label from "~/components/Label";
import classNames from "classnames";

interface Props {
  readonly onSelectedItem?: (index: number, item: any) => void;
}

const sorted = (obj: any) => _(obj).toPairs().sortBy(0).fromPairs().value();

export default function RequestsTableEmbed({ onSelectedItem }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [isShowFilterModal, setIsShowFilterModal] = useState<boolean>(false);

  const [filterKeys, setFilterKeys] = useState<string[]>([
    "query",
    "headers",
    "asn_description",
    "asn_number",
    "is_ua_bot",
    "asn_name",
    "route_way",
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
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllASNRecords)).then(
        (res) => {
          if (_.isArray(res.data.value)) {
            const value = _.toArray(res.data.value);

            setData(value);
          }
        }
      );
    });
  }, []);

  if (_.isArray(data) && _.isEmpty(data)) {
    return (
      <FirstRecordPlease
        title="Received requests"
        text="When any router receives any request, you will see it here"
        isVisible={_.isEmpty(data) && _.isArray(data)}
        icon={<img className="h-20" src={serverImage} alt="Server image" />}
      />
    );
  }

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
    <div>
      {isShowFilterModal && editSortedModalContent}

      <div className="border-b border border-gray-200 p-1.5 ">
        <button
          onClick={() => setIsShowFilterModal(true)}
          className="p-2 bg-gray-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4 fill-gray-500"
          >
            <path d="M14 2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2.172a2 2 0 0 0 .586 1.414l2.828 2.828A2 2 0 0 1 6 9.828v4.363a.5.5 0 0 0 .724.447l2.17-1.085A2 2 0 0 0 10 11.763V9.829a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 0 14 4.172V2Z" />
          </svg>
        </button>
      </div>

      <Table
        headers={tableHeaders}
        onSelectedItem={(index, item) => {
          onSelectedItem?.(index, sorted(data[index]));
        }}
        data={data?.map((it, index) => {
          const row = {
            ...it,

            time: (
              <span className="text-gray-400">
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
            route_way: it.route_way ? "Existing" : "Unknown",
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
  );
}
