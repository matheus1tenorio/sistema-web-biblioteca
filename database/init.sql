CREATE DATABASE biblioteca;
USE biblioteca;

CREATE TABLE cliente(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE livro(
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100),
    autor VARCHAR(100),
    disponivel BOOLEAN DEFAULT TRUE
);

CREATE TABLE emprestimo(
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    livro_id INT,
    data_emprestimo DATE,
    FOREIGN KEY(cliente_id) REFERENCES cliente(id),
    FOREIGN KEY(livro_id) REFERENCES livro(id)
);