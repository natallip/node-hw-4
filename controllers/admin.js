module.exports = async (ctx) => {
  if (ctx.session.isAdmin) {
    ctx.render('pages/admin');
  } else {
    ctx.redirect('/');
  }
};
