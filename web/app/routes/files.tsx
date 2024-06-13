import type { MetaFunction } from "@remix-run/node";
import _ from "lodash";
import { useState, useEffect, useCallback, useRef } from "react";
import Modal from "~/components/Modal";
import SubNavbar from "~/components/SubNavbar";
import DashboardLayout, { LeftActiveBarItem } from "~/layouts/DashboardLayout";
import string from "~/localization/polyglot";
import webConfig, { ApiPathEnum } from "~/web.config";
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import toast from "react-hot-toast";

export const meta: MetaFunction = () => {
  return [{ title: string("meta.title.files") }];
};


export default function Files() {
  const [data, setData] = useState<any[] | undefined>(undefined);
  const [rawContent, setRawContent] = useState<string>("");

  const [currentPwd, setCurrentPwd] = useState("/");
  const [cursorOnFile, setCursorOnFile] = useState<string|undefined>();
  const [rawLanguage, setRawLanguage] = useState<string>("html");

  const editorRef = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    let ext = String(cursorOnFile?.split('.').pop()).toLowerCase()

    switch (ext) {
      case 'js':
        setRawLanguage('javascript');
        break;
    
      default:
        setRawLanguage(ext);
        break;
    }
  }, [rawContent]);

  useEffect(() => {
    fether();
  }, [currentPwd]);

  useEffect(() => {
    setCursorOnFile(undefined);
  }, [currentPwd]);
  
  useEffect(() => {
    if (cursorOnFile) {
      setRawContent("Loading... 😈");

      webConfig.axiosFactory("PRIVATE").then((i) => {
        i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetFile) + '?path=' + cursorOnFile).then(
          (res) => {
            setRawContent(res.data.value);
          }
        );
      });  
    }
  }, [cursorOnFile]);

  const fether = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllFiles) + '?path=' + currentPwd).then(
        (res) => {
          setData(res.data.value);
        }
      );
    });
  }, [currentPwd]); 

  return (
    <DashboardLayout
      subTitle={string("dashboard.subtitle.files")}
      currentLeftActiveBarItem={LeftActiveBarItem.FILES}
    >
      <SubNavbar 
        createActionLabel="Save file"
        onCreateAction={() => {
          if (_.isEmpty(rawContent)) {
            return
          }
          
          let data = new FormData();

          data.append("content", rawContent);

          webConfig.axiosFactory("PRIVATE").then((i) => {
            toast.promise(
              i.post(
                webConfig.apiEndpointFactory(ApiPathEnum.WriteFile) + '?path=' + cursorOnFile,
                data
              ),
               {
                 loading: 'Saving...',
                 success: 'File saved!',
                 error: 'Could not save.',
               }
             );
            }
          );
        
        }}
        title={string("dashboard.subtitle.files")} />

      <div className="w-full h-full bg-white overflow-hidden flex flex-row">
        <div className="w-[200px] h-full divide-y divide-zinc-200 border-r ">
          {_.orderBy(data || [], "is_file").map((it) => (
            <div onClick={() => {
              if (!it.is_file) {
                setCurrentPwd(it.path)
              } else {
                setCursorOnFile(it.path);
              }
            }} className="w-full cursor-pointer flex flex-row items-center gap-2 bg-white py-1 px-2">
              {!it.is_file ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3 fill-yellow-500">
                <path d="M3.75 3A1.75 1.75 0 0 0 2 4.75v3.26a3.235 3.235 0 0 1 1.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0 0 16.25 5h-4.836a.25.25 0 0 1-.177-.073L9.823 3.513A1.75 1.75 0 0 0 8.586 3H3.75ZM3.75 9A1.75 1.75 0 0 0 2 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0 0 18 15.25v-4.5A1.75 1.75 0 0 0 16.25 9H3.75Z" />
                </svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3 fill-gray-500">
                  <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                  <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                </svg>
              }

              <span className="text-xs">{_.last(_.split(it.path, "/"))}</span>
            </div>
          ))}
        </div>

        <div className="overflow-hidden w-full h-full" ref={editorRef}>
          {
            typeof window !== "undefined" &&
            <Editor
              width={editorRef.current?.clientWidth} 
              line={0}
              height="calc(100vh - 120px)" 
              defaultLanguage="html"
              language={rawLanguage}
              value={rawContent}
              theme="vs-light"
              options={{
                formatOnType: true,
                formatOnPaste: true
              }}
              onChange={it => {
                if (it) {
                  setRawContent(it);
                }
              }} />
          }
        </div>
      </div>
      
    </DashboardLayout>
  );
}
