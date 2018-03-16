const router = require('koa-router')();
const koaBody = require('koa-body');
const path = require('path');
const base = '../controllers';
const upload = path.join(process.cwd(), 'public/assets/upload');
const koaBodyObj = {
  multipart: true,
  formidable: {
    uploadDir: upload
  }
};
router.get('/', require(base + '/index'));
router.post('/', koaBody(), require(base + '/contact-me'));
router.get('/login', require(base + '/login'));
router.post('/login', koaBody(), require(base + '/check-admin'));
router.get('/admin', require(base + '/admin'));
router.post('/admin/upload', koaBody(koaBodyObj), require(base + '/upload'));
router.post('/admin/skills', koaBody(), require(base + '/skills'));

module.exports = router;
