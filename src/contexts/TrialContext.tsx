"use client"
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/auth/client';
import { useRouter } from 'next/navigation'

type TrialContextType = {
    trialName: string;
    setTrialName: (name: string) => void;
};

const defaultTrialContext: TrialContextType = {
    trialName: "",
    setTrialName: () => { },
};

export const TrialContext = createContext<TrialContextType>(defaultTrialContext);

export const useTrial = () => {
    const context = useContext(TrialContext);
    if (context === undefined) {
        throw new Error('useTrial must be used within a TrialProvider');
    }
    return context;
};

export const TrialProvider = ({ children }: { children: ReactNode }) => {
    const [trialName, setTrialName] = useState<string>('')
  
    return (
        <TrialContext.Provider value={{
             trialName, 
             setTrialName 
             }}>
            {children}
        </TrialContext.Provider>
    );
};