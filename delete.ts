// const uploadTranscriptToS3 = async (transcript: string) => {
//   // Create a Blob (file-like object) from the transcript
//   const blob = new Blob([transcript], { type: "text/plain" });
//   const file = new File([blob], "transcript.txt");

//   // Upload this file to S3
//   const data = await uploadToS3(file);
//   if (!data?.file_key || !data?.file_name) {
//       throw new Error("Failed to upload transcript");
//   }
//   return data;
// };
