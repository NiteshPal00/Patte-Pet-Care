import multer from "multer";
import path from 'path'
import fs from "fs";
import catModels from '../../models/Shop/cat.models';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("uploads/catShopImg/")) {
      cb(null, "uploads/catShopImg/");
    } else {
      fs.mkdirSync("uploads/catShopImg/")
      cb(null, "uploads/catShopImg/");
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

export const addCatShop = (req, res) => {
  try {
    const uploadCatShopData = upload.single("image");
    uploadCatShopData(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }
      const { title, name, discount, price, priceCut } = req.body;

      let img = null;
      if (req.file) {
        img = req.file.filename;
      }

      const catData = new catModels({
        title: title,
        image: img,
        name: name,
        discount: discount,
        price: price,
        priceCut: priceCut
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

export const getCatAll = async (req, res) => {
  try {
    const catAllData = await catModels.find();
    // console.log(catAllData);
    if (catAllData) {
      return res.status(200).json({
        data: catAllData,
        message: "Success",
        filepath: "http://localhost:8003/uploads/catShopImg"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getCatShop = async (req, res) => {
  try {
    const CatShopID = req.params.CatShop_id;
    const CatShopData = await catModels.findOne({ status: 1, _id: CatShopID });
    if (CatShopData) {
      return res.status(200).json({
        data: CatShopData,
        message: "Success",
        filepath: "http://localhost:8003/uploads/catShopImg"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCatShop = async (req, res) => {
  try {

    const uploadCatShopData = upload.single("image");
    uploadCatShopData(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }
      const CatShopId = req.params.CatShop_id;
      const { title, name, discount, price, priceCut } = req.body;

      const existCatShop = await catModels.findOne({ _id: CatShopId });

      let img = existCatShop.image;
      if (req.file) {
        img = req.file.filename;
        if (fs.existsSync('./uploads/catShopImg' + existCatShop.image)) {
          fs.unlinkSync('./uploads/catShopImg' + existCatShop.image)
        }
      }

      const updateCat = await catModels.updateOne({ _id: CatShopId }, {
        $set: {
          title: title,
          image: img,
          name: name,
          discount: discount,
          price: price,
          priceCut: priceCut
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

export const deleteCatShop = async (req, res) => {
  try {
    const CatShopID = req.params.CatShop_id;
    const catData = await catModels.findOne({ _id: CatShopID })

    if (fs.existsSync('uploads/catShopImg' + catData.image)) {
      fs.unlinkSync('uploads/catShopImg' + catData.image)
    }

    const deletedData = await catModels.deleteOne({ _id: CatShopID })
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
