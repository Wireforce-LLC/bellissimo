import Button from "~/components/Button";
import EazyModal from "~/components/EazyModal";
import ErrorString from "~/components/ErrorString";
import Input from "~/components/Input";
import LibraryOfExplorerEmbed from "~/embed/LibraryOfExplorer";
import Link from "~/components/Link";
import LoadingActivity from "~/components/LoadingActivity";
import MonacoEditorEmbed from "~/embed/MonacoEditor";
import Select from "~/components/Select";
import SubNavbar from "~/components/SubNavbar";
import Table2 from "~/components/Table2";
import _ from "lodash";
import humanizeString from "humanize-string";
import moment from "moment";
import webConfig, { ApiPathEnum } from "~/web.config";
import { flatten } from "flat";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Component for exploring and aggregating data from a MongoDB database.
 *
 * @returns {JSX.Element} The rendered DatahubExplorer component.
 */
export default function DatahubExplorer() {
  // State variables
  const [data, setData] = useState("[]");
  const [errorString, setErrorString] = useState<string | undefined>();
  const [templateName, setTemplateName] = useState<string | undefined>();
  const [isModalLibraryOpen, setIsModalLibraryOpen] = useState(false);
  const [isModalTemplateOpen, setIsModalTemplateOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [databases, setDatabases] = useState<any[]>([]);
  const [database, setDatabase] = useState<string | undefined>();
  const [collection, setCollection] = useState<string | undefined>();
  const [collections, setCollections] = useState<any[]>();
  const [aggregatedData, setAggregatedData] = useState<any[]>([]);

  const aggregateButtonRef = useRef<HTMLButtonElement>(null);

  const isValidSyntax = useMemo(() => {
    try {
      JSON.parse(data);
      return true;
    } catch (e) {
      return false;
    }
  }, [data]);

  // Computed values
  const flattenRequestedData: any[] = useMemo(() => {
    return aggregatedData
      .map((it) => flatten(it))
      .map((it: any) => _.mapValues(it, String));
  }, [aggregatedData]);

  const tableHeaders = useMemo(() => {
    return _.keys(_.maxBy(flattenRequestedData, (data) => _.keys(data)));
  }, [flattenRequestedData]);

  // Fetch all databases on component mount
  useEffect(() => {
    webConfig.axiosFactory("PRIVATE").then((axios) => {
      axios
        .get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllDatabasesList))
        .then((databases) => {
          setDatabases(
            databases.data.value?.map((i: any) => ({
              name: humanizeString(i),
              value: i,
            }))
          );
        });
    });
  }, []);

  // Fetch all collections based on selected database
  useMemo(() => {
    webConfig.axiosFactory("PRIVATE").then((axios) => {
      axios
        .get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllCollectionsList), {
          params: {
            database: database,
          },
        })
        .then((campaigns) => {
          setCollections(
            campaigns.data.value.map((i: any) => ({
              name: humanizeString(i),
              value: i,
            }))
          );
        });
    });
  }, [database]);

  const createTemplate = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((axios) => {
      axios
        .post(webConfig.apiEndpointFactory(ApiPathEnum.CreateTemplate), {
          name: templateName,
          template: JSON.parse(data),
        })
        .then((campaigns) => {
          setIsModalTemplateOpen(false);
        })
        .catch((error) => {
          setErrorString(error.response.data.value);
        });
    });
  }, [data, templateName]);

  /**
   * Aggregate data based on the content of the Monaco editor.
   *
   * @param {string} content - The content of the Monaco editor.
   */
  const aggregate = (content: string) => {
    setIsFetching(true);
    webConfig.axiosFactory("PRIVATE").then((axios) => {
      axios
        .post(
          webConfig.apiEndpointFactory(ApiPathEnum.ExplorerExplore),
          JSON.parse(content),
          {
            params: {
              database: database,
              collection: collection,
            },
          }
        )
        .then((campaigns) => {
          setAggregatedData(campaigns.data.value);
          setIsFetching(false);
        })
        .catch((error) => {
          if (error.response.data.error) {
            setErrorString(error.response.data.error);
          } else {
            setErrorString(
              "While aggregating data: " + error.response.statusText
            );
          }
        });
    });
  };

  return (
    <>
      {/* Library modal */}
      <EazyModal
        isVisible={isModalLibraryOpen}
        title="Library"
        isDisablePaddings
        intent={setIsModalLibraryOpen}
      >
        <LibraryOfExplorerEmbed
          onSelectedTemplate={(template) =>
            setData(JSON.stringify(template.template, null, 2))
          }
        />
        {/* Save current aggregation button */}
        {/* <Button
                    onPress={() => {}}
                    variant="secondary"
                >
                    Save current aggregation
                </Button> */}
      </EazyModal>

      <EazyModal
        isVisible={isModalTemplateOpen}
        title="Create template"
        intent={setIsModalTemplateOpen}
      >
        <div className="space-y-4">
          <Input
            placeholder="Template name"
            value={templateName}
            onChangeValue={setTemplateName}
          />
          <Button onPress={createTemplate}>Save template</Button>
        </div>
      </EazyModal>

      <EazyModal
        isVisible={errorString != undefined}
        title="Error aggregating data"
        intent={() => setErrorString(undefined)}
      >
        <ErrorString>{errorString}</ErrorString>
      </EazyModal>

      <SubNavbar title="Data explorer"/>
      
      {/* Datahub explorer */}
      <div className="w-full h-full bg-white overflow-y-auto">
        <div className="w-full z-50">
          {/* Monaco editor */}
          <div className="w-full h-[220px] border-b border-b-zinc-200">
            <MonacoEditorEmbed
              language="json"
              isHiddenRightBar
              startContent={data}
              onChangeContent={setData}
              onIntentSave={(it) => {return true}}
            />
          </div>

          {/* Header */}
          <div className="px-3 py-2 flex flex-row justify-between border-b border-b-zinc-200">
            <div className="flex flex-row gap-2">
              {/* Select database */}
              <div className="w-64">
                <Select
                  value={database}
                  placeholder="Select database"
                  onChangeValue={setDatabase}
                  values={databases}
                />
              </div>

              {/* Select collection */}
              <div className="w-64">
                <Select
                  value={collection}
                  placeholder="Select collection"
                  onChangeValue={setCollection}
                  values={collections}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="w-fit flex flex-row gap-2">
              {/* Save button */}
              <Button
                disabled={!isValidSyntax}
                variant="secondary"
                onPress={() => setIsModalTemplateOpen(true)}
              >
                Save
              </Button>

              {/* Library button */}
              <Button
                disabled={!isValidSyntax}
                variant="secondary"
                onPress={() => setIsModalLibraryOpen(true)}
              >
                Library
              </Button>

              {/* Aggregate button */}
              <Button
                disabled={!isValidSyntax}
                ref={aggregateButtonRef}
                onPress={() => aggregate(data)}
              >
                Aggregate
              </Button>
            </div>
          </div>
        </div>

        {/* Loader */}
        {isFetching && (
          <div className="my-12">
            <LoadingActivity />
          </div>
        )}

        {/* Table */}
        {!isFetching && (
          <div className="w-full overflow-auto z-10">
            <Table2
              headerTransformer={{
                any(value: string) {
                  return humanizeString(value);
                },
                ip: () => "IP"
              }}
              valueTransformer={{
                // Loockup on ipinfo
                ip(value: string) {
                  return <span className="font-medium hover:underline">
                    <Link href={"https://ipinfo.io/" + value}>
                      {value}
                    </Link>
                  </span>;
                },
                time(value: number) {
                  if (moment(value).isValid()) {
                    return <span className="font-mono text-[10px]">
                      {moment(value).format("DD.MM.YYYY HH:mm:ss")}
                    </span>;
                  } else if (moment(value / 1000).isValid() && moment(value / 1000).year() > 2000) {
                    return <span className="font-mono text-[10px]">
                      {moment(value / 1000).format("DD.MM.YYYY HH:mm:ss")}
                    </span>;
                  } else if (moment(value * 1000).isValid() && moment(value * 1000).year() > 2000) {
                    return <span className="font-mono text-[10px]">
                      {moment(value * 1000).format("DD.MM.YYYY HH:mm:ss")}
                    </span>;
                  }

                  return value;
                }
              }}
              dataset={flattenRequestedData} />
            {/* <Table2
              
              dataset={flattenRequestedData.map((it) => ({
                ...it,
                time: it.time && (
                  moment(it.time).format("DD.MM.YYYY") ==
                  moment().format("DD.MM.YYYY") ? (
                    <>
                      <span className="font-semibold">
                        {moment(it.time).format("HH:mm:ss")}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">
                        (today)
                      </span>
                    </>
                  ) : (
                    <span>{moment(it.time).format("DD.MM.YYYY HH:mm:ss")}</span>
                  )
                ),
              }))} */}
            {/* /> */}
          </div>
        )}
      </div>
    </>
  );
}
