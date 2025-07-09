const express = require('express');
const router = express.Router();
const homeController = require("../controller/homeController");

/* GET home page. */
router.get('/', homeController.Home);
router.get('/about', homeController.About);
router.get('/privacy-policy', homeController.PrivacyPolicy);
router.get('/term-use', homeController.TermUse);
router.get('/contact-us', homeController.ContactUs);
router.post('/contact-us', homeController.ContactUsStore);
router.get('/game/:slug', homeController.Single);
router.get('/play/:slug', homeController.PlayGame);
router.get('/category/:slug', homeController.CategoryGames);

module.exports = router;
