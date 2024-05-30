import multer from 'multer';
import path from 'path';
import fs from 'fs';
import TeamsModel from '../../models/Home/Teams.model';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (fs.existsSync("uploads/teamsImage/")) {
            cb(null, "uploads/teamsImage/");
        } else {
            fs.mkdirSync("uploads/teamsImage/")
            cb(null, "uploads/teamsImage/");
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

export const addTeams = (req, res) => {
    try {
        const uploadTeamsData = upload.single("image");
        uploadTeamsData(req, res, function (err) {
            if (err) {
                return res.status(400).json({
                    message: err.message,
                });
            }
            const { header, title } = req.body;

            let img = null;
            if (req.file) {
                img = req.file.filename;
            }

            const TeamsData = new TeamsModel({
                header: header,
                title: title,
                image: img
            });
            TeamsData.save();

            if (TeamsData) {
                return res.status(201).json({
                    data: TeamsData,
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

export const getTeams = async (req, res) => {
    try {
      const TeamsData = await TeamsModel.find({ status: 1 });
      console.log(TeamsData);
      if (TeamsData) {
        return res.status(200).json({
          data: TeamsData,
          message: "Success",
          filepath:"http://localhost:8003/uploads/teamsImage"
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
