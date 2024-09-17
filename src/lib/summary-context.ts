import { Pinecone, PineconeRecord, QueryResponse } from '@pinecone-database/pinecone';
import { convertToAscii } from './utils';
import { getEmbeddings } from './db/embeddings';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { embedding } from "@/constant";

dotenv.config();

const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 3000; // 3 seconds

// Add a simple in-memory cache
const cache: { [key: string]: any } = {};

export async function getMatchesFromEmbeddings(fileKey: string) {
    const cacheKey = `matches_${fileKey}`;
    if (cache[cacheKey]) {
        console.log("Returning cached result for", fileKey);
        return cache[cacheKey];
    }

    const embeddings = embedding;
    console.log("embeddings in the summary context", embeddings.slice(0, 5), "...");
    console.log("filekey in the getMatchesFromEmbeddings", fileKey);

    const pc = new Pinecone({
        apiKey: process.env.PINCONE_API_KEY!,
    });

    const index = await pc.index('chatapp');
    const namespace = await index.namespace(convertToAscii(fileKey));

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            console.log(`Attempt ${attempt + 1}: Querying Pinecone after ${INITIAL_BACKOFF * Math.pow(2, attempt) / 1000} seconds`);
            await new Promise(resolve => setTimeout(resolve, INITIAL_BACKOFF * Math.pow(2, attempt)));

     
            const queryRequest = await namespace.query({
                topK: 3,
                vector: embeddings,
                includeMetadata: true,
            });

            console.log(`Attempt ${attempt + 1} queryRequest:`, JSON.stringify(queryRequest, null, 2));

            if (queryRequest.matches && queryRequest.matches.length > 0) {
                console.log(`Matches found on attempt ${attempt + 1}`);
                cache[cacheKey] = queryRequest.matches;
                return queryRequest.matches;
            } else if (attempt < MAX_RETRIES - 1) {
                console.log(`No matches found on attempt ${attempt + 1}. Retrying...`);
            } else {
                console.log("No matches found after all retry attempts.");
                return [];
            }
        } catch (error) {
            console.error(`Error on attempt ${attempt + 1}:`, error);
            if (attempt === MAX_RETRIES - 1) {
                throw error;
            }
        }
    }

    return [];
}

export async function getSummaryContext(fileKey: string) {

    const matches = await getMatchesFromEmbeddings( fileKey);
    console.log("I am working at the getContext")
    console.log("matches for the summary right now.", matches);

    const qualifyingDocs = await matches.filter(
        (match: any) => 
            match.score && match.score > 0.5
        );

    // const qualifyingDocs = matches;

    type Metadata = {
        text: string,
        pageNumber: number,
    }
    console.log("qualifyingDocs", qualifyingDocs);

    let docs = qualifyingDocs.map((match: any)=> (match.metadata as Metadata).text);
    console.log("docs", docs);
    return docs.join("\n").substring(0, 3000)
}

// export async function getSummaryContext(fileKey: string) {
//     try {
//         console.log("Starting getSummaryContext for fileKey:", fileKey);
//         const matches = await getMatchesFromEmbeddings(fileKey);
//         console.log("Matches received from getMatchesFromEmbeddings:", JSON.stringify(matches, null, 2));

//         const qualifyingDocs = matches.filter(
//             (match) => match.score && match.score > 0.5
//         );

//         console.log("Qualifying documents:", JSON.stringify(qualifyingDocs, null, 2));

//         type Metadata = {
//             text: string,
//             pageNumber: number,
//         }

//         let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
//         console.log("Extracted text from qualifying documents:", docs);

//         const result = docs.join("\n").substring(0, 3000);
//         console.log("Final summary context (truncated):", result.substring(0, 100) + "...");
//         return result;
//     } catch (error) {
//         console.error("Error in getSummaryContext:", error);
//         throw error;
//     }
// }