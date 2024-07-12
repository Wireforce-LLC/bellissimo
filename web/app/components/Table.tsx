import { ReactNode, useCallback, useMemo } from "react";
import string from "~/localization/polyglot";
import LoadingActivity from "./LoadingActivity";
import _ from "lodash";
import ErrorString from "./ErrorString";
import Card from "./Card";
import humanizeString from "humanize-string";

interface Props {
  readonly headers?: string[];
  readonly doKey?: (index: number, item: any) => string;
  readonly onSelectedItem?: (index: number, item: any) => void | any;
  readonly isNoEmptyState?: boolean;
  readonly data?:
    | ({ [key: string]: ReactNode } | string | undefined)[]
    | undefined;
}

/**
 * A button component for table actions.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onClick - The click event handler.
 * @return {JSX.Element} The rendered button.
 */
export function TableActionButton({ onClick }: { onClick: () => void | any }) {
  return (
    // Render a button with hover background color change.
    <button
      className="hover:bg-gray-100 px-2 rounded-sm z-10"
      onClick={onClick}
    >
      {/* Render a SVG icon. */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
      >
        {/* Define the path for the icon. */}
        <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
      </svg>
    </button>
  );
}

/**
 * A table component for displaying data.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.headers - The headers for the table.
 * @param {Array|Object} props.data - The data to be displayed in the table.
 * @param {Function} props.onSelectedItem - The click event handler for each table row.
 * @param {Boolean} props.isNoEmptyState - Flag to show empty state message.
 * @param {Function} props.doKey - The function to generate the key for each table row.
 * @return {JSX.Element} The rendered table.
 */
export default function Table({
  headers,
  data,
  onSelectedItem,
  isNoEmptyState,
  doKey
}: Props) {
  const safeValue = useCallback((value: any) => {
    return value;
  }, []);

  const headersOverride = useMemo(() => {
    if (headers) {
      return headers;
    }

    if (data) {
      return _.keys(_.first(data)).flatMap((key) => humanizeString(key));
    }

    return []
  }, [headers, data])

  const reactHeaderTable = useMemo(() => {
    return <tr className=" border-b  divide-zinc-200 border-zinc-200 sticky top-0 bg-white">
      {headersOverride?.map((text) => (
        <th
          scope="col"
          className="px-3 py-1.5 text-xs text-black text-left font-medium"
        >
          {text}
        </th>
      ))}
    </tr>
  }, [headersOverride]);

  // Render empty state message if data is empty
  if (!isNoEmptyState) {
    if (data == null) {
      return (
        <Card className="border-none">
          <div className="flex justify-center items-center flex-col w-full h-full min-h-[100px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4 fill-gray-400 mb-1"
            >
              <path d="M8 7c3.314 0 6-1.343 6-3s-2.686-3-6-3-6 1.343-6 3 2.686 3 6 3Z" />
              <path d="M8 8.5c1.84 0 3.579-.37 4.914-1.037A6.33 6.33 0 0 0 14 6.78V8c0 1.657-2.686 3-6 3S2 9.657 2 8V6.78c.346.273.72.5 1.087.683C4.42 8.131 6.16 8.5 8 8.5Z" />
              <path d="M8 12.5c1.84 0 3.579-.37 4.914-1.037.366-.183.74-.41 1.086-.684V12c0 1.657-2.686 3-6 3s-6-1.343-6-3v-1.22c.346.273.72.5 1.087.683C4.42 12.131 6.16 12.5 8 12.5Z" />
            </svg>
  
            <p className="text-gray-400 text-xs">
              There is no data to display in the table
            </p>
          </div>
        </Card>
      );
    }

    if (data == undefined) {
      return (
        <Card className="border-none">
          <div className="flex justify-center items-center flex-col w-full h-full min-h-[100px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4 fill-gray-400 mb-1"
            >
              <path d="M8 7c3.314 0 6-1.343 6-3s-2.686-3-6-3-6 1.343-6 3 2.686 3 6 3Z" />
              <path d="M8 8.5c1.84 0 3.579-.37 4.914-1.037A6.33 6.33 0 0 0 14 6.78V8c0 1.657-2.686 3-6 3S2 9.657 2 8V6.78c.346.273.72.5 1.087.683C4.42 8.131 6.16 8.5 8 8.5Z" />
              <path d="M8 12.5c1.84 0 3.579-.37 4.914-1.037.366-.183.74-.41 1.086-.684V12c0 1.657-2.686 3-6 3s-6-1.343-6-3v-1.22c.346.273.72.5 1.087.683C4.42 12.131 6.16 12.5 8 12.5Z" />
            </svg>
  
            <p className="text-gray-400 text-xs">
              The data in the table is undefined or empty
            </p>
          </div>
        </Card>
      );
    }

    if (_.isArray(data) && _.isEmpty(data)) {
      return (
        <Card className="border-none">
          <div className="flex justify-center items-center flex-col w-full h-full min-h-[100px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4 fill-gray-400 mb-1"
            >
              <path d="M8 7c3.314 0 6-1.343 6-3s-2.686-3-6-3-6 1.343-6 3 2.686 3 6 3Z" />
              <path d="M8 8.5c1.84 0 3.579-.37 4.914-1.037A6.33 6.33 0 0 0 14 6.78V8c0 1.657-2.686 3-6 3S2 9.657 2 8V6.78c.346.273.72.5 1.087.683C4.42 8.131 6.16 8.5 8 8.5Z" />
              <path d="M8 12.5c1.84 0 3.579-.37 4.914-1.037.366-.183.74-.41 1.086-.684V12c0 1.657-2.686 3-6 3s-6-1.343-6-3v-1.22c.346.273.72.5 1.087.683C4.42 12.131 6.16 12.5 8 12.5Z" />
            </svg>
  
            <p className="text-gray-400 text-xs">
              The table list is completely empty
            </p>
          </div>
        </Card>
      );
    }
  }

  // Render table with data
  return data ? (
    <table className="w-full bg-white">
      <thead>
        {reactHeaderTable}
      </thead>

      <tbody>
        {_.isArray(data) &&
          data.map((item, index) => (
            <tr
              tabIndex={index}
              data-key={doKey?.(index,item) || index}
              key={doKey?.(index, item) || index}
              onClick={() => onSelectedItem?.(index, item)}
              className="border-b z-0 divide-zinc-200 border-zinc-200 cursor-pointer hover:bg-blue-50 border-x-transparent border-x-2 hover:border-x-blue-500 transition-colors duration-100"
            >
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
                  <td
                    className="px-3 py-1.5 text-xs text-[#adb5bd] text-opacity-75"
                  >
                    <div className="text-wrap w-full block">
                      <svg
                        viewBox="0 0 1024 1024"
                        fill="currentColor"
                        height="1em"
                        width="1em"
                        className="size-3.5 text-gray-500 hover:text-gray-800"
                      >
                        <path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z" />
                      </svg>
                    </div>
                  </td>
                )
              )}

              {_.range(0, headersOverride.length - _.keys(item).length ).map(() => (
                <td className="px-3 py-1.5 text-xs font-normal">
                  <span className="text-zinc-400">
                    New column
                  </span>
                </td>
              ))}
            </tr>
          ))}

        {!_.isArray(data) && (
          <ErrorString>
            {/* Render error message if data is not an array */}
            The data set you are using to build the table is not supported. This
            table only supports drawing lists
          </ErrorString>
        )}
      </tbody>
    </table>
  ) : (
    <div className="w-full bg-white py-12">
      {/* Render loading spinner if data is not available */}
      <LoadingActivity text={string("const.loadingData")} />
    </div>
  );
}
