//import models
const db = require("../models");

const InterestRate = db.Global_Interest_Rates;

// global error message
const msg = "Something went wrong. Please try again";

// Post InterestRate details
exports.create = (req, res) => {
    const { interestRate, effectiveDate} = req.body;
    // Save data to  database

    if (req.body) {
        InterestRate.create({
            interestRate,
            effectiveDate,
            // corporateId
            
        })
            .then((InterestRate) => {
                // Send created InterestRate to client
                res.status(201).json({
                    success: true,
                    message: "Global interest rate created successfully",
                    InterestRate,
                });
            })
            .catch((err) => {
                res.status(500).json({ error: true, message: err.message });
            });
    } else {
        res.status(500).json({ success: false, message: msg });
    }
};

// Fetch all InterestRate
exports.findAll = (req, res) => {
    InterestRate.findAll()
        .then((interestRate) => {
            // Send all InterestRate to Client
            if (interestRate) {
                res.json({ success: true, interestRate });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Nothing match your request!!",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: true, message: msg });
        });
};

// Find InterestRate by Id including all associate
exports.findByPk = (req, res) => {
    let { id } = req.params;

    InterestRate.findByPk(id /*, {include:['corporate']}*/)
        .then((interestRate) => {
            if (interestRate) {
                res.json({ success: true, interestRate });
            } else {
                res.json({ success: false, message: "Nothing match your request!" });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: true, message: err.message });
        });
};

// Update a InterestRate identified by the InterestRateId in the request
exports.update = (req, res) => {
    const { id } = req.params;
    const {interestRate, effectiveDate} = req.body;

    if (interestRate || effectiveDate) {
        InterestRate.update({
            interestRate, effectiveDate
        }, {
            where: {
                id
            }
        })
            .then(() => res.status(201).json({
                success: true,
                message: 'InterestRate has been updated.'
            }))
            .catch(err => {
                res.status(500).json({
                    error: true,
                    message: msg
                });
            });

    } else {
        return res.json({
            success: false,
            message: 'You cannot update empty fields'
        });
    }
};

// Delete InterestRate by Id
exports.delete = (req, res) => {
    const { id } = req.params;
    InterestRate.destroy({
        where: { id: id },
    })
        .then(() => {
            res.status(200).json({
                success: true,
                message: "Interest rate has been deleted!",
            });
        })
        .catch((err) => {
            res.status(500).json({ error: true, message: "Fail to delete!" });
        });
};
