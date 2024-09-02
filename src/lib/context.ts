import { Pinecone, PineconeRecord, QueryResponse } from '@pinecone-database/pinecone';
import { convertToAscii } from './utils';
import { getEmbeddings } from './db/embeddings';
import dotenv from 'dotenv';

dotenv.config();


export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string) {
    try {
        const pc = new Pinecone({
            apiKey: process.env.PINCONE_API_KEY!,
        });

        const index = await pc.index('chatapp');
        const namespace = index.namespace(convertToAscii(fileKey));
        console.log("namespace", namespace);
        const queryRequest = await namespace.query({
            topK: 5,
            vector: embeddings,
            includeMetadata: true,
        });

        return queryRequest.matches || [];
    } catch (error) {
        console.error("Error querying embeddings", error);
        throw error;
    }
}

export async function getContext(query: string, fileKey: string) {
    const queryEmbeddings = await getEmbeddings(query);
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
    console.log("I am working at the getContext")
    // console.log("matches", matches);

    const qualifyingDocs = matches.filter(
        (match) => {
            console.log("match", match);
            match.score && match.score > 0.7
        });

    type Metadata = {
        text: string,
        pageNumber: number,
    }

    let docs = qualifyingDocs.map((match)=> (match.metadata as Metadata).text);
    console.log("docs", docs);
    return docs.join("\n").substring(0, 3000)
}

