import React from "react";

import styles from "./VerifyModal.module.css";
import classNames from "classnames";
import Modal, { ModalProps } from "../../Modal";
import TextInput from "@/components/patterns/TextInput/TextInput";

export interface VerifyModalProps extends ModalProps {
  emailToVerify?: string;
}

const VerifyModal = ({
  className,
  hideModal,
  emailToVerify,
  ...rest
}: VerifyModalProps) => {
  const handleVerifyEmail = () => {
    // TODO: Implement verification
  };
  const [verifyCode, setVerifyCode] = React.useState("");

  return (
    <Modal
      title="Verify email"
      subtitle={`Your code was sent to ${emailToVerify}`}
      actions={[
        {
          variant: "primary",
          label: "Verify",
          disabled: !verifyCode.trim(),
          onClick: handleVerifyEmail,
        },
      ]}
      hideModal={hideModal}
      {...rest}
    >
      <div className={classNames(className, styles.container)} {...rest}>
        <TextInput
          label="Verification code"
          placeholder="XXX XXX"
          didUpdateText={(text) => setVerifyCode(text)}
        />
      </div>
    </Modal>
  );
};

export default VerifyModal;
