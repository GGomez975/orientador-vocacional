const express = require('express');
const cors = require('cors');
const db = require('./src/db/database');
const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'orientador-vocacional-backend' });
});

db.initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Error al inicializar el backend:', err);
  process.exit(1);
});

module.exports = app;
