import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AnimationsAWSCredentialsResultType } from "@/app/animations/data/animations.repository";

type UploadObjectType = {
  Key: string;
  ContentType: string;
  data: PutObjectCommandInput["Body"];
  CacheControl?: PutObjectCommandInput["CacheControl"];
  Metadata?: Record<string, string>;
  Tagging?: string;
};

export type GetObjectResponseType<T> = {
  error: boolean;
  reason?: string;
  data?: T;
};

export class S3Service {
  private static instance: S3Service;
  private static currentS3Client: S3Client;
  private static currentS3Bucket: string;

  private constructor() {}

  public static getInstance(): S3Service {
    if (!S3Service.instance) {
      S3Service.instance = new S3Service();
    }
    return S3Service.instance;
  }

  static async setup(
    bucket: string,
    region: string,
    credentials: AnimationsAWSCredentialsResultType["getAWSCredentials"],
  ) {
    S3Service.currentS3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: credentials.AccessKeyId,
        secretAccessKey: credentials.SecretAccessKey,
        sessionToken: credentials.SessionToken,
        expiration: credentials.Expiration,
      },
    });
    S3Service.currentS3Bucket = bucket;
  }

  /**
   * Methods
   * */
  async uploadObject(props: UploadObjectType): Promise<PutObjectCommandOutput> {
    const params: PutObjectCommandInput = {
      Bucket: S3Service.currentS3Bucket,
      Key: props.Key,
      Body: props.data,
      ContentType: props.ContentType,
      CacheControl: props.CacheControl,
      Tagging: props.Tagging,
    };
    const cmd = new PutObjectCommand(params);
    const response = await S3Service.currentS3Client.send(cmd);
    return response;
  }

  async getObjectSignedUrl(Key: string): Promise<string> {
    const cmd = new GetObjectCommand({
      Bucket: S3Service.currentS3Bucket,
      Key,
      ResponseContentType: "application/json",
      ResponseContentDisposition: 'attachment; filename="animation.json"',
    });
    return await getSignedUrl(S3Service.currentS3Client, cmd, {
      expiresIn: 10800,
    });
  }
}
