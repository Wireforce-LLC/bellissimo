import Button from "~/components/Button";
import EditRouterParamsEmbed from "./EditRouterParams";
import Input from "~/components/Input";
import Tabs from "~/components/Tabs";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useEffect, useState } from "react";

interface Route {
  readonly name: string;
  readonly domain: string;
  readonly path: string;
  readonly filter_id: string;
  readonly resource_id: string;
  readonly params: { [key: string]: string };
}

interface Props {
  readonly routeName?: string;
  readonly onDeleteRoute?: (resourceName: string) => void;
}

/**
 * The ViewRouteEmbed component is responsible for rendering the details of a route and allowing the user to delete it.
 * It fetches the route data from the server and displays it in a user-friendly format.
 * It also provides a delete button that triggers a request to delete the route when pressed.
 * The component receives the `routeName` prop which is used to fetch the route data.
 *
 * @param {Props} props - The component props.
 * @param {string} props.resourceName - The name of the resource associated with the route.
 * @returns {JSX.Element} The rendered component.
 */
export default function ViewRouteEmbed({ routeName, onDeleteRoute }: Props) {
  // State variables
  const [route, setRoute] = useState<Route | undefined>(); // The route data

  // Fetch the route data from the server on component mount
  useEffect(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(
        webConfig.apiEndpointFactory(ApiPathEnum.Route) + "/" + routeName
      ).then((i) => {
        setRoute(i.data.value as Route);
      });
    });
  }, []);

  // Render the component
  return (
    <Tabs isDisableBorders isDisablePaddings isFullSize titles={["Overview", "Params"]}>
        <div className="h-full w-full flex flex-col gap-4 p-2">
          <Input type="text" label="Name" isDisabled value={route?.name} />

          <div className="grid grid-cols-2 gap-2">
            <Input
              type="text"
              isDisabled
              label="Domain"
              value={route?.domain}
            />

            <Input type="text" isDisabled label="Path" value={route?.path} />
          </div>

          <Input
            type="text"
            isDisabled
            label="Filter ID"
            value={route?.filter_id}
          />

          <Button
            variant="delete"
            onPress={() => route?.name && onDeleteRoute?.(route?.name)}
          >
            Delete router
          </Button>
        </div>

        <div className="h-full w-full flex flex-col gap-4 p-2">
          <EditRouterParamsEmbed routeName={routeName} startParams={route?.params || {}}/>
        </div>
      </Tabs>
  );
}
