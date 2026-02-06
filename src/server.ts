import express  from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from the root!'); // Or res.sendFile('index.html') for a static file
}); 

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.listen(process.env.PORT, () =>
  console.log("Backend running on port " + process.env.PORT)
);