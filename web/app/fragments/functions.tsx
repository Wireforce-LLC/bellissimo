import CreateFunctionEmbed from "~/embed/CreateFunction";
import EazyModal from "~/components/EazyModal";
import EditFunctionEmbed from "~/embed/EditFunction";
import SubNavbar from "~/components/SubNavbar";
import Table2 from "~/components/Table2";
import Tabs from "~/components/Tabs";
import TriggersListEmbed from "~/embed/TriggersList";
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
        title="Edit Function"
        isBigModal
        isDisablePaddings
        isVisible={modalEditId != undefined}
        intent={() => setModalEditId(undefined)}
      >
        <EditFunctionEmbed id={modalEditId}/>
      </EazyModal>

      <SubNavbar
        title={string("dashboard.subtitle.functions")}
        onCreateAction={() => setOnAppendModal(true)}
        createActionLabel="Create Function"
      />

      <Tabs titles={["Functions", "Scheduled", "Triggers"]} isDisableBorders isDisablePaddings>
        <div className="p-2">
          <Table2
            onSelectedItem={(_, row) => setModalEditId(row.id)}
            dataset={functions}
          />
        </div>

        <div>...</div>

        <div className="p-2">
          <TriggersListEmbed/>
        </div>
      </Tabs>
    </>
  );
}
