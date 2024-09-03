import { HTMLAttributes, ReactNode, MouseEvent } from "react";
import styles from "./QuizChoiceCheckbox.module.css";
import classNames from "classnames";
import { Check } from "lucide-react";

interface QuizChoiceCheckboxProps extends HTMLAttributes<HTMLDivElement> {
    selected?: boolean;
    correct?: boolean; // Indicates if the choice is correct (for styling)
    incorrect?: boolean; // Indicates if the choice is incorrect (for styling)
    title: string;
    subtitle?: string;
    iconComponent?: ReactNode; // Optional SVG icon to display next to the title
    didToggle?: (event?: MouseEvent<HTMLDivElement>) => void;
}

const QuizChoiceCheckbox = ({
    selected = false,
    correct = false,
    incorrect = false,
    title,
    subtitle,
    iconComponent,
    className,
    didToggle,
    ...rest
}: QuizChoiceCheckboxProps) => {
    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        // Prevent triggering any parent event handlers
        event.stopPropagation();
        didToggle?.(event);
    };

    return (
        <div
            {...rest}
            className={classNames(styles.container, className, {
                [styles.correct]: correct,   // Add correct class if correct
                [styles.incorrect]: incorrect // Add incorrect class if incorrect
            })}
            onClick={handleClick}
        >
            <div
                className={classNames(
                    styles.checkbox,
                    selected ? styles.selected : null
                )}
            >
                {selected && <Check size={16} color={correct ? "green" : incorrect ? "red" : "black"} />}
            </div>
            <div className={styles.text}>
                <div className={styles.title}>
                    {iconComponent && (
                        <span className={styles.icon}>{iconComponent}</span>
                    )}
                    <span>{title}</span>
                </div>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
        </div>
    );
};

export default QuizChoiceCheckbox;
