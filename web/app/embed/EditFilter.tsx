import { useCallback, useEffect, useState } from "react";
import webConfig, { ApiPathEnum } from "~/web.config";
import BuildFilterEmbed, { FilterRow } from "./BuildFilter";
import _ from "lodash";
import LoadingActivity from "~/components/LoadingActivity";

interface Props {
  readonly filterId?: string;
  readonly onEditFilter?: (filters: FilterRow[], filterId?: string) => void;
}

/**
 * Embed for editing a filter.
 * Note that this will load the filter from the server and display it on the screen.
 *
 * @param Props - Props object containing filter properties.
 *   See EditFilter for details.
 * @return { ReactElement } The embed element that will be added to the page as
 *   a child of component React
 */
export default function EditFilterEmbed({ filterId, onEditFilter }: Props) {
  const [data, setData] = useState<any[] | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);
  const [conditions, setConditions] = useState<FilterRow[]>([]);

  const fetcher = useCallback(() => {
    setIsFetching(true);

    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Filter) + "/" + filterId)
        .then((res) => {
          let conditions = _.map(res.data.value.conditions, (it) => {
            let row = {
              ...it,
              resourceId: it.resource_id,
            } as FilterRow

            return row
          });

          setData(res.data.value);
          setConditions(conditions || []);
        })
        .finally(() => {
          setIsFetching(false);
        });
    });
  }, [filterId]);

  useEffect(() => {
    fetcher();
  }, [filterId]);

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-white">
      {isFetching && <LoadingActivity text="Loading filter" />}

      {!isFetching && (
        <BuildFilterEmbed
          onSubmitLabel="Update filter"
          /**
           * @param FilterRow[]
           */
          startFilters={conditions}
          /**
           * @param submit
           * @param FilterRow
           */
          onSubmit={function (submit: FilterRow[]): void {
            onEditFilter?.(submit, filterId);
          }}
        />
      )}
    </div>
  );
}
