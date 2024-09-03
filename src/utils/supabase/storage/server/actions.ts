'use server'
import { createClient } from '@/utils/supabase/auth/server';

export const createSupabaseSignedUrl = async (bucketName: string, fileName: string, timeLimit: number=60) => {
    const supabase = createClient();
    

    const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(fileName, timeLimit)

    if (error) {
        throw error
    }

    const signedUrl = data.signedUrl
    return signedUrl
}