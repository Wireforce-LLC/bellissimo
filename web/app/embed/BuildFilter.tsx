import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import Button from "~/components/Button";
import Input from "~/components/Input";
import Select from "~/components/Select";
import webConfig, { ApiPathEnum } from "~/web.config";
import asnGroups from "../../../containers/asn_owners_group.json";

interface Props {
  readonly onSubmit: (submit: FilterRow[]) => void;
  readonly startFilters: FilterRow[];
}

interface PluginRow {
  name: string;
  value: string;
}

export interface FilterRow {
  name?: string;
  value?: string;
  operator?: string;
  plugin?: string;
  resourceId?: string;
}

const DEFAULT_FILTER_ROW = {
  name: "",
  value: "",
  operator: "==",
  plugin: "",
  resourceId: "",
};

const OPEARTORS = [
  { name: "==", value: "==" },
  { name: "!=", value: "!=" },
  { name: "~", value: "~" },
  { name: "in", value: "in" },
];

const DEFAULT_PLUGINS = [
  { name: "🔥 BotDetect by User Agent", value: "ua::bot" },

  { name: "🔥 IP", value: "ip" },
  { name: "🔥 Country by IP", value: "ip::country_code" },

  { name: "🔥 User Agent", value: "ua" },

  { name: "📡 Owner network by ASN", value: "asn::owner" },
  { name: "📡 Group of ASN", value: "asn::groups" },
  { name: "📡 Country by ASN", value: "asn::country_code" },

  { name: "🛡️ Referrer", value: "referrer" },
  { name: "🛡️ Domain", value: "domain" },

  { name: "🛡️ Tor Traffic", value: "traffic::tor" },
  { name: "🛡️ Cookies", value: "cookie::string" },
  { name: "🛡️ Headers", value: "header::string" },
  { name: "🛡️ Session ID", value: "session_id" },
  { name: "🛡️ Accept Language", value: "accept_language" },

  { name: "📦 User Agent Brand", value: "ua::device::brand" },
  { name: "📦 User Agent Family", value: "ua::device::family" },

  { name: "🚥 Clean Traffic", value: "request_guard" },
  { name: "🔒 ProxyCheck", value: "proxycheck_io" },

  { name: "🚧 Other", value: "other" },
  { name: "🚧 Unknown", value: "unknown" },
];

interface RowFilter {
  index: number;
  modelFilters: FilterRow[];
  setModelFilters: (it: FilterRow[]) => void;
  plugins: any[];
  resources: any[];
}

/**
 * Returns a JSX element based on the pluginName and value.
 * If the pluginName is "asn::owner", a Select component is returned.
 * Otherwise, an Input component is returned.
 *
 * @param {string} pluginName - The name of the plugin.
 * @param {string | undefined} operator - The operator of the filter.
 * @param {string | undefined} value - The value of the filter.
 * @param {(it: string | undefined) => void} onChangeValue - The callback function to handle the change of the value.
 * @return {JSX.Element} The JSX element based on the pluginName and value.
 */
const filterValue = (
  pluginName: string,
  operator: string | undefined,
  value: string | undefined,
  onChangeValue: (it: string | undefined) => void
) => {
  if (pluginName === "asn::owner" && operator === "in") {
    return (
      <div className="w-full">
        <label className="text-xs text-gray-500 mb-[5px] block">
          Filter value
        </label>
        <div className="w-full bg-red-50 flex justify-center items-center h-8">
          <span className="text-xs text-red-500 font-medium py-2.5">
            Doesnt support in
          </span>
        </div>
      </div>
    );
  }

  if (pluginName === "referrer" && operator === "in") {
    return (
      <div className="w-full">
        <label className="text-xs text-gray-500 mb-[5px] block">
          Filter value
        </label>
        <div className="w-full bg-red-50 flex justify-center items-center h-8">
          <span className="text-xs text-red-500 font-medium py-2.5">
            Doesnt support in
          </span>
        </div>
      </div>
    );
  }

  if (pluginName === "cookie::string" && operator === "in") {
    return (
      <div className="w-full">
        <label className="text-xs text-gray-500 mb-[5px] block">
          Filter value
        </label>
        <div className="w-full bg-red-50 flex justify-center items-center h-8">
          <span className="text-xs text-red-500 font-medium py-2.5">
            Doesnt support in
          </span>
        </div>
      </div>
    );
  }

  if ((pluginName === "ua::bot" || pluginName === "request_guard" || pluginName === "proxycheck_io") && (operator === "==" || operator === "!=")) {
    return (
      <div className="w-full">
        <label className="text-xs text-gray-500 mb-[5px] block">
          Filter value
        </label>
        <div className="w-full bg-lime-50 flex justify-center items-center h-8">
          <span className="text-xs text-lime-500 font-medium py-2.5">True</span>
        </div>
      </div>
    );
  }

  if (pluginName === "ua::bot" && !(operator === "==" || operator === "!=")) {
    return (
      <div className="w-full">
        <label className="text-xs text-gray-500 mb-[5px] block">
          Filter value
        </label>
        <div className="w-full bg-red-50 flex justify-center items-center h-8">
          <span className="text-xs text-red-500 font-medium py-2.5">
            Doesnt support operator
          </span>
        </div>
      </div>
    );
  }

  if (pluginName === "asn::groups" && operator === "in") {
    return (
      <Select
        label="Filter value"
        values={Object.keys(asnGroups).map((key) => ({
          name: _.capitalize(String(key)),
          value: key,
        }))}
        value={value}
        onChangeValue={onChangeValue}
      />
    );
  } else if (pluginName === "asn::groups" && operator != "in") {
    return (
      <div className="w-full">
        <label className="text-xs text-gray-500 mb-[5px] block">
          Filter value
        </label>
        <div className="w-full bg-red-50 flex justify-center items-center h-8">
          <span className="text-xs text-red-500 font-medium py-2.5">
            Support only "in"
          </span>
        </div>
      </div>
    );
  }

  if (operator === "in") {
    return (
      <div className="w-full">
        <Input
          // Label for the Input component
          label="Filter value"
          // Class name for the Input component
          className="w-full"
          // Value of the Input component
          value={value}
          // Callback function to handle the change of the value
          onChangeValue={onChangeValue}
        />

        <small className="text-[10px] text-gray-500">
          {(value && value?.split(",").length) || 0} items
        </small>
      </div>
    );
  }

  return (
    <Input
      // Label for the Input component
      label="Filter value"
      // Class name for the Input component
      className="w-full"
      // Value of the Input component
      value={value}
      // Callback function to handle the change of the value
      onChangeValue={onChangeValue}
    />
  );
};

/**
 * RowFilterRecord component renders a single row of filter records.
 * It allows the user to modify the filter name, plugin, operator, filter value, and resource.
 * Clicking on the delete icon will remove the filter record.
 *
 * @param {RowFilter} props - The props containing the index, modelFilters, setModelFilters, plugins, and resources.
 * @returns {JSX.Element} The rendered RowFilterRecord component.
 */
function RowFilterRecord({
  index,
  modelFilters,
  setModelFilters,
  plugins,
  resources,
}: RowFilter) {
  return (
    <div>
      {/* Container for the filter record */}
      <div className="flex flex-row justify-between items-top space-x-2 h-14 w-full">
        {/* Label for the filter name */}
        <Input
          label="Filter name"
          // Current value of the filter name
          value={modelFilters[index]?.name}
          // Callback function to handle the change of the filter name
          onChangeValue={(it) => {
            const from = _.clone(modelFilters);
            from[index].name = it;
            setModelFilters(from);
          }}
        />

        {/* Select component for the plugin */}
        <Select
          label="Plugin"
          // Array of values for the plugin Select component
          values={plugins}
          // Current value of the plugin Select component
          value={modelFilters[index]?.plugin}
          // Callback function to handle the change of the plugin value
          onChangeValue={(it) => {
            const from = _.clone(modelFilters);
            from[index].plugin = it;
            setModelFilters(from);
          }}
        />

        {/* Select component for the operator */}
        <Select
          label="Operator"
          // Array of values for the operator Select component
          values={OPEARTORS}
          // Current value of the operator Select component
          value={modelFilters[index]?.operator}
          // Callback function to handle the change of the operator value
          onChangeValue={(it) => {
            const from = _.clone(modelFilters);
            from[index].operator = it;
            setModelFilters(from);
          }}
        />

        {/* Dynamically render the filter value component based on the plugin value */}
        {filterValue(
          modelFilters[index].plugin!!,
          modelFilters[index]?.operator,
          modelFilters[index]?.value,
          (it) => {
            const from = _.clone(modelFilters);
            from[index].value = it;
            setModelFilters(from);
          }
        )}

        {/* Select component for the resource */}
        <Select
          label="Resource"
          // Array of values for the resource Select component
          values={resources?.map((it) => ({
            name: it?.resource_id,
            value: it?.resource_id,
          }))}
          // Current value of the resource Select component
          value={modelFilters[index]?.resourceId}
          // Callback function to handle the change of the resource value
          onChangeValue={(it) => {
            const from = _.clone(modelFilters);
            from[index].resourceId = it;
            setModelFilters(from);
          }}
        />

        {/* Delete icon to remove the filter record */}
        <svg
          onClick={() => {
            if (modelFilters.length > 1) {
              const from = _.clone(modelFilters);
              delete from[index];
              setModelFilters(_.compact(from));
            } else {
              setModelFilters([_.clone(DEFAULT_FILTER_ROW)]);
            }
          }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 flex-shrink-0 hover:text-red-800 hover:bg-red-100 cursor-pointer p-1 text-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
  );
}

export default function BuildFilterEmbed({ onSubmit, startFilters }: Props) {
  const [resources, setResources] = useState([]);
  const [plugins, setPlugins] = useState<PluginRow[]>([]);

  const [modelFilters, setModelFilters] = useState<FilterRow[]>(
    _.clone(startFilters) || [DEFAULT_FILTER_ROW]
  );

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.Resources)).then((res) => {
        setResources(res.data.value);
      });

      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllFilterPlugins)).then(
        (res) => {
          if (_.isArray(res.data.value)) {
            const pluginsRow: PluginRow[] = res.data.value.map(
              (it: string) => ({
                name:
                  DEFAULT_PLUGINS.find((p) => p.value === it)?.name ||
                  "🎛️ " + it,
                value: it,
              })
            );

            const orderedPlugins: PluginRow[] = _.orderBy(
              pluginsRow,
              "value",
              "asc"
            );

            setPlugins(orderedPlugins);
          }
        }
      );
    });
  }, []);

  useEffect(() => {
    fether();
  }, []);

  return (
    <div className="w-full h-full absolute top-0 left-0 right-0 bottom-0 flex flex-col overflow-x-auto space-y-4">
      <div className="flex flex-col space-y-4 overflow-y-auto pb-12">
        {modelFilters?.map((it, index) => (
          <RowFilterRecord
            key={index}
            index={index}
            modelFilters={modelFilters}
            setModelFilters={setModelFilters}
            plugins={plugins}
            resources={resources}
          />
        ))}

        <button
          className="w-full text-[#003049] bg-zinc-100 text-xs font-medium cursor-pointer py-2"
          onClick={() => {
            setModelFilters([...modelFilters!!, _.clone(DEFAULT_FILTER_ROW)]);
          }}
        >
          Add filter
        </button>
      </div>

      <div className="bottom-0 absolute left-0 right-0">
        <Button
          onPress={() => {
            onSubmit(modelFilters);
          }}
        >
          Create
        </Button>
      </div>
    </div>
  );
}
