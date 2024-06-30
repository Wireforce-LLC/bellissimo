import _ from "lodash";

interface Props {
  readonly children?: String;
}

export default function ErrorString({ children }: Props) {
  if (_.isEmpty(children) || !children) {
    return undefined;
  }

  return (
    children && (
      <span className="text-xs font-medium text-red-500">{children}</span>
    )
  );
}
