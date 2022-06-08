const getContracts = async (req, res) => {
    const { Op } = require("sequelize");
    const { Contract } = req.app.get('models');
    const { id, type } = req.profile;

    const query = {
        [Op.not]: [
            {
                status: 'terminated',
            },
        ],
    };

    type === 'client' ? query.ClientId = id : query.ContractorId = id;

    const contracts = await Contract.findAll({ where: query });

    if (!contracts || !Array.isArray(contracts)) {
        // handle empty-case
        return res.status(404).end('No contracts found.');
    }

    res.json(contracts);
};

const getContractById = async (req, res) => {
    const { Contract } = req.app.get('models');
    const { id: userId, type } = req.profile;
    const { id } = req.params;
    const query = { id };

    type === 'client' ? query.ClientId = userId : query.ContractorId = userId;

    const contract = await Contract.findOne({ where: query });

    if (!contract) return res.status(404).end('No contract was found');

    res.json(contract);
};

module.exports = {
    getContracts,
    getContractById,
};