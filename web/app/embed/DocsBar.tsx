import { useRef } from "react";

interface Props {
  readonly id: string;
}

export default function DocsBar({ id }: Props) {
  const refIframe = useRef<HTMLIFrameElement | null>(null);

  return (
    <div className="w-full h-full">
      <div className="p-2 border-b border-gray-200 flex items-center flex-row gap-2">
        <button className="hover:bg-blue-50 p-1" onClick={() => (refIframe.current?.contentWindow?.history?.length || 0) > 0 && refIframe.current?.contentWindow?.history.back()}>
          <svg
            viewBox="0 0 512 512"
            fill="currentColor"
            height="1em"
            width="1em"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={32}
              d="M112 160l-64 64 64 64"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={32}
              d="M64 224h294c58.76 0 106 49.33 106 108v20"
            />
          </svg>
        </button>
        <h1 className="text-sm font-extralight">
            Documentation
        </h1>
      </div>

      <iframe ref={refIframe} sandbox="" src={"/docs?id=" + id} className="w-full h-full p-2" />
    </div>
  );
}
