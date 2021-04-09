using Amazon.S3;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Threading.Tasks;

namespace WebCameraRecorder.Models
{
    public class S3Storage : IStorage
    {
        private const string bucketName = "web-camera-recorder";
        private readonly IAmazonS3 client;

        public S3Storage(IConfiguration configuration)
        {

        }
        public string GetUrl(string fileName)
        {
            return "fjalskfjaslkfjkalsfj";
        }

        public async Task PostAsync(Stream stream, string fileName)
        {

        }
    }
}
