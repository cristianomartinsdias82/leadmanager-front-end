# Projeto: Lead Manager (Front-end)

O que é o Lead Manager?
É um projeto que tem como objetivo permitir gerenciar de maneira simples e intuitiva - através de operações de listagem, adiçāo, atualizaçāo e remoção - dados de leads.
A parte de front-end do projeto consiste atualmente em duas telas.
Uma para listagem de leads que, a partir dela, os usuários são capazes de:
- Visualizar uma lista contendo os dados principais de leads existentes
- Acionar o botão para adicionar novos leads
- Selecionar um lead a fim de removê-lo ou
- Selecionar um lead e acionar o botão para atualizar os respectivos dados<br/>
E outra para as operações de adicionar um novo lead ou atualizar um lead previamente selecionado

O Lead Manager é um projeto implementado utilizando as seguintes linguagens, tecnologias e ferramentas:
- Plataforma Angular versão 16
- Angular Material e Angular CDK
- Node versão 18
- Linguagens Javascript e Typescript versão 5
- Programação reativa com RxJs
- HTML5
- CSS
- Flexbox com Angular FlexLayout

Pré-requisitos para execução do Front-End da aplicação
É necessário possuir os seguintes componentes instalados na máquina:
- NodeJS 18 (pode obtido através da url: https://nodejs.org/en)
- Angular CLI
  Após instalado o NodeJs, digitar a seguinte linha de comando no Terminal, Command Prompt ou Powershell:
    npm install -g @angular/cli [ENTER]
    NOTA: Se o sistema operacional for Linux ou MacOs, poderá ser necessário prefixar a linha de comando com sudo e, em seguida, ter que informar a senha de administrador para prosseguir com a instalação

Como executar o projeto localmente?
- Garanta que a máquina esteja devidamente configurada, conforme a seção "Pré-requisitos para execução do Front-End da aplicação"
- Acesse o Terminal, Command Prompt ou Powershell
- Navegue até a pasta raíz do projeto (mesma pasta que contém o arquivo package.json, por exemplo)
- Execute o seguinte comando:
  ng serve -o
  (O comando irá gerar os arquivos necessários para execução e automaticamente abrirá o navegador web padrão com a Url da aplicação).

Novas demandas no radar:
- (Bug) Ao selecionar um Lead para atualização, a pesquisa de endereço por CEP está sendo diparada, sobrescrevendo os dados de endereço previamente informados no cadastro do mesmo
- (User Story) Adicionar a possibilidade de adicionar leads em lote
  - Disponibilizar um campo de upload que aceite arquivos com a extensão CSV
  - Durante o upload, disponibilizar um indicador de progresso que informe o percentual da 
    operação, fazendo uso inclusive de funcionalidades visuais que o Angular Material oferece 
- (User Story) Adicionar tela de autenticação no sistema a fim de impedir acesso 
  - Possibilidade 1: a aplicação deverá ser capaz de encaminhar a solicitação de autenticação para um servidor de identidade a fim de obter o Token de autenticação
  - Possibilidade 2: a aplicação deverá invocar o endpoint de autenticação da API de leads a fim de obter o Token de autenticação
- (Technical debt) Adicionar a aplicação ao Docker-Compose simplificar a configuração da máquina e permitir automatizar a execução da aplicação em uma única linha de comando

Em termos de implementação, o que tem de reaproveitável no código-fonte deste projeto e/ou que de repente pode servir como ponto de partida ou para outros projetos?
- Práticas de Clean Code
- Estruturação de pastas de maneira um pouco similar a projetos de back-end implementados com Clean Architecture, agrupando implementações por features (List leads, Maintain Lead)
- No formulário de gerenciamento de Leads (app/leads/maintain/views/maintain-lead.*)
  Formulário digirido a modelo
  Lógica de construção do formulário com FormBuilder
  Uso de validadores síncronos (app/common/validation/custom-validators.ts)
    Validação de Cnpj através de Regex e através do algoritmo baseado no Módulo 1
    Validação de Cep baseado em Regex
  Uso de validadores assíncronos (app/common/validation/custom-validators.ts)
    Disparo de solicitação ao servidor para validação do Cnpj
    Disparo de solicitação ao servidor para validação da Razão social
  Uso de diretivas de elementos html (app/common/ui/input-masks/cep-mask.directive.ts + cnpj-mask.directive.ts)
    Formatação automática/dinâmica dos campos Cnpj e Cep
    Lógica de configuração no campo Cep para buscar endereço relacionado
  Lógica que exibe Dialog de confirmação de abandono de página caso o formulário de lead possua informações não confirmada com Guards (app/common/ui/navigation/on-leave.ts + leave-confirmation.guard.ts | app/leads/maintain/views/maintain-lead.ts)
  (Continuar a listagem. Afinal, tem muita coisa que vale deixa aqui como índice/referência!)

O projeto está em processo de evolução e sempre pode ser melhorado, tanto em termos de organização (estrutura e pastas, separações de responsbilidades) quanto de algoritmos, usos de elementos Angular para situações específicas dentre outras coisas! Portanto, opiniões sempre são muito bem-vindas! :)
