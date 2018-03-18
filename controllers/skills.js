const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

module.exports = async (ctx) => {
  const {age, concerts, cities, years} = ctx.request.body;
  if (!age || !concerts || !cities || !years) {
    return ctx.render('pages/admin', { msgskill: 'Заполните все поля!' });
  }
  if (!db.get('skills').value()) {
    await db.defaults({ skills: [] }).write();
    await db.get('skills')
      .push({ number: age, text: 'Возраст начала занятий на скрипке' })
      .push({ number: concerts, text: 'Концертов отыграл' })
      .push({ number: cities, text: 'Максимальное число городов в туре' })
      .push({ number: years, text: 'Лет на сцене в качестве скрипача' })
      .write();
  }
  if (!db.get('skills').value()) {
    db.defaults({ skills: [] }).write();
  }
  db.get('skills').remove().write();
  db.get('skills')
    .push({ number: age, text: 'Возраст начала занятий на скрипке' })
    .push({ number: concerts, text: 'Концертов отыграл' })
    .push({ number: cities, text: 'Максимальное число городов в туре' })
    .push({ number: years, text: 'Лет на сцене в качестве скрипача' })
    .write();
  ctx.render('pages/admin', { msgskill: 'Данные успешно изменены' });
};
