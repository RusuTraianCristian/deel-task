const { query } = require("express");

const postBalanceDepositById = async (req, res) => {
    const { Contract, Job, Profile } = req.app.get('models');
    const { userId } = req.params;
    const { quantity } = req.body;

    if (typeof quantity === 'undefined' || !quantity) return res.status(400).end('Malformed request: no quantity provided.');

    const client = await Profile.findOne({
        where: {
            id: userId,
        },
    });

    if (!client) return res.status(404).end('Invalid client.');

    const { id } = req.profile;

    const query = {
        where: {
            paid: null,
        },
        include: [
            {
                model: Contract,
                where: { status: 'in_progress' },
                include: [
                    {
                        model: Profile,
                        as: 'Client',
                        where: { id },
                    },
                ],
            },
        ],
    };

    const unpaidAmount = await Job.sum('price', query);

    const limit = unpaidAmount / 4;

    if (quantity >= limit || quantity === 0) return res.status(400).end('Cannot deposit more than allowed or none.');

    await client.increment({ balance: quantity });

    res.json(`You deposited ${quantity} -- new balance is: ${client.balance}`);
};

module.exports = {
    postBalanceDepositById,
};