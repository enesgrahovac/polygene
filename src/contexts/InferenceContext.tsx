'use client'
import { createContext, useState, useContext, ReactNode } from 'react';

type InferenceData = {
    predictionId: string;
    status: string;
    output: any;
    metrics?: any;
    predictionUrl: string;
    pathToGenotypePhenotypeGraph: string;
    pathToPhenotypeGraph: string;
} | null;

type InferenceContextType = {
    inference: InferenceData;
    setInference: (data: InferenceData) => void;
};

const defaultInferenceContext: InferenceContextType = {
    inference: null,
    setInference: () => { },
};

export const InferenceContext = createContext<InferenceContextType>(defaultInferenceContext);

export const useInference = () => {
    const context = useContext(InferenceContext);
    if (context === undefined) {
        throw new Error('useInference must be used within an InferenceProvider');
    }
    return context;
};

export const InferenceProvider = ({ children }: { children: ReactNode }) => {
    const [inference, setInference] = useState<InferenceData>(defaultInferenceContext.inference);

    return (
        <InferenceContext.Provider value={{ inference, setInference }}>
            {children}
        </InferenceContext.Provider>
    );
};