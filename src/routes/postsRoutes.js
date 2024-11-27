import express from "express"; // Importa o módulo express para criar a API
import multer from "multer"; // Importa o módulo multer para lidar com uploads de arquivos
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSucessStatus: 200
}

// Importa as funções controladoras do arquivo postController.js
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postController.js";

// Configura o armazenamento de arquivos para o multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define o diretório de destino para os uploads ("uploads/")
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Mantém o nome original do arquivo enviado
    cb(null, file.originalname);
  },
});

// Cria uma instância do middleware multer com as configurações de armazenamento
const upload = multer({ dest: "./uploads", storage });

// Função que define as rotas da API
const routes = (app) => {
  // Habilita o middleware express.json() para interpretar requisições JSON
  app.use(express.json());
  app.use(cors(corsOptions))

  // Rota GET para listar todos os posts (atendida pela função listarPosts)
  app.get("/posts", listarPosts);

  // Rota POST para criar um novo post (atendida pela função postarNovoPost)
  app.post("/posts", postarNovoPost);

  // Rota POST para upload de imagem e criação de post (atendida pela função uploadImagem)
  // Utiliza o middleware upload.single("imagem") para processar o arquivo enviado com o campo "imagem"
  app.post("/upload", upload.single("imagem"), uploadImagem);

  app.put("/upload/:id",atualizarNovoPost)
};

export default routes; // Exporta a função routes para uso na aplicação principal