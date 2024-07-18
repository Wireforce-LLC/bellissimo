import moment from "moment";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useCallback, useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis } from "recharts";

interface Props {
    readonly campaignId?: string;
    readonly initStartDate?: number;
    readonly initEndDate?: number;
}

interface DayClicksRecord {
   readonly month: number;
   readonly day: number;
   readonly year: number;
   readonly clicks: number;
}

interface ExtendedDayClicksRecord extends DayClicksRecord {
   readonly date: string;
}

export default function AdsCampaignClicks({ campaignId, initStartDate, initEndDate }: Props) {
    const [startDate, setStartDate] = useState<number>(initStartDate ?? moment().add(-14, "days").unix());
    const [endDate, setEndDate] = useState<number>(initEndDate ?? moment().unix());
    
    const [isFetching, setFetching] = useState(true);
    const [data, setData] = useState<ExtendedDayClicksRecord[]>();

    const fetcher = useCallback(() => {
        webConfig.axiosFactory("PRIVATE").then((axios) => {
            axios
                .get(
                    webConfig.apiEndpointFactory(ApiPathEnum.GetAdsManagerCampaignsClicksHistory),
                    {
                        params: {
                            start_time: startDate,
                            end_time: endDate,
                            utm_campaign_name: campaignId
                        },
                    }
                )
                .then((res) => {
                    setData(res.data.value.map((i: DayClicksRecord) => (
                        {
                            ...i,
                            date: moment(`${i.day}.${i.month}.${i.year}`).format("DD.MM.YYYY"),
                        }
                    )));
                })
                .finally(() => {
                    setFetching(false);
                });
        });
    }, [startDate, endDate, campaignId]);

    useEffect(() => {
        fetcher();
    }, []);

    return <div className="w-[700px] flex flex-col items-center justify-center">
         <LineChart  width={680} height={400} data={data} style={{fontSize: 12,  padding: 0}}>
            <Line type="monotone" dataKey="clicks" stroke="#000"/>
            <XAxis dataKey="date" style={{fontSize: 10, color: 'gray'}}/>
            <CartesianGrid stroke="#D3D3D3" strokeDasharray="5 5" />
            <Tooltip/>
        </LineChart>
    </div>;
}