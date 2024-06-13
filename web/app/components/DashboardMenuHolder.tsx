import { ReactNode } from "react";
import _ from "lodash";

interface Props {
  readonly children: ReactNode[] | ReactNode;
}

export default function DashboardMenuHolder({ children }: Props) {
  return (
    <div role="menu" className="divide-y divide-gray-100">
      {_.isArray(children)
        ? _.orderBy(children, (i) => _.get(i, "props.priority", 0))
        : children}
    </div>
  );
}
