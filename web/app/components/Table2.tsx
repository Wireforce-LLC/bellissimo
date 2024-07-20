import Card from "./Card";
import _ from "lodash";
import classNames from "classnames";
import moment from "moment";
import { ReactNode, useMemo } from "react";

interface Props<T> {
  readonly className?: string;
  readonly isCompact?: boolean;
  readonly dataset?: T[] | null;
  readonly isTransform?: boolean;
  readonly dateDisplay?: boolean;
  readonly dateDivide?: number;
  readonly hiddenColumns?: string[];
  readonly sortColumns?: string[];
  readonly onSelectedItem?: (index: number, item: T) => void;
  readonly headerTransformer?: {
    [key: string]: (value: string) => string;
  };
  readonly valueTransformer?: {
    [key: string]: (value: any, row: T) => ReactNode | String | string;
  };
  readonly additionalColumns?: {
    [key: string]: (data: T[], row: T) => ReactNode | String | string;
  };
  readonly rowClassName?: string;
}

type InputData = string | number | Date | object | any[] | null;

type OutputData = string | string | string | string | string | string;

/**
 * Generate a hash string from the object using a simple hashing algorithm.
 * @param obj - The object to generate the hash from.
 * @returns The hash of the object as a hexadecimal string.
 */
const generateObjectHash = (obj: any) => {
  let str = JSON.stringify(obj);
  let hash = 0;
  if (str.length === 0) return hash.toString(16);

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return hash.toString(16);
};

// Function that formats data based on its type and transform flag
const formatData = (
  data: InputData,
  isTransform: boolean,
  dateDisplay: boolean,
  dateDivide: number = 1
): OutputData => {
  if (typeof data === "string") {
    return data;
  } else if (dateDisplay && data instanceof Date) {
    return moment(data).format("MM.DD.YYYY HH:mm");
  } else if (
    dateDisplay &&
    _.isNumber(data) &&
    data > 1000000000 &&
    moment(data).isValid()
  ) {
    return moment(data / dateDivide).format("MM.DD.YYYY HH:mm");
  } else if (Array.isArray(data)) {
    return "Array";
  } else if (typeof data === "number") {
    return isTransform ? data.toLocaleString() : String(data);
  } else if (_.isObject(data)) {
    return "Object";
  } else if (data === null || data === undefined) {
    return "-";
  } else {
    return String(data);
  }
};

/**
 * Recursively sorts the keys of an object.
 *
 * @param object The object whose keys need to be sorted
 * @returns An object with sorted keys
 */
const sortByKeysRecursive = (object: any): any => {
  /**
   * Helper function to sort the keys of an object
   * @param obj The object whose keys need to be sorted
   * @returns An object with sorted keys
   */
  const sortObjectKeys = (obj: Record<string, any>): Record<string, any> => {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    const sortedKeys = Object.keys(obj).sort();
    return Object.fromEntries(
      sortedKeys.map((key) => {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          return [key, sortObjectKeys(obj[key])];
        } else {
          return [key, obj[key]];
        }
      })
    );
  };

  return sortObjectKeys(object);
};

/**
 * Finds the document with the most keys in an array and returns
 * a document with those keys with undefined values.
 *
 * @param documents An array of documents to search through
 * @returns A document with the keys from the document with the most keys with undefined values
 */
const findDocumentWithMostKeys = (
  documents: any[]
): Record<string, undefined> => {
  if (documents.length === 0) {
    return {};
  }

  let maxKeys = 0;
  let docWithMostKeys: Record<string, any> | undefined;

  documents.forEach((doc) => {
    const keysCount = Object.keys(doc).length;
    if (keysCount > maxKeys) {
      maxKeys = keysCount;
      docWithMostKeys = doc;
    }
  });

  if (docWithMostKeys) {
    const keys = Object.keys(docWithMostKeys);
    const docWithUndefinedValues: Record<string, any> = {};

    keys.forEach((key) => {
      docWithUndefinedValues[key] = undefined;
    });

    return docWithUndefinedValues;
  }

  return {};
};

/**
 * Combine all documents in the array into a single document with all keys filled with undefined.
 * @param docs - Array of documents to process.
 * @returns Combined document with all keys filled with undefined.
 */
const combineWithUndefined = (docs: any) => {
  const allKeys: string[] = [
    ...new Set(docs.flatMap((doc: any) => Object.keys(doc))),
  ] as string[];

  const combinedDoc: Record<string, undefined> = {};

  allKeys.forEach((key) => {
    combinedDoc[key] = undefined;
  });

  return combinedDoc;
};

/**
 * Order the keys in the object based on a custom order provided as an array.
 * @param obj - The object to reorder the keys of.
 * @param keysOrder - An array specifying the desired order of keys.
 * @returns The object with keys ordered according to the keysOrder array.
 */
const orderKeys = <T extends Record<string, any>>(
  obj: T,
  keysOrder: string[]
): T => {
  const orderedKeys = _.intersection(keysOrder, Object.keys(obj));
  const unorderedKeys = _.omit(obj, orderedKeys);
  return _.merge(_.pick(obj, orderedKeys), unorderedKeys) as T;
};

export default function Table2<T>({
  headerTransformer,
  dataset,
  sortColumns,
  hiddenColumns,
  valueTransformer,
  additionalColumns,
  rowClassName,
  isCompact,
  className,
  onSelectedItem,
}: Props<T>) {
  if (dataset == null) {
    return (
      <div
        className={
          "flex justify-center items-center flex-col w-full h-full min-h-[100px]"
        }
      >
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
    );
  }

  if (dataset == undefined) {
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

  if (_.isArray(dataset) && _.isEmpty(dataset)) {
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

  const data = useMemo(() => {
    let sorted = dataset?.map(sortByKeysRecursive);

    return sorted?.flatMap((i) => {
      let omit = _.omit(i, hiddenColumns || []);

      if (additionalColumns) {
        let renderedAdditionalColumns = _.mapValues(
          additionalColumns,
          function (x) {
            return x(sorted, i);
          }
        );

        omit = _.merge(omit, renderedAdditionalColumns);
      }

      return orderKeys(omit, sortColumns || []);
    });
  }, [dataset, hiddenColumns, sortColumns, additionalColumns]);

  const placement = useMemo(() => {
    if (!_.isArray(data)) {
      return {};
    }

    return combineWithUndefined(data);
  }, [data]);

  const displayData = useMemo(() => {
    if (!_.isArray(data)) {
      return [];
    }

    return data.map((i) => {
      return {
        ...placement,
        ...i,
      };
    });
  }, [placement, data]);

  const tableHeaders = useMemo(() => {
    return Object.keys(placement);
  }, [placement]);

  const reactHeaders = useMemo(() => {
    return tableHeaders.map((i) => {
      if (headerTransformer && _.hasIn(headerTransformer, i)) {
        return (
          <th
            className={rowClassName || "text-[10px] font-mono py-[5px] px-[8px]"}
            align="left"
            key={i}
          >
            {headerTransformer[i](i)}
          </th>
        );
      }

      if (headerTransformer && _.hasIn(headerTransformer, "any")) {
        return (
          <th
            className={rowClassName || "text-[10px] font-mono py-[5px] px-[8px]"}
            align="left"
            key={i}
          >
            {headerTransformer["any"](i)}
          </th>
        );
      }

      return (
        <th
          className={rowClassName || "text-[10px] font-mono py-[5px] px-[8px]"}
          align="left"
          key={i}
        >
          {i}
        </th>
      );
    });
  }, [tableHeaders, headerTransformer]);

  const reactRows = useMemo(() => {
    return displayData?.map((a: { [key: string]: any }, index: number) => {
      return (
        <tr
          key={generateObjectHash(a)}
          onClick={() => {
            onSelectedItem?.(index, a as T);
          }}
          className={classNames(
            "hover:bg-blue-50 border-b border-b-gray-100",
            onSelectedItem
              ? "cursor-pointer hover:outline outline-offset-2 outline-black"
              : "cursor-default"
          )}
        >
          {_.toPairs(a).map(([key, value]) => {
            if (
              typeof valueTransformer != "undefined" &&
              _.hasIn(valueTransformer, key)
            ) {
              return (
                <td
                  className={
                    rowClassName || "text-xs font-normal py-[5px] px-[8px]"
                  }
                  align="left"
                  key={key}
                >
                  {valueTransformer[key](value, dataset[index] as T)}
                </td>
              );
            }
            return (
              <td
                className={
                  rowClassName || "text-xs font-normal py-[5px] px-[8px]"
                }
                align="left"
                key={key}
              >
                {formatData(value, true, true, 1000)}
              </td>
            );
          })}
        </tr>
      );
    });
  }, [displayData]);

  return (
    <table className={classNames(className, "table-auto w-full bg-white")}>
      <thead>
        <tr>{reactHeaders}</tr>
      </thead>
      <tbody>{reactRows}</tbody>
    </table>
  );
}
