import classNames from "classnames";
import _ from "lodash";
import { useEffect, useState } from "react";
import webConfig, { ApiPathEnum } from "~/web.config";

interface Funnel {
  schema: string[];
  count: number;
}

interface Props {
  isHideShortSchemas?: boolean;
}

/**
 * FunnelClicksEmbed component renders a funnel chart with click data.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function FunnelClicksEmbed({ isHideShortSchemas }: Props) {
  // State to hold the click data
  const [data, setData] = useState<Funnel[] | undefined>();

  /**
   * Effect hook to fetch click data from the API.
   */
  useEffect(() => {
    // Fetch click data using the private API client
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetFunnelClicks), {
        params: {
          hide_short_schemas: isHideShortSchemas === true,
        },
      }).then((res) => {
        // If the response contains an array of click data, update the state
        if (_.isArray(res.data.value)) {
          setData(res.data.value);
        }
      });
    });
  }, []);

  /**
   * Render the funnel chart.
   *
   * @returns {JSX.Element} The rendered funnel chart.
   */
  return (
    <div className="w-full h-full">
      {
        // Render each step of the funnel chart
        _.orderBy(data, (i) => _.first(i.schema))?.map((i) => (
          <div className="flex flex-row gap-1 p-1">
            <div className="px-1 text-[10px] min-w-[20px] h-5 bg-purple-200 flex justify-center items-center flex-shrink-0">
              {i.count}
            </div>
            {i.schema.map((j, k) => (
              <div className="flex h-5 items-center flex-row w-full">
                <div
                  className={classNames(
                    // Class names for the step element
                    "flex items-center justify-start flex-row h-5 gap-1 w-full text-[10px] px-2 py-0.5 bg-indigo-" +
                      (k + 1) * 100,
                    {
                      "text-white": k >= 3,
                    }
                  )}
                  data-key={k}
                  key={j}
                >
                  {/* SVG icon representing the step */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    height="1em"
                    width="1em"
                  >
                    <path d="M10.76 8.69a.76.76 0 00-.76.76V20.9c0 .42.34.76.76.76.19 0 .35-.06.48-.16l1.91-1.55 1.66 3.62c.13.27.4.43.69.43.11 0 .22 0 .33-.08l2.76-1.28c.38-.18.56-.64.36-1.01L17.28 18l2.41-.45a.88.88 0 00.43-.26c.27-.32.23-.79-.12-1.08l-8.74-7.35-.01.01a.756.756 0 00-.49-.18M15 10V8h5v2h-5m-1.17-5.24l2.83-2.83 1.41 1.41-2.83 2.83-1.41-1.41m0-11.32l1.41-1.41 2.83 2.83-1.41 1.41-2.83-2.83M7 10H2V8h5v2" />
                  </svg>
                  <span>{j}</span>
                </div>
                {/* Separator between steps */}
                {k <= i.schema.length - 2 && (
                  <svg
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    height="1em"
                    width="1em"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 8a.5.5 0 01.5-.5h5.793L8.146 5.354a.5.5 0 11.708-.708l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L10.293 8.5H4.5A.5.5 0 014 8z"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        ))
      }
    </div>
  );
}
