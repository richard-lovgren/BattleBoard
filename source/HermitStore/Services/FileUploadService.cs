using HeyRed.Mime;

namespace HermitStore.Services
{
    public interface IFileUploadService
    {
        public Task<byte[]> UploadImageAsync(IFormFile file, Guid id);
        public Task<bool> UploadImageAsync(byte[] byteArrFromDb, string filePath, Guid id);
        public string GetContentTypeFromExistingFile(Guid id);
        public string GetFilePathFromExistingFile(Guid id);

    }

    /// <summary>
    /// Class <c>FileUploadService</c> service class for uploading files to the server.
    /// </summary>
    public class FileUploadService : IFileUploadService
    {
        private static readonly int maxFileSize = 1024 * 1024; // 1 MB
        private static readonly string[] allowedContentTypes = ["image/jpeg", "image/png"];
        private static readonly string uploadsFolder = "Uploads";

        /// <summary>
        /// Method <c>UploadImageAsync</c> uploads an image to the server, saves it in the Uploads folder, and returns the image as a byte array.
        /// If the Uploads folder does not exist, it will be created.
        /// </summary>
        public async Task<byte[]> UploadImageAsync(IFormFile file, Guid id)
        {
            if (file.Length > maxFileSize)
            {
                throw new Exception("File size exceeds the 1 MB limit.");
            }

            if (!allowedContentTypes.Contains(file.ContentType))
            {
                throw new Exception("File type is not supported.");
            }

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            //Remove all files with the same id (only removes file if it was previously uploaded)
            foreach (var f in Directory.GetFiles(uploadsFolder))
            {
                if (f.Contains($"{id}"))
                {
                    File.Delete(f);
                }
            }

            var fileExtension = MimeTypesMap.GetExtension(file.ContentType);
            var filePath = Path.Combine(uploadsFolder, $"{id}.{fileExtension}");

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var newImageAsByteArray = await File.ReadAllBytesAsync(filePath);

            return newImageAsByteArray;
        }

        public async Task<bool> UploadImageAsync(byte[] byteArrFromDb, string filePath, Guid id)
        {

            if (byteArrFromDb.Length > maxFileSize)
            {
                throw new Exception("File size exceeds the 1 MB limit.");
            }

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            //Remove all files with the same id (only removes file if it was previously uploaded)
            foreach (var f in Directory.GetFiles(uploadsFolder))
            {
                if (f.Contains($"{id}"))
                {
                    File.Delete(f);
                }
            }

            await File.WriteAllBytesAsync(filePath, byteArrFromDb);

            return true;
        }

        /// <summary>
        /// Get content type from existing file
        /// </summary>
        public string GetContentTypeFromExistingFile(Guid id)
        {
            var fileNameInUploadsFolder = Directory.GetFiles(uploadsFolder).FirstOrDefault(x => x.Contains($"{id}")) ?? throw new FileNotFoundException("File not found.");
            return MimeTypesMap.GetMimeType(fileNameInUploadsFolder); //only works if the file was uploaded to the folder before.
        }

        public string GetFilePathFromExistingFile(Guid id)
        {
            var fileNameInUploadsFolder = Directory.GetFiles(uploadsFolder).FirstOrDefault(x => x.Contains($"{id}")) ?? throw new FileNotFoundException("File not found.");
            return fileNameInUploadsFolder;
        }

        public bool FileExists(string path)
        {
            return File.Exists(path);
        }
    }
}
