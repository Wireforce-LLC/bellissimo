import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import Table from "~/components/Table";
import webConfig, { ApiPathEnum } from "~/web.config";

interface Props {
}

export default function UsersTableEmbed() {
  const [data, setData] = useState<any[]>([]);

  const tableData = useMemo(() => {
    return data?.map(it => {
      const row = _.omit(it, ["devices"]);

      return row;
    });
  }, [data]);

  const fetcher = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllUsers)).then((res) => {
        if (_.isArray(res.data.value)) {
          const value = _.toArray(res.data.value);
  
          setData(value);
        }
      });
    });
  }, []);

  useEffect(() => {
    fetcher();
  }, [])
  
  return <Table 
    headers={_.keys(_.first(tableData))}
    data={tableData}
    onSelectedItem={(index, item) => {
      console.log(index, item);
    }}/>
}
