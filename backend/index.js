import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/database.js";
import FileUpload from "express-fileupload";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import SaleRoute from "./routes/SaleRoute.js";

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
});

// (Opsional) Uncomment ini sekali saja untuk membuat tabel Session di database
store.sync();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto", // 'auto' mendeteksi http/https
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000", // Frontend Next.js
  })
);

app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));

// Routes
app.use(UserRoute);
app.use(ProductRoute);
app.use(SaleRoute);

app.listen(process.env.APP_PORT, () => {
  console.log(`Server up and running on port ${process.env.APP_PORT}...`);
});

(async () => {
  await db.sync();
})();
