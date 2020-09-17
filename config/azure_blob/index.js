// const multer = require("multer");
// const inMemoryStorage = multer.memoryStorage();
// const singleFileUpload = multer({ storage: inMemoryStorage });
const azureStorage = require("azure-storage");
const getStream = require("into-stream");

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

//app.post("/upload/image", singleFileUpload.single("file"), imageUpload);
module.exports = uploadFileToBlob;
