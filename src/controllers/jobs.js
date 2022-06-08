const getJobsUnpaid = async (req, res) => {
    const { Contract, Job } = req.app.get('models');
    const { id, type } = req.profile;

    const query = { status: 'in_progress' };

    type !== 'client' ? query.ContractorId = id : query.ClientId = id;

    const jobs = await Job.findAll({
        where: {
            paid: null,
        },
        include: [
            {
                model: Contract,
                where: query,
            },
        ]
    });

    res.json(jobs);
};

const postJobPay = async (req, res) => {
    const { sequelize: { transaction } } = require('../model');
    const { Contract, Job, Profile } = req.app.get('models');
    const { job_id } = req.params;
    const { id, balance, client } = req.profile;

    const job = await Job.findOne({
        where: {
            id: job_id,
            paid: null,
        },
        include: [
            {
                model: Contract,
                where: { ClientId: id },
            },
        ],
    });

    if (!job) return res.status(404).end('Job not found.');

    if (balance < job.price) return res.status(403).end('No or insufficient funds.');
  
    const contractor = await Profile.findOne({
        where: {
            id: job.Contract.ContractorId,
            type: "contractor",
        },
    });

    const useTransaction = await transaction();

    try {
        await client.decrement({ balance: job.price }, { useTransaction });
        await contractor.increment({ balance: job.price }, { useTransaction });
        await job.update({ paid: true, paymentDate: Date.now() }, { useTransaction });

        await useTransaction.commit();

        res.json(job);
    }
    catch (err) {
        await useTransaction.rollback();
        // logger.error(err);
        return res.status(500).end('An error occurred.');
    }
};

module.exports = {
    getJobsUnpaid,
    postJobPay,
};