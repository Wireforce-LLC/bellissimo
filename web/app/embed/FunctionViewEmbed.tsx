import MonacoEditorEmbed from "./MonacoEditor";
import webConfig, { ApiPathEnum } from "~/web.config";
import { Axios } from "axios";
import { useCallback, useEffect, useState } from "react";

interface Props {
  readonly id?: string;
}

export default function FunctionViewEmbed({ id }: Props) {
  const [data, setData] = useState<any | undefined>(undefined);
  const [sourceCode, setSourceCode] = useState<any | undefined>(undefined);
  const [statusText, setStatusText] = useState<string | undefined>();

  const fether = useCallback(() => {
    setStatusText("Fetching source code...");
    webConfig.axiosFactory("PRIVATE").then((i: Axios) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetFunction), {
        params: {
          id,
        },
      }).then((res) => {
        setData(res.data.value);
      });

      i.get(webConfig.apiEndpointFactory(ApiPathEnum.ReadFunction), {
        params: {
          id,
        },
      }).then((res) => {
        setSourceCode(res.data.value);
        setStatusText(undefined);
      });
    });
  }, [id]);

  const writeFunction = useCallback(
    (sourceCode: string) => {
      setStatusText("Saving...");
      webConfig.axiosFactory("PRIVATE").then((i: Axios) => {
        i.post(webConfig.apiEndpointFactory(ApiPathEnum.WriteFunction), {
          id,
          content: sourceCode,
        }).then(() => {
          setStatusText("Saved");
          fether();
        });
      });

      return true;
    },
    [id]
  );

  useEffect(() => {
    fether();
  }, [id]);

  return (
    <div className="w-full h-full relative flex flex-col">
      <div className="w-full h-full">
        <MonacoEditorEmbed
          isHiddenRightBar
          language="php"
          onIntentSave={writeFunction}
          startContent={sourceCode}
        />
      </div>

      <div className="w-full flex-shrink-0 absolute bottom-0 px-2 py-0.5  text-black text-[12px] bg-zinc-100 border-t border-zinc-300">
        {statusText}
      </div>
    </div>
  );
}
