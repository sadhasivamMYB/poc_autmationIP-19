import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import masterRoutes from "./routes/masterItem.route";
import initialStockRoutes from "./routes/initialStock.route";
import dailyStockRoutes from "./routes/dailystock.route";
import warehouseRoutes from "./routes/warehouse.route";
import userRoutes from "./routes/user.route";
import "./job/stockGeneration.job"

const app = express();

app.use(cors());
app.use(express.json());


import excelRoutes from "./routes/excel.route";

app.use("/api/auth", authRoutes);
app.use('/api/master-item', masterRoutes)
app.use('/api/initial-stock', initialStockRoutes)
app.use('/api/daily-stock', dailyStockRoutes)
app.use('/api/warehouse', warehouseRoutes)
app.use('/api/users', userRoutes)
app.use('/api/excel', excelRoutes)

app.get("/health", (req, res) => {
    res.send("Hello World! API is running.");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});