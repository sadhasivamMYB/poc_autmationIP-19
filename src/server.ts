import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import masterRoutes from "./routes/masterItem.route";
import initialStockRoutes from "./routes/initialStock.route";
import dailyStockRoutes from "./routes/dailystock.route";
import warehouseRoutes from "./routes/warehouse.route";
import userRoutes from "./routes/user.route";
import compare from "./routes/compare.route";
import dashboard from "./routes/dashboardStats.route"
import summaryRoutes from "./routes/summary.route"
import excelRoutes from "./routes/excel.route";
import invitationRoutes from "./routes/invitation.route";
import "./job/stockGeneration.job";
// import "./job/invitationCleanup.job";

const app = express();


const allowedOrigins = process.env.ALLOWED_ORIGIN_LISTS?.split(",").map(origin => origin.trim()) || [];

app.use(
    cors({
        origin: (origin, callback) => {
            //   // Allow requests without Origin (Postman, curl, mobile apps)
            //   if (!origin) {
            //     return callback(null, true);
            //   }

            if (allowedOrigins.includes(origin as string)) {
                return callback(null, true);
            }

            return callback(new Error(`Origin '${origin}' is not allowed by CORS`));
        },
        credentials: true,
    })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/master-item', masterRoutes)
app.use('/api/initial-stock', initialStockRoutes)
app.use('/api/daily-stock', dailyStockRoutes)
app.use('/api/warehouse', warehouseRoutes)
app.use('/api/users', userRoutes)
app.use('/api/dashboard-stats', dashboard)
app.use('/api/excel', excelRoutes)
app.use('/api/compare', compare)
app.use('/api/summary', summaryRoutes)
app.use('/api/invitations', invitationRoutes)

app.get("/health", (req, res) => {
    res.send("Hello World! API is running.");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 