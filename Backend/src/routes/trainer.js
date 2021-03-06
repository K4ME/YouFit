import express from "express";
import fs from "fs";
import { promisify } from "util";

const router = express.Router();
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

// Criar um usuário (trainer)
router.post("/create", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    const { avatar, name, email, password, phone, adress, biograph } = req.body;

    let trainer = {
      id: data.nextTrainerId++,
      avatar,
      name,
      email,
      password,
      phone,
      adress,
      biograph,
      students: [],
      likes: [],
    };
    data.trainer.push(trainer);
    await writeFile(global.fileName, JSON.stringify(data));

    res.end();

    logger.info(`POST /trainer/create - ${JSON.stringify(trainer)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Mostrar todos os trainadores
router.get("/", async (_, res) => {
  try {
    const trainers = JSON.parse(await readFile(global.fileName, "utf8"));
    // const data = { trainers: trainers.trainer };
    const data = trainers.trainer;
    delete data.nextId;
    delete data.nextTrainerId;

    console.log(data);
    res.send(data);

    logger.info("GET /trainer");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

//mostrar trainadores filtrados pelos likes do usuário
router.get("/:id", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    const dataTrainers = data.trainer;
    delete dataTrainers.nextId;
    delete dataTrainers.nextTrainerId;

    const idReq = parseInt(req.params.id, 10);
    const likes = data.user[idReq - 1].likes; //retorna a lista de likes do usuario

    function imprimir(item, indice) {
      for (var i = 0; i < likes.length; i++) {
        if (item.id == likes[i]) {
          delete dataTrainers[indice];
        }
      }
    }

    dataTrainers.forEach(imprimir);

    const newDataTrainers = dataTrainers.filter(function (val) {
      return val !== null;
    });

    //console.log(newDataTrainers);
    res.send(newDataTrainers);

    logger.info("GET /trainer/:id");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Mostrar usuário por ID
router.get("/consult/:id", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    data.trainer = data.trainer.filter(
      (us) => us.id === parseInt(req.params.id, 10)
    );
    delete data.nextId;
    delete data.nextTrainerId;

    console.log(data.trainer);
    res.send(data.trainer);

    logger.info(`GET /trainer/consult/:id - " ${req.params.id}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Exclui um usuário -- Não usar pq buga o update
router.delete("/delete/:id", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    data.trainer = data.trainer.filter(
      (us) => us.id !== parseInt(req.params.id, 10)
    );
    await writeFile(global.fileName, JSON.stringify(data));

    res.end();

    logger.info(`DELETE /trainer/delete/:id - " ${req.params.id}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Atualiza um cadastro
router.put("/update/:id/", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    const {
      avatar,
      name,
      email,
      password,
      phone,
      adress,
      biograph,
      students,
      likes,
    } = req.body;

    let trainerId = req.params.id - 1;

    let newtrainer = {
      id: data.trainer[trainerId].id,
      avatar,
      name,
      email,
      password,
      phone,
      adress,
      biograph,
      students,
      likes,
    };

    data.trainer[trainerId] = newtrainer;
    await writeFile(global.fileName, JSON.stringify(data));

    res.end();

    logger.info(`PUT /trainer/update/ - " ${JSON.stringify(newtrainer)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Adcionar aluno a lista de alunos
router.put("/addstudent/:id/", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    const { id } = req.body;

    let trainerId = req.params.id - 1;

    let oldTrainer = data.trainer.filter(
      (us) => us.id === parseInt(req.params.id, 10)
    );

    if (oldTrainer[0].students === undefined) {
      oldTrainer[0].students = id;
    } else {
      let size = oldTrainer[0].students.length;
      oldTrainer[0].students[size] = id;
    }

    let newtrainer = {
      id: data.trainer[trainerId].id,
      avatar: data.trainer[trainerId].avatar,
      name: data.trainer[trainerId].name,
      email: data.trainer[trainerId].email,
      password: data.trainer[trainerId].password,
      phone: data.trainer[trainerId].phone,
      adress: data.trainer[trainerId].adress,
      biograph: data.trainer[trainerId].biograph,
      students: oldTrainer[0].students,
      likes: data.trainer[trainerId].likes,
    };

    data.trainer[trainerId] = newtrainer;
    await writeFile(global.fileName, JSON.stringify(data));

    res.end();

    logger.info(
      `PUT /trainer/addstudent/:id - " ${JSON.stringify(newtrainer)}`
    );
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    delete data.nextId;
    delete data.nextTrainerId;

    const { email, password } = req.body;

    data.trainer = data.trainer.filter(
      (us) => us.email === email && us.password === password
    );

    if (data.trainer == "") {
      res.send("erro");
    } else {
      const trainerId = JSON.stringify(data.trainer[0].id);

      console.log(data.trainer);
      res.send(trainerId);
    }
    logger.info(`GET /user/login - " ${email - password}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

//mostrar trainadores que deram like no aluno
router.get("/mytrainer/:id", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    const dataTrainers = data.trainer;
    delete dataTrainers.nextId;
    delete dataTrainers.nextTrainerId;

    const idReq = parseInt(req.params.id, 10); //id aluno

    let treinadores = [];

    function imprimir(item, indice) {
      for (var i = 0; i < item.students.length; i++) {
        if (idReq == item.students[i]) {
          if (treinadores == null) treinadores = [dataTrainers[indice]];
          if (treinadores != null)
            treinadores = [...treinadores, dataTrainers[indice]];
        }
      }
    }

    dataTrainers.forEach(imprimir);

    res.send(treinadores);

    logger.info("GET /trainer/mytrainer/:id");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
