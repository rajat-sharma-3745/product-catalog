import app from './app.js';
import { connectDb } from './config/db.js';

const PORT = process.env.PORT || 3000;

async function start() {
   connectDb()
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
