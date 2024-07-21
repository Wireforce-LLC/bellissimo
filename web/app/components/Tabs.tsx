import Card from "./Card";
import _ from "lodash";
import classNames from "classnames";
import { ReactNode, useState } from "react";

interface Props {
  readonly children: ReactNode[] | ReactNode;
  readonly titles: string[];
  readonly isDisableBorders?: boolean;
  readonly isDisablePaddings?: boolean;
  readonly onIntentChangeTab?: () => boolean;
  readonly isFullSize?: boolean;
}

export default function Tabs({
  children,
  isDisableBorders,
  isDisablePaddings,
  isFullSize,
  titles,
  onIntentChangeTab
}: Props) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Card
      className={classNames("bg-zinc-100", {
        "border-none": isDisableBorders === true,
        "w-full h-full": isFullSize
      })}
      isDisablePaddings={isDisablePaddings}
    >
      <div
        className={classNames(
          "flex flex-row w-full border-b border-b-gray-100 bg-white",
          {}
        )}
      >
        {titles?.map((i, index) => {
          return (
            <div
              onClick={() => {
                if (onIntentChangeTab != undefined)  {
                  if (onIntentChangeTab()) {
                    setActiveTab(index)
                  }
                } else {
                  setActiveTab(index)}
                }
              }
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
        className={classNames({ "px-4 py-2.5": isDisablePaddings !== true, "w-full h-full": isFullSize })}
      >
        {_.isArray(children) && children[activeTab] || null}
      </div>
    </Card>
  );
}
