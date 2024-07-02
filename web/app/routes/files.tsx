import type { MetaFunction } from "@remix-run/node";
import _, { set } from "lodash";
import SubNavbar from "~/components/SubNavbar";
import DashboardLayout, { LeftActiveBarItem } from "~/layouts/DashboardLayout";
import string from "~/localization/polyglot";
import FileEditorEmbed from "~/embed/FileEditor";
import { useCallback, useEffect, useState } from "react";
import Modal from "~/components/Modal";
import Input from "~/components/Input";
import Button from "~/components/Button";
import webConfig, { ApiPathEnum } from "~/web.config";
import toast from "react-hot-toast";
import classNames from "classnames";

export const meta: MetaFunction = () => {
  return [{ title: string("meta.title.files") }];
};

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
      )
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

      <div className={classNames("w-full h-full flex flex-row", {
        "hidden": isReady
      })}>
        
        <div className="w-[200px] flex-shrink-0 border-r border-r-zinc-200 h-full animate-pulse bg-zinc-100"></div>
        <div className="w-full h-full animate-pulse bg-zinc-50"></div>
      </div>
      
      {/* Render the file editor */}
      <div className={classNames("w-full h-full", {
        "hidden": !isReady
      })}>
        <FileEditorEmbed onReady={() => setReady(true)} onChangePwd={setPwd} pwd={pwd} />
      </div>
    </>
  );
}
