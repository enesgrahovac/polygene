import React from 'react';
import styles from './AnalysisPage.module.css';
import { useInference } from '@/contexts/InferenceContext';
import PageLayout from "@/components/patterns/PageLayout/PageLayout";
import Button from '@/components/patterns/Button/Button';
import { useRouter } from 'next/navigation';
import { PhenotypeClassification } from '@/types/inference';

const AnalysisPage = () => {
    const { 
        inference, 
        pathToGenotypePhenotypeGraph, 
        pathToPhenotypeGraph,
        phenotypeGraphStatus,
        genotypePhenotypeGraphStatus
    } = useInference();
    const router = useRouter();

    const openGenotypePhenotypeClustering = () => {
        if (genotypePhenotypeGraphStatus === 'ready') {
            window.open(pathToGenotypePhenotypeGraph, '_blank');
        }
    };

    const openPhenotypeClustering = () => {
        if (phenotypeGraphStatus === 'ready') {
            window.open(pathToPhenotypeGraph, '_blank');
        }
    };

    return (
        <PageLayout>
            <div className={styles.pageContainer}>
                {(!pathToGenotypePhenotypeGraph && !pathToPhenotypeGraph) ? (
                    <div className={styles.noData}>
                        <div>No inference data available.</div>
                        <Button
                            label="Go Back"
                            variant="secondary"
                            onClick={() => router.push("/lab")}
                        />
                    </div>
                ) : (
                    <>
                        <Button
                            label={genotypePhenotypeGraphStatus === 'ready' ? "Genotype Phenotype Clustering" : "Genotype Phenotype Clustering is processing..."}
                            onClick={openGenotypePhenotypeClustering}
                            variant="ghost"
                            style={{ width: "400px" }}
                            disabled={genotypePhenotypeGraphStatus !== 'ready'}
                        />
                        <Button
                            label={phenotypeGraphStatus === 'ready' ? "Phenotype Clustering" : "Phenotype Clustering is processing..."}
                            onClick={openPhenotypeClustering}
                            variant="ghost"
                            style={{ width: "400px" }}
                            disabled={phenotypeGraphStatus !== 'ready'}
                        />
                    </>
                )}
            </div>
        </PageLayout>
    );
};

export default AnalysisPage;