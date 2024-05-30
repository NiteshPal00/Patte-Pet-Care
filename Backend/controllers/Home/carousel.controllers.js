import multer from 'multer';
import path from 'path';
import fs from 'fs';
import carouselModels from '../../models/Home/carousel.models';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (fs.existsSync("uploads/carouselImage/")) {
            cb(null, "uploads/carouselImage/");
        } else {
            fs.mkdirSync("uploads/carouselImage/")
            cb(null, "uploads/carouselImage/");
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

export const addCarousel = (req, res) => {
    try {
        const uploadCarouselData = upload.single("image");
        uploadCarouselData(req, res, function (err) {
            if (err) {
                return res.status(400).json({
                    message: err.message,
                });
            }
            const { name, names, description } = req.body;

            let img = null;
            if (req.file) {
                img = req.file.filename;
            }

            const carouselData = new carouselModels({
                name: name,
                description: description,
                names: names,
                image: img
            });
            carouselData.save();

            if (carouselData) {
                return res.status(201).json({
                    data: carouselData,
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

export const getCarousel = async (req, res) => {
    try {
      const carouselData = await carouselModels.find({ status: 1 });
      console.log(carouselData);
      if (carouselData) {
        return res.status(200).json({
          data: carouselData,
          message: "Success",
          filepath:"http://localhost:8003/uploads/carouselImage"
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };