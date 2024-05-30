import multer from "multer";
import path from 'path'
import fs from "fs";
import petSinmodels from '../../models/Shop/petSin.models';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (fs.existsSync("uploads/petSinShop/")) {
            cb(null, "uploads/petSinShop/");
        } else {
            fs.mkdirSync("uploads/petSinShop/")
            cb(null, "uploads/petSinShop/");
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

export const addPetSinShop = (req, res) => {
    try {
        const uploadPetSinShopData = upload.single("image");
        uploadPetSinShopData(req, res, function (err) {
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

            const petData = new petSinmodels({
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

export const getPetSinAll = async (req, res) => {
    try {
        const getSinData = await petSinmodels.find();
        // console.log(getSinData);
        if (getSinData) {
            return res.status(200).json({
                data: getSinData,
                message: "Success",
                filepath: "http://localhost:8003/uploads/petSinShop"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getPetSinShop = async (req, res) => {
    try {
        const PetSinShopID = req.params.PetSinShop_id;
        const PetSinShopData = await petSinmodels.findOne({ status: 1, _id: PetSinShopID });
        if (PetSinShopData) {
            return res.status(200).json({
                data: PetSinShopData,
                message: "Success",
                filepath: "http://localhost:8003/uploads/petSinShop"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const updatePetSinShop = async (req, res) => {
    try {

        const uploadPetSinShopData = upload.single("image");
        uploadPetSinShopData(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    message: err.message,
                });
            }

            const PetSinShopId = req.params.PetSinShop_id;
            const { title, name, discount, price, priceCut } = req.body;

            const existPetSinShop = await petSinmodels.findOne({ _id: PetSinShopId });

            let img = existPetSinShop.image;
            if (req.file) {
                img = req.file.filename;
                if (fs.existsSync('./uploads/petSinShop' + existPetSinShop.image)) {
                    fs.unlinkSync('./uploads/petSinShop' + existPetSinShop.image)
                }
            }

            const updatePet = await petSinmodels.updateOne({ _id: PetSinShopId }, {
                $set: {
                    title: title,
                    image: img,
                    name: name,
                    discount: discount,
                    price: price,
                    priceCut: priceCut
                }
            })

            if (updatePet.matchedCount) {
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

export const deletePetSinShop = async (req, res) => {
    try {
        const PetSinShopID = req.params.PetSinShop_id;
        const petData = await petSinmodels.findOne({ _id: PetSinShopID })

        if (fs.existsSync('uploads/petSinShop' + petData.image)) {
            fs.unlinkSync('uploads/petSinShop' + petData.image)
        }

        const deletedData = await petSinmodels.deleteOne({ _id: PetSinShopID })
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
