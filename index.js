import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const porta = 5000;
const host = 'localhost';
var listaUsuarios = [];
var mensagem = [];
let usuarioAtivo = null;

const app = express();
app.use(cookieParser());
app.use(session({
    secret: "M1nH4Ch4v3S3cR3t4",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 30
    }
}));    
app.use(express.urlencoded({extended: true}));
app.use(express.static('./paginas'));

function processaCadastros(req,res){
    const dados = req.body;
    let conteudo = '';
    if(!(dados.nome && dados.date && dados.nickname)) {
        conteudo = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }
        div {
            width: 300px;
            margin: 0 auto;
            padding: 20px;
            background-color: #de3163;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            color: #ffffff;
        }
        label {
            color: #ffffff;
        }
        input[type="text"],
        input[type="date"],
        button {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: none;
            border-radius: 4px;
        }
        input[type="text"],
        input[type="date"] {
            background-color: #ffffff;
        }
        button {
            background-color: #ffffff;
            color: #ffcccc;
            cursor: pointer;
        }
        button:hover {
            background-color: #de3163;
        }
        </style>
        <title>Cadastro de Usuários</title>
        </head>
        <body>
            <div>
            <form action='/cadastro-de-usuarios' method='POST' novalidate>
            <h1>Cadastro de Usuários</h1>
            <div>
                <label for="nome">Nome:</label><br>
                <input type="text" id="nome" name="nome" value="${dados.nome}" required>
            </div>`;
    if(!dados.nome){
        conteudo += `
        <div>
          <p>Por favor, informe o nome!</p>
        </div>`;}
    conteudo +=`
        <br>
        <div>
        <label for="date">Data de Nascimento:</label><br>
        <input type="date" id="date" name="date" required>
        </div>`;
    if(!dados.date){
        conteudo +=`
        <div>
          <p>Por favor, informe a data de nascimento!</p>
        </div>`;}
    conteudo +=`
        <br>
        <div>
        <label for="nickname">Nickname:</label><br>
        <input type="text" id="nickname" name="nickname" required>
        </div>`;
    if(!dados.nickname){
        conteudo +=`
        <div>
          <p>Por favor, informe seu Nickname!</p>
        </div>`;}
    conteudo += `
        <br>
        <div>
            <button type="submit">Cadastrar</button>
        </div>
        </form>
        </div>
        </body>
        </html>`;
    res.end(conteudo);
    }
    else{
        const usuario = {
            nome : dados.nome,
            date : dados.date,
            nickname : dados.nickname
        }
    listaUsuarios.push(usuario);
    
    conteudo = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }
        h1 {
            text-align: center;
            color: #ffffff;
            background-color: #de3163;
            padding: 20px 0;
            margin: 0;
        }
        table {
            width: 80%;
            margin: 20px auto;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #de3163;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #de3163;
            color: #ffffff;
        }
        tbody tr:nth-child(even) {
            background-color: #fff5f5;
        }
        a {
            display: block;
            width: 200px;
            margin: 20px auto;
            text-align: center;
            padding: 10px;
            text-decoration: none;
            color: #ffffff;
            background-color: #de3163;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        a:hover {
            background-color: #ff9999;
        }
    </style>
    <title>LISTA DE USUARIOS</title>
    </head>
    <body>
    <h1>Lista de usuarios cadastrados</h1>
    <table>
        <thead>
        <tr>
            <th>Nome</th>
            <th>Data de Nascimento</th>
            <th>Nickname</th>
        </tr>
        </thead>
        <tbody>`;
    for(const usuario of listaUsuarios){
        conteudo += `
        <tr>
            <td>${usuario.nome}</td>
            <td>${usuario.date}</td>
            <td>${usuario.nickname}</td>
        </tr>`;
    }
    conteudo += `
    </tbody>
    </table>
    <a href="/" role="button">VOLTAR AO MENU</a>
    <a href="/cadastro-de-usuarios.html" role="button">CONTINUAR CADASTRANDO</a>
    </body>
    </script>
    </html>`;
    res.end(conteudo);
}};

function chat(listaUsuarios, mensagem) {
    return `
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }
        h1 {
            text-align: center;
            color: #ffffff;
            background-color: #de3163;
            padding: 20px 0;
            margin: 0;
        }
        label {
            color: #000000;
            margin-top: 10px;
            display: block;
        }
        select,
        input[type="text"] {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        button {
            width: 100%;
            padding: 10px;
            background-color: #de3163;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #ff9999;
        }
        h2 {
            margin-top: 20px;
            color: #000000;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            background-color: #de3163;
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 4px;
        }
        a {
            display: block;
            width: 200px;
            margin: 20px auto;
            text-align: center;
            padding: 10px;
            text-decoration: none;
            color: #ffffff;
            background-color: #de3163;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        a:hover {
            background-color: #ff9999;
        }
        </style>
        <title>Bate-papo</title>
      </head>
      <body>
        <h1>Chat</h1>
        <form action='/postarMensagem' method='POST'>
          <label for="usuario">Usuário:</label>
          <select id="usuario" name="usuario" required>
            ${listaUsuarios.map(user => `<option>${user.nome}</option>`).join('')}
          </select>
          <label for="mensagem">Mensagem:</label>
          <input type="text" id="mensagem" name="mensagem" required>
          <button type="submit">Enviar</button>
        </form>
        <h2>Mensagens</h2>
        <ul>
          ${mensagem.map(msg => `<li>${msg.usuario}(${msg.hora}): ${msg.texto}</li>`).join('')}
        </ul>
        <a href="/">Voltar para o Menu</a>
      </body>
      </html>
    `;
  }
app.get('/chat', (req, res) => {
    if (req.session.usuarioAutenticado) {
      res.send(chat(listaUsuarios, mensagem));
    } else {
      res.redirect('/login');
    }
  });
  
app.post('/postarMensagem', (req, res) => {
    if (req.session.usuarioAutenticado) {
      const novaMensagem = {
        usuario: req.body.usuario,
        texto: req.body.mensagem,
        hora: new Date().toLocaleTimeString(),
      };
      mensagem.push(novaMensagem);
      res.redirect('/chat');
    } else {
      res.redirect('/login');
    }
});

function autenticar(req, res, next){
    if(req.session.usuarioAutenticado){
        next();
    }
    else{
        res.redirect("/login.html");
    }
}

app.get('/', autenticar, (req, res) =>{
    const data = new Date();
    res.cookie("data", data.toLocaleString(), {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true
    });
    res.end(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #ffffff;
            margin: 0;
            padding: 0; }
        h1 {
            text-align: center;
            color: #ffffff;
            background-color: #de3163;
            padding: 20px 0;
            margin: 0;}
        ul {
            list-style-type: none;
            margin: 0;
            padding: 0; }
        li {
            background-color: #de3163;
            margin-bottom: 10px; }
        li a {
            display: block;
            text-decoration: none;
            color: #ffffff;
            padding: 10px;}
        li a:hover {
            background-color: #de3163;}
        footer {
            text-align: center;
            padding: 20px 0;
            color: #ffffff;
            background-color: #de3163;
            position: absolute;
            bottom: 0;
            width: 100%;}
    </style>
    <head>
        <title>MENU</title>
        </head>
        <body>
            <h1>MENU</h1>
                <ul>
                    <li><a href="/cadastro-de-usuarios.html">Cadastro de Usuários</a></li>
                </ul>
                <ul>
                    <li><a href="/chat">Bate-papo</a></li>
                </ul>
            <footer>
                <p>Seu ultimo acesso foi em ${data}</p>
            </footer>
            </body>
            </html>
    `)
})
app.get('/cadastro-de-usuarios.html', (req, res) => {
    res.end(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
    body {
        font-family: Arial, sans-serif;
        background-color: #ffffff;
        margin: 0;
        padding: 0;
    }
    div {
        width: 300px;
        margin: 0 auto;
        padding: 20px;
        background-color: #de3163;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        text-align: center;
        color: #ffffff;
    }
    label {
        color: #ffffff;
    }
    input[type="text"],
    input[type="date"],
    button {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: none;
        border-radius: 4px;
    }
    input[type="text"],
    input[type="date"] {
        background-color: #ffffff;
    }
    button {
        background-color: #ffffff;
        color: #de3163;
        cursor: pointer;
    }
    button:hover {
        background-color: #ff9999;
    }
    </style>
    <title>Cadastro de Usuários</title>
    </head>
    <body>
    <div>
        <form action='/cadastro-de-usuarios' method='POST' novalidate>
            <h1>Cadastro de Usuários</h1>
            <div>
                <label for="nome">Nome:</label><br>
                <input type="text" id="nome" name="nome" required>
            </div>
            <br>
            <div>
                <label for="date">Data de Nascimento:</label><br>
                <input type="date" id="date" name="date" required>
            </div>
            <br>
            <div>
                <label for="nickname">Nickname:</label><br>
                <input type="text" id="nickname" name="nickname" required>
            </div>
            <br>
            <div>
                <button type="submit">Cadastrar</button>
            </div>
        </form>
    </div>
    </body>
    </html>`)
})


app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'paginas', 'login.html'));
});
app.post('/login', (req, res)=>{
    const usuario = req.body.usuario;
    const senha = req.body.senha;
    if(usuario && senha && (usuario === 'julia') && (senha === '123')){
      req.session.usuarioAutenticado = true ;
      res.redirect('/');
    }
    else{
      res.end(`
        <!DOCTYPE html>
          <head>
            <meta charset="UTF-8">
            <title>Falha no Login</title>
            <style>
            body {
            background-color: #ffffff;
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 100px;}
            h2 { color: #de3163;}
            a {
            color: #ffffff;
            background-color: #de3163;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s;}
            a:hover {background-color: #ff9999;}
            </style>
          <head>
          <body>
            <h2>Usuario ou senha invalido!</h2>
            <a href="/login.html">Voltar ao Login</a>
          </body>
        </html>`);
    }
});

app.post('/cadastro-de-usuarios',processaCadastros)
app.listen(porta, host, () => {
    console.log(`Servidor executando na url http://${host}:${porta}`);
});