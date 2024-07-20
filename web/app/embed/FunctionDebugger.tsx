import Button from "../components/Button";
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
}

export default function FunctionDebuggerEmbed({id} : Props) {
    const [output, setOutput] = useState<ExecutionResult | undefined>();

    const fether = useCallback(() => {
        webConfig.axiosFactory("PRIVATE").then((i) => {
            i.post(webConfig.apiEndpointFactory(ApiPathEnum.RunFunctionWithDebugger), {
                id,
                argv: {

                }
            }).then((res) => {
                setOutput(res.data.value as ExecutionResult);
            });
        });
    }, [id])

    return (
        <div>
            <pre>{output?.output}</pre>

            <Button onPress={fether}>Run</Button>
        </div>
    )
}