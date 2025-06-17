import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import dnsRoute from "./routes/dnsRoutes.js";

dotenv.config(); // load environment variables

const app = express(); // express application instance

app.use(cors()); // enabling cors
app.use(express.json()); // parse incoming requests
app.use(morgan("dev")); // logs HTTP request to console

app.use("/api/v1/dns", dnsRoute);

app.get("/", (req, res) => {
  res.send({
    message: "DNS LookUp Server",
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
