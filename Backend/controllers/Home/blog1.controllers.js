import multer from 'multer';
import path from 'path';
import fs from 'fs';
import blog1models from '../../models/Home/blog1.models';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (fs.existsSync("uploads/blog1Image/")) {
            cb(null, "uploads/blog1Image/");
        } else {
            fs.mkdirSync("uploads/blog1Image/")
            cb(null, "uploads/blog1Image/");
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

export const addBlogs = (req, res) => {
    try {
        const uploadblog1Data = upload.single("image");
        uploadblog1Data(req, res, function (err) {
            if (err) {
                return res.status(400).json({
                    message: err.message,
                });
            }
            
            const { title , description, imgTitle } = req.body;
            // console.log(req.body);

            let img = null;
            if (req.file) {
                img = req.file.filename;
            }
           
            const blog1Data = new blog1models({
                title: title,
                description: description,
                imgTitle: imgTitle,
                image: img
            });
            
            blog1Data.save();

            if (blog1Data) {
                return res.status(201).json({
                    data: blog1Data,
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

export const getBlogs = async (req, res) => {
    try {
        const blogsData = await blog1models.find({ status: 1 });
        console.log(blogsData);
        if (blogsData) {
            return res.status(200).json({
                data: blogsData,
                message: "Success",
                filepath: "http://localhost:8003/uploads/blog1Image"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
