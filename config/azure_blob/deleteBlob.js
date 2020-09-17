const _ = require ("lodash");
const azureStorage = require("azure-storage");


if (process.env.NODE_ENV !== "production") {
    require("dotenv/config");
}


const azureStorageConfig = {
    accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    accountKey: process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY,
    blobURL: process.env.AZURE_STORAGE_BLOBURL,
    containerName: process.env.CONTAINERNAME,
};

const deleteFileFromBlob = async (url) => {
    let response = "delete";
    if (url){
        let blobName = getFileFromUrl(url);
        let token;
            const directoryPath = "sme";
        const blobService = azureStorage.createBlobService(
            azureStorageConfig.accountName,
            azureStorageConfig.accountKey
        );

         blobService.doesBlobExist(azureStorageConfig.containerName,blobName,(error,result) => {

            if (error){
                response = error;
            }
            else if(result.exists)
            {
                
                blobService.deleteBlobIfExists(azureStorageConfig.containerName,blobName,(error,result) => {
                response =result;
                    });

                 
            }
            else{
                response = `File (${blobName}) does not exist : `;
            }

         });
    }else{
        response ="No url Provided";
    }

    return response;
    }

getFileFromUrl = (url) =>
{
    
    let splitUrl = _.split(url,"/");
    let filename = splitUrl.pop();
    let directory = splitUrl.pop();


    return `${directory}/${filename}`;

}

module.exports = deleteFileFromBlob;