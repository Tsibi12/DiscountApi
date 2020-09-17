const azureStorage = require("azure-storage");
const getStream = require("into-stream");
const atob = require("atob");

if (process.env.NODE_ENV !== "production") {
  require("dotenv/config");
}

const azureStorageConfig = {
  accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  accountKey: process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY,
  blobURL: process.env.AZURE_STORAGE_BLOBURL,
  containerName: process.env.CONTAINERNAME,
};

uploadFileToBlob = async (directoryPath, file) => {
  return new Promise((resolve, reject) => {
    const blobName = getBlobName(file.originalname);
    const stream = getStream(file.buffer);
    const streamLength = file.buffer.length;

    const blobService = azureStorage.createBlobService(
      azureStorageConfig.accountName,
      azureStorageConfig.accountKey
    );
    blobService.createBlockBlobFromStream(
      azureStorageConfig.containerName,
      `${directoryPath}/${blobName}`,
      stream,
      streamLength,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            filename: blobName,
            // originalname: file.originalname,
            size: streamLength,
            path: `${azureStorageConfig.containerName}/${directoryPath}/${blobName}`,
            url: `${azureStorageConfig.blobURL}/${azureStorageConfig.containerName}/${directoryPath}/${blobName}`,
          });
        }
      }
    );
  });
};

const getBlobName = (originalName) => {
  const identifier = Math.random().toString().replace(/0\./, ""); // remove "0." from start of string
  return `${identifier}-${originalName}`;
};

// const imageUpload = async (req, res, next) => {
// try {
//     const image = await uploadFileToBlob("sme", req.file); // images is a directory in the Azure container
//     return res.json(image);
// } catch (error) {
//     next(error);
// }
// };

const uploadBase64ToBlob = async (directoryPath, file) => {
  file.buffer = convertBase64ToBlob(file.content);

  return new Promise((resolve, reject) => {
    const blobName = getBlobName(file.fileName ? file.fileName : file.filename);
    const stream = getStream(file.buffer);
    const streamLength = file.buffer.length;

    const blobService = azureStorage.createBlobService(
      azureStorageConfig.accountName,
      azureStorageConfig.accountKey
    );
    blobService.createBlockBlobFromStream(
      azureStorageConfig.containerName,
      `${directoryPath}/${blobName}`,
      stream,
      streamLength,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            filename: blobName,
            // originalname: file.originalname,
            size: streamLength,
            path: `${azureStorageConfig.containerName}/${directoryPath}/${blobName}`,
            url: `${azureStorageConfig.blobURL}/${azureStorageConfig.containerName}/${directoryPath}/${blobName}`,
          });
        }
      }
    );
  });
};

const convertBase64ToBlob = (base64Content) => {
  const parts = base64Content.split(",");
  const doctype = parts[0].split(";")[0];
  const base64data = parts[1];

  // decode base64 string, remove space for IE compatibility
  var binary = atob(base64data.replace(/\s/g, ""));

  var len = binary.length;
  var buffer = new ArrayBuffer(len);
  var view = new Uint8Array(buffer);
  for (var i = 0; i < len; i++) {
    view[i] = binary.charCodeAt(i);
  }
  // create the blob object with content-type "application/pdf"
  //var blob = new Blob( [view], { type: "application/pdf" });

  return view;
};

// Deleting file from azure blob
// const deleteFiles = async (documents) => {
//   try {
//     if (documents.length > 0) {
//       reportStatus("Deleting files...");
//       for (const option of documents) {
//         // azureStorageConfig
//         const blobURL = azureStorageConfig.blobURL.fromContainerURL(azureStorageConfig.containerName, option.pdf);
//         // const blobURL = azblob.BlobURL.fromContainerURL(containerURL, option.text);
//         await blobURL.delete(azblob.Aborter.none);
//       }
//       reportStatus("Done.");
//       listFiles();
//     } else {
//       reportStatus("No files selected.");
//     }
//   } catch (error) {
//     reportStatus(error.body.message);
//   }
// };

// deleteButton.addEventListener("click", deleteFiles);

//app.post("/upload/image", singleFileUpload.single("file"), imageUpload);
module.exports = uploadBase64ToBlob;
