import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Sales = db.define('sales', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: { notEmpty: true }
    },
    invoice_number: { // Contoh: INV/0125
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    transaction_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    due_date: { // Jatuh Tempo (H+7)
        type: DataTypes.DATE,
        allowNull: true
    },
    total_price: { // Total Tagihan
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed'),
        defaultValue: 'pending' // Karena tanpa payment gateway, default pending dulu
    },
    userId: { // Foreign Key (Siapa yang beli)
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: 'id'
        }
    }
}, {
    freezeTableName: true
});

// Relasi: 1 Transaksi milik 1 User
Users.hasMany(Sales);
Sales.belongsTo(Users, { foreignKey: 'userId' });

export default Sales;