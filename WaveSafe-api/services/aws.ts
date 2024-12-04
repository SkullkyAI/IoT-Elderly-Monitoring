import S3 from 'npm:aws-sdk/clients/s3';
import { Router } from "@oak/oak";
import {GetObjectCommand, PutObjectCommand} from 'npm:aws-sdk/clients';

const s3Client = new S3({
    region: 'us-west-2',
    credentials: {
        accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID") || "",
        secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY") || "",
    },
});

const router = new Router();

router.get("/generate-presigned-url/upload", async (ctx) => {
    const fileName = ctx.request.url.searchParams.get("fileName");
    if (!fileName) {
      ctx.response.status = 400;
      ctx.response.body = { error: "El parámetro 'fileName' es obligatorio" };
      return;
    }
  
    const url = await s3Client.createPresignedPost(
        {
            Bucket: Deno.env.get("AWS_BUCKET_NAME") || "",
            Fields: {
                key: fileName,
            },
            Conditions: [
                ['content-length-range', 0, 716800], // Up to 700KB
                ['starts-with', '$Content-Type', 'image/'],
            ],
            Expires: 3600, // URL expires in 1 hour
        }
    );
    // Bucket: Deno.env.get("AWS_BUCKET_NAME") || "",
    // key: fileName,
    // Method: "PUT", // Para subida
    // Expires: 3600, // Expira en 1 hora
  
    ctx.response.status = 200;
    ctx.response.body = { url };
  });