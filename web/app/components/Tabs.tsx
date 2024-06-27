import classNames from "classnames";
import { ReactNode, useEffect, useState } from "react";
import Card from "./Card";
import _ from "lodash";

interface Props {
  readonly children: ReactNode[] | ReactNode;
  readonly titles: string[];
  readonly isDisableBorders?: boolean;
  readonly isDisablePaddings?: boolean;
}

export default function Tabs({
  children,
  isDisableBorders,
  isDisablePaddings,
  titles,
}: Props) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Card
      className={classNames({
        "border-none": isDisableBorders === true,
      })}
    >
      <div
        className={classNames(
          "flex flex-row w-full border-b border-b-gray-100",
          {}
        )}
      >
        {titles?.map((i, index) => {
          return (
            <div
              onClick={() => setActiveTab(index)}
              className={classNames("text-xs font-medium cursor-pointer", {
                "py-1.5 px-3": true,
                "border-b-2 border-b-blue-500": activeTab == index,
                "border-b-2 border-b-transparent hover:border-b-gray-200":
                  activeTab !== index,
              })}
            >
              {i}
            </div>
          );
        })}
      </div>

      <div
        className={classNames({ "px-4 py-2.5": isDisablePaddings !== true })}
      >
        {_.isArray(children) && children[activeTab] || null}
      </div>
    </Card>
  );
}
