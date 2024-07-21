import MonacoEditorEmbed from "./MonacoEditor";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { toast } from "react-hot-toast";

interface Props {
  readonly path: string;
  readonly isLock?: boolean;
  readonly onSavedContent?: () => void;
  readonly onChangeContent?: (content: string) => void;
}

export default function FileEditorSignleFileEmbed({
  path,
  isLock,
  onChangeContent,
  onSavedContent,
}: Props) {
  const [language, setLanguage] = useState("HTML");
  const [isReady, setReady] = useState(false);
  const [raw, setRaw] = useState("");

  /**
   * Handle the change content
   */
  const applyLanguage = useCallback(() => {
    let ext = String(path?.split(".").pop()).toLowerCase();

    switch (ext) {
      case "js":
        setLanguage("javascript");
        break;

      default:
        setLanguage(ext);
        break;
    }
  }, [path]);

  useEffect(() => {
    if (!path) {
      return;
    }

    webConfig
      .axiosFactory("PRIVATE")
      .then((i) => {
        i.get(
          webConfig.apiEndpointFactory(ApiPathEnum.GetFile) + "?path=" + path
        )
          .then((res) => {
            setRaw(res.data.value);
            setReady(true)
            applyLanguage()
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [path]);

  const doSaveFile = useCallback((content: string, path: string) => {
    const data = new FormData();

    data.append("content", content);

    webConfig
      .axiosFactory("PRIVATE")
      .then((i) => {
        toast
          .promise(
            i.post(
              webConfig.apiEndpointFactory(ApiPathEnum.WriteFile) +
                "?path=" +
                path,
              data
            ),
            {
              loading: "Saving...",
              success: (
                <div>
                  <h4 className="text-lime-500 font-bold">Saved!</h4>
                  <p className="text-xs text-zinc-500">{path}</p>
                </div>
              ),
              error: "Could not save.",
            }
          )
          .then(() => {
            // setIsLastFileSaved(true)
            onSavedContent?.();
          });
      })
      .catch((error) => {
        console.error(error);
      });

    return true;
  }, [onSavedContent]);

  return (
    <div className="w-full h-full">
      <div className="px-4 py-2 text-xs text-gray-500 flex flex-row items-center gap-2 justify-start border-b border-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-3"
        >
          <path d="M2.5 3.5A1.5 1.5 0 0 1 4 2h4.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12a1.5 1.5 0 0 1 .439 1.061V12.5A1.5 1.5 0 0 1 12 14H4a1.5 1.5 0 0 1-1.5-1.5v-9Z" />
        </svg>

        {
          isLock ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3 text-red-600">
              <path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3 text-lime-600">
              <path d="M11.5 1A3.5 3.5 0 0 0 8 4.5V7H2.5A1.5 1.5 0 0 0 1 8.5v5A1.5 1.5 0 0 0 2.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 9.5 7V4.5a2 2 0 1 1 4 0v1.75a.75.75 0 0 0 1.5 0V4.5A3.5 3.5 0 0 0 11.5 1Z" />
            </svg>
          )
        }

        <span>{path}</span>
      </div>

      {isReady && <MonacoEditorEmbed
        onChangeContent={(raw) => {
          onChangeContent?.(raw);
          setRaw(raw);
        }}
        language={language}
        startContent={raw}
        theme="vs"
        onIntentSave={(content) => doSaveFile(content, path)}
      />}
    </div>
  );
}
