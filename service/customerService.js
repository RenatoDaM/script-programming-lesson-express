const { Customer, Pet } = require('../database');

async function saveCustomer(customerName, cpf, petName, petType) {
    const newCustomer = await Customer.create({
        name: customerName,
        cpf: cpf,
    });

    await Pet.create({
        name: petName,
        type: petType,
        customerId: newCustomer.id,
    });
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

module.exports = {
    saveCustomer,
    savePet,
};