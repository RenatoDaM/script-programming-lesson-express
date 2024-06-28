const { Sequelize, DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

const dbName = "petshop_db";
const dbUser = "root";
const dbHost = "localhost";
const dbDriver = "postgres";
const dbPassword = "root";

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDriver,
});

class Customer extends Model {}
class Pet extends Model {}
class User extends Model {
	static async hashPassword(password) {
        return bcrypt.hash(password, 10);
    }
    
    async comparePassword(password) {
        return bcrypt.compare(password, this.password);
    }
}

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: sequelizeConnection,
    modelName: 'User',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await User.hashPassword(user.password);
            }
        },
        beforeUpdate: async (user) => {
            if (user.password) {
                user.password = await User.hashPassword(user.password);
            }
        }
    }
});

Customer.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'Customer',
    }
);

Pet.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'Pet',
    }
);

Customer.hasMany(Pet, {
    foreignKey: 'customerId',
    as: 'pets'
});
Pet.belongsTo(Customer, {
    foreignKey: 'customerId',
    as: 'customer'
});

sequelizeConnection.sync()
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch((error) => {
        console.error('Error creating database & tables:', error);
    });

module.exports = {
	sequelizeConnection,
	User,
	Customer,
	Pet
};
