import express from "express";
import fs from "fs";
import { promisify } from "util";

const router = express.Router();
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

// Criar um usuário (aluno)
router.post("/create", async (req, res) => {
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
      trainer,
    } = req.body;

    let user = {
      id: data.nextId++,
      avatar,
      name,
      email,
      password,
      phone,
      adress,
      biograph,
      trainer,
      likes: [],
      dislikes: [],
    };
    data.user.push(user);
    await writeFile(global.fileName, JSON.stringify(data));

    res.end();

    logger.info(`POST /user/create - ${JSON.stringify(user)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Mostrar todos os usuários
router.get("/", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    delete data.nextId;
    delete data.nextTrainerId;

    console.log(data.user);
    res.send(data.user);

    logger.info("GET /user");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

//retornar alunos que deram like no treinador
router.get("/:id", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    const dataUsers = data.user;
    delete dataUsers.nextId;
    delete dataUsers.nextTrainerId;

    const idReq = parseInt(req.params.id, 10);
    //const likes = data.user[idReq - 1].likes; //retorna a lista de likes do usuario

    let Alunos = []; //users que deram like no treinador

    function imprimir(item, indice) {
      for (var i = 0; i < item.likes.length; i++) {
        if (idReq == item.likes[i]) {
          if (Alunos == null) Alunos = [dataUsers[indice]];
          if (Alunos != null) Alunos = [...Alunos, dataUsers[indice]];
        }
      }
    }

    dataUsers.forEach(imprimir);

    res.send(Alunos);

    logger.info("GET /:id");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Mostrar usuário por ID
router.get("/consult/:id", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    data.user = data.user.filter((us) => us.id === parseInt(req.params.id, 10));
    delete data.nextId;
    delete data.nextTrainerId;

    console.log(data.user);
    res.send(data.user);

    logger.info(`GET /user/consult/:id - " ${req.params.id}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Exclui um usuário -- Não usar pq buga o update
router.delete("/delete/:id", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    data.user = data.user.filter((us) => us.id !== parseInt(req.params.id, 10));
    await writeFile(global.fileName, JSON.stringify(data));

    res.end();

    logger.info(`DELETE /user/delete/:id - " ${req.params.id}`);
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
      trainer,
      likes,
      dislikes,
    } = req.body;

    let userId = req.params.id - 1;

    let newUser = {
      id: data.user[userId].id,
      avatar,
      name,
      email,
      password,
      phone,
      adress,
      biograph,
      trainer,
      likes: likes,
      dislikes: dislikes,
    };

    data.user[userId] = newUser;
    await writeFile(global.fileName, JSON.stringify(data));

    res.end();

    logger.info(`PUT /user/update/ - " ${JSON.stringify(newUser)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// verificar usuário e senha
router.post("/login", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    delete data.nextId;
    delete data.nextTrainerId;

    const { email, password } = req.body;

    data.user = data.user.filter(
      (us) => us.email === email && us.password === password
    );

    if (data.user == "") {
      res.send("erro");
    } else {
      const userId = JSON.stringify(data.user[0].id);

      console.log(data.user);
      res.send(userId);
    }
    logger.info(`GET /user/login - " ${email - password}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Adicionar trainer ID a lista de LIKES do Aluno
router.put("/likes/:id", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    const { studentId } = req.body;

    let trainerId = req.params.id;

    let oldUser = data.user.filter((us) => us.id === parseInt(studentId, 10));

    console.log("---------- oldUser" + JSON.stringify(oldUser[0]));

    if (oldUser[0].likes === undefined) {
      oldUser[0].likes = trainerId;
      console.log("Likes " + oldUser.likes);
    } else {
      let size = oldUser[0].likes.length;
      oldUser[0].likes[size] = trainerId;
      console.log("-------- Likes " + JSON.stringify(oldUser[0].likes));
    }

    let newUser = {
      id: data.user[studentId - 1].id,
      avatar: data.user[studentId - 1].avatar,
      name: data.user[studentId - 1].name,
      email: data.user[studentId - 1].email,
      password: data.user[studentId - 1].password,
      phone: data.user[studentId - 1].phone,
      adress: data.user[studentId - 1].adress,
      biograph: data.user[studentId - 1].biograph,
      likes: oldUser[0].likes,
      dislikes: data.user[studentId - 1].dislikes,
    };

    data.user[studentId - 1] = newUser;
    await writeFile(global.fileName, JSON.stringify(data));

    res.end();

    logger.info(`PUT /user/likes/:id/ - " ${JSON.stringify(newUser)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Adicionar trainer ID a lista de DISLIKES do Aluno
router.put("/dislikes/:id", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    const { studentId } = req.body;

    let trainerId = req.params.id;

    let oldUser = data.user.filter((us) => us.id === parseInt(studentId, 10));

    console.log("---------- oldUser" + JSON.stringify(oldUser[0]));

    if (oldUser[0].dislikes === undefined) {
      oldUser[0].dislikes = trainerId;
      console.log("Dislikes " + oldUser.dislikes);
    } else {
      let size = oldUser[0].dislikes.length;
      oldUser[0].dislikes[size] = trainerId;
      console.log("-------- Dislikes " + JSON.stringify(oldUser[0].dislikes));
    }

    let newUser = {
      id: data.user[studentId - 1].id,
      avatar: data.user[studentId - 1].avatar,
      name: data.user[studentId - 1].name,
      email: data.user[studentId - 1].email,
      password: data.user[studentId - 1].password,
      phone: data.user[studentId - 1].phone,
      adress: data.user[studentId - 1].adress,
      biograph: data.user[studentId - 1].biograph,
      likes: data.user[studentId - 1].likes,
      dislikes: oldUser[0].dislikes,
    };

    data.user[studentId - 1] = newUser;
    await writeFile(global.fileName, JSON.stringify(data));

    res.end();

    logger.info(`PUT /user/dislikes/:id/ - " ${JSON.stringify(newUser)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
export default router;
