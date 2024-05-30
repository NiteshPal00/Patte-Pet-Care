import cartModals from "../models/cart.Modals";
import allShopModels from "../models/Shop/allShop.models";

export const addToCart = async (req, res) => {
    try {
        const { productID, userID } = req.body;

        const cartItems = await cartModals.findOne({
            productID: productID,
            userID: userID,
        });
        if (cartItems) {
            const quantity = cartItems.quantity + 1;
            if (quantity > 10) {
                return res.status(200).json({
                    message: "Can not more than 10 items",
                });
            }

            const updateCart = await cartModals.updateOne(
                { _id: cartItems._id },
                {
                    $set: {
                        quantity: quantity,
                    },
                }
            );
            if (updateCart.acknowledged) {
                return res.status(200).json({
                    message: "updated",
                });
            }
        } else {
            const product = await allShopModels.findOne({ _id: productID });

            const saveCart = new cartModals({
                userID: userID,
                productID: productID,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image,
            });

            saveCart.save();
            if (saveCart) {
                return res.status(200).json({
                    message: "Successfully added to cart",
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const cartID = req.params.cart_id;
        const { type } = req.query;

        const cartItem = await cartModals.findOne({ _id: cartID });

        var quantity = cartItem.quantity;
        if (type == "inc") {
            quantity += 1;
        }
        if (type == "desc") {
            quantity -= 1;
        }

        if (quantity > 30) {
            return res.status(200).json({
                message: "Can not more than 30 items",
            })
        }

        if (quantity < 1) {
            const deleteItem = await cartModals.deleteOne({ _id: cartID });
            if (deleteItem.acknowledged) {
                return res.status(200).json({
                    message: 'removed'
                })
            }
        }

        const update = await cartModals.updateOne({ _id: cartID }, {
            $set: {
                quantity: quantity
            }
        })

        if (update.acknowledged) {
            return res.status(200).json({
                message: 'updated'
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getCartData = async (req, res) => {
    try {
        const userID = req.params.userid;

        const cartItems = await cartModals.find({ userID: userID });
        if (cartItems) {
            return res.status(200).json({
                data: cartItems,
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

export const deleteCartItem = async (req, res) => {
    try {
        const cartID = req.params.cart_id
        const deleteItem = await cartModals.deleteOne({ _id: cartID });
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
