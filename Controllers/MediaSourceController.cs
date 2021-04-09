using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebCameraRecorder.Models;

namespace WebCameraRecorder.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaSourceController : ControllerBase
    {
        const string fileFormName = "video-blob";
        private readonly IStorage _storage;
        public MediaSourceController(IStorage storage)
        {
            _storage = storage;
        }
        //[HttpPost]
        //public async Task<IActionResult> Post()
        //{
        //    var form = Request.Form;
        //    var fileName = $"{Guid.NewGuid()}.webm";
        //    await _storage.PostAsync(form.Files[fileFormName].OpenReadStream(), fileName);
            
        //    return Ok(fileName);
        //}

        [HttpPost]
        public async Task<IActionResult> PostFS()
        {
            var form = Request.Form;
            var fileName = $"{Guid.NewGuid()}.webm";

            var filePath = $@"c:\temp\{fileName}";
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await form.Files[fileFormName].CopyToAsync(stream);
            }


            return Ok(fileName);
        }
        [HttpGet]
        public IActionResult Get(string fileName)
        {
            var url = _storage.GetUrl(fileName);
            return Ok(url);
        }
    }
}
