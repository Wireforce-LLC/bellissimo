import LoadingActivity from "~/components/LoadingActivity";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useCallback, useEffect, useState } from "react";

export interface AdCampaign {
  readonly name: string;
  readonly campaign_id: string;
  readonly target_click: string[];
  readonly campaign_type: number;
  readonly kpi: {
    readonly campaign_id: string,
    readonly clicks: number,
    readonly target_records: number,
    readonly not_target_records: number,
    readonly success_rate: number
  }
}

interface Props {
  readonly startDate: number;
  readonly endDate: number;
  readonly onSelect: (it: AdCampaign) => void;
}

export default function AdsCampaigns({ startDate, endDate, onSelect }: Props) {
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

  return <div className="grid-cols-2 grid gap-2 p-2">
    {
      data?.map((i) => (
        <div onClick={() => onSelect(i)} className="w-full hover:outline outline-black outline-1 outline-offset-2 bg-white px-3 py-2 flex justify-between hover:bg-zinc-50 cursor-pointer">
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
    
            {i.kpi == null && <div className="pt-2">
              <p className="text-xs text-zinc-500">KPI is not available yet</p>
            </div>}
    
            {
              i.kpi != null && (
                <div className="flex flex-row gap-2 mt-2">
                  <div className="flex items-center justify-center flex-row gap-1">
                    <span className="text-xs text-red-700 font-medium">
                      {i.kpi?.not_target_records}
                    </span>
                    <span className="text-xs font-normal text-zinc-400">fail</span>
                  </div>
    
                  <div className="flex items-center justify-center flex-row gap-1">
                    <span className="text-xs text-lime-700 font-medium">
                      {i.kpi?.target_records}
                    </span>
                    <span className="text-xs  font-normal text-zinc-400">success</span>
                  </div>
    
                  <div className="flex items-center justify-center flex-row gap-1">
                    <span className="text-xs text-blue-700 font-medium">
                      {i.kpi?.success_rate}%
                    </span>
                    <span className="text-xs  font-normal text-zinc-400">
                      percent success
                    </span>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      ))
    }
  </div>
}
