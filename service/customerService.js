const { Customer, Pet } = require('../database');

async function saveCustomer(customerName, cpf, petName, petType) {
    const sanitizedCpf = sanitizeCpf(cpf);

    const newCustomer = await Customer.create({
        name: customerName,
        cpf: sanitizedCpf,
    });

    await Pet.create({
        name: petName,
        type: petType,
        customerId: newCustomer.id,
    });
}

async function checkDuplicateCustomer(cpf) {
    const sanitizedCpf = sanitizeCpf(cpf);

    const existingCustomer = await Customer.findOne({
        where: {
            cpf: sanitizedCpf,
        },
    });

    return !!existingCustomer;
}
async function savePet(customerId, petName, petType) {
    try {
        const customer = await Customer.findByPk(customerId);

        if (!customer) {
            throw new Error(`Customer with id ${customerId} not found.`);
        }

        const newPet = await Pet.create({
            name: petName,
            type: petType,
            customerId: customerId,
        });

        return newPet;
    } catch (error) {
        throw error;
    }
}

function sanitizeCpf(cpf) {
    return cpf.replace(/[.-]/g, '');
}

module.exports = {
    saveCustomer,
    savePet,
    checkDuplicateCustomer,
};