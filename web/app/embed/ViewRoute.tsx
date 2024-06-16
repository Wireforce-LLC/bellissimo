import moment, { unix } from "moment";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "~/components/Button";
import Input from "~/components/Input";
import webConfig, { ApiPathEnum } from "~/web.config";

interface Route {
  readonly name: string;
  readonly domain: string;
  readonly path: string;
  readonly filter_id: string;
  readonly resource_id: string;
}

interface Props {
  readonly resourceName?: string;
  readonly onDeleteRoute?: (resourceName: string) => void;
}

/**
 * The ViewRouteEmbed component is responsible for rendering the details of a route and allowing the user to delete it.
 * It fetches the route data from the server and displays it in a user-friendly format.
 * It also provides a delete button that triggers a request to delete the route when pressed.
 * The component receives the `resourceName` prop which is used to fetch the route data.
 *
 * @param {Props} props - The component props.
 * @param {string} props.resourceName - The name of the resource associated with the route.
 * @returns {JSX.Element} The rendered component.
 */
export default function ViewRouteEmbed({ resourceName, onDeleteRoute }: Props) {
  // State variables
  const [route, setRoute] = useState<Route | undefined>(); // The route data
  const [openTime] = useState<number>(moment().unix()); // The timestamp of the last time the delete button was pressed
  const [currentTime, setCurrentTime] = useState<number>(moment().unix()); // The timestamp of the last time the delete button was pressed

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().unix());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch the route data from the server on component mount
  useEffect(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(
        webConfig.apiEndpointFactory(ApiPathEnum.Route) + "/" + resourceName
      ).then((i) => {
        setRoute(i.data.value as Route);
      });
    });
  }, []);

  // Render the component
  return (
    <div className="flex flex-col gap-4">
      <Input type="text" label="Name" isDisabled value={route?.name} />

      <Input type="text" isDisabled label="Domain" value={route?.domain} />

      <Input type="text" isDisabled label="Path" value={route?.path} />

      <Input
        type="text"
        isDisabled
        label="Filter ID"
        value={route?.filter_id}
      />

      <Button
        variant="delete"
        disabled={3 - (currentTime - openTime) >= 0}
        onPress={() => route?.name && onDeleteRoute?.(route?.name)}
      >
        Delete
      </Button>

      {3 - (currentTime - openTime) >= 0 && (
        <span className="text-xs text-left font-normal text-gray-500">
          Safe for deletion in {Math.floor((3 - (currentTime - openTime)) / 60)}
          :{Math.floor((3 - (currentTime - openTime)) % 60)}
        </span>
      )}
    </div>
  );
}
