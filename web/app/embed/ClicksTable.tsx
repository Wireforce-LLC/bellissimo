import humanizeString from "humanize-string";
import _ from "lodash";
import { useState, useEffect, useCallback, useMemo } from "react";
import BigInput from "~/components/BigInput";
import EazyModal from "~/components/EazyModal";
import Modal from "~/components/Modal";
import Table from "~/components/Table";
import webConfig, { ApiPathEnum } from "~/web.config";

interface Props {}

export default function ClicksTableEmbed({}: Props) {
  const [data, setData] = useState<any[] | undefined>(undefined);
  const [isShowModalWithSource, setIsShowModalWithSource] = useState(false);


  useEffect(() => {
    fether();
  }, []);

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllClicks)).then(
        (res) => {
          if (_.isArray(res.data.value)) {
            setData(res.data.value);
          }
        }
      );
    });
  }, []);

  const tableHeaders = useMemo(() => {
    return (
      data &&
      (!_.isEmpty(data)
        ? _.keys(_.first(data)).map((i) => humanizeString(i))
        : [])
    );
  }, [data]);

  return (
    <div>
      <Table headers={tableHeaders} data={data} />
    </div>
  );
}
