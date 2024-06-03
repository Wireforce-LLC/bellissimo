interface Props {
  readonly children?: String;
}

export default function ErrorString({ children }: Props) {
  return (
    children && (
      <span className="text-xs font-medium text-red-500">{children}</span>
    )
  );
}
