🎓 ROTEIRO — Sistema de Biblioteca (Microsserviços + MVC)
=========================================================

1️⃣ Introdução do Projeto
=========================

**Título:** Sistema de Gerenciamento de Biblioteca baseado em Microsserviços

**Objetivo:**

Desenvolver um sistema web para controle de:

*   clientes
    
*   livros
    
*   empréstimos
    

utilizando arquitetura moderna baseada em **Microsserviços** e padrão **MVC**.

2️⃣ Tecnologias Utilizadas
==========================

### Backend

*   Python
    
*   Flask
    
*   API REST
    

### Frontend

*   HTML
    
*   CSS
    
*   JavaScript
    

### Banco de Dados

*   MySQL
    

### DevOps

*   Docker
    
*   Docker Compose
    

### Arquitetura

*   MVC (Model-View-Controller)
    
*   Microsserviços
    

3️⃣ Arquitetura Geral do Sistema
================================

Estrutura:biblioteca-system/
----------------------------

│

├── docker-compose.yml

│

├── frontend/

│ ├── index.html

│ ├── css/

│ └── js/

│

├── cliente-service/

│ ├── app.py

│ ├── models/

│ ├── controllers/

│ ├── routes/

│ ├── config.py

│ ├── requirements.txt

│ └── Dockerfile

│

├── livro-service/

│ └── (mesma estrutura)

│

├── emprestimo-service/

│ └── (mesma estrutura)

│

└── database/

└── init.sql

4️⃣ Organização do Projeto
==========================

📁 frontend/
------------

Responsável pela interface do usuário.

Funções:

*   telas HTML
    
*   requisições HTTP
    
*   interação com APIs
    

📁 cliente-service/
-------------------

Microsserviço responsável por:

*   cadastrar cliente
    
*   listar clientes
    
*   editar cliente
    
*   remover cliente
    

📁 livro-service/
-----------------

Responsável por:

*   cadastro de livros
    
*   controle de disponibilidade
    
*   consulta de acervo
    

📁 emprestimo-service/
----------------------

Responsável por:

*   registrar empréstimos
    
*   vincular cliente + livro
    
*   controlar devoluções
    

📁 database/
------------

Contém:

*   criação das tabelas
    
*   relacionamento entre entidades
    

docker-compose.yml
------------------

Responsável por:

*   subir todos os serviços
    
*   conectar containers
    
*   iniciar banco automaticamente
    

5️⃣ Arquitetura MVC
===================

🔵 Model
--------

Camada responsável por:

*   conexão com MySQL
    
*   consultas SQL
    
*   manipulação de dados
    

🟢 Controller
-------------

Responsável por:

*   regras de negócio
    
*   validações
    
*   comunicação Model ↔ Rotas
    

🟠 View
-------

Representada pelo:

*   Frontend HTML
    
*   respostas JSON da API
    

6️⃣ Funcionamento dos Microsserviços
====================================

Cada serviço:

✅ possui aplicação Flask própria✅ roda em container separado✅ possui MVC interno✅ expõe API REST independente

exemplo:

localhost:5001 → clientes

localhost:5002 → livros

localhost:5003 → empréstim

7️⃣ Fluxo do Sistema
====================

### Cadastro de Cliente

1.  Usuário acessa Frontend
    
2.  Frontend envia requisição HTTP
    
3.  cliente-service recebe
    
4.  Controller processa
    
5.  Model salva no MySQL
    

### Empréstimo de Livro

1.  Usuário seleciona cliente
    
2.  Escolhe livro
    
3.  emprestimo-service registra empréstimo
    
4.  livro-service marca livro como indisponível
    

8️⃣ Containerização com Docker
==============================

Docker permite:

✅ padronização do ambiente✅ execução em qualquer máquina✅ isolamento dos serviços

Cada microsserviço possui:

*   Dockerfile próprio
    
*   container independente
    

9️⃣ Comunicação entre Serviços
==============================

Comunicação realizada via:

--> APIs REST --> requisições HTTP

Exemplo: emprestimo-service → livro-service (para atualizar disponibilidade do livro.)

🔟 Benefícios da Arquitetura
============================

✔ baixo acoplamento✔ fácil manutenção✔ escalabilidade✔ serviços independentes✔ padrão usado na indústria

1️⃣1️⃣ Demonstração do Sistema
==============================

Mostrar:

*   cadastro de cliente
    
*   cadastro de livro
    
*   realização de empréstimo
    
*   consulta dos dados
    

1️⃣2️⃣ Conclusão
================

O projeto demonstrou a aplicação prática de:

*   arquitetura MVC
    
*   microsserviços
    
*   APIs REST
    
*   containerização com Docker
    

permitindo desenvolver um sistema modular e escalável.

> O sistema foi projetado seguindo princípios modernos de engenharia de software, separando responsabilidades por domínio e utilizando microsserviços containerizados para facilitar escalabilidade e manutenção.