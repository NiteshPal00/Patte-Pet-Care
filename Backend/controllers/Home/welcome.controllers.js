import multer from 'multer';
import path from 'path';
import fs from 'fs';
import welcomeModels from '../../models/Home/welcome.models';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (fs.existsSync("uploads/welcome/")) {
            cb(null, "uploads/welcome/");
        } else {
            fs.mkdirSync("uploads/welcome/")
            cb(null, "uploads/welcome/");
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

export const postWelcome = (req, res) => {
    try {
        const uploadwelcome = upload.single("image");
        uploadwelcome(req, res, function (err) {
            if (err) {
                return res.status(400).json({
                    message: err.message,
                });
            }
            const { name, description } = req.body;

            let img = null;
            if (req.file) {
                img = req.file.filename;
            }

            const welcomeData = new welcomeModels({
                name: name,
                description: description,
                image: img,
            });
            welcomeData.save();

            if (welcomeData) {
                return res.status(201).json({
                    data: welcomeData,
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

export const getwelcome = async (req, res) => {
    try {
      const welcomeData = await welcomeModels.find({ status: 1 });
      if (welcomeData) {
        return res.status(200).json({
          data: welcomeData,
          message: "Success",
          filepath:"http://localhost:8003/uploads/welcome/"
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };