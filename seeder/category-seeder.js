const { CategoryModel } = require("../models");

const slugify = (value) => value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");

const category = async () => {
    try {
        const rawRecords = [
            { id: "1", name: "Arcade", status: "Active", icon: "fa fa-gamepad" },
            { id: "2", name: "Racing", status: "Active", icon: "fa fa-car" },
            { id: "3", name: "Stickman", status: "InActive", icon: "fa fa-person" },
            { id: "4", name: "Action", status: "Active", icon: "fa fa-fire" },
            { id: "5", name: "Adventure", status: "Active", icon: "fa-brands fa-wpexplorer" },
            { id: "6", name: "Puzzle", status: "Active", icon: "fa fa-puzzle-piece" },
            { id: "7", name: "Girls", status: "Active", icon: "fa fa-child-dress" },
            { id: "8", name: "Clicker", status: "Active", icon: "fa fa-arrow-pointer" },
            { id: "9", name: "Hypercasual", status: "Active", icon: "fa-solid fa-dice" },
            { id: "10", name: "Shooting", status: "Active", icon: "fa fa-person-military-rifle" },
            { id: "11", name: "Boys", status: "InActive", icon: "fa fa-child" },
            { id: "12", name: "2 Player", status: "InActive", icon: "fa fa-children" },
            { id: "13", name: "Multiplayer", status: "InActive", icon: "fa fa-boxes-stacked" },
            { id: "14", name: "Sports", status: "InActive", icon: "fa fa-volleyball" }
        ];

        const now = new Date().toISOString().slice(0, 19).replace("T", " ");

        const insertRecords = rawRecords.map((item) => ({
            ...item,
            slug: slugify(item.name),
            image: null,
            shorting: "500",
            created_at: now,
            updated_at: now,
            deleted_at: null,
        }));

        await CategoryModel.bulkCreate(insertRecords);
    } catch (error) {
        console.error("category seeder:", error);
    }
};
module.exports = { category };
