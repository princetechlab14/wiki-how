const { Op } = require("sequelize");
const { GameModel, CategoryModel } = require("../models");
const { deleteObjS3 } = require("../services/fileupload");
const Joi = require("joi");

const gameSchema = Joi.object({
    title: Joi.string().required(),
    category_id: Joi.number().integer().optional(),
    game_url: Joi.string().allow(null, '').optional(),
    logo_url: Joi.string().allow(null, '').optional(),
    banner_url: Joi.string().allow(null, '').optional(),
    short_desc: Joi.string().allow(null, '').optional(),
    description: Joi.string().optional(),
    shorting: Joi.number().integer().optional(),
});

// Get list of games
const getIndex = async (req, res) => {
    try {
        res.render("games/index", { title: "Games List" });
    } catch (error) {
        console.error("Error fetching Games:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Show the create Games form
const create = async (req, res) => {
    try {
        const categories = await CategoryModel.findAll({ where: { status: "Active" } });
        res.render("games/create", { title: "Create Games", categories, error: '' });
    } catch (error) {
        console.error("Error fetching games create:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Store a new games
const store = async (req, res) => {
    try {
        const categories = await CategoryModel.findAll({ where: { status: "Active" } });
        const { error, value } = gameSchema.validate(req.body);
        if (error) return res.render("games/create", { title: "Games Create", error: error.details[0].message, categories });
        const slug = value.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
        const logoPath = req.files?.logo ? req.files.logo[0].location : value.logo_url;
        const bannerPath = req.files?.banner ? req.files.banner[0].location : value.banner_url;
        const newGames = { ...value, slug, logo: logoPath, banner: bannerPath };
        await GameModel.create(newGames);
        res.redirect("/admin/games");
    } catch (error) {
        console.error("Error creating games:", error);
        if (req.files) await Promise.all(req.files.map(async (file) => { await deleteObjS3(file.location); }));
        res.status(500).send("Internal Server Error");
    }
};

// Show the edit games form
const edit = async (req, res) => {
    const { id } = req.params;
    const awsBaseUrl = process.env.AWS_BASE_URL;
    try {
        const categories = await CategoryModel.findAll({ where: { status: "Active" } });
        const game = await GameModel.findByPk(id);
        if (!game) return res.status(404).send("Game not found");
        res.render("games/edit", { title: "Edit Games", game, awsBaseUrl, error: '', categories });
    } catch (error) {
        console.error("Error fetching games for editing:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Update the game
const update = async (req, res) => {
    const { id: gameId } = req.params;
    const awsBaseUrl = process.env.AWS_BASE_URL;
    try {
        Object.keys(req.body).forEach(key => {
            if (req.body[key] === '') req.body[key] = null;
        });
        const game = await GameModel.findByPk(gameId);
        if (!game) return res.status(404).send("Game not found");
        const categories = await CategoryModel.findAll({ where: { status: "Active" } });
        const { error, value } = gameSchema.validate(req.body);
        console.log("game update req.body error => ", req.body);
        if (error) return res.render("games/edit", { title: "Games Edit", game, awsBaseUrl, error: error.details[0].message, categories });

        // Handle new image uploads
        let logoPath = game.logo; // Default to existing logo
        let bannerPath = game.banner; // Default to existing banner
        if (req.files?.logo) {
            logoPath = req.files.logo[0].location;
            if (game.logo && game.logo.startsWith(awsBaseUrl)) await deleteObjS3(game.logo); // Delete old logo if a new one is uploaded
        } else if (value.logo_url) {
            logoPath = value.logo_url;
            if (game.logo && game.logo !== value.logo_url && game.logo.startsWith(awsBaseUrl)) await deleteObjS3(game.logo); // Delete old logo if a new URL is provided
        }

        if (req.files?.banner) {
            bannerPath = req.files.banner[0].location;
            if (game.banner && game.banner.startsWith(awsBaseUrl)) await deleteObjS3(game.banner); // Delete old banner if a new one is uploaded
        } else if (value.banner_url) {
            bannerPath = value.banner_url;
            if (game.banner && game.banner !== value.banner_url && game.banner.startsWith(awsBaseUrl)) await deleteObjS3(game.banner); // Delete old banner if a new URL is provided
        }

        // Create slug based on the title
        const slug = value.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
        const updateGame = { ...value, title: value.title?.trim(), slug, logo: logoPath, banner: bannerPath };
        await GameModel.update(updateGame, { where: { id: gameId } });
        res.redirect(`/admin/games`);
    } catch (error) {
        console.error("Error updating games:", error);
        if (req.files) await Promise.all(Object.values(req.files).flat().map(async (file) => { await deleteObjS3(file.location); }));
        res.status(500).send("Internal Server Error");
    }
};

// Delete a games post
const deleteRecord = async (req, res) => {
    const { id } = req.params;
    try {
        const game = await GameModel.findByPk(id);
        if (!game) return res.status(404).send("Games not found");
        // const imagePaths = game.images || []; 
        // if (game.logo) imagePaths.push(game.logo);
        // if (game.banner) imagePaths.push(game.banner);

        // // Delete images from S3
        // if (imagePaths.length > 0) {
        //     await Promise.all(imagePaths.map(async (image) => await deleteObjS3(image)));
        // }
        await GameModel.destroy({ where: { id: id } });
        res.redirect("/admin/games");
    } catch (error) {
        console.error("Error deleting games:", error);
        res.status(500).send("Internal Server Error");
    }
};

const changeStatus = async (req, res) => {
    const { id } = req.params;
    if (id) {
        const detail = await GameModel.findByPk(id);
        let status;
        if (detail.status == "Active") {
            status = "InActive";
        } else {
            status = "Active";
        }
        try {
            const update = await GameModel.update({ status }, { where: { id } });
            if (update) {
                res.send({ success: true });
            } else {
                res.status(500).render("error", { error: "Internal Server Error" });
            }
        } catch (error) {
            res.status(500).render("error", { error: "Internal Server Error" });
        }
    } else {
        res.status(500).render("error", { error: "Internal Server Error" });
    }
};

const getData = async (req, res) => {
    try {
        let { page, limit, search, order, column } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;
        let whereCondition = {};
        if (search) {
            whereCondition = {
                [Op.or]: [
                    { id: { [Op.like]: `%${search}%` } },
                    { title: { [Op.like]: `%${search}%` } },
                    { slug: { [Op.like]: `%${search}%` } },
                    { short_desc: { [Op.like]: `%${search}%` } },
                    { shorting: { [Op.like]: `%${search}%` } },
                    { status: { [Op.like]: `%${search}%` } },
                ],
            };
        }
        let orderBy = [["id", "DESC"]];
        if (column && order) orderBy = [[column, order.toUpperCase()]];
        const { count, rows: tableRecords } = await GameModel.findAndCountAll({
            attributes: ['id', 'title', 'slug', 'logo', 'game_url', 'banner', 'shorting', 'status'],
            where: whereCondition,
            limit,
            offset,
            order: orderBy,
            include: [{ model: CategoryModel, as: "mainCategory", attributes: ['id', 'name'] }]
        });
        res.json({ success: true, data: tableRecords, pagination: { totalItems: count, totalPages: Math.ceil(count / limit), currentPage: page, pageSize: limit } });
    } catch (error) {
        console.error("Error fetching game-list:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = { getIndex, create, store, deleteRecord, edit, update, changeStatus, getData };
