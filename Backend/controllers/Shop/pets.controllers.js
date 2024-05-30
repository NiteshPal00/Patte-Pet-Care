import multer from "multer";
import path from 'path'
import fs from "fs";
import petsModels from '../../models/Shop/pet.models';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (fs.existsSync("uploads/petShopImg/")) {
            cb(null, "uploads/petShopImg/");
        } else {
            fs.mkdirSync("uploads/petShopImg/")
            cb(null, "uploads/petShopImg/");
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        const orgName = file.originalname;
        const imgArr = orgName.split('.')
        imgArr.pop();
        const fname = imgArr.join('.')
        const ext = path.extname(orgName)
        cb(null, fname + "-" + uniqueSuffix + ext);
    },
})
const upload = multer({ storage: storage });

export const addPetShop = (req, res) => {
    try {
        const uploadpetShopData = upload.single("image");
        uploadpetShopData(req, res, function (err) {
            if (err) {
                return res.status(400).json({
                    message: err.message,
                });
            }
            const { title, name, discount, price, priceCut } = req.body;

            let img = null;
            if (req.file) {
                img = req.file.filename;
            }

            const petData = new petsModels({
                title: title,
                image: img,
                name: name,
                discount: discount,
                price: price,
                priceCut: priceCut
            });

            petData.save();
            if (petData) {
                return res.status(201).json({
                    data: petData,
                    message: "Created",
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getPetAll = async (req, res) => {
    try {
        const petAllData = await petsModels.find();
        // console.log(petAllData);
        if (petAllData) {
            return res.status(200).json({
                data: petAllData,
                message: "Success",
                filepath: "http://localhost:8003/uploads/petShopImg"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getpetShop = async (req, res) => {
    try {
        const petShopID = req.params.petShop_id;
        const petShopData = await petsModels.findOne({ status: 1, _id: petShopID });
        if (petShopData) {
            return res.status(200).json({
                data: petShopData,
                message: "Success",
                filepath: "http://localhost:8003/uploads/petShopImg"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const updatepetShop = async (req, res) => {
    try {

        const uploadpetShopData = upload.single("image");
        uploadpetShopData(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    message: err.message,
                });
            }
            const petShopId = req.params.petShop_id;
            const { title, name, discount, price, priceCut } = req.body;

            const existpetShop = await petsModels.findOne({ _id: petShopId });

            let img = existpetShop.image;
            if (req.file) {
                img = req.file.filename;
                if (fs.existsSync('./uploads/petShopImg' + existpetShop.image)) {
                    fs.unlinkSync('./uploads/petShopImg' + existpetShop.image)
                }
            }

            const updateDog = await petsModels.updateOne({ _id: petShopId }, {
                $set: {
                    title: title,
                    image: img,
                    name: name,
                    discount: discount,
                    price: price,
                    priceCut: priceCut
                }
            })

            if (updateDog.matchedCount) {
                return res.status(200).json({
                    message: "Updated",
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const deletepetShop = async (req, res) => {
    try {
        const petShopID = req.params.petShop_id;
        const petData = await petsModels.findOne({ _id: petShopID })

        if (fs.existsSync('uploads/petShopImg' + petData.image)) {
            fs.unlinkSync('uploads/petShopImg' + petData.image)
        }

        const deletedData = await petsModels.deleteOne({ _id: petShopID })
        if (deletedData.acknowledged) {
            return res.status(200).json({
                message: 'Deleted'
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
