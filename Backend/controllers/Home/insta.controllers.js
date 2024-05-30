import multer from 'multer';
import path from 'path';
import fs from 'fs';
import instaModels from '../../models/Home/insta.models';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (fs.existsSync("uploads/instaImg/")) {
            cb(null, "uploads/instaImg/");
        } else {
            fs.mkdirSync("uploads/instaImg/")
            cb(null, "uploads/instaImg/");
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

export const addInsta = async (req, res) => {
    try {
        const uploadinstData = upload.fields([
            { name: 'images', maxCount: 7 }
        ]);
        uploadinstData(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    message: err.message,
                });
            }

            let img = [];

            if (req.files['images']) {
                req.files['images'].forEach((image) => {
                    img.push(image.filename);
                });
            }

            const instData = await instaModels.create({
                images: img
            })

            if (instData) {
                return res.status(201).json({
                    data: instData,
                    message: "Created",
                });
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

export const getInsta = async (req, res) => {
    try {
        const instalData = await instaModels.find();
        //  console.log(instalData);
        if (instalData) {
            return res.status(200).json({
                data: instalData,
                message: "Success",
                filepath: "http://localhost:8003/uploads/instaImg"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
