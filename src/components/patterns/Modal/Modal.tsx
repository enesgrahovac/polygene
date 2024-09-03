import React from "react";
import styles from "./Modal.module.css";
import classNames from "classnames";
import Button, { ButtonProps } from "../Button/Button";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  actions?: ButtonProps[];
  hideModal?: () => void;
  showFooterDivider?: boolean;
}

const Modal = ({
  className,
  children,
  title,
  subtitle,
  actions,
  hideModal,
  showFooterDivider = true,
  ...rest
}: ModalProps) => {
  // Hide and reset animation flag
  const handleHide = () => {
    hideModal?.();
  };

  return createPortal(
    <div onClick={handleHide} className={styles.overlay}>
      <div
        className={classNames(className, styles.container)}
        onClick={(e) => {
          // Prevents the overlay behind this from trigerring its onClick
          e.stopPropagation();
        }}
        {...rest}
      >
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>{title}</h1>
            <Button
              icon={<X />}
              onClick={handleHide}
              variant="ghost"
              className={styles.close}
            />
          </div>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.content}>{children}</div>
        {actions && (
          <div
            className={classNames(
              styles.footer,
              !showFooterDivider ? styles.noDivider : null
            )}
          >
            {actions.map((action, index) => (
              <Button key={index} {...action} />
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
