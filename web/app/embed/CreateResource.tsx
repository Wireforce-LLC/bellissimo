import classNames from "classnames";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import BigInput from "~/components/BigInput";
import Button from "~/components/Button";
import ErrorString from "~/components/ErrorString";
import Input from "~/components/Input";
import Select from "~/components/Select";
import webConfig, { ApiPathEnum, DRIVERS } from "~/web.config";

/**
 * The intent for the CreateResourceEmbed component.
 *
 * @typedef {Object} CreateresourceIntent
 * @property {string} resourceId - The ID of the resource being created.
 * @property {string} driver - The name of the driver for the resource.
 * @property {string} content - The content of the resource.
 * @property {string} fileUri - The file URI of the resource.
 */
interface CreateresourceIntent {
  readonly resourceId?: string;
  readonly driver?: string;
  readonly content?: string;
  readonly fileUri?: string;
}

/**
 * Renders the CreateResourceEmbed component.
 *
 * @param {Props} props - The props object containing the onCreateResource callback.
 * @returns {JSX.Element} The rendered CreateResourceEmbed component.
 */
interface Props {
  readonly onCreateResource?: (intent: CreateresourceIntent) => void;
}

/**
 * Renders the CreateResourceEmbed component.
 *
 * @param {Props} props - The props object containing the onCreateResource callback.
 * @returns {JSX.Element} The rendered CreateResourceEmbed component.
 */
export default function CreateResourceEmbed({
  // Callback function to be called when the resource is created
  onCreateResource,
}: Props) {
  const [defaultDrivers] = useState(DRIVERS);

  // State variables
  const [availableDrivers, setAvailableDrivers] = useState<any[]>([]);
  const [modelResourceId, setModelResourceId] = useState<string | undefined>();
  const [modelDriver, setModelDriver] = useState<string | undefined>();
  const [modelContent, setModelContent] = useState<string | undefined>();
  const [modelFileUri, setModelFileUri] = useState<string | undefined>();
  const [typeOfContent, setTypeOfContent] = useState<number>(0);
  const [filesPlaceholder, setFilesPlaceholder] = useState<
    string[] | undefined
  >(undefined);
  const [errorString, setErrorString] = useState<string | undefined>();

  const fetcher = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllFilesShort)).then(
        (res) => {
          setFilesPlaceholder(res.data.value);

          if (res.data.value) {
            setModelFileUri(_.first(res.data.value));
          }
        }
      );
    });

    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(
        webConfig.apiEndpointFactory(ApiPathEnum.GetAllResourceDrivers)
      ).then((res) => {
        const driversList = defaultDrivers.concat(
          res.data.value.map((i: string) => {
            return {
              name: i,
              description: "Driver from other suppliers",
              value: i,
            };
          })
        );

        const uniqDriversList = _.uniqBy(driversList, "value");

        setAvailableDrivers(uniqDriversList);
      });
    });
  }, []);

  useEffect(() => {
    fetcher();
  }, []);

  // Callback function to be called when the resource is created
  const createResource = useCallback(() => {
    if (!modelResourceId) {
      setErrorString("Resource ID is required");
      return;
    }

    if (!modelDriver) {
      setErrorString("Driver is required");
      return;
    }

    if (typeOfContent == 0 && !modelFileUri) {
      setErrorString("File URI is required");
      return;
    }

    if (typeOfContent == 1 && !modelContent) {
      setErrorString("Content is required");
      return;
    }

    setErrorString(undefined);

    if (modelResourceId && modelDriver && (modelContent || modelFileUri)) {
      if (typeOfContent == 0) {
        onCreateResource?.({
          resourceId: modelResourceId,
          driver: modelDriver,
          fileUri: modelFileUri,
          content: undefined,
        });
      } else if (typeOfContent == 1) {
        onCreateResource?.({
          resourceId: modelResourceId,
          driver: modelDriver,
          content: modelContent,
          fileUri: undefined,
        });
      }
    }
  }, [modelResourceId, modelDriver, modelContent, modelFileUri]);

  return (
    <div className="space-y-4 pt-2">
      {/* Resource ID input */}
      <Input
        label="Resource ID"
        value={modelResourceId}
        onChangeValue={setModelResourceId}
      />

      {/* Driver selection */}
      <div>
        <label className="text-xs text-gray-400 mb-[5px] block">Driver</label>

        <div className="w-full overflow-y-auto max-h-[220px]">
          <div className="grid grid-cols-3 gap-2">
            {/* Render each available driver */}
            {availableDrivers.map((it) => (
              <div
                onClick={() => setModelDriver(it.value)}
                className={classNames(
                  "w-full select-none cursor-pointer px-2 py-1 border border-gray-200",
                  {
                    "border-blue-500 bg-blue-50": modelDriver == it.value,
                  }
                )}
              >
                <h4 className="text-sm font-regular">{it.name}</h4>
                <p className="text-[10px] w-[80%] text-gray-400">
                  {it.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <span className="text-xs w-[75%] mt-2 text-gray-400 mb-[5px] block">
          The driver is the method by which the response will be displayed to
          the user when he visits the page with this resource.
        </span>
      </div>

      {typeOfContent == 0 && (
        <Select
          label="File"
          values={
            filesPlaceholder?.map((i: string) => ({ name: i, value: i })) || []
          }
          value={modelFileUri}
          onChangeValue={setModelFileUri}
        />
      )}

      {/* Regular content input */}
      {typeOfContent == 1 && (
        <BigInput
          label="Regular content"
          value={modelContent}
          onChangeValue={setModelContent}
        />
      )}

      {/* Toggle content type */}
      <a
        className="text-blue-500 text-xs"
        href="#"
        onClick={() => setTypeOfContent(typeOfContent == 0 ? 1 : 0)}
      >
        Toogle content type
      </a>

      {/* Error message */}
      {errorString && (
        <div>
          <ErrorString>{errorString}</ErrorString>
        </div>
      )}

      {/* Create button */}
      <Button
        disabled={!modelFileUri && !modelContent}
        onPress={createResource}
      >
        Create
      </Button>
    </div>
  );
}
