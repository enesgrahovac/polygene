import React from "react";
import styles from "./ProgressBar.module.css";
import classNames from "classnames";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress: number; // Progress should be a number between 0 and 1
}

const ProgressBar = ({ progress, className, ...rest }: ProgressBarProps) => {
  // Ensure progress is clamped between 0 and 1 to avoid invalid widths
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  // Dynamic style for the progress bar itself
  const progressBarStyle: React.CSSProperties = {
    width: `${clampedProgress * 100}%`, // Convert progress ratio to a percentage
  };

  return (
    <div className={classNames(className, styles.container)} {...rest}>
      <div className={styles.progress} style={progressBarStyle} />
    </div>
  );
};

export default ProgressBar;
