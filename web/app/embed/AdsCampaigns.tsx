import LoadingActivity from "~/components/LoadingActivity";
import Table from "~/components/Table";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useCallback, useEffect, useState } from "react";

interface AdCampaign {
  readonly name: string;
  readonly campaign_id: string;
  readonly target_click: string[];
  readonly campaign_type: number;
  readonly kpi_success: number;
  readonly kpi_fail: number;
  readonly kpi_percent: number;
  readonly count_clicks: number;
}

interface Props {
  readonly startDate: number;
  readonly endDate: number;
}

export default function AdsCampaigns({ startDate, endDate }: Props) {
  const [data, setData] = useState<AdCampaign[]>();
  const [isFetching, setFetching] = useState(true);

  const fether = useCallback(() => {
    setFetching(true);
    
    webConfig.axiosFactory("PRIVATE").then((axios) => {
      axios
        .get(
          webConfig.apiEndpointFactory(ApiPathEnum.GetAdsManagerCampaignsList),
          {
            params: {
              start_time: startDate,
              end_time: endDate,
            },
          }
        )
        .then((res) => {
          setData(res.data.value);
        })
        .finally(() => {
          setFetching(false);
        });
    });
  }, [startDate, endDate]);

  useEffect(() => {
    setData(undefined);

    fether();
  }, [startDate, endDate]);

  if (isFetching) {
    return (
      <div className="py-8">
        <LoadingActivity text="It takes a little longer" />
      </div>
    );
  }

  return data?.map((i) => (
    <div className="w-full bg-white px-3 py-2 flex justify-between hover:bg-zinc-50 cursor-pointer border-b border-b-zinc-100">
      <div>
        <div className="flex flex-row items-center gap-1">
          {i.campaign_type === 101 ? (
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtfbcYeYgf0wQJ-LSPm3CPbyB7T1p0f5bnaA&s"
              className="w-[12px] h-[12px] object-contain"
              alt=""
            />
          ) : undefined}

          {i.campaign_type === 102 ? (
            <img
              src="https://www.svgrepo.com/show/353800/google-ads.svg"
              className="w-[12px] h-[12px] object-contain"
              alt=""
            />
          ) : undefined}

          <h2 className="font-medium text-sm">{i.name}</h2>
        </div>

        <p className="text-xs text-zinc-500">Campaign ID: {i.campaign_id}</p>

        <div className="flex flex-row gap-2 mt-2">
          <div className="flex items-center justify-center flex-row gap-1">
            <span className="text-xs text-red-700 font-medium">
              {i.kpi_fail}
            </span>
            <span className="text-xs font-normal text-zinc-400">fail</span>
          </div>

          <div className="flex items-center justify-center flex-row gap-1">
            <span className="text-xs text-lime-700 font-medium">
              {i.kpi_success}
            </span>
            <span className="text-xs  font-normal text-zinc-400">success</span>
          </div>

          <div className="flex items-center justify-center flex-row gap-1">
            <span className="text-xs text-blue-700 font-medium">
              {i.kpi_percent.toFixed(2)}%
            </span>
            <span className="text-xs  font-normal text-zinc-400">
              percent success
            </span>
          </div>
        </div>
      </div>
    </div>
  ));

  return <Table data={data as any[]} />;
}
