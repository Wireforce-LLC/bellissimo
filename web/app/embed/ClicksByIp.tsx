import humanizeString from "humanize-string";
import _ from "lodash";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import Table from "~/components/Table";
import webConfig, { ApiPathEnum } from "~/web.config";

interface Props {
    readonly ip?: string;
}

export default function ClicksByIpEmbed({ip}: Props) {
    const [data, setData] = useState<undefined|any[]>();

    const headers = useMemo(() => {
        if (!_.isEmpty(data)) {
            return _.keys((data || [])[0]).map(it => humanizeString(it));
        } else {
            return []
        }
    }, [data])

    useEffect(() => {
        webConfig.axiosFactory("PRIVATE").then((i) => {
            i.get(
                webConfig.apiEndpointFactory(ApiPathEnum.GetListOfClicks) +
                  "/" +
                  ip
              ).then((res) => {
                setData(res.data.value);
              })
        })
    }, []);

    return <>
        <Table data={data?.map(it => ({
            ...it,
            time: moment(it.time * 1000).format("DD.MM.YYYY HH:mm:ss"),
        }))} headers={headers}/>
    </>
}