import express from "express";
import authRoute from "./routes/auth.route.js"
import flashCardRoute from "./routes/flash-card.routes.js"
import statisticRouter from "./routes/statistic.route.js";
import analyticRouter from "./routes/analytic.route.js";
import notificationRouter from "./routes/notification.route.js";
import adminRouter from "./routes/admin.route.js";

import newInitiateRouter from "./routes/NEW/initiate.route.js"

import studentRouter from "./routes/student.routes.js";
import teacherRouter2 from "./routes/teacher.route.js";

import cors from "cors";

const app = express();
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json())
app.use("/ping", async (req,res)=>{
    try{
        return res.status(200).json("Ponger!")
    }catch(err){
        return res.status(500).json({message : err.message})
    }
});

app.use("/query/:name", async (req,res)=>{
    try{
        return res.status(200).json(`Query : ${req.params.name}`)
    }catch(err){
        return res.status(500).json({message : err.message})
    }
});

app.use("/new/initiate", newInitiateRouter);

app.use("/auth",authRoute)
app.use("/flash-card",flashCardRoute);
app.use("/statistic", statisticRouter);
app.use("/analytic", analyticRouter);
app.use("/notification", notificationRouter);
app.use("/admin", adminRouter);
app.use("/student", studentRouter);
app.use("/teacher",teacherRouter2)

export default app;