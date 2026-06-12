import express from "express";
import authRoute from "./routes/auth.route.js"
import flashCardRoute from "./routes/flash-card.routes.js"
import mandarinSentenceRoute from "./routes/mandarin-sentence.routes.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json())
app.use("/ping", async (req,res)=>{
    try{
        return res.status(200).json("Pong!")
    }catch(err){
        return res.status(500).json({message : err.message})
    }
});
app.use("/auth",authRoute)
app.use("/flash-card",flashCardRoute)
app.use("/mandarin-sentece", mandarinSentenceRoute);

export default app;