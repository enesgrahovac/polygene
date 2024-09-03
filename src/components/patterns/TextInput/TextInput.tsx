import React from "react";
import styles from "./TextInput.module.css";
import classNames from "classnames";

interface TextInputProps extends React.HTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  prefilledValue?: string;
  type?: "text" | "time" | "password" | "number";
  disabled?: boolean;
  didUpdateText?: (text: string) => void;
}

const TextInput = ({
  className,
  label,
  placeholder,
  prefilledValue,
  disabled = false,
  didUpdateText,
  type = "text",
  ...rest
}: TextInputProps) => {
  const [text, setText] = React.useState("");

  return (
    <div className={classNames(className, styles.inputWrapper)}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className={classNames(styles.input, disabled ? styles.disabled : null)}
        value={prefilledValue}
        aria-disabled={disabled}
        onChange={(e) => {
          setText(e.target.value);
          didUpdateText?.(e.target.value);
        }}
        {...rest}
      />
    </div>
  );
};

export default TextInput;
