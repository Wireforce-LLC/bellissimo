import { ReactNode } from "react";

interface Props {
  readonly children?: ReactNode[];
}

export function ListItem({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}

export default function List({ children }: Props) {
  return <ul></ul>;
}
