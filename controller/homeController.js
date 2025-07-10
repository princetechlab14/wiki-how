const { Op } = require("sequelize");
const { CategoryModel, GameModel, ContactUsModel } = require("../models");
const { orderBy } = require("lodash");

const categoryList = async () => {
    try {
        return CategoryModel.findAll({ where: { status: "Active" }, order: [['shorting', 'ASC']] });
    } catch (error) {
        console.error("Error Fetching categoryList:", error);
        res.status(500).send("Internal Server Error");
    }
};

const Home = async (req, res) => {
    const { search } = req.query;
    try {
        const categories = await CategoryModel.findAll({
            where: { status: "Active" },
            include: [{
                model: GameModel,
                as: "games",
                where: {
                    status: "Active",
                    ...(search ? { title: { [Op.like]: `%${search}%` } } : {}),
                },
                order: [["shorting", "ASC"]],
                required: false,
                limit: 8,
            }]
        });
        const sidebarCategories = await categoryList();
        res.render('frontend/index', { categories, search, sidebarCategories });
    } catch (error) {
        console.error("Error Fetching Home:", error);
        res.status(500).send("Internal Server Error");
    }
};

const Single = async (req, res) => {
    const { search } = req.query;
    const { slug } = req.params;
    try {
        const game = await GameModel.findOne({
            where: { slug, status: "Active" },
            include: [{ model: CategoryModel, as: "mainCategory", }]
        });
        if (!game) return res.send("Game not found");

        const whereCondition = { status: "Active" };
        if (game?.category_id) whereCondition.category_id = game.category_id;
        if (search) whereCondition.title = { [Op.like]: `%${search}%` };

        const gameCategories = await GameModel.findAll({ where: whereCondition, limit: 20 });
        const sidebarCategories = await categoryList();
        res.render('frontend/single', { game, search, gameCategories, sidebarCategories });
    } catch (error) {
        console.error("Error Fetching Single:", error);
        res.status(500).send("Internal Server Error");
    }
};

const PlayGame = async (req, res) => {
    const { slug } = req.params;
    try {
        const game = await GameModel.findOne({ where: { slug, status: "Active" } });
        if (!game) return res.send("Game not found");
        res.render('frontend/play', { game });
    } catch (error) {
        console.error("Error Fetching PlayGame:", error);
        res.status(500).send("Internal Server Error");
    }
};

const About = async (req, res) => {
    try {
        const sidebarCategories = await categoryList();
        res.render('frontend/about', { sidebarCategories });
    } catch (error) {
        console.error("Error Fetching About:", error);
        res.status(500).send("Internal Server Error");
    }
}

const PrivacyPolicy = async (req, res) => {
    try {
        const sidebarCategories = await categoryList();
        res.render('frontend/privacyPolicy', { sidebarCategories });
    } catch (error) {
        console.error("Error Fetching About:", error);
        res.status(500).send("Internal Server Error");
    }
}

const TermUse = async (req, res) => {
    try {
        const sidebarCategories = await categoryList();
        res.render('frontend/termUse', { sidebarCategories });
    } catch (error) {
        console.error("Error Fetching About:", error);
        res.status(500).send("Internal Server Error");
    }
}

const ContactUs = async (req, res) => {
    try {
        const sidebarCategories = await categoryList();
        res.render('frontend/contactUs', { sidebarCategories });
    } catch (error) {
        console.error("Error Fetching ContactUs:", error);
        res.status(500).send("Internal Server Error");
    }
};

const ContactUsStore = async (req, res) => {
    const { subject, email, message } = req.body;
    try {
        await ContactUsModel.create({ subject, email, message });
        res.redirect("/");
    } catch (error) {
        console.error("Error Fetching Contact Us Store:", error);
        res.status(500).send("Internal Server Error");
    }
};

const CategoryGames = async (req, res) => {
    const { slug } = req.params;
    const limit = 100;
    try {
        const gameCategories = await CategoryModel.findOne({
            where: { status: "Active", slug },
            include: [{
                model: GameModel,
                as: "games",
                where: { status: "Active" },
                order: [["shorting", "ASC"]],
                required: false,
                limit: limit,
                offset: 0
            }]
        });
        const sidebarCategories = await categoryList();
        res.render('frontend/category', { gameCategories, sidebarCategories });
    } catch (error) {
        console.error("Error Fetching Single:", error);
        res.status(500).send("Internal Server Error");
    }
};

const LoadMoreGames = async (req, res) => {
    const { slug } = req.params;
    const { page = 1 } = req.query;
    const limit = 100;
    const offset = (parseInt(page) - 1) * limit;

    try {
        const category = await CategoryModel.findOne({
            where: { slug, status: "Active" }
        });

        if (!category) return res.status(404).json({ error: "Category not found" });

        const games = await GameModel.findAll({
            where: {
                category_id: category.id,
                status: "Active"
            },
            order: [["shorting", "ASC"]],
            offset,
            limit
        });

        res.json(games);
    } catch (error) {
        console.error("Load More Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


module.exports = { Home, Single, PlayGame, About, PrivacyPolicy, TermUse, ContactUs, ContactUsStore, CategoryGames, LoadMoreGames };
