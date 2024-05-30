import multer from 'multer';
import path from 'path';
import fs from 'fs';
import blogModels from '../../models/Home/blog.models';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (fs.existsSync("uploads/blogImage/")) {
            cb(null, "uploads/blogImage/");
        } else {
            fs.mkdirSync("uploads/blogImage/")
            cb(null, "uploads/blogImage/");
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

export const addBlog = (req, res) => {
    try {
        const uploadBlogData = upload.single("image");
        uploadBlogData(req, res, function (err) {
            if (err) {
                return res.status(400).json({
                    message: err.message,
                });
            }
            
            const { imgHeader } = req.body;

            let img = null;
            if (req.file) {
                img = req.file.filename;
            }
           
            const BlogData = new blogModels({
                imgHeader: imgHeader,
                image: img
            });
            
            BlogData.save();

            if (BlogData) {
                return res.status(201).json({
                    data: BlogData,
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

export const getBlog = async (req, res) => {
    try {
        const carouselData = await blogModels.find({ status: 1 });
        // console.log(carouselData);
        if (carouselData) {
            return res.status(200).json({
                data: carouselData,
                message: "Success",
                filepath: "http://localhost:8003/uploads/blogImage"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
