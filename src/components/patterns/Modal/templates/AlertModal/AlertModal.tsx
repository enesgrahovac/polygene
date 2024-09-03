import React from "react";
import Modal, { ModalProps } from "../../Modal";

export interface AlertModalProps extends ModalProps {}

const AlertModal = ({
  className,
  title,
  hideModal,
  ...rest
}: AlertModalProps) => {
  return (
    <Modal
      title={title}
      hideModal={hideModal}
      showFooterDivider={false}
      {...rest}
    />
  );
};

export default AlertModal;
