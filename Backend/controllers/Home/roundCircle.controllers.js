import multer from 'multer';
import path from 'path';
import fs from 'fs';
import roundCircleModels from '../../models/Home/roundCircle.models';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (fs.existsSync("uploads/roundCircle/")) {
            cb(null, "uploads/roundCircle/");
        } else {
            fs.mkdirSync("uploads/roundCircle/")
            cb(null, "uploads/roundCircle/");
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

export const roundCircle = (req, res) => {
    try {
        const uploadRoundCircle = upload.single("image");
        uploadRoundCircle(req, res, function (err) {
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

            const roundCircleData = new roundCircleModels({
                name: name,
                description: description,
                image: img
            });
            roundCircleData.save();

            if (roundCircleData) {
                return res.status(201).json({
                    data: roundCircleData,
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

export const getroundCircle = async (req, res) => {
    try {
      const roundCircleData = await roundCircleModels.find({ status: 1 });
      if (roundCircleData) {
        return res.status(200).json({
          data: roundCircleData,
          message: "Success",
          filepath:"http://localhost:8003/uploads/roundCircle/"
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };