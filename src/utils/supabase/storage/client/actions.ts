"use client"
import { createClient } from '@/utils/supabase/auth/client';

// This could be placed in a utility file where you handle API interactions.
export async function clientSideUpload(bucketName:string, saveToPath:string, file: File): Promise<any> {
    if (!file) {
        alert('No file selected');
        return null;
    }

    const supabase = createClient();
    const fileExtension = file.name.split('.').pop();
   
    try {
        const { data, error } = await supabase.storage
            .from(bucketName) // Your bucket name
            .upload(`${saveToPath}`, file, {
                contentType: file.type || 'application/octet-stream',  // Use default MIME type if null
                upsert: false
            });

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Upload failed:', error);
        return null;
    }
}