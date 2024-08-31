import { Pinecone, PineconeRecord,  } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {Document, RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter';
import { getEmbeddings } from './embeddings';
import md5 from 'md5';
import { metadata } from '@/app/layout';
import { convertToAscii } from '../utils';



dotenv.config();


const pc = new Pinecone({
  apiKey: process.env.PINCONE_API_KEY!,
});

console.log('Pinecone instance:', pc);
const index = pc.index('quickstart' );

type PDFPage = {
  pageContent: string;
  metadata:{
    loc: {pageNumber: number}
  }

}

export async function loadS3IntoPinecone(filekey: string){
  console.log('Downloading s3 into file system');
  console.log('filekey in the pinecone', filekey);
  const file_name = await downloadFromS3(filekey);
  if (!file_name) {
    throw new Error('Failed to download file from S3');
    return;
  }
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];
  // return pages;

  // 2. split and segment the pdf
  // pages = Array(13)

  // split the pdf into smaller chunks
  const documents = await Promise.all(pages.map(page => prepareDocument(page)));

  // 3. vectorise and embed individual documents
  const vectors = await Promise.all(documents.flat().map(doc => embedDocument(doc)));

  // 4. Upload the vectors to Pinecone
  const pineconeIndex = pc.index('chatapp')
  console.log("Uploading to Pinecone", vectors);
  const namespace = pineconeIndex.namespace(convertToAscii(filekey));

  await namespace.upsert(vectors);

  return documents[0]
} 

async function embedDocument(doc: Document){
  try{
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        pageNumber: doc.metadata.pageNumber,
        text: doc.metadata.text
      }
    } as PineconeRecord;

  }catch(error){
    console.error(error);
    throw new Error('Failed to embed document at embedDocument');
  }
  const text = doc.metadata.text;
  // const embeddings = await getEmbeddings(text);
  // return embeddings;
}

// Function to limit to omit the multibyte characters like emojis and maintain the byte size
export const truncateStringByBytes = (str: string, numBytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, numBytes));
}

async function prepareDocument(page: PDFPage){
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, ' ');

  //split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs =  await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000)
      }
    })
  ]);
  return docs;

}

// src/lib/db/pinecone.js