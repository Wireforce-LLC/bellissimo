import { ReactElement, ReactNode } from "react";
import _ from "lodash";

interface DashboardNestedComponentInterface {
  readonly name: string;
  readonly component: ReactNode;
}

export function Menu({ children }: { children: ReactNode }) {
  return {
    name: "Menu",
    component: children,
  } as DashboardNestedComponentInterface;
}

export function View({ children }: { children: ReactNode }) {
  return {
    name: "View",
    component: children,
  } as DashboardNestedComponentInterface;
}

interface Props {
  readonly nested: (DashboardNestedComponentInterface | undefined)[];
  readonly menuEnabled: boolean
}

export default function DashboardArea({ menuEnabled, nested }: Props) {
  return (
    <div className="w-full h-full">
      <div className="md:px-0 h-full">
        <div className="flex flex-col h-full md:flex-row">
          {menuEnabled && (
            <div className="flex-shrink-0 min-w-full md:h-full md:min-w-48 md:border-r md:border-r-gray-100 bg-white">
              {_.find(nested, (item) => item?.name == "Menu")?.component}
            </div>
          )}

          <div className="flex-shrink w-full">
            {_.find(nested, (item) => item?.name == "View")?.component}
          </div>
        </div>
      </div>
    </div>
  );
}
