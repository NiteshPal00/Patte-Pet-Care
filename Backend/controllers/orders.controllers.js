import orderModels from "../models/order.models";

export const addCheckout = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, company_name, street_address, town, state, zip_code } = req.body;

        const saveCheckout = new orderModels({
            first_name: first_name,
            last_name: last_name,
            company_name: company_name,
            street_address: street_address,
            email: email,
            town: town,
            state: state,
            zip_code: zip_code,
            phone: phone,
        });
        saveCheckout.save();

        if (saveCheckout) {
            return res.status(201).json({
                data: saveCheckout,
                message: "Successfully data inserted.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getCheckouts = async (req, res) => {
    try {
        const userID = req.params.userid;
        console.log(userID)
        const getCheckoutData = await orderModels.find({ userID: userID });
        if (getCheckoutData) {
            return res.status(200).json({
                data: getCheckoutData,
                message: "Successfully fetched.",
                filepath:"http://localhost:8003/uploads/allShopImg"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
