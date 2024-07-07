import _ from "lodash";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import webConfig, { ApiPathEnum } from "~/web.config";
import classNames from "classnames";
import manWithIdea from "/man_with_idea.jpg";
import Tabs from "~/components/Tabs";
import FileEditorSignleFileEmbed from "./FileEditorSignleFile";
import EventEmitter from "eventemitter3";

export const $emitter = new EventEmitter();

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
      <svg
      viewBox="0 0 24 24"
      className="size-3 fill-indigo-500"
    >
      <path d="M12.043 23.968c.479-.004.953-.029 1.426-.094a11.805 11.805 0 003.146-.863 12.404 12.404 0 003.793-2.542 11.977 11.977 0 002.44-3.427 11.794 11.794 0 001.02-3.476c.149-1.16.135-2.346-.045-3.499a11.96 11.96 0 00-.793-2.788 11.197 11.197 0 00-.854-1.617c-1.168-1.837-2.861-3.314-4.81-4.3a12.835 12.835 0 00-2.172-.87h-.005c.119.063.24.132.345.201.12.074.239.146.351.225a8.93 8.93 0 011.559 1.33c1.063 1.145 1.797 2.548 2.218 4.041.284.982.434 1.998.495 3.017.044.743.044 1.491-.047 2.229-.149 1.27-.554 2.51-1.228 3.596a7.475 7.475 0 01-1.903 2.084c-1.244.928-2.877 1.482-4.436 1.114a3.916 3.916 0 01-.748-.258 4.692 4.692 0 01-.779-.45 6.08 6.08 0 01-1.244-1.105 6.507 6.507 0 01-1.049-1.747 7.366 7.366 0 01-.494-2.54c-.03-1.273.225-2.553.854-3.67a6.43 6.43 0 011.663-1.918c.225-.178.464-.333.704-.479l.016-.007a5.121 5.121 0 00-1.441-.12 4.963 4.963 0 00-1.228.24c-.359.12-.704.27-1.019.45a6.146 6.146 0 00-.733.494c-.211.18-.42.36-.615.555-1.123 1.153-1.768 2.682-2.022 4.256-.15.973-.15 1.96-.091 2.95.105 1.395.391 2.787.945 4.062a8.518 8.518 0 001.348 2.173 8.14 8.14 0 003.132 2.23 7.934 7.934 0 002.113.54c.074.015.149.015.209.015zm-2.934-.398a4.102 4.102 0 01-.45-.228 8.5 8.5 0 01-2.038-1.534c-1.094-1.137-1.827-2.566-2.247-4.08a15.184 15.184 0 01-.495-3.172 12.14 12.14 0 01.046-2.082c.135-1.257.495-2.501 1.124-3.58a6.889 6.889 0 011.783-2.053 6.23 6.23 0 011.633-.9 5.363 5.363 0 013.522-.045c.029 0 .029 0 .045.03.015.015.045.015.06.03.045.016.104.045.165.074.239.12.479.271.704.42a6.294 6.294 0 012.097 2.502c.42.914.615 1.934.631 2.938.014 1.079-.18 2.157-.645 3.146a6.42 6.42 0 01-2.638 2.832c.09.03.18.045.271.075.225.044.449.074.688.074 1.468.045 2.892-.66 3.94-1.647.195-.18.375-.375.54-.585.225-.27.435-.54.614-.823.239-.375.435-.75.614-1.154a8.112 8.112 0 00.509-1.664c.196-1.004.211-2.022.149-3.026-.135-2.022-.673-4.045-1.842-5.724a9.054 9.054 0 00-.555-.719 9.868 9.868 0 00-1.063-1.034 8.477 8.477 0 00-1.363-.915 9.927 9.927 0 00-1.692-.598l-.3-.06c-.209-.03-.42-.044-.634-.06a8.453 8.453 0 00-1.015.016c-.704.045-1.412.16-2.112.337C5.799 1.227 2.863 3.566 1.3 6.67A11.834 11.834 0 00.238 9.801a11.81 11.81 0 00-.104 3.775c.12 1.02.374 2.023.778 2.977.227.57.511 1.124.825 1.648 1.094 1.783 2.683 3.236 4.51 4.24.688.39 1.408.69 2.157.944.226.074.45.15.689.21z" />
    </svg>
    );
  }

  if (
    file.is_file &&
    (file.path.endsWith(".html") || file.path.endsWith(".htm"))
  ) {
    return (
      <svg viewBox="0 0 16 16" className="size-3 fill-red-600">
        <path
          // fill="currentColor"
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
        className="size-3 fill-[#008C45]"
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
        className="size-3 fill-[#CD212A]"
      >
        <path d="M8.372 1.349a.75.75 0 0 0-.744 0l-4.81 2.748L8 7.131l5.182-3.034-4.81-2.748ZM14 5.357 8.75 8.43v6.005l4.872-2.784A.75.75 0 0 0 14 11V5.357ZM7.25 14.435V8.43L2 5.357V11c0 .27.144.518.378.651l4.872 2.784Z" />
      </svg>
    );
  }

  if (file.path.endsWith("scenario")) {
    return (
      <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-3 fill-indigo-500"
    >
      <path d="M.258 4.142c-.579-.646-.12-1.672.747-1.672h14.139l-8.191 9.155L.258 4.142zM19.744 6.86l-3.629-4.056a1.002 1.002 0 00-.368-.257L7.289 12 .258 19.858c-.578.646-.12 1.672.748 1.672h5.613L19.744 6.86zm4 4.471l-1.695-1.895-1.97-2.201L7.289 21.53h8.079c.285 0 .557-.122.748-.334l5.934-6.632 1.695-1.895c.34-.381.34-.957-.001-1.338z" />
    </svg>
    )
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-3 fill-[#f48037]"
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
  const [pwdHistory, setPwdHistory] = useState<string[]>([]);
  const [isLastFileSaved, setIsLastFileSaved] = useState<boolean>(true);

  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    $emitter.on("doRefreshFileList", function () {
      fether();
    });
  }, []);

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

  const sortedFiles = useMemo(() => {
    if (_.isEmpty(files)) {
      return [];
    }
    
    let sorted = _.orderBy(files || [], "is_file");

    if (sorted.find(f => f.path == "/objects")) {
      sorted = sorted.filter(f => f.path != "/objects");
      sorted = [{ path: "/objects", is_file: false }, ...sorted]
    }

    if (sorted.find(f => f.path == "/plugins")) {
      sorted = sorted.filter(f => f.path != "/plugins");
      sorted = [{ path: "/plugins", is_file: false }, ...sorted]
    }

    if (sorted.find(f => f.path == "/scenario")) {
      sorted = sorted.filter(f => f.path != "/scenario");
      sorted = [{ path: "/scenario", is_file: false }, ...sorted]
    }

    return sorted;    
  }, [files]);

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
          });
      });
  }, [currentPwd]);

  return (
    <div className="w-full h-full bg-white overflow-hidden flex flex-row">
      {/* Left sidebar */}
      <div className="w-[200px] flex-shrink-0 h-full divide-y divide-zinc-200 border-r">
        {pwdHistory.length > 0 && (
          <File
            file={{ path: "..", is_file: false }}
            isSelected={false}
            setCurrentPwd={() => {
              let cloned = _.clone(_.dropRight(pwdHistory, 1));
              let lastPath = _.last(cloned);

              if (cloned.length  == 0) {
                setCurrentPwd("./");
              } else {
                setCurrentPwd(String(lastPath));
              }

              setPwdHistory(cloned);
              fether();            
            }}
            setCursorOnFile={closure}
          />    
        )}
      

        {sortedFiles.map((it) => {
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
