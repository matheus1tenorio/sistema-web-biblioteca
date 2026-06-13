CREATE TABLE IF NOT EXISTS cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    matricula VARCHAR(8) UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'cliente'
);


CREATE TABLE IF NOT EXISTS livro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    ano INT,
    quantidade INT NOT NULL DEFAULT 1,
    disponivel BOOLEAN DEFAULT TRUE
);


CREATE TABLE IF NOT EXISTS emprestimo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    livro_id INT NOT NULL,
    data_emprestimo DATE NOT NULL,
    data_devolucao DATE,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id),
    FOREIGN KEY (livro_id) REFERENCES livro(id)
);

-- esse é o admin fixo do sistema. ele é o usuario que tera todas permissões no sistema
INSERT IGNORE INTO cliente (
    nome,
    email,
    matricula,
    senha,
    role
)
VALUES (
    'Administrador',
    'admin@ifpe.paulista.com',
    'ADMIN001',
    'scrypt:32768:8:1$8rr1FtExjRdA18Gy$6d14250180a644eca9d43b444aaf27186a7cf4bc0c1db6f82430f89878893a5ca12f5139c527f97754c06404d90d30fcd1e277422765ca408e2a2fb569fb59ba',
    'admin'
);

-- a senha é senha123 mas aqui no SQL esta em HASH, que foi gerado no terminal do python pelo metodo generate_password_hash() da biblioteca Werkzeug
-- EMAIL: admin@ifpe.paulista.com
-- SENHA: senha123