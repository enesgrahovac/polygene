import React, { useEffect, useState } from 'react';
import styles from './AnalysisPage.module.css';
import { useInference } from '@/contexts/InferenceContext';
import PageLayout from "@/components/patterns/PageLayout/PageLayout";
import Button from '@/components/patterns/Button/Button';
import { useRouter } from 'next/navigation';

const AnalysisPage = () => {
    const { inference } = useInference();
    const router = useRouter();

    const openGenotypePhenotypeClustering = () => {
        window.open(inference?.pathToGenotypePhenotypeGraph, '_blank');
    };

    const openPhenotypeClustering = () => {
        window.open(inference?.pathToPhenotypeGraph, '_blank');
    };

    return (
        <PageLayout>
            <div className={styles.pageContainer}>
                {!inference || (!inference.pathToGenotypePhenotypeGraph && !inference.pathToPhenotypeGraph) ? (
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
                            label="Genotype Phenotype Clustering"
                            onClick={openGenotypePhenotypeClustering}
                            variant="ghost"
                            style={{ width: "400px" }}
                        />
                        <Button
                            label="Phenotype Clustering"
                            onClick={openPhenotypeClustering}
                            variant="ghost"
                            style={{ width: "400px" }}
                        />
                    </>
                )}
            </div>
        </PageLayout>
    );
};

export default AnalysisPage;