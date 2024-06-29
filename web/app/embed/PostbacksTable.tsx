import humanizeString from "humanize-string";
import _ from "lodash";
import { useState, useEffect, useCallback, useMemo } from "react";
import Table from "~/components/Table";
import webConfig, { ApiPathEnum } from "~/web.config";

interface Props {}

export default function PostbackTableEmbed({}: Props) {
  const [data, setData] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    fether();
  }, []);

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllPostbacks)).then(
        (res) => {
          if (_.isArray(res.data.value)) {
            setData(res.data.value);
          }
        }
      );
    });
  }, []);

  const tableHeaders = useMemo(() => {
    return (
      data &&
      (!_.isEmpty(data)
        ? _.keys(_.first(data)).map((i) => humanizeString(i))
        : [])
    );
  }, [data]);

  return (
    <div>
      <div className="w-full flex flex-col justify-center items-start px-4 pt-2 pb-2.5 bg-white border-b border-b-gray-200">
        <h2 className="text-sm font-bold">
          How to send postbacks{" "}
          <span className="text-gray-400">(webhooks)</span>?
        </h2>
        <p className="text-xs font-normal text-gray-500">
          Sending postbacks is very easy. Set up a posbek link in your affiliate
          program as follows:
        </p>

        {typeof window !== "undefined" && (
          <p className="text-xs font-normal text-blue-500 block mt-2">
            {window.location.protocol}//{window.location.hostname}
            /service/postback?
            {`uuid={uuid}&date={date}&status={status}&ip={ip}&amount={amount}&stream={stream}&currency={currency}&time={time}`}
          </p>
        )}
      </div>

      <Table headers={tableHeaders} data={data} />
    </div>
  );
}
