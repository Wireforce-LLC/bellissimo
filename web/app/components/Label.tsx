interface Props {
  readonly children?: String;
}

export default function Label({ children }: Props) {
  return (
    children && (
      <label className="text-sm font-normal uppercase text-black">
        {children}
      </label>
    )
  );
}
