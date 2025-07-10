const { GameModel, CategoryModel } = require("../models");
const insertRecords = require('./gamemonitize.json');

const slugify = (value) => value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
const rawRecords = [
    { name: "Arcade", status: "Active", icon: "fa fa-gamepad" },
    { name: "Racing", status: "Active", icon: "fa fa-car" },
    { name: "Stickman", status: "Active", icon: "fa fa-person" },
    { name: "Action", status: "Active", icon: "fa fa-fire" },
    { name: "Adventure", status: "Active", icon: "fa-brands fa-wpexplorer" },
    { name: "Puzzle", status: "Active", icon: "fa fa-puzzle-piece" },
    { name: "Girls", status: "Active", icon: "fa fa-child-dress" },
    { name: "Clicker", status: "Active", icon: "fa fa-arrow-pointer" },
    { name: "Hypercasual", status: "Active", icon: "fa-solid fa-dice" },
    { name: "Shooting", status: "Active", icon: "fa fa-person-military-rifle" },
    { name: "Boys", status: "Active", icon: "fa fa-child" },
    { name: "2 Player", status: "Active", icon: "fa fa-children" },
    { name: "Multiplayer", status: "Active", icon: "fa fa-boxes-stacked" },
    { name: "Sports", status: "Active", icon: "fa fa-volleyball" },
    { name: "Cooking", status: "Active", icon: "fa fa-kitchen-set" },
    { name: "Soccer", status: "Active", icon: "fa fa-futbol" },
    { name: "Baby Hazel", status: "Active", icon: "fa fa-baby" },
    { name: "3D", status: "Active", icon: "fa-brands fa-unity" },
    { name: ".IO", status: "Active", icon: "fa-brands fa-itch-io" },
];


const games = async () => {
    try {
        const uniqueCategoriesSet = new Set(insertRecords.map(game => game.category?.trim()).filter(cat => cat && cat.length > 0));
        const uniqueCategories = Array.from(uniqueCategoriesSet);

        const categoryRecords = uniqueCategories.map((cat, index) => {
            const match = rawRecords.find(raw => raw.name.toLowerCase() === cat.toLowerCase());
            return {
                name: cat,
                slug: slugify(cat),
                icon: match?.icon || "fa fa-question",
                status: match?.status || "Inactive"
            };
        });

        await CategoryModel.bulkCreate(categoryRecords, { ignoreDuplicates: true });

        const categoriesInDB = await CategoryModel.findAll();
        const categoryMap = {};
        categoriesInDB.forEach(cat => { categoryMap[cat.name] = cat.id; });

        const insertRecordsData = [];
        insertRecords.forEach(element => {
            insertRecordsData.push({
                title: element.title,
                slug: element.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, ""),
                description: element.description,
                game_url: element.url,
                logo: element.thumb,
                banner: element.thumb,
                short_desc: element.tags,
                category_id: categoryMap[element.category] || null,
            });
        });

        await GameModel.bulkCreate(insertRecordsData);
    } catch (error) {
        console.error("games seeder:", error);
    }
};
module.exports = { games };
