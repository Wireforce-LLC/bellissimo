import classNames from "classnames";
import { flatten } from "flat";
import _ from "lodash";
import { useEffect, useState } from "react";
import Table from "~/components/Table";
import Tabs from "~/components/Tabs";
import webConfig, { ApiPathEnum } from "~/web.config"; //@ts-ignore
import loadable from '@loadable/component';
const ReactJson = loadable(() => import('react-json-view'));

interface Props {
  readonly requestBody?: any;
}

export default function RequestOverviewEmbed({ requestBody }: Props) {
  const [tab, setTab] = useState(0);
  const [body] = useState(_.toPairs(flatten(requestBody) || {}));
  const [guardBody, setGuardBody] = useState<any | undefined>();

  let overview = (
    <Table
      data={body.map(([key, value]: string[]) => {
        if (key == "route_way") {
          return {
            key,
            value: "Data is corrupted",
          };
        }

        if (key == "query") {
          return {
            key,
            value: "Data is corrupted",
          };
        }

        return {
          key,
          value,
        };
      })}
      headers={["Key", "Value"]}
    />
  );

  useEffect(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(
        webConfig.apiEndpointFactory(ApiPathEnum.SelectGuard) +
          "/" +
          requestBody?.request_id
      ).then((res) => {
        setGuardBody(res.data.value);
      });
    });
  }, []);

  const isEmptyGuard = (
    <div className="flex justify-center items-center min-h-64 h-full w-full flex-col">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-12 fill-zinc-900"
      >
        <path
          fillRule="evenodd"
          d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
          clipRule="evenodd"
        />
      </svg>

      <h4 className="text-md text-center font-bold mt-4">No guard</h4>
      <p className="text-xs text-center font-normal opacity-50 w-72">
        No analysis records for this query were found in the database.
      </p>
    </div>
  );

  return (
    <div className="w-full overflow-hidden">
      <Tabs isDisableBorders isDisablePaddings titles={["Request Overview", "Guard Request", "Request as JSON"]}>
        <div>{overview}</div>
        <div>
          {
            (guardBody ? (
              <Table
                data={guardBody && _.toPairs(flatten(guardBody))}
                headers={["Key", "Value"]}
              />
            ) : (
              isEmptyGuard
            ))
          }
        </div>
        <div className="p-4">
          <ReactJson src={requestBody} />
        </div>
      </Tabs>
    </div>
  );
}
