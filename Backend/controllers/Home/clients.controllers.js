import clientsModels from "../../models/Home/clients.models";

export const addClient = (req, res) => {
    try {

        const { name, header, description } = req.body

        const saveClient = new clientsModels({
            name: name,
            header: header,
            description: description,
        })
        saveClient.save();

        if (saveClient) {
            return res.status(201).json({
                data: saveClient,
                message: "Successfully data inserted."
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getClients = async (req, res) => {
    try {

        const getClientData = await clientsModels.find();
        if (getClientData) {
            return res.status(200).json({
                data: getClientData,
                message: 'Successfully fetched.'
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
