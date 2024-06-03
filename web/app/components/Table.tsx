import { ReactNode, useCallback } from "react";
import string from "~/localization/polyglot";
import LoadingActivity from "./LoadingActivity";
import _ from "lodash";
import ErrorString from "./ErrorString";

interface Props {
  readonly headers?: string[];
  readonly data?:
    | ({ [key: string]: ReactNode } | string | undefined)[]
    | undefined;
}

export function TableActionButton({ onClick }: { onClick: () => void | any }) {
  return (
    <button
      className="hover:bg-gray-100 px-2 rounded-sm z-10"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
      </svg>
    </button>
  );
}

export default function Table({ headers, data, onSelectedItem }: Props) {
  const safeValue = useCallback((value: any) => {
    return value;
  }, []);

  return data ? (
    <table className="w-full bg-white">
      <thead>
        <tr className="bg-gray-300 border-b divide-x divide-zinc-200 border-zinc-200 sticky top-0 bg-white">
          {headers?.map((text) => (
            <th
              scope="col"
              className="px-3 py-1.5 text-xs text-black bg-gray-50 text-left font-medium"
            >
              {text}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {_.isArray(data) &&
          data.map((item, index) => (
            <tr className="border-b z-0 divide-x divide-zinc-200 border-zinc-200 cursor-pointer hover:bg-gray-100 hover:bg-opacity-25">
              {Object.values(item || []).map((value) =>
                value ? (
                  <td className="px-3 py-1.5 text-xs font-normal">
                    {_.isBoolean(value)
                      ? value
                        ? "Yes"
                        : "No"
                      : safeValue(value)}
                  </td>
                ) : (
                  <td className="px-3 py-1.5 text-xs text-[#adb5bd] text-opacity-75">
                    <div className="text-wrap w-full block">
                      {string("const.nonValue")}
                    </div>
                  </td>
                )
              )}
            </tr>
          ))}

        {!_.isArray(data) && (
          <ErrorString>
            The data set you are using to build the table is not supported. This
            table only supports drawing lists
          </ErrorString>
        )}
      </tbody>
    </table>
  ) : (
    <div className="w-full bg-white py-12 border-b border-b-gray-100">
      <LoadingActivity text={string("const.loadingData")} />
    </div>
  );
}
