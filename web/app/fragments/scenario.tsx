import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import FirstRecordPlease from "~/components/FirstRecordPlease";
import SafeWhiteSpace from "~/components/SafeWhiteSpace";
import SubNavbar from "~/components/SubNavbar";
import Tabs from "~/components/Tabs";
import DocsBar from "~/embed/DocsBar";
import string from "~/localization/polyglot";
import webConfig, { ApiPathEnum } from "~/web.config";

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

export default function Scenario() {
  const [logs, setLogs] = useState<LogEntity[] | undefined>(undefined);

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllScenarioLogs)).then(
        (res) => {
          setLogs(res.data.value);
        }
      );
    });
  }, []);

  useEffect(() => fether(), [fether]);

  return (
    <>
      <SubNavbar
        title={string("dashboard.subtitle.scenario")}
        // onCreateAction={() => setIsModalCreateVisible(true)}
      />

      <div className="w-full h-full flex flex-row overflow-hidden">
        <div className="h-full w-full">
          <Tabs
            isFullSize
            isDisablePaddings
            isDisableBorders
            titles={["Logs", "Linked"]}
          >
            <div className="h-full overflow-y-auto">
              <FirstRecordPlease
                title="Create router"
                text="Create your first router to route traffic from different domains, different paths. Create and manage full-fledged routers"
                // isVisible={_.isEmpty(data) && _.isArray(data)}
                // icon={<img className="h-20" src={routerImage} alt="Server image" />}
              />

              {/* {JSON.stringify(logs)} */}

              {logs &&
                logs.length > 0 &&
                logs.map((log) => (
                  <div
                    key={log.event_name}
                    className="grid h-fit grid-cols-12 gap-2 text-[12px] hover:bg-zinc-50 p-2 cursor-text"
                  >
                    <span className="col-span-1 text-ellipsis overflow-hidden flex flex-row h-fit items-center justify-start gap-2">
                      {moment(log.time * 1000).format("DD.MM.YYYY HH:mm:ss")}
                    </span>
                    <span className="col-span-1 text-ellipsis overflow-hidden flex flex-row h-fit items-center justify-start gap-2">
                      <svg
                        className="size-3"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M10.76 8.69a.76.76 0 00-.76.76V20.9c0 .42.34.76.76.76.19 0 .35-.06.48-.16l1.91-1.55 1.66 3.62c.13.27.4.43.69.43.11 0 .22 0 .33-.08l2.76-1.28c.38-.18.56-.64.36-1.01L17.28 18l2.41-.45a.88.88 0 00.43-.26c.27-.32.23-.79-.12-1.08l-8.74-7.35-.01.01a.756.756 0 00-.49-.18M15 10V8h5v2h-5m-1.17-5.24l2.83-2.83 1.41 1.41-2.83 2.83-1.41-1.41M10 0h2v5h-2V0M3.93 14.66l2.83-2.83 1.41 1.41-2.83 2.83-1.41-1.41m0-11.32l1.41-1.41 2.83 2.83-1.41 1.41-2.83-2.83M7 10H2V8h5v2" />
                      </svg>
                      <span className="text-zinc-800">{log.event_name}</span>
                    </span>
                    <span className="col-span-2 text-ellipsis overflow-hidden">
                      <span className="text-wrap text-ellipsis truncate text-[#578ad6] w-full">
                        {log.params.ip}
                      </span>
                    </span>
                    <span className="col-span-8 whitespace-pre-line text-zinc-400 hover:text-black active:text-black w-full h-fit">
                      {log.result}
                    </span>
                  </div>
                ))}

              <SafeWhiteSpace />
            </div>

            <div></div>
          </Tabs>
        </div>

        <div className="h-full w-[300px] border-l border-l-zinc-200">
          <DocsBar id="how_to_work_routers" />
        </div>
      </div>
    </>
  );
}
