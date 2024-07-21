import Table2 from "~/components/Table2";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useCallback, useState } from "react";
import { useEffect } from "react";

interface Props {
  readonly id?: string;
}

/**
 * TriggersByFunctionIdEmbed component displays triggers list by function id.
 *
 * @param {Props} props - The component props.
 * @param {string} props.id - The function id.
 * @returns {JSX.Element} The rendered TriggersByFunctionIdEmbed component.
 */
export default function TriggersByFunctionIdEmbed({ id }: Props) {
  // State hook for the triggers list data.
  const [data, setData] = useState<any[]>([]);

  /**
   * fetchData function fetches the triggers list data from the API.
   *
   * @returns {void}
   */
  const fetchData = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(
        webConfig.apiEndpointFactory(ApiPathEnum.GetTriggersListByFunction),
        {
          params: {
            id: id,
          },
        }
      ).then((res) => {
        if (res.data.value) {
          setData(res.data.value);
        }
      });
    });
  }, [id]);

  // Fetch the triggers list data when the component mounts and when the id changes.
  useEffect(() => fetchData(), [id, fetchData]);

  // Render the TriggersByFunctionIdEmbed component.
  return (
    <Table2
      // Pass the triggers list data to the Table2 component.
      dataset={data}
    />
  );
}
