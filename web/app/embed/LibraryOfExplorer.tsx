import { useEffect, useState } from "react";
import webConfig, { ApiPathEnum } from "~/web.config";

interface Template {
  readonly name: string;
  readonly template: any[];
}

interface Props {
  readonly onSelectedTemplate?: (template: Template) => void;
}

export default function LibraryOfExplorerEmbed({ onSelectedTemplate }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    webConfig.axiosFactory("PRIVATE").then((axios) => {
      axios
        .get(webConfig.apiEndpointFactory(ApiPathEnum.GetAllTemplatesList))
        .then((data) => {
          setTemplates(data.data.value);
        });
    });
  }, []);
  return (
    <>
      <div>
        {templates.map((template) => {
          return (
            <div
              className="cursor-pointer px-3 py-1.5 hover:bg-gray-100 flex flex-row justify-between items-center"
              key={template.name}
              onClick={() => onSelectedTemplate?.(template)}
            >
              <span className="text-xs">{template.name}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-3 fill-zinc-400"
              >
                <path d="M13.75 7h-3v5.296l1.943-2.048a.75.75 0 0 1 1.114 1.004l-3.25 3.5a.75.75 0 0 1-1.114 0l-3.25-3.5a.75.75 0 1 1 1.114-1.004l1.943 2.048V7h1.5V1.75a.75.75 0 0 0-1.5 0V7h-3A2.25 2.25 0 0 0 4 9.25v7.5A2.25 2.25 0 0 0 6.25 19h7.5A2.25 2.25 0 0 0 16 16.75v-7.5A2.25 2.25 0 0 0 13.75 7Z" />
              </svg>
            </div>
          );
        })}
      </div>
    </>
  );
}
