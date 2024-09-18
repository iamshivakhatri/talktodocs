import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { convertToAscii } from "../utils";

import fs from 'fs';
import path from 'path';

dotenv.config();

const pc = new Pinecone({
  apiKey: process.env.PINCONE_API_KEY!,
});

interface CustomDocument extends Document {
  pageContent: string;
  metadata: {
    pageNumber: number;
    text: string;
  };
}

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

// Helper function to break an array into chunks
const chunks = <T>(array: T[], batchSize: number): T[][] => {
  const result = [];
  for (let i = 0; i < array.length; i += batchSize) {
    result.push(array.slice(i, i + batchSize));
  }
  return result;
};

// Function to delete a file
const deleteFile = (filePath: string) => {
  try {
    console.log(`Deleting file: ${filePath}`);
    fs.unlinkSync(filePath);
    console.log(`File deleted successfully: ${filePath}`);
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
};

export async function loadS3IntoPinecone(filekey: string) {
  console.log("Downloading s3 into file system");
  const file_name = await downloadFromS3(filekey);
  if (!file_name) {
    throw new Error("Failed to download file from S3");
  }

  try{
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];
  
    // Split the PDF into smaller chunks
    const documents = await Promise.all(
      pages.map((page) => prepareDocument(page))
    );
  
    // Vectorize and embed individual documents
    const vectors = await Promise.all(
      documents.flat().map((doc) => embedDocument(doc))
    );
  
    // Upload vectors to Pinecone in batches
    const pineconeIndex = pc.index("chatapp");
    const namespace = pineconeIndex.namespace(convertToAscii(filekey));
  
    const batchSize = 200;
  
    const vectorChunks = chunks(vectors, batchSize);
  
    for (let i = 0; i < vectorChunks.length; i++) {
      const chunk = vectorChunks[i];
      const validRecords = chunk.filter(
        (record) => record.values && record.values.length > 0
      );
      if (validRecords.length > 0) {
        await namespace.upsert(validRecords);
        console.log(`Uploaded batch ${i + 1}/${vectorChunks.length} to Pinecone`);
      } else {
        console.warn(`Skipped batch ${i + 1} due to lack of valid records`);
      }
    }
  
    return documents[0];
  }catch(error){
    console.error("Error while processing PDF:", error);
  }finally{
    deleteFile(file_name);
  }
}




async function embedDocument(doc: CustomDocument): Promise<PineconeRecord> {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        pageNumber: doc.metadata.pageNumber,
        text: doc.metadata.text,
      },
    };
  } catch (error) {
    console.error("Failed to embed document:", error);
    throw new Error("Failed to embed document");
  }
}

async function prepareDocument(page: PDFPage): Promise<CustomDocument[]> {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, " ");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return docs.map((doc) => ({
    ...doc,
    metadata: {
      pageNumber: doc.metadata.pageNumber as number,
      text: doc.metadata.text as string,
    },
  })) as CustomDocument[];
}

export const truncateStringByBytes = (
  str: string,
  numBytes: number
): string => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, numBytes));
};

export async function deleteFromPinecone(filekey: string): Promise<void> {
  try {
    console.log("Deleting from Pinecone", filekey);
    const index = pc.index("chatapp");

    const namespaceExists = await checkNamespaceExists(index, filekey);

    if (!namespaceExists) {
      console.log("Namespace not found or already deleted");
      return;
    } else {
      const deletion = await index.namespace(filekey).deleteAll();
      console.log("Deletion from Pinecone", deletion);
    }
  } catch (error) {
    console.error("Error deleting from Pinecone:", error);
  }
}

async function checkNamespaceExists(
  index: any,
  namespace: string | null
): Promise<boolean> {
  if (namespace === null) throw new Error("No namespace value provided.");
  const { namespaces } = await index.describeIndexStats();
  return namespaces.hasOwnProperty(namespace);
}
