import React, {useEffect, useState} from "react";
import styles from "./DropdownSelector.module.css";
import { ChevronDown } from "lucide-react";

export interface DropdownSelectorOption {
    label: string;
    id: string;
}

interface DropdownSelectorProps
    extends React.HTMLAttributes<HTMLSelectElement> {
    label?: string;
    placeholder?: string;
    options: DropdownSelectorOption[];
    selectedValue?: string;
    didSelect?: (option: DropdownSelectorOption) => void;
}

const DropdownSelector = ({
    className,
    label,
    placeholder,
    options,
    selectedValue,
    didSelect,
    ...rest
}: DropdownSelectorProps) => {
    const [text, setText] = useState("");
    const [selected, setSelected] = useState<DropdownSelectorOption>(
        options[0]
    );

    // Update selected when selectedId changes
    useEffect(() => {
        if (selectedValue) {
            const newSelected = options.find(option => option.id === selectedValue);
            if (newSelected) setSelected(newSelected);
        }
    }, [selectedValue, options]);

    return (
        <div className={styles.inputWrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.selectWrapper}>
                <select
                    value={selectedValue} // Controlled by the selectedValue prop
                    onChange={(e) => {
                        const selection = options.find(option => option.id === e.target.value);
                        if (selection && didSelect) {
                            didSelect(selection); // Notify the parent about the selection change
                        }
                    }}
                    {...rest}
                >
                    {options.map((opt) => (
                        <option value={opt.id}>{opt.label}</option>
                    ))}
                </select>
                <ChevronDown size={20} className={styles.chevron} />
            </div>
        </div>
    );
};

export default DropdownSelector;
