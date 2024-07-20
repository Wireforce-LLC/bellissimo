import Button from "~/components/Button";
import CreateFunctionEmbed from "~/embed/CreateFunction";
import EazyModal from "~/components/EazyModal";
import FunctionDebuggerEmbed from "~/embed/FunctionDebugger";
import FunctionViewEmbed from "~/embed/FunctionViewEmbed";
import Input from "~/components/Input";
import SubNavbar from "~/components/SubNavbar";
import Table2 from "~/components/Table2";
import Tabs from "~/components/Tabs";
import string from "~/localization/polyglot";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useCallback, useEffect, useState } from "react";

interface LogEntity {
  event_name: string;
  params: {
    time: number;
    name: string;
    ip: string;
  };
  result: string;
  time: number;
}

interface FunctionEntity {
  id: string;
  name: string;
}

/**
 * RemoteFunctions component displays event logs and
 * provides a tabbed interface to view them.
 *
 * @returns {JSX.Element} The RemoteFunctions component.
 */
export default function RemoteFunctions() {
  const [functions, setFunctions] = useState<FunctionEntity[]>([]);
  const [onAppendModal, setOnAppendModal] = useState(false);
  const [modalEditId, setModalEditId] = useState<string | undefined>();
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [confirmDeleteWord, setConfirmDeleteWord] = useState("");

  const removeFunction = useCallback((id: string) => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.delete(webConfig.apiEndpointFactory(ApiPathEnum.DeleteFunction), {
        params: {
          id,
        },
      }).then(() => {
        fether();
      });
    });
  }, []);

  /**
   * Fetches the logs from the API.
   *
   * @returns {void}
   */
  const fether = useCallback(() => {
    // Fetch the logs using the axiosFactory and apiEndpointFactory
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(
        webConfig.apiEndpointFactory(ApiPathEnum.GetAllRemoteFunctions)
      ).then((res) => {
        // Set the logs state with the fetched data
        setFunctions(res.data.value);
      });
    });
  }, []);

  // Fetch the logs on component mount
  useEffect(() => fether(), [fether]);

  return (
    <>
      <EazyModal
        title="Create Function"
        isVisible={onAppendModal}
        intent={setOnAppendModal}
      >
        <CreateFunctionEmbed
          onCreated={() => {
            setOnAppendModal(false);
            fether();
          }}
        />
      </EazyModal>

      <EazyModal
        title="Confirm delete"
        zIndex={5}
        isVisible={isConfirmDeleteVisible}
        intent={setIsConfirmDeleteVisible}
      >
        <div className="space-y-4">
          <Input
            placeholder="Enter 'delete' to confirm"
            value={confirmDeleteWord}
            onChangeValue={setConfirmDeleteWord}
          />

          <Button
            disabled={confirmDeleteWord != "delete"}
            variant="delete"
            onPress={() => {
              removeFunction(modalEditId!);
              setModalEditId(undefined);
              setIsConfirmDeleteVisible(false);
              setConfirmDeleteWord("");
            }}
          >
            Remove function
          </Button>
        </div>
      </EazyModal>

      <EazyModal
        title="Edit Function"
        isBigModal
        isDisablePaddings
        isVisible={modalEditId != undefined}
        intent={() => setModalEditId(undefined)}
      >
        <div className="flex flex-col h-full w-full">
          <Tabs
            isDisableBorders
            isDisablePaddings
            isFullSize
            titles={["View", "Debug"]}
          >
            <div className="flex flex-col h-full w-full">
              <SubNavbar
                title="Function body"
                onCreateAction={() => {
                  setIsConfirmDeleteVisible(true);
                }}
                createActionIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-3"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                createActionLabel="Remove"
              />

              <div className="w-full h-full">
                <FunctionViewEmbed id={modalEditId} />
              </div>
            </div>
            
            <FunctionDebuggerEmbed id={modalEditId}/>
          </Tabs>
        </div>
      </EazyModal>

      <SubNavbar
        title={string("dashboard.subtitle.functions")}
        onCreateAction={() => setOnAppendModal(true)}
        createActionLabel="Create Function"
      />

      <div className="p-2">
        <Table2
          onSelectedItem={(_, row) => setModalEditId(row.id)}
          dataset={functions}
        />
      </div>
    </>
  );
}
