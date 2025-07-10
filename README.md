# SistemaEstoque
Sistema de controle de estoque **INDIGO**, uma aplicação web desenvolvida para facilitar o gerenciamento de **filamentos e resinas** usados na impressão 3D.

> ⚠️ **Atenção:**  
> Este repositório é apenas **demonstrativo**, criado com o objetivo de apresentar o funcionamento geral do sistema.  
> O projeto oficial está hospedado em um servidor privado e o repositório principal é **privado** por motivos de segurança e proteção de dados.

---

## Funcionalidades
- Cadastro, edição e remoção de **resinas** e **filamentos** (produtos).
- Controle de **estoque por gramas**, com alertas visuais de estoque mínimo e máximo.
- Simulador de consumo para projetos:
  - Escolha do item e cor.
  - Cálculo automático do impacto no estoque.
  - Sugestões para compra se o material for insuficiente ou estiver abaixo de 200g após uso.
- Interface simples e responsiva (HTML, CSS, JavaScript).
- Integração com back-end em **Spring Boot** via API RESTful.

## Tecnologias Utilizadas

### Front-end
- HTML5
- CSS3
- JavaScript (Fetch API)
- SweetAlert2

### Back-end
- Java + Spring Boot
- Banco de Dados: MySQL / PostgreSQL
- Swagger para documentação da API
