import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

 //Lista todos os posts existentes no banco de dados.
export async function listarPosts(req, res) {
    // Obtém todos os posts do banco de dados utilizando a função getTodosPosts() definida no modelo.
    const posts = await getTodosPosts();

    // Envia uma resposta HTTP com status 200 (OK) e os dados dos posts em formato JSON.
    res.status(200).json(posts);
}

//Cria um novo post no banco de dados com base nos dados fornecidos na requisição.

export async function postarNovoPost(req, res) {
    // Extrai os dados do novo post do corpo da requisição.
    const novoPost = req.body;

    try {
        // Chama a função criarPost() do modelo para inserir o novo post no banco de dados.
        const postCriado = await criarPost(novoPost);

        // Envia uma resposta HTTP com status 200 (OK) e os dados do post criado em formato JSON.
        res.status(200).json(postCriado);
    } catch (error) {
        // Registra o erro no console para fins de depuração e envia uma resposta HTTP com status 500 (Erro Interno do Servidor).
        console.error(error.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

 // Cria um novo post com uma imagem e salva a imagem no servidor.

export async function uploadImagem(req, res) {
    // Cria um objeto com os dados do novo post, incluindo o nome original da imagem.
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    try {
        // Chama a função criarPost() para inserir o novo post no banco de dados.
        const postCriado = await criarPost(novoPost);
        // Constrói o novo nome do arquivo da imagem, utilizando o ID do post criado para garantir unicidade.
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        // Renomeia o arquivo da imagem para o novo nome e move-o para o diretório de uploads.
        fs.renameSync(req.file.path, imagemAtualizada);
        // Envia uma resposta HTTP com status 200 (OK) e os dados do post criado em formato JSON.
        res.status(200).json(postCriado);
        } catch (error) {
        // Registra o erro no console para fins de depuração e envia uma resposta HTTP com status 500 (Erro Interno do Servidor).
        console.error(error.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

export async function atualizarNovoPost(req, res) {
    // Extrai os dados do novo post do corpo da requisição.
    const id = req.params.id;
    const urlImagem= `http://localhost:3000/${id}.png`

    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imgBuffer)

        const post={
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }
        // Chama a função criarPost() do modelo para inserir o novo post no banco de dados.
        const postCriado = await atualizarPost(id, post);

        // Envia uma resposta HTTP com status 200 (OK) e os dados do post criado em formato JSON.
        res.status(200).json(postCriado);
    } catch (error) {
        // Registra o erro no console para fins de depuração e envia uma resposta HTTP com status 500 (Erro Interno do Servidor).
        console.error(error.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}