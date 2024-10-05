"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ConfettiContextProps {
    showConfetti: boolean;
    triggerConfetti: () => void;
}

const ConfettiContext = createContext<ConfettiContextProps>({
    showConfetti: false,
    triggerConfetti: () => {},
});

export const ConfettiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [showConfetti, setShowConfetti] = useState<boolean>(false);

    const triggerConfetti = () => {
        setShowConfetti(true);
        // Optionally, reset the state after a delay to allow multiple triggers
        setTimeout(() => {
            setShowConfetti(false);
        }, 2000); // Adjust duration as needed
    };

    return (
        <ConfettiContext.Provider value={{ showConfetti, triggerConfetti }}>
            {children}
        </ConfettiContext.Provider>
    );
};

// Custom hook for easy access to the context
export const useConfetti = () => useContext(ConfettiContext);