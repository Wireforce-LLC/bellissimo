import { flatten } from "flat";
import _ from "lodash";
import { FormEvent, useCallback, useState } from "react";
import toast from "react-hot-toast";
import BigInput from "~/components/BigInput";
import Button from "~/components/Button";
import ErrorString from "~/components/ErrorString";
import Input from "~/components/Input";
import webConfig, { ApiPathEnum } from "~/web.config";

interface Props {
  readonly routeName?: string;
  readonly onEditResource?: (routeName: string) => void;
}

/**
 * Renders the EditRouterParamsEmbed component.
 *
 * @param {Props} props - The props object.
 * @param {string} props.routeName - The name of the route being edited (optional).
 * @param {function} props.onEditResource - The callback function to be called when the resource is edited (optional).
 * @returns {JSX.Element} The rendered EditRouterParamsEmbed component.
 */
export default function EditRouterParamsEmbed({
  routeName,
  onEditResource,
}: Props): JSX.Element {
  // State variables
  const [params, setParams] = useState<Array<[string, string]>>([]);
  const [errorString, setErrorString] = useState<string | undefined>();

  /**
   * Handles the form submission.
   * Validates the form inputs and calls the onEditResource callback function
   * with the edited route data.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   * @returns {Promise<void>} A promise that resolves when the form submission is complete.
   */
  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      setErrorString(undefined);

      // Validate params
      if (!params.length) {
        setErrorString("Params are required");
        return;
      }

      // Validate route name
      if (!routeName) {
        setErrorString("Route name is required");
        return;
      }

      // Validate params
      try {
        const data = new FormData();

        // Validate each param
        for (const [key, value] of params) {
          if (_.isEmpty(value) && !_.isEmpty(key)) {
            setErrorString(`Key '${key}' is required`);
            return;
          }

          if (_.isEmpty(key) && _.isEmpty(value)) {
            setErrorString("Params are required");
            return;
          }

          // Append params to form data
          data.append(key, value);
        }

        // Make API request to edit route params
        const axios = await webConfig.axiosFactory("PRIVATE");
        const response = await toast.promise(
          axios.post(
            webConfig.apiEndpointFactory(ApiPathEnum.RouteSetPrams) +
              "/" +
              routeName,
            data
          ),
          {
            loading: "Saving...",
            success: "Saved!",
            error: "Failed!",
          }
        );

        if (response && onEditResource) {
          onEditResource(routeName);
        }
      } catch (e) {
        setErrorString("Invalid JSON");
        return;
      }
    },
    [onEditResource, params, routeName]
  );

  return (
    <form className="space-y-2 h-full w-full flex flex-col" onSubmit={onSubmit}>
      {/* Display route name */}
      <Input label="Route name" value={routeName} isDisabled />

      {/* Display params */}
      <div className="w-full h-full space-y-2">
        {params.map((record, index) => (
          <div className="w-full flex flex-row gap-2">
            <Input
              label="Param"
              value={record[0]}
              onChangeValue={(value) => {
                const newParams = [...params];
                newParams[index] = [value!!, record[1]];
                setParams(newParams);
              }}
            />

            <Input
              label="Value"
              value={record[1]}
              onChangeValue={(value) => {
                const newParams = [...params];
                newParams[index] = [record[0], value!!];
                setParams(newParams);
              }}
            />
          </div>
        ))}

        {/* Add param */}
        <Button
          variant="secondary"
          type="button"
          onPress={() => {
            const newParams = params.concat([["", ""]]);
            setParams(newParams);
          }}
        >
          Add param
        </Button>
      </div>

      {/* Display error message */}
      <div>{errorString && <ErrorString>{errorString}</ErrorString>}</div>

      {/* Submit button */}
      <Button type="submit">Submit</Button>
    </form>
  );
}
