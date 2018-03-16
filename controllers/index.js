module.exports = async (ctx) => {
  const products = require('../db.json').products;
  const skills = require('../db.json').skills;
  ctx.render('pages/index', { products, skills });
};
