//import models
const db = require("../models");
const deleteFileFromBlob = require("../config/azure_blob/deleteBlob");
const uploadBase64ToBlob = require("../config/azure_blob/base64");

const SME_Documents = db.Sme_documents;
const SME = db.Sme;
// global error message
const msg = "Something went wrong . Please try again";

//  operator
const {Op} = db.Sequelize;

//Date function => Adding 2 hours to the current date
Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
}

// Uploading base64 file
exports.createMultiple = async (req, res, next) => {
    const { smeId } = req.body;
    let documentsSaved;
    if (req.body && req.body.documents){
      
    try {
        const documents = req.body.documents;

        documentsSaved = await Promise.all(documents.map( async(doc) => {

            const fileUrl =  await uploadBase64ToBlob("sme",doc);
        
            //doc.id/doc.filename/doc.type in line 41/37/40 needs to be replaced after the next update.
            //TODO Fix doc.id/doc.filename/doc.type to doc.fileId/doc.fileName/doc.fileType
            //these changes (filename) now apply to uploadBase64ToBlob as well
            if (fileUrl.url) {
                await SME_Documents.create({
                 fileName: doc.fileName? doc.fileName : doc.filename,
                 fileUrl: fileUrl.url,
                 smeId: smeId,
                 fileType: doc.fileType ? doc.fileType : doc.type,
                  fileId: doc.fileId ? doc.fileId : doc.id
                  }).then((createdDoc) => {
                      doc.smeId = smeId
                      doc.fileUrl = fileUrl.url,
                      doc.id = createdDoc.id;
                      doc.buffer = undefined;
                      doc.content = undefined;
                      doc.fileInfo =undefined;
                    });
                }
              return doc;
            
        }));
        console.log({documentsSaved})
        return res.status(201).json({
            success: true,
            documents:documentsSaved,
            message: `File(s) created successfully`
        });
        
        } catch (error) {
        next(error);
        }
    }
    else{
        return res.json({ success: false, message: "Fail to save sme documents" });
    }
   //return res.json({ success: false,message:error.message});
};


// Post company bank details
// exports.create = async (req, res, next) => {
//     // Save data to  database
//     const { fileName, smeId  } = req.body;

    
//     try {
//         const fileUrl = await uploadFileToBlob("sme", req.file); // sme is a directory in the Azure container
        
//         if (fileUrl.url) {
//             const doc = await SME_Documents.create({
//                 fileName,
//                 fileUrl:fileUrl.url,
//                 smeId
//             })
//             return res.status(201).json({
//                 success: true,
//                 message: `${fileName} created successfully`,doc
//             });
//         } else {
//             return res.json({ success: true,message:'Please select one file'});
//         }
//         //return res.json(ownerShip);
//     } catch (error) {
//         next(error);
//     }
// };

// Fetch all SME_Documents
exports.findAll = (req, res) => {
    SME_Documents.findAll({ include: ["sme"] })
      .then((documents) => {
        // Send all SME_Documents to Client
        if (documents.length > 0) {
          let groupedSmeDocuments = [];
          let smeInvoices = [];
          let smeId = 0;
          let sme = undefined;

          for (let i = 0; i < documents.length; i++) {
            if (smeId !== documents[i].smeId) {
              if (smeInvoices.length > 0) {
                groupedSmeDocuments.push({
                  smeId,
                  sme,
                  documents: smeInvoices,
                });
              }
              smeId = documents[i].smeId;
              sme = documents[i].sme;

              smeInvoices = [documents[i]];
            } else {
              smeInvoices.push(documents[i]);
            }
          }

          if (smeInvoices.length > 0) {
            groupedSmeDocuments.push({
              smeId,
              sme,
              documents: smeInvoices,
            });
          }
          res.json({ success: true, groupedSmeDocuments });
        } else {
          res.status(200).json({
            success: false,
            message: "Nothing match your request!!",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: true, message: err.message });
      });
};

// Find a SME_Documents by Id
exports.findByPk = (req, res) => {

    let { id } = req.params;

    SME_Documents.findByPk(id, { include: ['sme'] })
        .then((document) => {
            if (document) {
                res.json({ success: true, document });
            } else {
                res.json({ success: false, message: "Nothing match your request! " });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: true, message: err.message });
        });
};

// Update a SME_Documents identified by the SME_DocumentsId in the request
exports.update = async (req, res, next) => {
    const { id } = req.params;
    const { smeId } = req.body;

    if (req.body && req.body.documents) {
      try {
        const documents = req.body.documents;
        documents.forEach(async (doc) => {
          const fileUrl = await uploadBase64ToBlob("sme", doc);

          if (fileUrl.url) {
            await SME_Documents.update({
              fileName: doc.filename,
              fileUrl: fileUrl.url,
              fileType: doc.type,
              fileId: doc.id,
            },{
            where: { id }});
          }
        });
        return res.status(201).json({
          success: true,
          message: `File(s) updated successfully`,
        });
      } catch (error) {
        next(error);
      }
    } else {
      return res.json({
        success: false,
        message: "Fail to update sme documents",
      });
    }
};

// Admin Approve documents 
exports.approveDocuments = async (req, res) => {
    const { id,smeId} = req.body;

    if (id && smeId) {
      SME_Documents.update(
        {
          confirmed: true,
          confirmedDate: new Date().addHours(2),
        },
        {
          where: {
            id,
            smeId
          },
        }
      )
        .then((document) => {
          if (document[0] === 0){
            return res.json({
              error: true,
              message:
                "Failed to approve documents.",
            });
          }
          //Check if all the documents are approved if so, then set the sme status to DocsApproved
          SME_Documents.findAll({where:{
            smeId:smeId,
            confirmed:false
          }}).then((document) => {
       
            if (document && document.length === 0){
              SME.update({status:"DocsApproved"},
              {where:
                {id:smeId,
                status:"DocsSubmitted"}
              })
            }
          });

          res.status(201).json({
            success: true,
            message: "Documents has been confirmed.",
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: true,
            message: err.message,
          });
        });
    } else {
      return res.json({
        success: false,
        message: "Documents Id/smeId is missing!!",
      });
    }
};

// Delete SME_Documents by Id
exports.delete = (req, res) => {
    const { id } = req.params;

    SME_Documents.findByPk(id).then((document) => {

          deleteFileFromBlob(document.fileUrl).then(() => {
                SME_Documents.destroy({
                     where: { id: id },
                 })
                .then(() => {
                    res.status(200).json({ success: true, message: "SME_Documents has been deleted!" });
                })
                .catch((err) => {
                    res.status(500).json({ success: false, message: "Fail to delete banking details!" });
                });
              });
              
          }).catch((err) => {
            res.status(500).json({ success: false, message: "Fail to delete banking details!" });
        });
};
 
