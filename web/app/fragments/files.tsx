import Button from "~/components/Button";
import FileEditorEmbed, { $emitter as $fileEmitter } from "~/embed/FileEditor";
import Input from "~/components/Input";
import Modal from "~/components/Modal";
import SubNavbar from "~/components/SubNavbar";
import classNames from "classnames";
import string from "~/localization/polyglot";
import toast from "react-hot-toast";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useCallback, useEffect, useState } from "react";

/**
 * Represents a file list page.
 * @returns The rendered file list page.
 */
export default function Files() {
  const [isReady, setReady] = useState(false);
  /**
   * The visibility state of the modal to create a file.
   */
  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);

  /**
   * The current path of the file editor.
   */
  const [pwd, setPwd] = useState<string | undefined>();
  const [name, setName] = useState<string | undefined>();

  /**
   * Handles the keydown event.
   * @param e - The keydown event.
   */
  const keydownHandler = (e: KeyboardEvent) => {
    if (e.key === "n" && (e.ctrlKey || e.metaKey || e.altKey)) {
      e.preventDefault();
      setIsModalCreateVisible(true);
    }
  };

  const onCreateFile = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      const data = new FormData();

      data.append("pwd", pwd!);
      data.append("name", name!);

      toast.promise(
        i.post(webConfig.apiEndpointFactory(ApiPathEnum.CreateFile), data),
        {
          loading: "Creating file...",
          success: (
            <div>
              <span className="font-medium">File created successfully</span>
              <p className="text-xs text-zinc-500">
                {pwd}/{name}
              </p>
            </div>
          ),
          error: "Failed to create file",
        }
      ).then(() => {
        $fileEmitter.emit("doRefreshFileList");
      });
    });
  }, [pwd, name]);

  useEffect(() => {
    // Add the keydown event listener
    document.addEventListener("keydown", keydownHandler);

    // Remove the keydown event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  /**
   * Renders the file list page.
   * @returns The rendered file list page.
   */
  return (
    <>
      <SubNavbar
        onCreateAction={() => setIsModalCreateVisible(true)}
        createActionLabel="Create file"
        title={string("dashboard.subtitle.files")}
      />

      {/* Render the modal to create a file */}
      {isModalCreateVisible && (
        <Modal
          title="Create file"
          onClose={() => setIsModalCreateVisible(false)}
        >
          <div className="flex flex-col gap-4">
            <Input
              value={pwd}
              onChangeValue={(it) => setPwd(it)}
              label="PWD"
              isDisabled
              placeholder="PWD"
            />

            <Input
              value={name}
              onChangeValue={(it) => setName(it)}
              label="Path"
              placeholder="Path"
            />

            <Button onPress={onCreateFile}>Create</Button>
          </div>
        </Modal>
      )}

      <div
        className={classNames("w-full h-full flex flex-row", {
          hidden: isReady,
        })}
      >
        <div className="w-[200px] flex-shrink-0 border-r border-r-zinc-200 h-full animate-pulse bg-zinc-100"></div>
        <div className="w-full h-full animate-pulse bg-zinc-50"></div>
      </div>

      {/* Render the file editor */}
      <div
        style={{ height: "calc(100vh - 38px - 45px - 32px)" }}
        className={classNames("w-full flex flex-row overflow-hidden", {
          hidden: !isReady,
        })}
      >
        { pwd?.includes("scenario/events") && <div className="border-b border-zinc-200 px-3 py-2">
            <p className="text-xs">
              <span className="font-medium">Scenario</span> 
              {" - "}
              <span className="text-zinc-500">
                scripts in this folder automatically become executable files for the system. This means that any call to an event (click) named N will call the N.php file in that folder. <i>Please note that case is important.</i>
              </span>
            </p>
          </div> }

          <FileEditorEmbed
            onReady={() => setReady(true)}
            onChangePwd={setPwd}
            pwd={pwd}
          />

      </div>
    </>
  );
}
