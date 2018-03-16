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
  const arrOfNumbers = [];
  Object.keys(ctx.request.body).map((key) => {
    let value = ctx.request.body[key];
    arrOfNumbers.push(value);
  });
  db._.mixin({
    upNumber: function (array) {
      for (let i = 0; i < array.length; i++) {
        array[i] = arrOfNumbers[i];
      }
      return array;
    }
  });
  await db.get('skills')
    .map('number')
    .upNumber()
    .write();
  console.log(db.get('skills').value());
  ctx.render('pages/admin', { msgskill: 'Данные успешно изменены' });
};
