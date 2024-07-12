import { ReactNode } from "react";

interface Props {
  readonly children?: ReactNode[];
}

/**
 * Component for rendering a single list item.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content of the list item.
 * @returns {ReactElement} The rendered list item.
 */
export function ListItem({ children }: { children: ReactNode }) {
  // Render a list item with the given children as its content.
  return (
    <li>
      {/* The content of the list item */}
      {children}
    </li>
  );
}

/**
 * Component for rendering a list.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The children elements of the list.
 * @returns {ReactElement} The rendered list component.
 */
export default function List({ children }: Props) {
  // Render a list with the provided children elements.
  return <ul></ul>;
}
