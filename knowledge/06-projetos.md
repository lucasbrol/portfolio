# Projetos do Lucas

Os repositórios públicos do Lucas no GitHub também são sincronizados automaticamente nesta base. Abaixo está o contexto de cada projeto: do que se trata, como funciona, as tecnologias e o papel do Lucas.

## ParkFinder (TCC) — do que se trata
O ParkFinder é o Trabalho de Conclusão de Curso (TCC) do Lucas em Sistemas de Informação na UFV, orientado pelo Prof. Guilherme Mendonça Freire. É um aplicativo mobile que mostra ao motorista a chance de encontrar vaga de estacionamento em uma região antes de ele chegar lá. A ideia é de crowdsensing participativo: os próprios motoristas alimentam os dados. O estudo de caso é a cidade de Ouro Branco (MG), dividida em regiões como Centro, Pioneiros, Primeiro de Maio, Siderurgia e Luzia Augusta. O projeto está em desenvolvimento (a defesa está prevista para 2027) e o repositório é privado enquanto o TCC não termina, por isso não há link público. Ainda não está decidido se ele será aberto depois da defesa: isso depende do resultado do projeto.

## ParkFinder (TCC) — como funciona
1. Depois do login, o app pergunta "para onde você vai?" e o motorista escolhe o destino no mapa ou por busca de endereço.
2. A API descobre em qual região fica o destino com uma operação espacial do PostGIS (ST_Contains) e calcula a disponibilidade em tempo real.
3. O índice de disponibilidade é: respostas "sim" / (respostas "sim" + "não") na última hora. Com 70% ou mais a chance é alta, entre 40% e 70% é média, abaixo de 40% é baixa, e com menos de 5 registros aparece "informação insuficiente". Os limites são configuráveis.
4. O mapa também mostra os estacionamentos da região, incluindo os pagos.
5. Ao chegar, o motorista responde se conseguiu estacionar, e essa resposta alimenta o índice da região.

## ParkFinder (TCC) — tecnologias
Back-end: Python, FastAPI assíncrono, Pydantic, SQLAlchemy 2 com asyncpg e GeoAlchemy2, Shapely, Alembic (migrações), autenticação com JWT e bcrypt, documentação automática com Swagger/OpenAPI. Banco: PostgreSQL com PostGIS e índices espaciais GiST. Aplicativo: React Native com Expo e TypeScript, mapas com react-native-maps e OpenStreetMap, localização e notificações. Testes: unitários e de integração com Pytest contra um banco PostGIS real. Infraestrutura: Docker e Docker Compose. A arquitetura do back-end é em camadas (rotas, serviços, repositórios, modelos e schemas) e segue a LGPD, coletando o mínimo de dados.

## AlphaPulse (trabalho em grupo) — do que se trata
O AlphaPulse é um trabalho em grupo da disciplina SIN 323 – Inteligência Artificial (UFV, 2026), feito pelo Lucas com colegas, incluindo o Otavio Pierin, e orientado pela Profa. Larissa Ferreira Rodrigues Moreira. É um monitor de sentimento de notícias financeiras do Ibovespa: ele coleta manchetes reais, mede o sentimento de cada uma com um modelo de linguagem especializado em finanças e testa se esse sentimento ajuda a prever o próximo pregão. É um projeto acadêmico e não é recomendação de investimento. Todo o projeto foi desenvolvido em conjunto pelo grupo, sem divisão de partes entre os integrantes. Repositório: https://github.com/otavio-pierin/AlphaPulse

## AlphaPulse — como funciona e resultados
O grupo fez o fine-tuning completo do FinBERT-PT-BR (cerca de 110 milhões de parâmetros) com notícias rotuladas por especialistas. A acurácia na classificação de sentimento subiu de 77,1% para 88,4% (±1,1%, validação cruzada em 5 divisões). Para a previsão de mercado, foram comparados LSTM, Bi-LSTM, CNN, Transformer, MLP, SVM e regressão logística, com fusão precoce e tardia (early/late fusion) e stacking. A avaliação usou validação walk-forward em 630 pregões, com p-valor e cuidados contra vazamento de dados. Nenhuma das 17 configurações superou o acaso com significância estatística, um resultado coerente com a hipótese de mercados eficientes e reportado com honestidade. Tecnologias: Python, PyTorch, Hugging Face Transformers, scikit-learn, pandas, NumPy, SciPy, Matplotlib, yfinance, Google News RSS, SQLite e uma aplicação web em Streamlit.

## Leukemia Classification (trabalho em grupo) — do que se trata
Trabalho em grupo da disciplina SIN 393 – Introdução à Visão Computacional (UFV, 2026), com o Prof. João Fernando Mari, feito pelo Lucas, Otavio Pierin e Breno Pierin. O projeto classifica imagens de microscópio de células únicas como leucêmicas (Leucemia Linfoblástica Aguda de células B, B-ALL) ou normais, para apoiar o diagnóstico. Usa o dataset C-NMC 2019 do Kaggle, com cerca de 10 mil imagens de treino. Foi feito em Jupyter Notebook. Todo o projeto foi desenvolvido em conjunto pelo grupo, sem divisão de partes entre os integrantes. Repositório: https://github.com/otavio-pierin/SIN393-Leukemia-Classification

## Leukemia Classification — como funciona e resultados
O grupo comparou três redes convolucionais com transfer learning do ImageNet em PyTorch: ResNet50, DenseNet121 e EfficientNet-B3, todas com o mesmo protocolo. Usaram aumento de dados pensado para o domínio (rotação, espelhamento, variação de cor e desfoque leve), perda ponderada por classe por causa do desbalanceamento, precisão mista e early stopping. O conjunto de teste tem pacientes que não aparecem no treino, o que evita vazamento de dados por paciente. A comparação usou F1-macro, ROC-AUC, matriz de confusão e o teste de McNemar. O melhor modelo foi a DenseNet121, com F1-macro de 0,80, ROC-AUC de 0,89 e acurácia de cerca de 83%. Tecnologias: Python, PyTorch, torchvision, scikit-learn, pandas, NumPy, Matplotlib, Jupyter e Kaggle.

## RideFleet (trabalho em grupo) — do que se trata
Trabalho em grupo da disciplina SIN 142 – Sistemas Distribuídos (UFV, 2026/1), feito pelo Lucas com Breno Pierin, Luan Siqueira Ramos e Luana Nishida. A turma montou uma federação de aplicativos de transporte: um servidor central chamado Core, fornecido pela disciplina, cuida de travas distribuídas, saga, leilão, relógio lógico e log causal, e cada grupo fez o próprio serviço de corridas conectado a ele. O RideFleet é o serviço do grupo do Lucas. Quando faltam motoristas, ele delega a corrida a outro grupo por meio de um leilão no Core, e também recebe corridas de outros grupos pelo mesmo caminho. Parte do desenvolvimento foi feita na máquina de um colega, por isso os commits aparecem no nome dos colegas. Repositório: https://github.com/lucasbrol/SIN142-RideFleet

## RideFleet — como funciona e tecnologias
A corrida segue uma máquina de estados (request, match, confirm, in_transit, complete ou cancelled). As corridas ficam em duas filas com Redis Streams (entrada e saída), com consumer groups, confirmação por ACK e reprocessamento de mensagens pendentes. Um relógio lógico de Lamport, compartilhado entre as instâncias no Redis e atualizado por script Lua, ordena os eventos junto com o log do Core. Ao vencer um leilão, o serviço adquire uma trava distribuída da corrida no Core e executa uma saga; se ela falhar, o Core compensa a corrida. Um Nginx distribui a carga entre duas instâncias da API. Há health check (UP, DEGRADED ou DOWN), logs estruturados em JSON, métricas no padrão Prometheus com dashboards no Grafana, testes com Pytest, scripts de carga e um pipeline de CI/CD escrito para GitHub Actions. Tecnologias: Python, FastAPI assíncrono, Pydantic, SQLAlchemy, PostgreSQL, Redis, Nginx, Prometheus, Grafana, React com Vite, Docker e Docker Compose.

## EventHub QA (projeto de QA)
Projeto prático de QA em que o Lucas simulou o fluxo real de testes de uma plataforma de eventos e venda de ingressos: análise de requisitos, cenários e casos de teste, execução, reporte de bugs com passos de reprodução, resultado esperado e resultado obtido, severidade e prioridade, reteste e gestão do fluxo no Jira. Aplicou testes funcionais, negativos, de valor limite e de autorização. Os testes são manuais e documentados em Markdown. Testes de API com Postman, validação com SQL, automação com Playwright e CI/CD com GitHub Actions estão planejados como próximas etapas. Repositório: https://github.com/lucasbrol/Eventhub-qa-project

## LabDeProg — e-commerce de roupas (trabalho em grupo)
Aplicação web de e-commerce de roupas feita em grupo com Django: cadastro e login de usuários, catálogo de produtos e carrinho de compras (adicionar, alterar quantidade, remover e calcular o total). Tem testes automatizados com Pytest e roda com Docker e Docker Compose usando MySQL. Também foi usada para praticar QA, com cenários e casos de teste. Tecnologias: Python, Django, MySQL, SQLite, HTML, CSS, JavaScript, Pytest e Docker. Repositório: https://github.com/lucasbrol/labdeprog

## Agenda UFV — sistema de eventos (trabalho em grupo)
Trabalho final da disciplina SIN 493 – Introdução à Programação Web (UFV), feito pelo Lucas com Otavio e Breno Pierin. É um sistema web de agendamento de eventos: cadastro e login, sessão de usuário, criação e listagem de eventos com busca, agendamento e cancelamento. Foi feito sem frameworks nem banco de dados: PHP puro, JavaScript puro, HTML5, CSS3 responsivo e dados em JSON. Repositório: https://github.com/lucasbrol/Sistema-de-eventos---SIN-493

## Jogos em Python com Pygame
O Lucas fez dois jogos em Python com a biblioteca Pygame para praticar programação orientada a objetos. O Caipihead é o mais complexo, com fases diferentes, menus, sprites, sons e registro de tempos de speed run, inspirado no jogo Cuphead. O outro é um jogo da cobrinha (Snake). Repositório do Caipihead: https://github.com/lucasbrol/Jogo-Caipihead-em-Python-

## Jogo da cobrinha
Jogo da cobrinha (Snake) feito pelo Lucas em Python com Pygame, com foco em orientação a objetos. Repositório: https://github.com/lucasbrol/Jogo-Cobrinha-em-Python-

## Algoritmos de ordenação em C
Na graduação, o Lucas implementou algoritmos de ordenação em C: Insertion Sort, Bubble Sort, Selection Sort, Shell Sort e Merge Sort.

## Este portfólio
Este site é um projeto do Lucas: um portfólio em Next.js e TypeScript com um assistente que usa RAG (Retrieval-Augmented Generation) com o Gemini para responder apenas com base em informações verificadas sobre ele. Tem testes automatizados com Vitest e Playwright, CI com GitHub Actions e uma avaliação que confere se o assistente não inventa respostas. Repositório: https://github.com/lucasbrol/portfolio

## Perfil do GitHub
O README do perfil do Lucas no GitHub mostra um cartão com todas as tecnologias que ele já usou, indicando em qual projeto cada uma foi usada, além de um destaque animado do ParkFinder. Perfil: https://github.com/lucasbrol
