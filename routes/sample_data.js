const express = require('express');
const { Router } = express;
const { Customer, Pet } = require('../database'); // Importando os modelos
const router = Router();

router.get("/customers", async (req, res) => {
    try {
        const customersWithPets = await Customer.findAll({
            include: {
                model: Pet,
                as: 'pets',
            },
        });
        console.log(customersWithPets)
        res.render('sample_data', { title: 'Clientes e Pets', action: 'list', sampleData: customersWithPets });
    } catch (error) {
        throw error;
    }
});

router.get("/newcustomer", (req, res) => {
    res.render('new_customer', { title: 'Adicionar Novo Cliente e Pet' });
});

router.post("/newcustomer", async (req, res) => {
    try {
        const { customerName, cpf, petName, petType } = req.body;

        const newCustomer = await Customer.create({
            name: customerName,
            cpf: cpf,
        });

        await Pet.create({
            name: petName,
            type: petType,
            customerId: newCustomer.id,
        });

        req.flash('success', 'Novo cliente e pet adicionados!');
        res.redirect("/sample_data/customers");
    } catch (error) {
        throw error;
    }
});


module.exports = router;
