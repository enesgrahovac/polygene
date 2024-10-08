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
    pathToVolcanoPlot: string;
    setPathToVolcanoPlot: (data: string) => void;
    volcanoPlotStatus: string;
    setVolcanoPlotStatus: (status: string) => void;
    phenotypeGraphStatus: string;
    setPhenotypeGraphStatus: (status: string) => void;
    genotypePhenotypeGraphStatus: string;
    setGenotypePhenotypeGraphStatus: (status: string) => void;
    pathToTopGenesBarPlot: string;
    setPathToTopGenesBarPlot: (data: string) => void;
    topGenesBarPlotStatus: string;
    setTopGenesBarPlotStatus: (status: string) => void;

};

const defaultInferenceContext: InferenceContextType = {
    inference: null,
    setInference: () => { },
    pathToGenotypePhenotypeGraph: '',
    setPathToGenotypePhenotypeGraph: () => { },
    pathToPhenotypeGraph: '',
    setPathToPhenotypeGraph: () => { },
    pathToVolcanoPlot: '',
    setPathToVolcanoPlot: () => { },
    volcanoPlotStatus: 'idle',
    setVolcanoPlotStatus: () => { },
    phenotypeGraphStatus: 'idle',
    setPhenotypeGraphStatus: () => { },
    genotypePhenotypeGraphStatus: 'idle',
    setGenotypePhenotypeGraphStatus: () => { },
    pathToTopGenesBarPlot: '',
    setPathToTopGenesBarPlot: () => { },
    topGenesBarPlotStatus: 'idle',
    setTopGenesBarPlotStatus: () => { },
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
    const [pathToVolcanoPlot, setPathToVolcanoPlot] = useState<string>('');
    const [volcanoPlotStatus, setVolcanoPlotStatus] = useState<string>('idle');
    const [pathToTopGenesBarPlot, setPathToTopGenesBarPlot] = useState<string>('');
    const [topGenesBarPlotStatus, setTopGenesBarPlotStatus] = useState<string>('idle');
    
    return (
        <InferenceContext.Provider value={{
            inference,
            setInference,
            pathToGenotypePhenotypeGraph,
            setPathToGenotypePhenotypeGraph,
            pathToPhenotypeGraph,
            setPathToPhenotypeGraph,
            pathToVolcanoPlot,
            setPathToVolcanoPlot,
            volcanoPlotStatus,
            setVolcanoPlotStatus,
          
            phenotypeGraphStatus,
            setPhenotypeGraphStatus,
            genotypePhenotypeGraphStatus,
            setGenotypePhenotypeGraphStatus,
            pathToTopGenesBarPlot,
            setPathToTopGenesBarPlot,
            topGenesBarPlotStatus,
            setTopGenesBarPlotStatus,
        }}>
            {children}
        </InferenceContext.Provider>
    );
};