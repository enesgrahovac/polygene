import {HTMLAttributes, ReactNode, MouseEvent} from "react";
import styles from "./Checkbox.module.css";
import classNames from "classnames";
import { Check } from "lucide-react";

interface CheckboxProps extends HTMLAttributes<HTMLDivElement> {
    selected?: boolean;
    title: string;
    subtitle?: string;
    iconComponent?: ReactNode; // Optional SVG icon to display next to the title
    didToggle?: (event?: MouseEvent<HTMLDivElement>) => void;
}

const Checkbox = ({
    selected = false,
    title,
    subtitle,
    iconComponent,
    className,
    didToggle,
    ...rest
}: CheckboxProps) => {
    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        didToggle?.(event);
    };

    return (
        <div
            {...rest}
            className={classNames(styles.container, className)}
            onClick={handleClick}
        >
            <div
                className={classNames(
                    styles.checkbox,
                    selected ? styles.selected : null
                )}
            >
                {selected && <Check size={16} />}
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

export default Checkbox;
