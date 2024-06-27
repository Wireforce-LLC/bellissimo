import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import Card from "~/components/Card";
import webConfig, { ApiPathEnum } from "~/web.config";
import Table from "~/components/Table";
import humanizeString from "humanize-string";
import LoadingActivity from "~/components/LoadingActivity";

interface Props {
  readonly title: string;
  readonly selector: string;
}

interface HostCount {
  readonly host: string;
  readonly source: string;
  readonly count_request: number;
}

export default function RequestsSelectorCardEmbed({ selector, title }: Props) {
  const [data, setData] = useState<HostCount[]>([]);
  const [max, setMax] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fether = useCallback(() => {
    setIsFetching(true);
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(
        webConfig.apiEndpointFactory(ApiPathEnum.SelectorRequests) + selector
      ).then((res) => {
        if (_.hasIn(res.data.value, "selected")) {
          setData(res.data.value.selected);
          setIsFetching(false);
        }
      });
    });
  }, []);

  useEffect(() => {
    fether();
  }, []);

  if (isFetching) {
    return (
      <div className="flex justify-center items-center flex-col w-full h-full min-h-[100px]">
        <LoadingActivity text="Loading analytic statistic" />
      </div>
    );
  }

  if (Object.entries(data).length === 0) {
    return (
      <Card className="border-none">
        <div className="flex justify-center items-center flex-col w-full h-full min-h-[100px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4 fill-gray-400 mb-1"
          >
            <path d="M8 7c3.314 0 6-1.343 6-3s-2.686-3-6-3-6 1.343-6 3 2.686 3 6 3Z" />
            <path d="M8 8.5c1.84 0 3.579-.37 4.914-1.037A6.33 6.33 0 0 0 14 6.78V8c0 1.657-2.686 3-6 3S2 9.657 2 8V6.78c.346.273.72.5 1.087.683C4.42 8.131 6.16 8.5 8 8.5Z" />
            <path d="M8 12.5c1.84 0 3.579-.37 4.914-1.037.366-.183.74-.41 1.086-.684V12c0 1.657-2.686 3-6 3s-6-1.343-6-3v-1.22c.346.273.72.5 1.087.683C4.42 12.131 6.16 12.5 8 12.5Z" />
          </svg>

          <p className="text-gray-400 text-xs">No data</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-none p-0" isDisablePaddings>
      <Table
        headers={_.keys(_.first(data)).map((i) => humanizeString(i))}
        data={_.map(data, function (row) {
          return {
            ...row,
          };
        })}
      />
    </Card>
  );
}
