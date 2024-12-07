// index.js
import dotenv from "dotenv";
import express from "express";
import { selectUsuarios, selectUsuario, insertUsuario, deleteUsuario, updateUsuario } from "./bd.js";  // Importação corrigida

dotenv.config();

const app = express();
const port = 3001;

// Middleware para permitir o recebimento de dados JSON nas requisições
app.use(express.json());  // Coloque isso antes das rotas

// Rota de exemplo para a raiz
app.get("/", (req, res) => {
  console.log("Rota / solicitada");
  res.json({
    nome: "Arthur Porto",  // Substitua pelo seu nome
  });
});

// Rota GET para listar todos os usuários
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await selectUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erro!" });
  }
  console.log("Rota GET /usuarios solicitada");
});

// Rota GET para buscar um usuário pelo ID
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

// Rota POST para criar um novo usuário
app.post("/usuario", async (req, res) => {
  console.log("Rota POST /usuario solicitada");
  try {
    await insertUsuario(req.body);
    res.status(201).json({ message: "Usuário inserido com sucesso!" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erro!" });
  }
});

// Rota DELETE para excluir um usuário
app.delete("/usuario/:id", async (req, res) => {
  console.log("Rota DELETE /usuario/# solicitada");
  try {
    const usuario = await selectUsuario(req.params.id);
    if (usuario.length > 0) {
      await deleteUsuario(req.params.id);
      res.status(200).json({ message: "Usuário excluído com sucesso!" });
    } else res.status(404).json({ message: "Usuário não encontrado!" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erro!" });
  }
});

// Rota PUT para atualizar um usuário
app.put("/usuario/:id", async (req, res) => {
  console.log("Rota PUT /usuario/# solicitada");
  try {
    const id = req.params.id;
    const usuario = await selectUsuario(id);
    if (usuario.length > 0) {
      await updateUsuario(id, req.body);
      res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    } else res.status(404).json({ message: "Usuário não encontrado!" });
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({ message: error.message || "Erro!" });
  }
});

// Inicia o servidor na porta 3001
app.listen(port, () => {
  console.log(`Serviço escutando na porta: ${port}`);
});
