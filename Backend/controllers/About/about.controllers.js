import multer from 'multer';
import path from 'path';
import fs from 'fs';
import aboutModels from '../../models/About/about.models';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (fs.existsSync("uploads/about/aboutImages/")) {
            cb(null, "uploads/about/aboutImages/");
        } else {
            fs.mkdirSync("uploads/about/aboutImages/")
            cb(null, "uploads/about/aboutImages/");
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

export const addabout = (req, res) => {
    try {
        const uploadaboutData = upload.single("image");
        uploadaboutData(req, res, function (err) {
            if (err) {
                return res.status(400).json({
                    message: err.message,
                });
            }
            const { name,  description } = req.body;

            let img = null;
            if (req.file) {
                img = req.file.filename;
            }

            const aboutData = new aboutModels({
                name: name,
                description: description,
                image: img
            });
            aboutData.save();

            if (aboutData) {
                return res.status(201).json({
                    data: aboutData,
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

export const getabout = async (req, res) => {
    try {
      const aboutData = await aboutModels.find({ status: 1 });
      console.log(aboutData);
      if (aboutData) {
        return res.status(200).json({
          data: aboutData,
          message: "Success",
          filepath:"http://localhost:8003/uploads/about/aboutImages/"
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
