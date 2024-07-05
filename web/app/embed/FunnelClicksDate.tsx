import _ from "lodash";
import { useEffect, useState } from "react";
import webConfig, { ApiPathEnum } from "~/web.config";
import classNames from "classnames";
import moment from "moment";

interface Props {}

interface GroupIter {
  name: string;
  count: number;
}

interface Group {
  date: string;
  counts: GroupIter[];
}

export default function FunnelClicksDate() {
  const [data, setData] = useState<Group[] | undefined>();
  const [tooltip, setTooltip] = useState<any | undefined>();

  useEffect(() => {
    // Fetch click data using the private API client
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetFunnelClicksDate)).then(
        (res) => {
          // If the response contains an array of click data, update the state
          if (_.isArray(res.data.value)) {
            setData(_.take(_.reverse(res.data.value), 6));
          }
        }
      );
    });
  }, []);

  return (
    <div className="w-full h-full space-y-4 text-xs">
      {data?.map((i) => (
        <div>
          <div className="mb-2 text-[10px]">
            {moment(i.date).format("DD.MM.YYYY")}
          </div>
          {!i.counts.length && <div className="bg-zinc-200 w-full h-5"></div>}
          <div className="w-full flex flex-row gap-1 basis-full">
            {_.orderBy(i.counts, (j) => j.name).map((j, k) => (
              <div
                onMouseEnter={() => {
                  setTooltip(j);
                }}
                onMouseLeave={() => {
                  setTooltip(undefined);
                }}
                style={{
                  width: `${(j.count / _.sumBy(i.counts, "count")) * 100}%`,
                }}
              >
                <div
                  className={classNames(
                    `w-full h-4 hover:outline outline-black outline-offset-1 cursor-pointer flex flex-row bg-orange-${
                      (k + 1) * 100
                    }`,
                    {
                      "text-white": k > 3,
                      "text-black": k < 3,
                      "outline": j.name == tooltip?.name
                    }
                  )}
                ></div>

                {(j.count / _.sumBy(i.counts, "count")) > 0.08 && (
                  <span className="cursor-pointer select-none text-zinc-400 hover:text-zinc-800 text-[8px]">
                    {j?.name}
                  </span>
                )}
                {/* <div>{j.name}</div> */}
                {/* <div>{j.count}</div> */}
              </div>
            ))}
          </div>
        </div>
      ))}

      {tooltip && <div className="w-full text-[10px] gap-1 flex flex-row border-t border-t-gray-200 py-2">
        Action <span className="text-zinc-400">{tooltip?.name}</span> has
        <span>{tooltip?.count}</span> count
      </div>}
    </div>
  );
}
