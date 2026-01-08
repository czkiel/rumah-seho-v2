import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Sales from "./SaleModel.js";
import Products from "./ProductModel.js";

const { DataTypes } = Sequelize;

const SaleItems = db.define('sale_items', {
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price_at_purchase: { 
        // Harga saat transaksi terjadi (PENTING: jaga-jaga harga produk berubah di masa depan)
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subtotal: { // qty * price_at_purchase
        type: DataTypes.INTEGER,
        allowNull: false
    },
    saleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Sales,
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Products,
            key: 'id'
        }
    }
}, {
    freezeTableName: true
});

// Relasi Kompleks
Sales.hasMany(SaleItems);
SaleItems.belongsTo(Sales, { foreignKey: 'saleId' });

Products.hasMany(SaleItems);
SaleItems.belongsTo(Products, { foreignKey: 'productId' });

export default SaleItems;