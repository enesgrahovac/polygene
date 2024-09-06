"use server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export const replicateInference = async (signedUrl: string) => {
    console.log("in replicate inference")
    const output = await replicate.run(
        "enesgrahovac/perturbgene:8a2a82ae35229e8a0a6a643ad9dab1933acb7dc132378ebef696bf270eb72998",
        {
            input: {
                input_path: signedUrl
            }
        }
    );
    console.log("replicateInference output", output);
    return output;
}

export const startInference = async (signedUrl: string) => {
    let prediction = await replicate.predictions.create({
        model: "enesgrahovac/perturbgene",
        version: "8a2a82ae35229e8a0a6a643ad9dab1933acb7dc132378ebef696bf270eb72998",
        input: {
            input_path: signedUrl,
        },
      });
    return prediction;
}

export const getInferenceStatus = async (predictionId: string) => {
    let prediction = await replicate.predictions.get(predictionId);
    return prediction;
}

export const cancelInference = async (predictionId: string) => {
    const response = await replicate.predictions.cancel(predictionId);
    return response;
}