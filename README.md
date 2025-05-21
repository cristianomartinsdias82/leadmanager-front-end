# Projeto: Lead Manager (Front-end)

O que é o Lead Manager?
É um projeto que tem como objetivo permitir gerenciar de maneira simples e intuitiva - através de operações de listagem, adiçāo, atualizaçāo e remoção - dados de leads.
A parte de front-end do projeto consiste em dois módulos:
- Gerenciamento de Lead (principal)
- Administração

No módulo de gerenciamento de leads, existe uma tela principal que se abre listando os leads cadastrados. Nela, os usuários são capazes de:
- Navegar de forma paginada
- Ordenar os itens por colunas como Cnpj e Razão, tanto de maneira ascendente como descendente
- Filtrar/Pesquisar por Razão Social ou Cnpj
- Selecionar um lead para visualizar mais detalhes e realizar atualizações do mesmo
- Remover um lead selecionado
- Ir para a tela de cadastro de novos leads, que pode ser realizado de duas maneiras
  - Via cadastro manual (formulário de preenchimento)
  - Por lote, através de arquivos no formato CSV
NOTA: A tela de cadastro é a mesma para atualização de dados de Leads.
Vale compartilhar também que, em situações de conflito/concorrência de atualização de dados por dois ou mais usuários, a aplicação dá aos mesmos a possibilidade de tomar uma decisão sobre como proceder neste cenário (sobrescrever, visualizar os novos dados, carregar os novos dados e cancelar a edição)

No módulo de adminsitração do sistema, usuários com o perfil de Administrador são capazes de:
- Listar, baixar e excluir os arquivos utilizados para a realização de carga de Leads em lote
- Visualizar e filtrar todas as ações realizadas pelos usuários no sistema

Telas do projeto
![image](https://github.com/user-attachments/assets/94b996f6-3aef-427a-bd8a-03db41b9939a)
(Tela de autenticação no servidor de autorização par obtenção do token JWT)

![image](https://github.com/user-attachments/assets/6c3def62-9a44-468e-87a3-368f2d243857)
(Tela de listagem de Leads)

![image](https://github.com/user-attachments/assets/4c6cd76c-111d-47b5-86a0-ca9aa90cea6f)
(Tela de listagem de Leads após a confirmação de inclusão/atualização/exclusão de Lead)

![image](https://github.com/user-attachments/assets/68703201-4234-4cd9-aad6-eb96a4f4308b)
(Manipulação de operações não autorizadas conforme o perfil do usuário autenticado)

![image](https://github.com/user-attachments/assets/36e83762-0921-4cb2-b91f-099175602a45)
(Diálogo de confirmação de exclusão de Leads)

![image](https://github.com/user-attachments/assets/6b75bb7f-0ef4-4866-abe1-8a8b0f78dcf2)
(Diálogo de envio de token OTP para confirmação da operação de exclusão de Leads)

![image](https://github.com/user-attachments/assets/47b24653-cca3-40de-ab55-be56420335ce)
(Tela de inclusão de Leads em lote via arquivos excel pré-formatado)

![image](https://github.com/user-attachments/assets/3e4aa73b-5122-4bfd-bc61-e6311cffe1d2)
(Tela de mostragem de inconsistências detectadas na inclusão de Leads em lote)

![image](https://github.com/user-attachments/assets/0cd87522-9221-4438-b243-64db2a16e229)
(Tela de cadastro manual de Lead)

![image](https://github.com/user-attachments/assets/b4726500-636f-423b-95e8-09ee867d0a23)
(Diálogo de confirmação de inclusão de Lead)

![image](https://github.com/user-attachments/assets/10966008-2d17-45dd-ad19-2c0881681fc3)
(Mostragem de campos obrigatórios para inclusão/atualização de Lead)

![image](https://github.com/user-attachments/assets/f189f4d6-0fc5-496c-8ec6-85d397d385b6)
(Mostragem de erros específicos de validação para inclusão/atualização de Lead)

![image](https://github.com/user-attachments/assets/4122ba9f-8fba-494f-9dac-3c68251d39c4)
(Manipulação do formulário de registro/atualização manual de Lead ao tentar sair ou clicar em 'Cancelar' quando houve alguma alteração nos dados)

![image](https://github.com/user-attachments/assets/fb08e902-d0d7-4d7d-b071-222d2835adbd)
(Manipulação de operações concorrentes sobre um determinado Lead)

![image](https://github.com/user-attachments/assets/7fdaed02-6942-461e-84d4-12d97f995dcb)
(Mostragem dos dados atualizados por usuários concorrentes durante a tentativa de atualizar ou excluir o mesmo Lead)

![image](https://github.com/user-attachments/assets/86157b69-d23a-4113-b9fa-d41ef3a34c42)
(Tela de saída do sistema)

O projeto utiliza as seguintes plataformas, linguagens, tecnologias, funcionalidades e ferramentas:
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
  - angular-auth-oidc-client (Fluxo de autorização oAuth2)
  - iamserver/ngx-countdown

Pré-requisitos para execução da aplicação
É necessário possuir o(s) seguinte(s) componente(s) instalado(s) na máquina:<br/>
Docker<br/>
Caso a máquina seja Mac, siga os passos conforme a url: https://docs.docker.com/desktop/install/mac-install/<br/>
Caso a máquina seja Linux, siga os passos conforme a url: https://docs.docker.com/desktop/install/linux-install/#generic-installation-steps<br/>
Caso a máquina seja Windows, siga os passos conforme a url: https://docs.docker.com/desktop/install/windows-install/<br/>

Em termos de implementação, o que tem de reaproveitável no código-fonte deste projeto e/ou que de repente pode servir como ponto de partida para outros projetos? Muitas coisas!
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
  Modal de diálogo de prompt customizável - que oferece a possibilidade de informar quais botões inserir e qual será o comportamento ao clicar em cada um deles<br/>
  Indicador de atividade (Spinner), capaz inclusive de mostrar percentual de progresso para casos de upload de arquivo, por exemplo<br/>
  Notificador do tipo Sticker<br/>
  Painel de notificação de dados baseado em pares chave-valor (atualmente utilizado para mostrar erros retornados pelo servidor como fruto de erros e validação de um cadastro de Lead, por exemplo)
- Customização do DataSource do DataTable do Angular Material para delegar as funcionalidades de paginação e ordenação para o servidor (app/common/paged-list.ts, list-sort-direction.ts, paging-parameters.ts + app/leads/list/views/list-leads/list-leads.component.ts, list-leads.datasource.ts)
  Notificador do tipo Painel em modal<br/>
- Serviço intermediador de resolução de conflitos de operações de atualização e remoção de dados (app/common/services/conflict-resolution-esrvice.ts)
  
O projeto está em constante processo de evolução e sempre pode ser melhorado, tanto em termos de organização (estrutura de pastas, separações de responsabilidades) quanto em termos de algoritmos, uso do Typescript, uso de elementos Angular mais adequados para situações específicas, dentre outras coisas! Portanto, sugestões e críticas sempre são muito bem-vindas! :)
