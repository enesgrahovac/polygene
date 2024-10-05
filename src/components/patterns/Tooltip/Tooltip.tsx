import React, { ReactNode, useState, useEffect, useRef } from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
    content: ReactNode;
    position?: 'top' | 'right' | 'bottom' | 'left';
    children: ReactNode;
    customClassName?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, position = 'top', children, customClassName }) => {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const toggleTooltip = () => {
        setIsVisible(!isVisible);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setIsVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.tooltipContainer} ref={tooltipRef}>
            <div onClick={toggleTooltip}>
                {children}
            </div>
            {isVisible && (
                    content
            )}
        </div>
    );
};

export default Tooltip;