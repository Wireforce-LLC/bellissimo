import classNames from "classnames";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import Button from "~/components/Button";
import Select from "~/components/Select";
import Input from "~/components/Input";
import string from "~/localization/polyglot";
import webConfig, { ApiPathEnum } from "~/web.config";
import LoadingActivity from "~/components/LoadingActivity";
import ErrorString from "~/components/ErrorString";

interface Props {
  readonly onRouterCreated?: () => void;
}


const notFoundAnything = (
  <div className="w-full flex flex-col justify-center items-center py-8">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-10 mb-4"
    >
      <path
        fillRule="evenodd"
        d="M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z"
        clipRule="evenodd"
      />
    </svg>

    <h1 className="text-md font-medium text-center mb-0 p-0">
      {string("routes.create.anyNotFoundTitle")}
    </h1>
    <p className="text-xs text-center font-normal opacity-50">
      {string("routes.create.anyNotFoundDescription")}
    </p>
  </div>
);

const notFoundResources = (
  <div className="w-full flex flex-col justify-center items-center py-8">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-10 mb-4"
    >
      <path
        fillRule="evenodd"
        d="M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z"
        clipRule="evenodd"
      />
    </svg>

    <h1 className="text-md font-medium text-center mb-0 p-0">
      {string("routes.create.resourcesNotFoundTitle")}
    </h1>
    <p className="text-xs text-center font-normal opacity-50">
      {string("routes.create.resourcesNotFoundDescription")}
    </p>
  </div>
);

const notFoundFilters = (
  <div className="w-full flex flex-col justify-center items-center py-8">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-10 mb-4"
    >
      <path
        fillRule="evenodd"
        d="M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z"
        clipRule="evenodd"
      />
    </svg>

    <h1 className="text-md font-medium text-center mb-0 p-0">
      {string("routes.create.filtersNotFoundTitle")}
    </h1>
    <p className="text-xs text-center font-normal opacity-50">
      {string("routes.create.filtersNotFoundDescription")}
    </p>
  </div>
);


export default function CreateRouteEmbed({onRouterCreated} : Props) {
  const [isFetching, setFetching] = useState(true);

    const [host, setHost] = useState<string | undefined>();

    const [filters, setFilters] = useState<any[] | undefined>(undefined);
    const [resources, setResources] = useState<any[] | undefined>(undefined);
    
    const [modelName, setModelName] = useState<string | undefined>();
    const [modelPath, setModelPath] = useState<string | undefined>();
    const [modelDomain, setModelDomain] = useState<string | undefined>();
    const [modelFilterId, setModelFilterId] = useState<string | undefined>();
    const [modelResourceId, setModelResourceId] = useState<string | undefined>();

    const [errorString, setErrorString] = useState<string | undefined>(undefined);

    useEffect(() => {
      setHost(window.location.hostname);
    }, []);

    const onCreateResource = useCallback(() => {
      if (modelPath?.startsWith("/")) {
        setErrorString("Path must not start with /");
        return;
      }

      if (_.isEmpty(modelName)) {
        setErrorString("Name is required");
        return;
      }

      if (_.isEmpty(modelPath)) {
        setErrorString("Path is required");
        return;
      }

      if (_.isEmpty(modelDomain)) {
        setErrorString("Domain is required");
        return;
      }

      if (_.isEmpty(modelFilterId)) {
        setErrorString("Filter is required");
        return;
      }

      if (_.isEmpty(modelResourceId)) {
        setErrorString("Resource is required");
        return;
      }
  
      setErrorString(undefined);

      let data = new FormData();
  
      data.append("name", modelName!);
      data.append("path", "/" + modelPath!);
      data.append("domain", modelDomain!);
      data.append("filter_id", modelFilterId!);
      data.append("resource_id", modelResourceId!);
  
      webConfig.axiosFactory("PRIVATE").then((i) => {
        i.post(webConfig.apiEndpointFactory(ApiPathEnum.CreateRoutes), data).then(
          (res) => {
            if (res.status == 201) {
              onRouterCreated?.();
            }
          }
        );
      });
    }, [modelFilterId, modelDomain, modelPath, modelName, modelResourceId]);

    useEffect(() => {
      setFetching(true)

      webConfig.axiosFactory("PRIVATE").then((i) => {
        Promise.all([
          i.get(webConfig.apiEndpointFactory(ApiPathEnum.Filters)),
          i.get(webConfig.apiEndpointFactory(ApiPathEnum.Resources))
        ]).then(([res1, res2]) => {
          setFilters(
            res1.data.value.map((i: any) => {
              return {
                value: i["filter_id"],
                name: i["name"] || i["filter_id"] || "Without Name",
              };
            })
          );

          setResources(
            res2.data.value.map((it: any) => ({
              value: it["resource_id"],
              name: `[${it["driver"] || "Without Driver"}] ` + it["resource_id"],
            }))
          );

          setFetching(false)
        })
      });
    }, []);

    if (isFetching) {
      return <LoadingActivity text="Fetching route data"/>
    }

    if (_.isEmpty(filters)) {
      return notFoundFilters
    }

    if (_.isEmpty(resources)) {
      return notFoundResources
    }

    return  <div className="space-y-4">
    <div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Domain"
          value={modelDomain}
          className={classNames("outline-none w-full", {
            "text-red-500 font-semibold":
              modelDomain?.startsWith("http://") ||
              modelDomain?.startsWith("https://"),

            "text-blue-500 bg-blue-50 border-blue-200":
              modelDomain == "any",
          })}
          onChangeValue={setModelDomain}
        />

        <div>
          <label className="text-xs text-gray-500 mb-[5px] block">
            Path
          </label>

          <div className="w-full flex flex-row h-8 px-3 py-1 text-sm placeholder-gray-400 hover:border-gray-200 focus-within:border-gray-400 border-gray-200 focus:border-gray-500 transition-colors duration-75 border-[0.115em] outline-none focus:outline-none">
            <span>{modelDomain || host}/</span>

            <input
              value={modelPath}
              onChange={(e) => setModelPath(e.target.value)}
              type="text"
              placeholder="any-path"
              className={classNames("outline-none w-full", {
                "text-red-500 font-semibold":
                  modelPath?.startsWith("/"),
                "text-zinc-500": !modelPath?.startsWith("/"),
              })}
            />
          </div>
        </div>
      </div>

      <span className="text-xs w-[75%] mt-2 text-gray-400 mb-[5px] block">
        Along this path, your traffic will be sent to the filter. The
        path can be nested, for example "/level1/level2"
      </span>

      {modelPath == 'index' && modelDomain && <div className="w-full bg-blue-100 px-2.5 py-1 pb-1.5">
        <span className="text-xs">
        The <b>index</b> page is used as the root page, it will accept requests at <b>{modelDomain}</b>
        </span>
      </div>}
    </div>

    <Input
      label="Name"
      value={modelName}
      onChangeValue={setModelName}
    />

    {resources && <Select
      label="Resource"
      placeholder="Select a resource"
      value={modelResourceId}
      values={resources}
      onChangeValue={setModelResourceId}
    />}

    {filters && <Select
      label="Filter"
      placeholder="Select a filter"
      value={modelFilterId}
      values={filters}
      onChangeValue={setModelFilterId}
    />}

    <ErrorString>{errorString}</ErrorString>

    <Button onPress={onCreateResource}>Create</Button>
  </div>
    
}