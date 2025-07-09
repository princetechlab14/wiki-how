const { CategoryModel } = require("../models");

const slugify = (value) => value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");

const category = async () => {
    try {
        const rawRecords = [
            { id: "1", name: "Arcade", status: "Active" },
            { id: "2", name: "Racing", status: "Active" },
            { id: "3", name: "Stickman", status: "InActive" },
            { id: "4", name: "Action", status: "Active" },
            { id: "5", name: "Adventure", status: "Active" },
            { id: "6", name: "Puzzle", status: "Active" },
            { id: "7", name: "Girls", status: "Active" },
            { id: "8", name: "Clicker", status: "Active" },
            { id: "9", name: "Hypercasual", status: "Active" },
            { id: "10", name: "Shooting", status: "Active" },
            { id: "11", name: "Boys", status: "InActive" },
            { id: "12", name: "2 Player", status: "InActive" },
            { id: "13", name: "Multiplayer", status: "InActive" },
            { id: "14", name: "Sports", status: "InActive" }
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
