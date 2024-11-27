import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";
// Importa a função para conectar ao banco de dados, definida no arquivo dbConfig.js.

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);
// Cria uma conexão com o banco de dados usando a string de conexão fornecida pela variável de ambiente STRING_CONEXAO.
// O await indica que a função conectarAoBanco é assíncrona e espera a conclusão da conexão antes de continuar.

export async function getTodosPosts() {
    // Função assíncrona para obter todos os posts do banco de dados.
    const db = conexao.db("imersao-instabyte");
    // Obtém o banco de dados com o nome "imersao-instabyte" a partir da conexão estabelecida.
    const colecao = db.collection("posts");
    // Obtém a coleção "posts" dentro do banco de dados.
    return colecao.find().toArray();
    // Executa uma consulta para encontrar todos os documentos (posts) na coleção e retorna os resultados como um array.
  }

  export async function criarPost(novoPost) {
    // Conecta ao banco de dados MongoDB chamado "imersao-instabyte"
    const db = conexao.db("imersao-instabyte");  
    // Seleciona a coleção "posts" dentro do banco de dados
    const colecao = db.collection("posts");  
    // Insere o novo post na coleção "posts" e retorna o resultado da operação
    return colecao.insertOne(novoPost);
  }

  export async function atualizarPost(id, novoPost) {
    // Conecta ao banco de dados MongoDB chamado "imersao-instabyte"
    const db = conexao.db("imersao-instabyte");  
    // Seleciona a coleção "posts" dentro do banco de dados
    const colecao = db.collection("posts");  
    const objID = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objID)},{$set: novoPost});
  }