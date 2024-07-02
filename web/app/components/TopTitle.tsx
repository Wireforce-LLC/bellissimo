import classNames from "classnames";

interface Props {
  readonly title: string;
  readonly subtitle: string;
  readonly isLeft?: boolean;
}

export default function TopTitle({isLeft, title, subtitle }: Props) {
  return (
    <div className={classNames("max-w-[497px]", {"text-left": isLeft, " text-center": !isLeft})}>
      <h1 className="text-2xl font-light">{title}</h1>
      <h6 className="text-xs opacity-75 font-medium">{subtitle}</h6>
    </div>
  );
}
