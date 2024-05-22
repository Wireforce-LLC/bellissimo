interface Props {
  readonly title: string,
  readonly subtitle: string,
}

export default function TopTitle({ title, subtitle }: Props) {
  return <div className="max-w-[497px]">
    <h1 className="text-2xl text-center font-light">
      {title}
    </h1>
    <h6 className="text-xs text-center opacity-75 font-medium">
      {subtitle}
    </h6>
  </div>
}
