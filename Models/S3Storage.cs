using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace WebCameraRecorder.Models
{
    public class S3Storage : IStorage
    {
        private const string bucketName = "web-camera-recorder";
        private readonly IAmazonS3 client;

        public S3Storage(IConfiguration configuration)
        {
            client = new AmazonS3Client(
                configuration["aws:AccessKeyId"],
                configuration["aws:SecretAccessKey"],
                RegionEndpoint.USWest2);
        }
        public string GetUrl(string fileName)
        {
            GetPreSignedUrlRequest request = new GetPreSignedUrlRequest
            {
                BucketName = bucketName,
                Key = fileName,
                Expires = DateTime.Now.AddMinutes(5)
            };
            return client.GetPreSignedURL(request);
        }

        public async Task PostAsync(Stream stream, string fileName)
        {
            var putRequest = new PutObjectRequest
            {
                BucketName = bucketName,
                InputStream = stream,
                Key = fileName
            };

            await client.PutObjectAsync(putRequest);
        }
    }
}
