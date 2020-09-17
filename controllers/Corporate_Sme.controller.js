//import models
const db = require("../models");

const CorporatesSme = db.Corporates_Sme;
const SME = db.Sme;
// global error message
const msg = "Something went wrong. Please try again";

// Post CorporatesSme details
exports.create = async(req, res,next) => {
    
const data= req.body.corporate;

    // Save data to  database
    if (req.body) {
         try {
       
        data.forEach( async(corp) => {
          await CorporatesSme.create({
              smeId:corp.smeId,
              corporateId:corp.corporateId,
              vendorNo:corp.vendorNo,
            })
        });
        return res.status(201).json({
            success: true,
            message: `SME created successfully`
        });
        
        } catch (error) {
        next(error);
        }
    }
       
    else {
        res.status(500).json({ success: false, message: msg });
    }
};

// Fetch all CorporatesSme
exports.findAll = (req, res) => {
    CorporatesSme.findAll()
        .then((CorporatesSmes) => {
            // Send all CorporatesSme to Client
            if (CorporatesSmes) {
                res.json({ success: true, CorporatesSmes });
            } else {
                res.status(204).json({
                    success: false,
                    message: "Nothing match your request!!",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: msg });
        });
};

// Fetch CorporatesSme by smeId
exports.findBySmeId = (req, res) => {
    const {corporateId,smeId} = req.params;
    CorporatesSme.findAll({where:{smeId}})
        .then((CorporatesSmes) => {
            // Send all CorporatesSme to Client
            if (CorporatesSmes) {
                res.json({ success: true, CorporatesSmes });
            } else {
                res.status(204).json({
                    success: false,
                    message: "Nothing match your request!!",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: msg });
        });
};

// Find CorporatesSme by Id including all associate
exports.findByPk = (req, res) => {
    let { id } = req.params;
console.log(req);
    CorporatesSme.findByPk(id, { include: ['sme','corporate'] })
        .then((CorporatesSme) => {
            if (CorporatesSme) {
                res.json({ success: true, CorporatesSme });
            } else {
                res.json({ success: false, message: "Nothing match your request!" });
            }
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: msg });
        });
};

// Update a CorporatesSme identified by the CorporatesSmeId in the request
exports.update = (req, res) => {
    const { id } = req.params;
    const { smeId, corporateId, vendorNo } = req.body;

    if (smeId || corporateId || vendorNo) {
        CorporatesSme.update({
            smeId, corporateId, vendorNo
        }, {
            where: {
                id: id
            }
        })
            .then(() => res.status(201).json({
                success: true,
                message: 'CorporatesSme has been updated.'
            }))
            .catch(e => res.json({
                error: true,
                message: msg
            }));

    } else {
        return res.json({
            success: false,
            message: 'You cannot update empty fields'
        });
    }
};

// Delete CorporatesSme by Id
exports.deleteById = (req, res) => {
    //console.log("result :" + req.params.id);
    const { id } = req.params;
    CorporatesSme.destroy({
        where: { id: id },
    })
        .then(() => {
            res
                .status(200)
                .json({
                    success: true,
                    message: "CorporatesSme has been deleted!",
                });
        })
        .catch((err) => {
            res.status(500).json({ error: true, message: "Fail to delete!" });
        });
};

// Delete CorporatesSme by Id
exports.delete = (req, res) => {
    const {smeId,corporateId,vendorNo}= req.body;
    const {userId} = req.userId;

    if (smeId > 0 && corporateId >0 && vendorNo){
        SME.findByPk(smeId).then((sme) => {
            if (sme){
                isAuthorized = req.isAdmin || sme.userId == req.userId;
                console.log("xxx",req.userId,isAuthorized,sme);
if(isAuthorized){
            CorporatesSme.destroy({
            where: { smeId,corporateId,vendorNo },
            })
            .then(() => {
                res
                .status(200)
                .json({
                    success: true,
                    message: "CorporatesSme has been deleted!",
                });
            })
            .catch((err) => {
                res.status(500).json({ error: true, message: "Fail to delete!" });
            });
        }
        else
        {
            res.status(401).json({ error: true, message: "Fail to delete!" });
        }
            }
            else
            {
                res.status(416).json({ error: true, message: "Fail to delete!" });
            }
            });
        }
        else
        {
            res.status(416).json({ error: true, message: "Fail to delete!" });
        };
    }

