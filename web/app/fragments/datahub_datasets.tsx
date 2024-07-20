import Button from "~/components/Button";
import EazyModal from "~/components/EazyModal";
import Input from "~/components/Input";
import Label from "~/components/Label";
import SubNavbar from "~/components/SubNavbar";
import Table2 from "~/components/Table2";
import TopTitle from "~/components/TopTitle";
import humanizeString from "humanize-string";
import string from "~/localization/polyglot";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useCallback, useEffect, useState } from "react";

export default function DatahubDatasets() {
  const [onAppendModal, setOnAppendModal] = useState(false);
  const [datasetOverviewModal, setDatasetOverviewModal] = useState<
    string | undefined
  >();

  const [datasetName, setDatasetName] = useState("");

  const [datasets, setDatasets] = useState<any[]>([]);

  const fetcher = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((axios) => {
      axios
        .get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllDatasetsList))
        .then((datasets) => {
          setDatasets(datasets.data.value);
        });
    });
  }, []);

  useEffect(() => {
    fetcher();
  }, []);

  const createDataset = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((axios) => {
      axios
        .post(webConfig.apiEndpointFactory(ApiPathEnum.CreateDataset), {
          name: datasetName,
        })
        .then(() => {
          setOnAppendModal(false);
          setDatasetName("");
          fetcher();
        });
    });
  }, [datasetName]);

  return (
    <>
      <EazyModal
        title="Create Dataset"
        isVisible={onAppendModal}
        intent={setOnAppendModal}
      >
        <div className="space-y-4">
          <Input
            label="Dataset name"
            value={datasetName}
            onChangeValue={setDatasetName}
            placeholder="new_dataset_with_customers"
          />

          <Button onPress={createDataset}>Create dataset</Button>
        </div>
      </EazyModal>

      <EazyModal
        title="Dataset overview"
        isVisible={datasetOverviewModal != undefined}
        intent={() => setDatasetOverviewModal(undefined)}
      >
        <TopTitle
          isLeft
          title="It's like a database."
          subtitle="Only more convenient. Datasets have a loose data typing, allow you to store data from different sources and subsequently receive it in Explorer"
        />

        <div className="mt-3">
          <Label>How to record data</Label>

          <p className="text-zinc-400 text-xs font-mono mb-4">
            <span className="select-none">&lt;!DOCTYPE html&gt;</span>
            <br />
            <span className="select-none">
              &lt;html lang=&quot;en&quot;&gt;
            </span>
            <br />
            <span className="select-none">&lt;head&gt;</span>
            <br />
            <span className="select-none ml-4">
              &lt;meta charset=&quot;UTF-8&quot;&gt;
            </span>
            <br />
            <span className="select-none ml-4">
              &lt;meta name=&quot;viewport&quot;
              content=&quot;width=device-width, initial-scale=1.0&quot;&gt;
            </span>
            <br />
            <span className="select-none ml-4">
              &lt;meta http-equiv=&quot;X-UA-Compatible&quot;
              content=&quot;ie=edge&quot;&gt;
            </span>
            <br />
            <span className="select-none ml-4">
              &lt;title&gt;My Website&lt;/title&gt;
            </span>
            <br />
            <span className="ml-4 text-black underline">
              &lt;script src=&quot;<span className="text-lime-600">/ds.js</span>
              &quot;&gt; &lt;/script&gt;
            </span>
            <br />
            <span className="select-none ml-4">
              &lt;link rel=&quot;stylesheet&quot;
              href=&quot;./style.css&quot;&gt;
            </span>
            <br />
            <span className="select-none ml-4">
              &lt;link rel=&quot;icon&quot; href=&quot;./favicon.ico&quot;
              type=&quot;image/x-icon&quot;&gt;
            </span>
            <br />
            <span className="ml-4 text-black">&lt;script&gt;</span>
            <br />
            <span className="ml-8 text-black">
              ds("{datasetOverviewModal}", {"{...}"})
            </span>{" "}
            <span className="text-zinc-500">// for write in dataset</span>{" "}
            <br />
            <span className="ml-4 text-black">&lt;/script&gt;</span>
            <br />
          </p>

          <Label>Or use HTTP Request</Label>

          <p className="text-xs mb-3">
            Just send your data in HTTP request with GET method. Document
            encoded in query string
          </p>

          <div className="text-sm text-zinc-900 bg-zinc-100  px-4 py-2 font-light">
            <span>/api/dataset/write/</span>
            <span className="text-green-700">{datasetOverviewModal}</span>
            <span className="text-orange-500">?</span>
            <span className="text-blue-500">key=value</span>
          </div>
        </div>
      </EazyModal>

      <SubNavbar
        title={string("dashboard.subtitle.datasets")}
        createActionLabel="Create dataset"
        createActionIcon={
          <svg
            viewBox="0 0 1024 1024"
            fill="currentColor"
            height="1em"
            width="1em"
            className="size-3"
          >
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" />
          </svg>
        }
        onCreateAction={() => {
          setOnAppendModal(true);
        }}
      />

      <div className="p-2">
        <Table2
          sortColumns={["name", "size_of_dataset"]}
          headerTransformer={{
            any(value: string) {
              return humanizeString(value);
            },
          }}
          valueTransformer={{
            size_of_dataset(value: number) {
              return (
                <span className="flex flex-row gap-1 items-center">
                  {value.toLocaleString()}

                  <span className="text-zinc-500">RECORDS</span>
                </span>
              );
            },
          }}
          rowClassName="px-3 py-1.5 text-xs"
          dataset={datasets}
          onSelectedItem={(_, item) => setDatasetOverviewModal(item.name)}
        />
      </div>
    </>
  );
}
