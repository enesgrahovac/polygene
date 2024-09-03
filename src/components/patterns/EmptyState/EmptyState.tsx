import React from "react";
import styles from "./EmptyState.module.css";
import classNames from "classnames";
import Button, { ButtonProps } from "../Button/Button";
import { Box, Ghost } from "lucide-react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  label: string;
  icon?: React.ReactElement;
  button?: ButtonProps;
}

const EmptyState = ({
  className,
  title,
  label,
  icon,
  button,
  ...rest
}: EmptyStateProps) => {
  return (
    <div className={classNames(className, styles.container)} {...rest}>
      {icon || <Ghost size={36} />}
      {title && <h2>{title}</h2>}
      <p>{label}</p>
      {button && <Button {...button} variant="primary" />}
    </div>
  );
};

export default EmptyState;
