import BuildFilterEmbed, { FilterRow } from "./BuildFilter";
import LoadingActivity from "~/components/LoadingActivity";
import _ from "lodash";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useCallback, useEffect, useState } from "react";

interface Props {
  readonly filterId?: string;
  readonly onSaved?: (filters: FilterRow[], filterId?: string) => any;
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
export default function EditFilterEmbed({ filterId, onSaved }: Props) {
  const [data, setData] = useState<any[] | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);
  const [conditions, setConditions] = useState<FilterRow[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [errorString, setErrorString] = useState<string|undefined>();

  const onEditFilter = useCallback(
    (filterRows: FilterRow[], filterId?: string) => {
      return new Promise((resolve, reject) => {
        if (filterId == undefined) {
          reject("Filter id is required");
          return;
        }

        webConfig.axiosFactory("PRIVATE").then((i) => {
          let data = new FormData();

          data.append("name", "any name");
          data.append("filter_id", filterId);

          filterRows?.forEach((filter, index) => {
            data.append(`conditions[${index}][name]`, filter.name!!);
            data.append(`conditions[${index}][value]`, filter.value!!);
            data.append(`conditions[${index}][operator]`, filter.operator!!);
            data.append(`conditions[${index}][plugin]`, filter.plugin!!);
            data.append(
              `conditions[${index}][resource_id]`,
              filter.resourceId!!
            );
          });

          i.put(
            webConfig.apiEndpointFactory(ApiPathEnum.UpdateFilter),
            data
          ).then(() => {
            onSaved?.(filterRows, filterId);
          }).finally(() => resolve(void 0));
        });
      });
    },
    []
  );

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
          setIsReady(true);
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
      {isFetching && <LoadingActivity text="Fetching" />}

      {isReady && <div className="w-full h-full" style={{visibility: isFetching ? 'hidden' : 'visible'}}>
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
            setIsFetching(true);
            onEditFilter?.(submit, filterId)
              .catch(e => {
                setErrorString(String(e))
              })
              .finally(() => {
                setIsFetching(false);
              });
          }}
        />
      </div>}
    </div>
  );
}
