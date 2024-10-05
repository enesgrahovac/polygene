import React, { useEffect, useState } from 'react';
import styles from './PredictionsPage.module.css';
import { useInference } from '@/contexts/InferenceContext';
import PageLayout from "@/components/patterns/PageLayout/PageLayout";
import Button from '@/components/patterns/Button/Button';
import { useRouter } from 'next/navigation';
import { PhenotypeClassification } from '@/types/inference';

const PredictionsPage = () => {
    const { inference } = useInference();
    const [phenotypeData, setPhenotypeData] = useState<PhenotypeClassification>([]);
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            if (inference?.phenotypePredictionOutput) {
                setPhenotypeData(inference.phenotypePredictionOutput);
            }
            else if (inference?.predictionUrl) {
                try {
                    const response = await fetch(inference.predictionUrl);
                    if (!response.ok) {
                        throw new Error('Failed to fetch inference data');
                    }
                    const data = await response.json();
                    setPhenotypeData(data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, [inference]);



    return (
        <PageLayout>
            <div className={styles.pageContainer}>
                {!inference ? (
                    <div className={styles.noData}>
                    <div>No inference data available.</div>
                    <Button
                        label="Go Back"
                        variant="secondary"
                        onClick={() =>router.push("/lab")}
                    />
                    </div>
                ) : !phenotypeData.length ? (
                    <div>Loading data...</div>
                ) : (
                    <>
                        <h1>Predictions for {inference.predictionId}</h1>
                        <table className={styles.predictionTable}>
                            <thead>
                                <tr>
                                    <th>Phenotype</th>
                                    <th>Value</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {phenotypeData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.Phenotype}</td>
                                        <td>{item.Value}</td>
                                        <td>{item.Percentage}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </PageLayout>
    )
}

const PredictionsPageContainer = () => (
    <div>
        <PredictionsPage />
    </div>
);

export default PredictionsPageContainer;