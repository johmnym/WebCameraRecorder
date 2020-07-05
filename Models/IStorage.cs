using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace WebCameraRecorder.Models
{
    public interface IStorage
    {
        Task PostAsync(Stream stream, string fileName);
        string GetUrl(string fileName);
    }
}
