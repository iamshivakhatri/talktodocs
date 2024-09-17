import { Pinecone, PineconeRecord, QueryResponse } from '@pinecone-database/pinecone';
import { convertToAscii } from './utils';
import { getEmbeddings } from './db/embeddings';
import fs from 'fs';  // Import the file system module
import path from 'path';  // Import path module
import {embedding} from "@/constant"





export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string) {
    try {
        console.log("I am working at the getMatchesFromEmbeddings with embeddings ", embeddings);
        // const fileName = `embeddings_${fileKey}.json`;
        // const filePath = path.join(process.cwd(), 'data', fileName);
        
        // const data = JSON.stringify(embeddings);
        
        // try {
        //     await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        //     await fs.promises.writeFile(filePath, data);
        //     console.log(`Embeddings saved to ${filePath}`);
        // } catch (error) {
        //     console.error('Error saving embeddings to file:', error);
        // }
            
    // apiKey: process.env.PINCONE_API_KEY!,
        const pc = new Pinecone({
            apiKey: process.env.PINCONE_API_KEY!,
        });

        const index = await pc.index('chatapp');
        const namespace = await index.namespace(convertToAscii(fileKey));
        console.log("namespace", namespace);
        const queryRequest = await namespace.query({
            topK: 3,
            vector: embeddings,
            includeMetadata: true,
        });

        console.log("queryRequest", queryRequest);

        return queryRequest.matches || [];
    } catch (error) {
        console.error("Error querying embeddings", error);
        throw error;
    }
}

export async function getContext(query: string, fileKey: string) {
    console.log("I am working at the getContext with the query: ", query);
    const queryEmbeddings = await getEmbeddings(query);
    console.log("queryEmbeddings Embedding dimension:", queryEmbeddings.length);
    console.log(" queryEmbeddingsSample embedding values:", queryEmbeddings.slice(0, 5));
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
    console.log("I am working at the getContext")
    console.log("matches for the summary right now.", matches);

    const qualifyingDocs = await matches.filter(
        (match) => 
            match.score && match.score > 0.5
        );

    // const qualifyingDocs = matches;

    type Metadata = {
        text: string,
        pageNumber: number,
    }
    console.log("qualifyingDocs", qualifyingDocs);

    let docs = qualifyingDocs.map((match)=> (match.metadata as Metadata).text);
    console.log("docs", docs);
    return docs.join("\n").substring(0, 3000)
}

