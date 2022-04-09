import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.post("/api/task", async (req, res, next) => {
  try {
    const description = req.body.description;
    const task = await prisma.task.create({
      data: {
        description,
      },
    });
    return res.json({ task });
  } catch (e) {
    next(e);
  }
});

app.get("/api/tasks", async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany();
    return res.json({ tasks });
  } catch (e) {
    next(e);
  }
});

app.delete("/api/task/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedTask = await prisma.task.delete({
      where: { id },
    });
    return res.json({ task: deletedTask });
  } catch (e) {
    next(e);
  }
});

app.listen(5000, () => {
  console.log("listening...");
});
