import multer from 'multer';
import path from 'path';
import fs from 'fs';
import healthSchema from '../../models/Blog/healths.models';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (fs.existsSync("uploads/healthImage/")) {
            cb(null, "uploads/healthImage/");
        } else {
            fs.mkdirSync("uploads/healthImage/")
            cb(null, "uploads/healthImage/");
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

export const addHealth = (req, res) => {
    try {
        const uploadHealthData = upload.single("image");
        uploadHealthData(req, res, function (err) {
            if (err) {
                return res.status(400).json({
                    message: err.message,
                });
            }
            const { title, name, description, category, button } = req.body;

            let img = null;
            if (req.file) {
                img = req.file.filename;
            }

            const HealthData = new healthSchema({
                title: title,
                description: description,
                name: name,
                image: img,
                category: category,
                button: button,
            });
            HealthData.save();

            if (HealthData) {
                return res.status(201).json({
                    data: HealthData,
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

export const getHealth = async (req, res) => {
    try {
      const HealthData = await healthSchema.find({ status: 1 });
    //   console.log(HealthData);
      if (HealthData) {
        return res.status(200).json({
          data: HealthData,
          message: "Success",
          filepath:"http://localhost:8003/uploads/healthImage"
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
  
  export const getallHealth = async (req, res) => {
    try {
      const allHealthID = req.params.allHealth_id;
      const allHealthData = await healthSchema.findOne({ status: 1, _id: allHealthID });
      if (allHealthData) {
        return res.status(200).json({
          data: allHealthData,
          message: "Success",
          filepath: "http://localhost:8003/uploads/healthImage"
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
  
  export const updateallHealth = async (req, res) => {
    try {
        const uploadallHealthData = upload.single("image");
        uploadallHealthData(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    message: err.message,
                });
            }

            const allHealthId = req.params.allHealth_id;
            const { title, name, description, category, button } = req.body;

            // Find the health data by ID
            const existallHealth = await healthSchema.findById(allHealthId);

            // Check if health data exists
            if (!existallHealth) {
                return res.status(404).json({
                    message: "Health data not found with the provided ID.",
                });
            }

            let img = existallHealth.image;
            if (req.file) {
                img = req.file.filename;
                if (fs.existsSync('./uploads/healthImage/' + existallHealth.image)) {
                    fs.unlinkSync('./uploads/healthImage/' + existallHealth.image)
                }
            }

            // Update the health data
            const updateCat = await healthSchema.updateOne({ _id: allHealthId }, {
                $set: {
                    title: title,
                    description: description,
                    name: name,
                    image: img,
                    category: category,
                    button: button,
                }
            });

            if (updateCat.matchedCount) {
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

  
  export const deleteallHealth = async (req, res) => {
    try {
      const allHealthID = req.params.allHealth_id;
      const catData = await healthSchema.findOne({ _id: allHealthID })
  
      if (fs.existsSync('uploads/healthImage/' + catData.image)) {
        fs.unlinkSync('uploads/healthImage/' + catData.image)
      }
  
      const deletedData = await healthSchema.deleteOne({ _id: allHealthID })
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