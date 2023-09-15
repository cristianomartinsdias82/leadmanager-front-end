# Projeto: Lead Manager (Front-end)

O que é o Lead Manager?
É um projeto que tem como objetivo permitir gerenciar de maneira simples e intuitiva - através de operações de listagem, adiçāo, atualizaçāo e remoção - dados de leads.
A parte de front-end do projeto consiste atualmente em duas telas.
Uma para listagem de leads a partir da qual os usuários são capazes de:
- Visualizar uma lista contendo os dados principais de leads existentes de forma paginada
- Ir para a tela de adicionar novos leads
  - Via cadastro manual
  - Via arquivos em lote no formato CSV
- Selecionar um lead a fim de removê-lo ou
- Selecionar um lead e acionar o botão para atualizar os respectivos dados<br/>
E outra tela para as operações de adicionar ou atualizar um lead previamente selecionado<br/>
- Em situações de conflito de atualização e remoção de dados, o usuário tem a possibilidade de tomar uma decisão sobre como proceder neste tipo de cenário (sobrescrever, carregar os novos dados, cancelar...)
de maneira fácil e intuitiva

O projeto está em constante evolução e utiliza a seguinte plataforma e linguagens, tecnologias, funcionalidades e ferramentas:
- Práticas de Código limpo / Clean code
- Plataforma Angular versão 16
- Angular Material e Angular CDK
- NodeJs versão 18
- Linguagens Javascript e Typescript versão 5
- Programação reativa com RxJs
- HTML5
- CSS
- Flexbox com Angular FlexLayout
- Pacotes NPM complementares
  - ngx-material-file-input (utilizado no formulário de upload de leads em lote)

Pré-requisitos para execução do Front-End da aplicação<br/>
É necessário possuir os seguintes componentes instalados na máquina:
- NodeJS 18.16 (que pode ser obtido através da url: https://nodejs.org/en)
- Angular CLI
  Após instalado o NodeJs, digitar a seguinte linha de comando no Terminal, Command Prompt ou Powershell:<br/>
    npm install -g @angular/cli [ENTER]<br/>
    NOTA: Caso o sistema operacional seja o Linux ou MacOs, poderá ser necessário prefixar a linha de comando com sudo e, em seguida, ter que informar a senha de administrador para prosseguir com a instalação.

Como executar o projeto localmente?
- Garanta que a máquina esteja devidamente configurada, conforme a seção "Pré-requisitos para execução do Front-End da aplicação"
- Acesse o Terminal, Command Prompt ou Powershell
- Navegue até a pasta raíz do projeto (mesma pasta que contém o arquivo package.json, por exemplo)
- Execute os seguintes comandos:<br/>
  npm install<br/>
  ng serve -o<br/>
  (O comando irá gerar os arquivos necessários para execução e automaticamente abrirá o navegador web padrão com a Url da aplicação).<br/>

Backlog:
- (User Story) Adicionar tela de autenticação no sistema a fim de impedir acesso indevido
  - A partir daí, a aplicação deverá receber e trafegar um Token de acesso aos recursos da API (JWT)
    - O token deverá ter o tempo de vida útil de 30 minutos
      - Permitir auto-renovação do token com refresh tokens
    - Armazenar este token utilizando localStorage
  - Possibilidade 1: a aplicação deverá ser capaz de encaminhar a solicitação de autenticação para um servidor de identidade a fim de obter o Token de autenticação
  - Possibilidade 2: a aplicação deverá invocar o endpoint de autenticação da API de leads a fim de obter o Token de autenticação
- (Technical debt) Implementar uma classe manipuladora global de erros
  - Quando um erro não manipulado ocorrer, redirecionar o usuário para uma rota ~/erro, para a qual deverá ser apresentado o SVG informando sobre ocorrido.

Em termos de implementação, o que tem de reaproveitável no código-fonte deste projeto e/ou que de repente pode servir como ponto de partida para outros projetos?
- Estruturação de pastas de maneira um pouco similar a projetos de back-end implementados com Clean Architecture, agrupando implementações por features (List leads, Maintain Lead)
- No formulário de gerenciamento de Leads (app/leads/maintain/views/maintain-lead/components/lead-form.*):
  Formulário digirido a modelo (formulário reativo!)
  Lógica de construção do formulário com FormBuilder<br/>
  Uso de validadores síncronos (app/common/validation/custom-validators.ts)<br/>
    Validação de Cnpj através de Regex e através do algoritmo baseado no Módulo 1<br/>
    Validação de Cep baseado em Regex<br/>
  Uso de validadores assíncronos (app/common/validation/custom-validators.ts)<br/>
    Disparo de solicitação ao servidor para validação do Cnpj<br/>
    Disparo de solicitação ao servidor para validação da Razão social<br/>
  Campo texto programado para fazer buscas assíncronas somente quando um determinado padrão de caracteres (formatos cnpj e cep, por exemplo) é atendido e após um certo tempo, a fim de evitar múltiplas solicitações a cada tecla digitada. (Efeito obtido através dos operadores RxJs 'debounceTime', 'filter' e 'mergeMap' via valueChanges do campo-texto)<br/>
  Uso de diretivas de elementos html (app/common/ui/input-masks/cep-mask.directive.ts + cnpj-mask.directive.ts)<br/>
    Formatação automática/dinâmica dos campos Cnpj e Cep<br/>
    Lógica de configuração no campo Cep para buscar o endereço relacionado<br/>
  Lógica que exibe Dialog de confirmação de abandono de página caso o formulário de lead possua informações não confirmada com Guards (app/common/ui/navigation/on-leave.ts + leave-confirmation.guard.ts | app/leads/maintain/views/maintain-lead.ts)<br/>
- Interceptador Http para manipular solicitações Http e tratar situações de erro específicas (app/common/infrastructure/request-handling.interceptor.ts)<br/>
  Uso da Api HttpClient<br/>
  Forte uso de operadores RxJs<br/>
  Uso do serviço de indicação de progresso da solicitação<br/>
  Tratamento de exceções específicas (erros técnicos, de concorrência e erros de domínio)<br/>
- Lógica de reportagem de progresso de upload de arquivos (app/leads/common/services/leads.service.ts + app/common/ui/widgets/acrivity-indicator.*)
  (Continuar a listagem. Afinal, tem muita coisa que vale anotar aqui como índice/referência!)
- Widgets de interface de usuário (app/common/ui/widgets/*):<br/>
  Modal de diálogo de prompt do tipo Sim/Não configurável<br/>
  Modal de diálogo de prompt customizável - que oferece a possibilidade de informar quais botoões inserir e qual será o comportamento ao clicar em cada um deles<br/>
  Indicador de atividade (Spinner), capaz inclusive de mostrar percentual de progresso para casos de upload de arquivo, por exemplo<br/>
  Notificador do tipo Sticker<br/>
  Painel de notificação de dados baseado em pares chave-valor (atualmente utilizado para mostrar erros retornados pelo servidor como fruto de erros e validação de um cadastro de Lead, por exemplo)
- Customização do DataSource do DataTable do Angular Material para delegar as funcionalidades de paginação e ordenação para o servidor (app/common/paged-list.ts, list-sort-direction.ts, paging-parameters.ts + app/leads/list/views/list-leads/list-leads.component.ts, list-leads.datasource.ts)
  Notificador do tipo Painel em modal<br/>
- Serviço intermediador de resolução de conflitos de operações de atualização e remoção de dados (app/common/services/conflict-resolution-esrvice.ts)
  
O projeto está em constante processo de evolução e sempre pode ser melhorado, tanto em termos de organização (estrutura de pastas, separações de responsabilidades) quanto em termos de algoritmos, uso do Typescript, uso de elementos Angular mais adequados para situações específicas, dentre outras coisas! Portanto, sugestões e críticas sempre são muito bem-vindas! :)
