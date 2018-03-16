const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const fs = require('fs');
const path = require('path');

module.exports = async (ctx) => {
  const upload = path.join(process.cwd(), 'public/assets/upload');
  let fileName;
  if (!fs.existsSync(upload)) {
    fs.mkdir(upload);
  }
  // console.log(111, ctx.request.body.fields);
  // console.log(222, ctx.request.body.files);
  const { name, price } = ctx.request.body.fields;
  const photo = ctx.request.body.files.photo;
  if (!name || !price || photo.size === 0) {
    fs.unlink(photo.path);
    return ctx.render('pages/admin', { msgfile: 'Заполните все поля!' });
  }
  fileName = path.join(upload, photo.name);
  // console.log(files.photo.path);
  fs.rename(photo.path, fileName, (err) => {
    if (err) {
      console.error(err);
      fs.unlink(fileName);
    }
  });
  fileName = path.join('assets', 'upload', photo.name);
  if (!db.get('products').value()) {
    db.defaults({ products: [] }).write();
  }
  db.get('products')
    .push({ name: name, price: price, src: fileName })
    .write();
  ctx.render('pages/admin', { msgfile: 'Картинка успешно загружена' });

  // (ctx.request, (err, fields, files) => {
  //   // if (err) return next(err);
  //   if (!fields.name || !fields.price || files.photo.size === 0) {
  //     fs.unlink(files.photo.path);
  //     ctx.body = ctx.render('pages/admin', { msgfile: 'Заполните все поля!' });
  //   }
  //   fileName = path.join(upload, files.photo.name);
  //   // console.log(files.photo.path);
  //   fs.rename(files.photo.path, fileName, (err) => {
  //     if (err) {
  //       console.error(err);
  //       fs.unlink(fileName);
  //     }
  //   });
  //   fileName = path.join('assets', 'upload', files.photo.name);
  //   if (!db.get('products').value()) {
  //     db.defaults({ products: [] }).write();
  //   }
  //   db.get('products')
  //     .push({ name: fields.name, price: fields.price, src: fileName })
  //     .write();
  //   ctx.body = ctx.render('pages/admin', { msgfile: 'Картинка успешно загружена' });
  // });
};
