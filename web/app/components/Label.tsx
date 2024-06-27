interface Props {
  readonly children?: String;
}

export default function Label({ children }: Props) {
  return (
    children && (
      <label className="text-xs font-medium uppercase text-black">
        {children}
      </label>
    )
  );
}
