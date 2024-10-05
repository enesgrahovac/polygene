"use client"
import { createContext, useState, useContext, ReactNode } from 'react';
import { PhenotypeClassification } from '@/types/inference';

type InferenceData = {
    predictionId: string;
    status: string;
    phenotypePredictionOutput: PhenotypeClassification;
    metrics?: any;
    predictionUrl: string;
} | null;

type InferenceContextType = {
    inference: InferenceData;
    setInference: (data: InferenceData) => void;
    pathToGenotypePhenotypeGraph: string;
    setPathToGenotypePhenotypeGraph: (data: string) => void;
    pathToPhenotypeGraph: string;
    setPathToPhenotypeGraph: (data: string) => void;
    phenotypeGraphStatus: string;
    setPhenotypeGraphStatus: (status: string) => void;
    genotypePhenotypeGraphStatus: string;
    setGenotypePhenotypeGraphStatus: (status: string) => void;
};

const defaultInferenceContext: InferenceContextType = {
    inference: null,
    setInference: () => { },
    pathToGenotypePhenotypeGraph: '',
    setPathToGenotypePhenotypeGraph: () => { },
    pathToPhenotypeGraph: '',
    setPathToPhenotypeGraph: () => { },
    phenotypeGraphStatus: 'idle',
    setPhenotypeGraphStatus: () => { },
    genotypePhenotypeGraphStatus: 'idle',
    setGenotypePhenotypeGraphStatus: () => { },
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
    const [pathToGenotypePhenotypeGraph, setPathToGenotypePhenotypeGraph] = useState<string>('');
    const [pathToPhenotypeGraph, setPathToPhenotypeGraph] = useState<string>('');
    const [phenotypeGraphStatus, setPhenotypeGraphStatus] = useState<string>('idle');
    const [genotypePhenotypeGraphStatus, setGenotypePhenotypeGraphStatus] = useState<string>('idle');

    return (
        <InferenceContext.Provider value={{
            inference,
            setInference,
            pathToGenotypePhenotypeGraph,
            setPathToGenotypePhenotypeGraph,
            pathToPhenotypeGraph,
            setPathToPhenotypeGraph,
            phenotypeGraphStatus,
            setPhenotypeGraphStatus,
            genotypePhenotypeGraphStatus,
            setGenotypePhenotypeGraphStatus
        }}>
            {children}
        </InferenceContext.Provider>
    );
};