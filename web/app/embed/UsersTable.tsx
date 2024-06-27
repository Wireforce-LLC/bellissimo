import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import Table from "~/components/Table";
import webConfig, { ApiPathEnum } from "~/web.config";

interface Props {
}

export default function UsersTableEmbed() {
  const [data, setData] = useState<any[]>([]);

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
    headers={["Name", "Email"]}
    data={data}
    onSelectedItem={(index, item) => {
      console.log(index, item);
    }}/>
}
