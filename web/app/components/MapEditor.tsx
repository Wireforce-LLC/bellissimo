import Input from "./Input";
import _ from "lodash";
import { useEffect, useState } from "react";

interface Props {
    readonly startParams: { [key: string]: string };
    readonly onChangeParams?: (params: { [key: string]: string }) => void;
}

export default function HashMapEditor({ startParams, onChangeParams }: Props) {
    const [params, setParams] = useState<Array<[string, string]>>(_.toPairs(startParams || {}));

    useEffect(() => {
        onChangeParams?.(_.fromPairs(params));
    }, [params]);

    return <div className="w-full h-full space-y-2">
    {params.map((record, index) => (
      <div className="w-full flex flex-row gap-2">
        <Input
          label="Param"
          value={record[0]}
          onChangeValue={(value) => {
            const newParams = [...params];
            newParams[index] = [value!!, record[1]];
            setParams(newParams);
          }}
        />

        <Input
          label="Value"
          value={record[1]}
          onChangeValue={(value) => {
            const newParams = [...params];
            newParams[index] = [record[0], value!!];
            setParams(newParams);
          }}
        />
      </div>
    ))}

    {/* Add param */}
    <button
      className="w-full text-[#003049] bg-zinc-100 text-xs font-medium cursor-pointer py-2"
      type="button"
      onClick={() => {
        const newParams = params.concat([["", ""]]);
        setParams(newParams);
      }}
    >
      Add param
    </button>
  </div>
}