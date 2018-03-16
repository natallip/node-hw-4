module.exports = async (ctx) => {
  const { email, password } = ctx.request.body;
  if (!email || !password) {
    return ctx.render('pages/login', { msglogin: 'Заполните все поля!', status: 'Error' });
  }
  if (email === 'admin@gmail.com' && password === 'admin') {
    ctx.session.isAdmin = true;
    return ctx.redirect('/admin');
  }
  ctx.render('pages/login', { msglogin: 'Вы не админ!' });
};
