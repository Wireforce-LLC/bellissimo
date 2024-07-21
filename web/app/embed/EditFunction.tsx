import Button from "~/components/Button";
import CreateTriggerEmbed from "./CreateTrigger";
import EazyModal from "~/components/EazyModal";
import FunctionDebuggerEmbed from "./FunctionDebugger";
import FunctionViewEmbed from "./FunctionViewEmbed";
import Input from "~/components/Input";
import SubNavbar from "~/components/SubNavbar";
import Tabs from "~/components/Tabs";
import TriggersByFunctionIdEmbed from "./TriggersByFunctionId";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useCallback, useState } from "react";

interface Props {
  readonly id?: string;
}

export default function EditFunctionEmbed({ id }: Props) {
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [confirmDeleteWord, setConfirmDeleteWord] = useState("");
  const [addTriggerModal, setAddTriggerModal] = useState(false);

  const [argv, setArgv] = useState<Record<string, string>>({});

  const removeFunction = useCallback((id: string) => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.delete(webConfig.apiEndpointFactory(ApiPathEnum.DeleteFunction), {
        params: {
          id,
        },
      }).then(() => {
        //   fether();
      });
    });
  }, []);

  return (
    <>
      <EazyModal
        title="Add trigger"
        zIndex={10}
        isVisible={addTriggerModal}
        intent={setAddTriggerModal}
      >
        <CreateTriggerEmbed funcId={id} />
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
              removeFunction(id!);
              //   setModalEditId(undefined);
              setIsConfirmDeleteVisible(false);
              setConfirmDeleteWord("");
            }}
          >
            Remove function
          </Button>
        </div>
      </EazyModal>
      <div className="flex flex-col h-full w-full">
        <Tabs
          isDisableBorders
          isDisablePaddings
          isFullSize
          titles={["View", "Debug", "Triggers"]}
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
              <FunctionViewEmbed id={id!} />
            </div>
          </div>

          <FunctionDebuggerEmbed argv={argv} onEditArgv={setArgv} id={id!} />

          <div>
            <SubNavbar
              createActionLabel=""
              onCreateAction={() => {
                setAddTriggerModal(true);
              }}
              title="Triggers"
            />

            <div className="p-2">
              <TriggersByFunctionIdEmbed id={id} />
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
}
