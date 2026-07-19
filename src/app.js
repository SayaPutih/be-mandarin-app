import express from "express";
import authRoute from "./routes/auth.route.js"
import adminRouter from "./routes/admin.route.js";

import initiate from "./routes/student/initiate/initiate.route.js";

import analyticRouter from "./routes/student/analytic/analytic.route.js";
import studentClassRouter from "./routes/student/class/studentClass.routes.js"
import studentCallenderRouter from "./routes/student/callender/studentCallender.routes.js";
import flashCardRoute from "./routes/student/flash-card/flash-card.routes.js";
import notificationRouter from "./routes/student/notification/notification.route.js";
import statisticRouter from "./routes/student/statistic/statistic.route.js";
import studentVocabularyRouter from "./routes/student/vocabulary/studentVocabulary.routes.js";

import teacherDasboardRouter from "./routes/teacher/dashboard/teacherDashboard.routes.js";
import teacherAnalyticRouter from "./routes/teacher/analytics/teacherAnalytic.routes.js";
import teacherDetailStudentRouter from "./routes/teacher/student/detail/teacherStudent.route.js";
import teacherAssignmentRouter from "./routes/teacher/assignment/teacherAssignment.routes.js"
import teacherClassRouter from "./routes/teacher/class/teacherClass.routes.js"
import teacherClassStudentRouter from "./routes/teacher/student/class/teacherStudent.routes.js";
import teacherVocabularyRouter from "./routes/teacher/vocabulary/teacherVocabulary.routes.js";

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

app.use("/new/initiate", initiate);

app.use("/auth",authRoute)
app.use("/admin", adminRouter);

app.use("/analytic", analyticRouter);
app.use("/student", studentCallenderRouter);
app.use("/student", studentClassRouter);
app.use("/flash-card", flashCardRoute);
app.use("/notification", notificationRouter);
app.use("/statistic", statisticRouter);
app.use("/student", studentVocabularyRouter);

app.use("/teacher", teacherDasboardRouter);
app.use("/teacher", teacherAnalyticRouter);
app.use("/teacher", teacherDetailStudentRouter);
app.use("/teacher", teacherAssignmentRouter);
app.use("/teacher", teacherClassRouter);
app.use("/teacher", teacherClassStudentRouter);
app.use("/teacher",teacherVocabularyRouter);

export default app;