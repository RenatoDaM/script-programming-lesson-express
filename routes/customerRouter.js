const express = require('express');
const { Router } = express;
const { Customer, Pet } = require('../database'); // Importando os modelos
const router = Router();
const {saveCustomer, savePet, checkDuplicateCustomer} = require('../service/customerService');
const { validateCpf } = require('../util/cpfValidator');

router.get("/", async (req, res) => {
    try {
        const customersWithPets = await Customer.findAll({
            include: {
                model: Pet,
                as: 'pets',
            },
        });
        console.log(customersWithPets)
        res.render('customers', { title: 'Clientes e Pets', action: 'list', sampleData: customersWithPets });
    } catch (error) {
        throw error;
    }
});

router.get("/newcustomer", (req, res) => {
    res.render('new_customer', { title: 'Add new Customer and his Pet' });
});

router.get("/:customerId/newpet", (req, res) => {
    const customerId = req.params.customerId;
    res.render('new_pet', { title: 'Add new Customer and his Pet', customerId: customerId });
});

router.post("/", async (req, res) => {
    try {
        const { customerName, cpf, petName, petType } = req.body;

        if (customerName === '' || cpf === '' || petName === '' || petType === '') {
            req.flash('error', 'Todos os campos são obrigatórios.');
            return res.redirect("/customers/newcustomer");
        } 

        if (!validateCpf(cpf)) {
            req.flash('error', 'CPF inválido.');
            return res.redirect("/customers/newcustomer");
        }

        if (checkDuplicateCustomer(cpf)) {
            req.flash('error', 'Já existe um usuário cadastrado com este CPF.');
            return res.redirect("/customers/newcustomer");
        }

        await saveCustomer(customerName, cpf, petName, petType)

        req.flash('success', 'Novo cliente e pet adicionados!');
        res.redirect("/customers");
        
    } catch (error) {
        throw error;
    }
});

router.post("/:customerId/newpet", async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const { petName, petType } = req.body;

        if (petName === '' || petType === '') {
            req.flash('error', 'Todos os campos são obrigatórios.');
            return res.redirect(`/customers/${customerId}/newpet`);
        } 

        await savePet(customerId, petName, petType);

        req.flash('success', 'Novo cliente e pet adicionados!');
        res.redirect("/customers");
        
    } catch (error) {
        throw error;
    }
});

module.exports = router;
