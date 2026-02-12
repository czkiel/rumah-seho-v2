import Products from "../models/ProductModel.js";
import path from "path";
import fs from "fs";

export const getProducts = async (req, res) => {
    try {
        const response = await Products.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getProductById = async (req, res) => {
    try {
        const response = await Products.findOne({
            where: {
                uuid: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createProduct = async (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
    
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const file = req.files.file; // Pastikan di Postman key-nya 'file'
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext; // Nama file jadi acak (MD5)
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 10000000) return res.status(422).json({ msg: "Image must be less than 10 MB" });

    file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await Products.create({
                name: name,
                price: price,
                description: description,
                image: fileName, // Simpan nama file
                url: url         // Simpan URL lengkap
            });
            res.status(201).json({ msg: "Product Created Successfuly" });
        } catch (error) {
            console.log(error.message);
        }
    })
}

export const updateProduct = async (req, res) => {
    const product = await Products.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!product) return res.status(404).json({ msg: "No Data Found" });

    let fileName = "";
    if (req.files === null) {
        // Jika tidak upload gambar baru, pakai nama file lama
        fileName = product.image;
    } else {
        // Jika upload gambar baru, hapus gambar lama dulu
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
        if (fileSize > 10000000) return res.status(422).json({ msg: "Image must be less than 10 MB" });

        // Hapus file lama (fs.unlink)
        const filepath = `./public/images/${product.image}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        // Pindahkan file baru
        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }

    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
        await Products.update({
            name: name,
            price: price,
            description: description,
            image: fileName,
            url: url
        }, {
            where: {
                id: product.id
            }
        });
        res.status(200).json({ msg: "Product Updated Successfuly" });
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteProduct = async (req, res) => {
    const product = await Products.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!product) return res.status(404).json({ msg: "No Data Found" });

    try {
        // Hapus file fisik di folder
        const filepath = `./public/images/${product.image}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
        
        // Hapus data di database
        await Products.destroy({
            where: {
                id: product.id
            }
        });
        res.status(200).json({ msg: "Product Deleted Successfuly" });
    } catch (error) {
        console.log(error.message);
    }
}