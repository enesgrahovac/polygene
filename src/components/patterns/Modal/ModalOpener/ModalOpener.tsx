import { useState, useEffect } from "react";
import SubscribeModal, {
    SubscribeModalProps,
} from "../templates/SubscribeModal/SubscribeModal";
import AlertModal, {
    AlertModalProps,
} from "../templates/AlertModal/AlertModal";
import VerifyModal, {
    VerifyModalProps,
} from "../templates/VerifyModal/VerifyModal";
import AuthModal from "../templates/AuthModal/AuthModal";

export enum ModalRegistry {
    authModal,
    addQuizModal,
    subscribeModal,
    alertModal,
    verifyModal,
    AuthModal
}

export interface ModalOpenerProps {
    modal: ModalRegistry;
    modalProps?:
    | SubscribeModalProps
    | AlertModalProps
    | VerifyModalProps
}

type Action = {
    label: string;
    variant: "primary" | "secondary" | "ghost" | undefined;
    onClick: () => void;
}

interface ToggleModalOptions {
    toggleModal: (visible: boolean, actions?: Action[]) => void; // Ensure this matches across all uses
}

const ModalOpener = ({
    children,
    modal,
    modalProps,
}: {
    children(options: ToggleModalOptions): React.ReactNode;
} & ModalOpenerProps) => {
    const [visible, setVisible] = useState(false);
    const [actions, setActions] = useState<Action[]>([]);

    const [paywallShown, setPaywallShown] = useState(false);

    const toggleModal = (
        shouldShow: boolean,
        modalActions?: Action[]
    ) => {
        setVisible(shouldShow);
        if (modalActions) {
            setActions(modalActions); // Set the new actions if provided
        }
    };

    const hideModal = async () => {
        setVisible(false);
        if (modal === ModalRegistry.subscribeModal) {
            // await setLastShowedPaywall(); // Update the last shown timestamp when the modal is hidden
            setPaywallShown(false);
        }
    };

    return (
        <>
            {modal === ModalRegistry.authModal && visible && (
                <AuthModal
                    key="AuthModal"
                    {...modalProps}
                    hideModal={hideModal}
                />
            )}
            {modal === ModalRegistry.subscribeModal && visible && (
                <SubscribeModal
                    key="SubscribeModal"
                    {...modalProps}
                    hideModal={hideModal}
                />
            )}
            {modal === ModalRegistry.alertModal && visible && (
                <AlertModal
                    key="AlertModal"
                    {...modalProps}
                    actions={actions} // Pass dynamic actions to the modal
                    hideModal={hideModal}
                />
            )}
            {modal === ModalRegistry.verifyModal && visible && (
                <VerifyModal key="VerifyModal" {...modalProps} hideModal={hideModal} />
            )}
            {children({ toggleModal })}
        </>
    );
};

export default ModalOpener;
