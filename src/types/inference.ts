export type TaskName = 
    | "phenotype_prediction"
    | "phenotype_clustering"
    | "genotype_phenotype_clustering"
    | "similar_genes_to_phenotype_class"
    | "plot_top_genes_similar_to_phenotype"
    | "gene_list_knockout_simulation"
    | "gene_knockout_knockin_simulation"
    | "find_marker_and_differentiator_genes";

export interface InferencePayload {
    inputPath: string;
    taskName: TaskName; 
    maxCells?: number; 
    batchSize?: number; 
}

export type PhenotypeClassification = {
    Phenotype: string;
    Value: string;
    Percentage: string;
}[]

