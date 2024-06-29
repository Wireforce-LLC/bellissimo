import { ReactNode } from "react";
import Modal from "./Modal";

interface Props {
    readonly isVisible: boolean;
    readonly intent: (it: boolean) => any|void;
    readonly children: ReactNode;
    readonly title?: string;
}

export default function EazyModal({ isVisible, title, children, intent } : Props) {
    return isVisible && <Modal title={title} onClose={() => intent(false)}>
        {children}
    </Modal>
}