import dotenv from "dotenv";
import express from "express";
import { selectUsuarios, selectUsuario } from "./bd.js"; // Corrigido para uma única importação
//index.js
import { selectUsuarios, selectUsuario, insertUsuario } from "./bd.js";

dotenv.config();

const app = express();
const port = 3001;

app.get("/", (req, res) => {
  console.log("Rota / solicitada");
  res.json({
    nome: "Arthur Porto",
  });
});

app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await selectUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erro!" });
  }

  console.log("Rota GET/usuarios solicitada");
});

app.get("/usuario/:id", async (req, res) => {
  console.log("Rota GET /usuario/# solicitada");
  try {
    const usuario = await selectUsuario(req.params.id);
    if (usuario.length > 0) res.json(usuario);
    else res.status(404).json({ message: "Usuário não encontrado!" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erro!" });
  }
});

app.listen(port, () => {
  console.log(`Serviço escutando na porta:  ${port}`);
});
//index.js
app.use(express.json());
//index.js
app.post("/usuario", async (req, res) => {
  console.log("Rota POST /usuario solicitada");
  try {
    await insertUsuario(req.body);
    res.status(201).json({ message: "Usuário inserido com sucesso!" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erro!" });
  }
});

//index.js
import { selectUsuarios, selectUsuario, insertUsuario, deleteUsuario } from "./bd.js";

//index.js
app.delete("/usuario/:id", async (req, res) => {
  console.log("Rota DELETE /usuario/# solicitada");
  try {
    const usuario = await selectUsuario(req.params.id);
    if (usuario.length > 0) {
      await deleteUsuario(req.params.id);
      res.status(200).json({ message: "Usuário excluido com sucesso!!" });
    } else res.status(404).json({ message: "Usuário não encontrado!" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erro!" });
  }
});