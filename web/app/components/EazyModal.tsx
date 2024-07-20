import Modal from "./Modal";
import { ReactNode } from "react";

interface Props {
  readonly isVisible: boolean;
  readonly intent: (it: boolean) => any | void;
  readonly children: ReactNode;
  readonly title?: string;
  readonly isBigModal?: boolean;
  readonly isDisablePaddings?: boolean;
  readonly zIndex?: number
}

/**
 * A wrapper component for the Modal component that simplifies the usage by
 * providing a default title and closing behavior.
 *
 * @param isVisible - A boolean indicating whether the modal should be visible or not.
 * @param title - The title that should be displayed in the modal header. If not provided, no title will be displayed. (optional, type: string | undefined)
 * @param children - The content that should be displayed in the modal body. (type: ReactNode)
 * @param intent - A function that will be called when the modal is closed. The function should accept a boolean parameter indicating whether the modal should be closed or not. (type: (it: boolean) => void)
 * @returns The rendered Modal component. (type: JSX.Element | null)
 */
export default function EazyModal({
  isVisible,
  title,
  children,
  intent,
  isBigModal,
  isDisablePaddings,
  zIndex = 1
}: Props): JSX.Element | null {
  // Render the Modal component only if isVisible is true.
  // The Modal component is passed the title and a function that calls the intent function with a false value when called.
  return isVisible ? (
    <Modal
      title={title}
      isBigModal={isBigModal}
      isNoPadding={isDisablePaddings}
      onClose={() => intent(false)}
      zIndex={zIndex}
    >
      {children}
    </Modal>
  ) : null;
}
