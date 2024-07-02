import { flatten } from "flat";
import humanizeString from "humanize-string";
import _ from "lodash";
import { useState, useEffect, useCallback, useMemo } from "react";
import BigInput from "~/components/BigInput";
import EazyModal from "~/components/EazyModal";
import Modal from "~/components/Modal";
import Table from "~/components/Table";
import webConfig, { ApiPathEnum } from "~/web.config";

interface Props {}

export default function ClicksMapTableEmbed({}: Props) {
  const [data, setData] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    fether();
  }, []);

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetMappingClicks)).then(
        (res) => {
          if (_.isArray(res.data.value)) {
            setData(res.data.value);
          }
        }
      );
    });
  }, []);

  const listData = useMemo(() => {
    return _.sortBy(
      data?.flatMap(function (i) {
        return {
          ip: i.ip,
          last_events: _.size(i.last_events) < 5 ? i.last_events.map(i => i.name).join(", ") : i.last_events.slice(0, 5).map(i => i.name).join(", ") + " and more",
          country: i.country && <span className="flex items-center justify-start gap-2">
            <span>{i.country}</span>
            <img
              className="size-3"
              alt="United States"
              src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${i?.country?.toUpperCase()}.svg`}
            />
          </span>,
        }
      }),
      ["country"],
      ["asc"]
    )
  }, [data])

  const tableHeaders = useMemo(() => {
    return (
      listData &&
      (!_.isEmpty(listData)
        ? _.keys(_.first(listData)).map((i) => humanizeString(i))
        : [])
    );
  }, [listData]);

  return (
    <Table headers={tableHeaders} data={listData} />
  );
}
