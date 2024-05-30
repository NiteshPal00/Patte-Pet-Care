import multer from "multer";
import path from 'path'
import fs from "fs";
import allShopModels from '../../models/Shop/allShop.models';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("uploads/allShopImg/")) {
      cb(null, "uploads/allShopImg/");
    } else {
      fs.mkdirSync("uploads/allShopImg/")
      cb(null, "uploads/allShopImg/");
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

export const addallShop = (req, res) => {
  try {
    const uploadallShopData = upload.single("image");
    uploadallShopData(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }
      const { title, name, discount, price, priceCut, category, star } = req.body;

      let img = null;
      if (req.file) {
        img = req.file.filename;
      }

      const catData = new allShopModels({
        title: title,
        image: img,
        name: name,
        discount: discount,
        price: price,
        priceCut: priceCut,
        category: category,
        star: star
      });

      catData.save();
      if (catData) {
        return res.status(201).json({
          data: catData,
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

export const getShop = async (req, res) => {
  try {
    const catAllData = await allShopModels.find();
    // console.log(catAllData);
    if (catAllData) {
      return res.status(200).json({
        data: catAllData,
        message: "Success",
        filepath: "http://localhost:8003/uploads/allShopImg"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getallShop = async (req, res) => {
  try {
    const allShopID = req.params.allShop_id;
    const allShopData = await allShopModels.findOne({ status: 1, _id: allShopID });
    if (allShopData) {
      return res.status(200).json({
        data: allShopData,
        message: "Success",
        filepath: "http://localhost:8003/uploads/allShopImg"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateallShop = async (req, res) => {
  try {

    const uploadallShopData = upload.single("image");
    uploadallShopData(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }
      const allShopId = req.params.allShop_id;
      const { title, name, discount, price, priceCut, category, star } = req.body;

      const existallShop = await allShopModels.findOne({ _id: allShopId });

      let img = existallShop.image;
      if (req.file) {
        img = req.file.filename;
        if (fs.existsSync('./uploads/allShopImg' + existallShop.image)) {
          fs.unlinkSync('./uploads/allShopImg' + existallShop.image)
        }
      }

      const updateCat = await allShopModels.updateOne({ _id: allShopId }, {
        $set: {
          title: title,
          image: img,
          name: name,
          discount: discount,
          price: price,
          priceCut: priceCut,
          category: category,
          star: star
        }
      })

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

export const deleteallShop = async (req, res) => {
  try {
    const allShopID = req.params.allShop_id;
    const catData = await allShopModels.findOne({ _id: allShopID })

    if (fs.existsSync('uploads/allShopImg' + catData.image)) {
      fs.unlinkSync('uploads/allShopImg' + catData.image)
    }

    const deletedData = await allShopModels.deleteOne({ _id: allShopID })
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
