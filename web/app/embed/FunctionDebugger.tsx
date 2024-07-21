import HashMapEditor from "~/components/MapEditor";
import Label from "~/components/Label";
import _ from "lodash";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useCallback, useState } from "react";

interface ExecutionResult {
  readonly file_name: string;
  readonly output: string;
  readonly processor: string;
  readonly error: string | null;
  readonly success: boolean;
  readonly args: Record<string, string>;
  readonly runtime: number;
}

interface Props {
  readonly id?: string;
  readonly argv?: Record<string, string>;
  readonly onEditArgv?: (argv: Record<string, string>) => void;
}

/**
 * The FunctionDebuggerEmbed component renders a function debugger.
 *
 * @param {Props} props - The component props.
 * @param {string} props.id - The ID of the function to be debugged.
 * @param {Record<string, string>} props.argv - The arguments to be passed to the function.
 * @param {(argv: Record<string, string>) => void} props.onEditArgv - The callback function to be called when the arguments are edited.
 * @returns {JSX.Element} - The rendered component.
 */
export default function FunctionDebuggerEmbed({ id, argv, onEditArgv }: Props): JSX.Element {
  // State variables
  const [output, setOutput] = useState<ExecutionResult | undefined>(); // The execution result of the function
  const [isRunning, setIsRunning] = useState(false); // Flag indicating if the function is running
  const [debugParams, setDebugParams] = useState<Record<string, string>>(argv || {}); // The debug parameters

  /**
   * Fetches the execution result of the function.
   */
  const fether = useCallback(() => {
    setIsRunning(true);
    webConfig.axiosFactory("PRIVATE").then((i) => {
      i.post(
        webConfig.apiEndpointFactory(ApiPathEnum.RunFunctionWithDebugger),
        {
          id,
          argv: _.omit(debugParams),
        }
      )
        .then((res) => {
          setOutput(res.data.value as ExecutionResult);
        })
        .finally(() => {
          setIsRunning(false);
        });
    });
  }, [id, debugParams]);

  return (
    <div className="h-full w-full bg-white">
      {/* Header */}
      <div className="flex flex-row justify-between px-4 py-2 bg-white border-b border-b-zinc-100">
        <div>
          <span className="text-black font-medium text-xs">Debugger</span>
        </div>
        <div>
          {/* Run button */}
          {!isRunning ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 fill-lime-500 hover:fill-lime-600 cursor-pointer"
              onClick={fether}
            >
              <path
                fill-rule="evenodd"
                d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                clip-rule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-6 fill-red-500 hover:fill-red-600 cursor-pointer"
            >
              <path d="M5.25 3A2.25 2.25 0 0 0 3 5.25v9.5A2.25 2.25 0 0 0 5.25 17h9.5A2.25 2.25 0 0 0 17 14.75v-9.5A2.25 2.25 0 0 0 14.75 3h-9.5Z" />
            </svg>
          )}
        </div>
      </div>

      {/* Execution result */}
      <div className="p-4 pb-5 space-y-0 bg-zinc-50 border-b border-b-zinc-200">
        <Label>Execution result</Label>
        <pre className="text-xs font-mono text-zinc-600 select-text w-full whitespace-pre-wrap">
          {output?.output || "For get output click please run the function"}
        </pre>
      </div>

      {/* Debug parameters */}
      <div className="p-4 space-y-6">
        <div>
          <Label>Debug parameters</Label>
          {/* HashMapEditor */}
          <HashMapEditor
            startParams={argv || {}}
            onChangeParams={(it) => {
              setDebugParams(it);
              onEditArgv?.(it);
            }}
          />
        </div>
      </div>
    </div>
  );
}