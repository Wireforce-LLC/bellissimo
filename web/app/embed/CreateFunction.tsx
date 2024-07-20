import Button from "~/components/Button";
import ErrorString from "~/components/ErrorString";
import Input from "~/components/Input";
import Select from "~/components/Select";
import humanizeString from "humanize-string";
import webConfig, { ApiPathEnum } from "~/web.config";
import { useCallback, useEffect, useState } from "react";

interface Props {
  readonly onCreated?: () => void;
}

export default function CreateFunctionEmbed({onCreated} : Props) {
  const [functionName, setFunctionName] = useState("");
  const [functionId, setFunctionId] = useState("");
  const [runtimeId, setRuntimeId] = useState("1");
  const [stringError, setStringError] = useState<string | undefined>();

  useEffect(() => {
    setFunctionId(
      humanizeString(functionName.trim())
        .replaceAll(" ", "_")
        .replaceAll(/[^a-zA-Z ]/g, "_")
        .replaceAll(new RegExp("[0-9]", "g"), "_")
        .toLocaleLowerCase()
    );
  }, [functionName]);

  const onCreateFunction = useCallback(() => {
    webConfig.axiosFactory("PRIVATE").then((axios) => {
      axios
        .post(webConfig.apiEndpointFactory(ApiPathEnum.CreateRemoteFunction), {
          name: functionName,
          id: functionId,
          runtime: parseInt(runtimeId),
        })
        .then(() => {
          setFunctionName("");
          setFunctionId("");
          setRuntimeId("1");
          setStringError(undefined);

          if (onCreated) {
            onCreated();
          }
        })
        .catch((e) => {
          setStringError(e.response.data.error);
        });
    });
  }, [functionId, runtimeId, functionName]);

  return (
    <div className="w-full space-y-4">
      <Input
        label="Function name"
        value={functionName}
        onChangeValue={setFunctionName}
      />

      <Input
        label="Function ID"
        value={functionId}
        onChangeValue={setFunctionId}
      />

      <Select
        label="Runtime"
        value={runtimeId}
        onChangeValue={(i) => setRuntimeId(i!!)}
        values={[
          { name: "PHP", value: "1" },
          { name: "Python", value: "3" },
          { name: "Node", value: "2" },
        ]}
      />

      <ErrorString>{stringError}</ErrorString>

      <Button onPress={onCreateFunction}>Create function</Button>
    </div>
  );
}
