import multer from "multer";
import path from 'path'
import fs from "fs";
import dogsModels from '../../models/Shop/dog.models';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (fs.existsSync("uploads/dogShopImg/")) {
            cb(null, "uploads/dogShopImg/");
        } else {
            fs.mkdirSync("uploads/dogShopImg/")
            cb(null, "uploads/dogShopImg/");
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

export const addDogShop = (req, res) => {
    try {
        const uploaddogShopData = upload.single("image");
        uploaddogShopData(req, res, function (err) {
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

            const dogData = new dogsModels({
                title: title,
                image: img,
                name: name,
                discount: discount,
                price: price,
                priceCut: priceCut
            });

            dogData.save();
            if (dogData) {
                return res.status(201).json({
                    data: dogData,
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

export const getDogAll = async (req, res) => {
    try {
        const dogAllData = await dogsModels.find();
        // console.log(dogAllData);
        if (dogAllData) {
            return res.status(200).json({
                data: dogAllData,
                message: "Success",
                filepath: "http://localhost:8003/uploads/dogShopImg"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getDogShop = async (req, res) => {
    try {
        const DogShopID = req.params.DogShop_id;
        const DogShopData = await dogsModels.findOne({ status: 1, _id: DogShopID });
        if (DogShopData) {
            return res.status(200).json({
                data: DogShopData,
                message: "Success",
                filepath: "http://localhost:8003/uploads/dogShopImg"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const updateDogShop = async (req, res) => {
    try {

        const uploadDogShopData = upload.single("image");
        uploadDogShopData(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    message: err.message,
                });
            }
            const DogShopId = req.params.DogShop_id;
            const { title, name, discount, price, priceCut } = req.body;

            const existDogShop = await dogsModels.findOne({ _id: DogShopId });

            let img = existDogShop.image;
            if (req.file) {
                img = req.file.filename;
                if (fs.existsSync('./uploads/dogShopImg' + existDogShop.image)) {
                    fs.unlinkSync('./uploads/dogShopImg' + existDogShop.image)
                }
            }

            const updateDog = await dogsModels.updateOne({ _id: DogShopId }, {
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

export const deleteDogShop = async (req, res) => {
    try {
        const DogShopID = req.params.DogShop_id;
        const dogData = await dogsModels.findOne({ _id: DogShopID })

        if (fs.existsSync('uploads/dogShopImg' + dogData.image)) {
            fs.unlinkSync('uploads/dogShopImg' + dogData.image)
        }

        const deletedData = await dogsModels.deleteOne({ _id: DogShopID })
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
