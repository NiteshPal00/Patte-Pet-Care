import allShopModels from "../models/Shop/allShop.models";
import wishlistModels from "../models/wishlist.models";

export const addToWish = async (req, res) => {
    try {
        const { productID, userID } = req.body;

        const wishItems = await wishlistModels.findOne({
            productID: productID,
            userID: userID,
        });

        const product = await allShopModels.findOne({ _id: productID });

        const savewish = new wishlistModels({
            userID: userID,
            productID: productID,
            name: product.name,
            price: product.price,
            priceCut: product.priceCut,
            image: product.image,
        });

        savewish.save();
        if (savewish) {
            return res.status(200).json({
                message: "Successfully added to wish",
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getwishData = async (req, res) => {
    try {
        const userID = req.params.userid;
        const wishItems = await wishlistModels.find({ userID: userID });
        if (wishItems) {
            return res.status(200).json({
                data: wishItems,
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

export const deletewishItem = async (req, res) => {
    try {
        const wishID = req.params.wish_id
        const deleteItem = await wishlistModels.deleteOne({ _id: wishID });
        if (deleteItem.acknowledged) {
            return res.status(200).json({
                message: 'deleted'
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
