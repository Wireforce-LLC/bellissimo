import _ from "lodash";
import {
  Editor,
  Monaco,
  MonacoDiffEditor,
  useMonaco,
} from "@monaco-editor/react";
import {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import webConfig, { ApiPathEnum } from "~/web.config";
import { M } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import BigInput from "~/components/BigInput";
import Select from "~/components/Select";
import classNames from "classnames";
import manWithIdea from "/man_with_idea.jpg";
import Tabs from "~/components/Tabs";
import MonacoEditorEmbed from "./MonacoEditor";
import FileEditorSignleFileEmbed from "./FileEditorSignleFile";

interface File {
  readonly path: string;
  readonly is_file: boolean;
}

interface Props {
  readonly pwd?: string;
  readonly onChangePwd?: (pwd: string) => void;
  readonly onReady?: () => void;
}

interface Tab {
  readonly name: string;
  readonly path: string;
  readonly isActive: boolean;
}

const closure = () => {};

function FileIcon({ file }: { file: File }) {
  if (file.is_file && file.path.endsWith(".js")) {
    return (
      <svg
        viewBox="0 0 32 32"
        fill="currentColor"
        className="size-3 fill-gray-500"
      >
        <path
          fill="currentColor"
          d="M9.633 7.968h3.751v10.514c0 4.738-2.271 6.392-5.899 6.392-.888 0-2.024-.148-2.764-.395l.42-3.036a6.18 6.18 0 001.925.296c1.58 0 2.567-.716 2.567-3.282V7.968zm7.008 12.785c.987.518 2.567 1.037 4.171 1.037 1.728 0 2.641-.716 2.641-1.826 0-1.012-.79-1.629-2.789-2.32-2.764-.987-4.59-2.517-4.59-4.961 0-2.838 2.394-4.985 6.293-4.985 1.9 0 3.258.37 4.245.839l-.839 3.011a7.779 7.779 0 00-3.455-.79c-1.629 0-2.419.765-2.419 1.604 0 1.061.913 1.53 3.085 2.369 2.937 1.086 4.294 2.616 4.294 4.985 0 2.789-2.122 5.158-6.688 5.158-1.9 0-3.776-.518-4.714-1.037l.765-3.085z"
        />
      </svg>
    );
  }

  if (file.is_file && file.path.endsWith(".php")) {
    return (
      <svg viewBox="0 0 24 24" fill="#777BB3" className="size-3">
        <path
          fillRule="evenodd"
          d="M10 12v8A10 10 0 018.17.17L10 2h5a5 5 0 015 4.99v9.02A4 4 0 0116 20v-2a2 2 0 100-4h-4l-2-2zm5.5-3a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        />{" "}
      </svg>
    );
  }

  if (file.is_file && file.path.endsWith(".json")) {
    return (
      <svg viewBox="0 0 24 24" fill="#777BB3" className="size-3">
        <path d="M5 3h2v2H5v5a2 2 0 01-2 2 2 2 0 012 2v5h2v2H5c-1.07-.27-2-.9-2-2v-4a2 2 0 00-2-2H0v-2h1a2 2 0 002-2V5a2 2 0 012-2m14 0a2 2 0 012 2v4a2 2 0 002 2h1v2h-1a2 2 0 00-2 2v4a2 2 0 01-2 2h-2v-2h2v-5a2 2 0 012-2 2 2 0 01-2-2V5h-2V3h2m-7 12a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1m-4 0a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1m8 0a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1z" />
      </svg>
    );
  }

  if (
    file.is_file &&
    (file.path.endsWith(".html") || file.path.endsWith(".htm"))
  ) {
    return (
      <svg viewBox="0 0 16 16" fill="#777BB3" className="size-3">
        <path
          fill="currentColor"
          d="M.946 0L2.23 14.4 7.992 16l5.777-1.602L15.055 0H.947zM12.26 4.71H5.502l.161 1.809H12.1l-.485 5.422-3.623 1.004-3.618-1.004-.247-2.774H5.9l.126 1.41 1.967.53.004-.001 1.968-.531.204-2.29H4.048l-.476-5.341h8.847l-.158 1.766z"
        />
      </svg>
    );
  }

  if (file.is_file) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-3 fill-gray-500"
      >
        {/* File icon path */}
        <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
        <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
      </svg>
    );
  }

  if (file.path.endsWith("objects")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="size-3 fill-lime-500"
      >
        <path d="M8 7c3.314 0 6-1.343 6-3s-2.686-3-6-3-6 1.343-6 3 2.686 3 6 3Z" />
        <path d="M8 8.5c1.84 0 3.579-.37 4.914-1.037A6.33 6.33 0 0 0 14 6.78V8c0 1.657-2.686 3-6 3S2 9.657 2 8V6.78c.346.273.72.5 1.087.683C4.42 8.131 6.16 8.5 8 8.5Z" />
        <path d="M8 12.5c1.84 0 3.579-.37 4.914-1.037.366-.183.74-.41 1.086-.684V12c0 1.657-2.686 3-6 3s-6-1.343-6-3v-1.22c.346.273.72.5 1.087.683C4.42 12.131 6.16 12.5 8 12.5Z" />
      </svg>
    );
  }

  if (file.path.endsWith("plugins")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="size-3 fill-orange-500"
      >
        <path d="M8.372 1.349a.75.75 0 0 0-.744 0l-4.81 2.748L8 7.131l5.182-3.034-4.81-2.748ZM14 5.357 8.75 8.43v6.005l4.872-2.784A.75.75 0 0 0 14 11V5.357ZM7.25 14.435V8.43L2 5.357V11c0 .27.144.518.378.651l4.872 2.784Z" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-3 fill-yellow-500"
    >
      {/* Directory icon path */}
      <path d="M3.75 3A1.75 1.75 0 0 0 2 4.75v3.26a3.235 3.235 0 0 1 1.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0 0 16.25 5h-4.836a.25.25 0 0 1-.177-.073L9.823 3.513A1.75 1.75 0 0 0 8.586 3H3.75ZM3.75 9A1.75 1.75 0 0 0 2 10.75v4.5c0 .966.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A1.75 1.75 0 0 0 16.25 9H3.75Z" />
    </svg>
  );
}

/**
 * Renders a file as a clickable component.
 *
 * @param {Object} props - The component props.
 * @param {File} props.file - The file object.
 * @param {Function} props.setCurrentPwd - The function to set the current working directory.
 * @param {Function} props.setCursorOnFile - The function to set the cursor on a file.
 * @return {JSX.Element} The rendered file component.
 */
function File({
  file,
  setCurrentPwd,
  isSelected,
  setCursorOnFile,
}: {
  file: File;
  setCursorOnFile: (path: string) => void;
  setCurrentPwd: (pwd: string) => void;
  isSelected: boolean;
}) {
  // Render the file as a clickable component
  return (
    <div
      onClick={() => {
        // If the file is a directory, set the current working directory
        if (!file.is_file) {
          setCurrentPwd(file.path);
        } else {
          // If the file is a file, set the cursor on the file
          setCursorOnFile(file.path);
        }
      }}
      className={classNames(
        "w-full hover:bg-gray-100 font-mono cursor-pointer flex flex-row items-center gap-2 bg-white py-1 px-2",
        {
          "bg-gray-100": isSelected,
        }
      )}
    >
      <FileIcon file={file} />

      {/* Render the file name */}
      <span className="text-xs">{_.last(_.split(file.path, "/"))}</span>
    </div>
  );
}

/**
 * Represents a tab component.
 * @param props - The props for the tab.
 * @returns The rendered tab component.
 */
function Tab(props: Tab) {
  // Render the tab component.
  return (
    <div
      className={classNames(
        "w-fit text-gray-500 hover:text-gray-700 rounded hover:bg-zinc-100 h-[32px] font-mono cursor-pointer flex flex-row items-center gap-2 bg-white py-1 px-2",
        {
          "border-b border-b-zinc-300 bg-zinc-100": props.isActive,
        }
      )}
    >
      {/* Render the tab name */}
      <span className="text-xs">{props.name}</span>
    </div>
  );
}

interface File {
  readonly path: string;
  readonly is_file: boolean;
}

/**
 * Represents a file editor embed component.
 * @param pwd - The starting path.
 * @returns The rendered file editor embed component.
 */
export default function FileEditorEmbed({ pwd = "/", onChangePwd, onReady }: Props) {
  const [files, setFiles] = useState<File[] | undefined>(undefined);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [currentPwd, setCurrentPwd] = useState(pwd);
  const [cursorOnFile, setCursorOnFile] = useState<string | undefined>();
  const [pwdHistory, setPwdHistory] = useState<string[]>([pwd]);
  const [isLastFileSaved, setIsLastFileSaved] = useState<boolean>(true);

  const editorRef = useRef<HTMLDivElement | null>(null);

  /**
   * Creates a tab for the given path.
   * @param path - The path of the tab.
   */
  const createTab = (path: string) => {
    setTabs(
      _.uniqBy(tabs.concat([{ name: path, path, isActive: true }]), "path")
    );
  };

  useEffect(() => {
    fether();

    onChangePwd?.(currentPwd);
  }, [currentPwd]);

  useEffect(() => {
    if (!cursorOnFile) {
      return;
    }

    createTab(cursorOnFile);
  }, [cursorOnFile]);

  const doIntentChangeTab = useCallback(() => {
    if (isLastFileSaved) {
      return true;
    }

    toast.error("Please save the file before changing tabs!");

    return false;
  }, [isLastFileSaved]);

  /**
   * Fetches the data for the current path.
   */
  const fether = useCallback(() => {
    webConfig
      .axiosFactory("PRIVATE")
      .then((i) => {
        i.get(
          webConfig.apiEndpointFactory(ApiPathEnum.GetAllFiles) +
            "?path=" +
            currentPwd
        )
          .then((res) => {
            setFiles(res.data.value as File[]);
            onReady?.()
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentPwd]);

  return (
    <div className="w-full h-full bg-white overflow-hidden flex flex-row">
      {/* Left sidebar */}
      <div className="w-[200px] flex-shrink-0 h-full divide-y divide-zinc-200 border-r">
        <File
          file={{ path: "..", is_file: false }}
          isSelected={false}
          setCurrentPwd={(it) => {
            let lastPath = _.last(pwdHistory);

            setPwdHistory(_.dropRight(pwdHistory, 1));
            setCurrentPwd(lastPath || "/");
            fether();
          }}
          setCursorOnFile={closure}
        />

        {_.orderBy(files || [], "is_file").map((it) => {
          return (
            <File
              file={it}
              isSelected={cursorOnFile === it.path}
              setCurrentPwd={(it) => {
                setCurrentPwd(it);
                setPwdHistory(pwdHistory.concat([it]));
              }}
              setCursorOnFile={(it) => {
                if (!isLastFileSaved) {
                  toast(
                    <div>
                      <span>Please save your work before leaving!</span>
                      <div className="text-xs text-gray-500">
                        You have unsaved changes
                      </div>

                      <button
                        onClick={() => {
                          setIsLastFileSaved(true);
                          toast.dismiss();
                          toast.success("Unlocked!");
                        }}
                        className="mt-2 w-fit px-2 py-1 text-xs text-white bg-zinc-100 rounded cursor-pointer hover:bg-zinc-200 text-zinc-500"
                      >
                        Unlock
                      </button>
                    </div>,
                    {
                      icon: "✍️",
                      duration: 3000,
                    }
                  );
                  return;
                }

                setCursorOnFile(it);
              }}
            />
          );
        })}
      </div>

      {/* Right editor */}
      <div className="overflow-hidden w-full h-full" ref={editorRef}>
        <div className="w-full h-full">
          {!cursorOnFile && (
            <div className="w-full h-[70%] flex flex-col items-center justify-center">
              <img src={manWithIdea} alt="" className="w-64" />
              <h1 className="font-medium text-gray-black">
                Before your idea become real
              </h1>
              <p className="text-xs text-gray-500">
                Select a file, or create a new one
              </p>
            </div>
          )}

          <Tabs
            onIntentChangeTab={doIntentChangeTab}
            isFullSize
            isDisablePaddings
            titles={tabs.map((tab) => tab.name.replace(/^.*[\\/]/, ""))}
          >
            {tabs.map((tab) => (
              <FileEditorSignleFileEmbed
                key={tab.path}
                isLock={!isLastFileSaved}
                path={tab.path}
                onChangeContent={() => {
                  setIsLastFileSaved(false);
                }}
                onSavedContent={() => {
                  setIsLastFileSaved(true);
                }}
              />
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
