angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('aMPEB', {
    url: '/paginaInicial',
    templateUrl: 'templates/aMPEB.html',
    controller: 'aMPEBCtrl'
  })

  .state('aMPEBAPP', {
    url: '/login',
    templateUrl: 'templates/aMPEBAPP.html',
    controller: 'aMPEBAPPCtrl'
  })

  .state('notCias', {
    url: '/noticias',
    templateUrl: 'templates/notCias.html',
    controller: 'notCiasCtrl'
  })

   .state('listaEnquetes', {
    url: '/listaEnquetes',
    templateUrl: 'templates/listaEnquetes.html',
    controller: 'listaEnquetesCtrl'
  })

  .state('prXimosEventos', {
    url: '/proximosEventos',
    templateUrl: 'templates/prXimosEventos.html',
    controller: 'prXimosEventosCtrl'
  })

  .state('meuMural', {
    url: '/meuMural',
    templateUrl: 'templates/meuMural.html',
    controller: 'meuMuralCtrl'
  })

  .state('notCia', {
    url: '/detalheNoticia',
    templateUrl: 'templates/notCia.html',
    controller: 'notCiaCtrl',
    params: { id: null, },
  })

  .state('detalheDoEvento', {
    url: '/detalheEvento',
    templateUrl: 'templates/detalheDoEvento.html',
    controller: 'detalheDoEventoCtrl',
    params: { id: null, },
  })

  .state('detalheDoConvNio', {
    url: '/detalheConvenio',
    templateUrl: 'templates/detalheDoConvNio.html',
    controller: 'detalheDoConvNioCtrl',
    params: { id: null,},
  })

  .state('mural', {
    url: '/detalheMural',
    templateUrl: 'templates/mural.html',
    controller: 'muralCtrl',
    params: { id: null, },
  })

  .state('meuCadastroNaAMPEB', {
    url: '/meuCadastro',
    templateUrl: 'templates/meuCadastroNaAMPEB.html',
    controller: 'meuCadastroNaAMPEBCtrl'
  })

  .state('listaDeContatos', {
    url: '/listaContatos',
    templateUrl: 'templates/listaDeContatos.html',
    controller: 'listaDeContatosCtrl'
  })

  .state('dependentesAtivos', {
    url: '/dependentesAtivos',
    templateUrl: 'templates/dependentesAtivos.html',
    controller: 'dependentesAtivosCtrl'
  })

  .state('contatosAMPEB', {
    url: '/contatosAmpeb',
    templateUrl: 'templates/contatosAMPEB.html',
    controller: 'contatosAMPEBCtrl'
  })

  .state('listaDeEndereOs', {
    url: '/listaEnderecos',
    templateUrl: 'templates/listaDeEndereOs.html',
    controller: 'listaDeEndereOsCtrl'
  })

  .state('listaDeConvNios', {
    url: '/listaConvenios',
    templateUrl: 'templates/listaDeConvNios.html',
    controller: 'listaDeConvNiosCtrl',
    params: { idTipoConvenio: null, nmConvenio: null, nmMunicipio: null },
  })

  .state('enquete', {
    url: '/enquete',
    templateUrl: 'templates/enquete.html',
    controller: 'enqueteCtrl',
    params: { id: null, dataExpiracao: null, flVotada: null },

  })

  .state('resultadoDaEnquete', {
    url: '/resultadoEnquete',
    templateUrl: 'templates/resultadoDaEnquete.html',
    controller: 'resultadoDaEnqueteCtrl',
    params: { id: null, flVotada: null }
  })

  .state('alterarASenha', {
    url: '/alterarSenha',
    templateUrl: 'templates/alterarASenha.html',
    controller: 'alterarASenhaCtrl'
  })

  .state('esqueceuASenha', {
    url: '/esqueceuSenha',
    templateUrl: 'templates/esqueceuASenha.html',
    controller: 'esqueceuASenhaCtrl'
  })

  .state('transmissOAoVivo', {
    url: '/transmissao',
    templateUrl: 'templates/transmissOAoVivo.html',
    controller: 'transmissOAoVivoCtrl'
  })

  .state('contato', {
    url: '/contato',
    templateUrl: 'templates/contato.html',
    controller: 'contatoCtrl',
    params: { id_associados_contatos_telefonicos: null, id_tipo_contatos_telefonicos: null, principal: null, permitir_divulgar: null, numero_contato: null, id_operadora_telefones: null, observacao: null}
  })

  .state('buscarConvNios', {
    url: '/filtrarConvenios',
    templateUrl: 'templates/buscarConvNios.html',
    controller: 'buscarConvNiosCtrl'
  })

  .state('endereO', {
    url: '/endereco',
    templateUrl: 'templates/endereO.html',
    controller: 'endereOCtrl',
    params: { id_associados_enderecos: null, id_tipo_endereco: null, principal: null, descricao_endereco: null, id_estado: null, id_municipio: null, ponto_de_referencia: null, observacoes: null, chave_externa: null }
  })

  .state('dadosPessoais', {
    url: '/dadosPessoais',
    templateUrl: 'templates/dadosPessoais.html',
    controller: 'dadosPessoaisCtrl'
  })
  .state('novidadesConvenios', {
    url: '/novidadesConvenios',
    templateUrl: 'templates/novidadesConvenios.html',
    controller: 'novidadesConveniosCtrl'
  })
  .state('novidadesConveniosDetalhe', {
    url: '/novidadesConveniosDetalhe',
    templateUrl: 'templates/novidadesConveniosDetalhe.html',
    controller: 'novidadesConveniosDetalheCtrl'
  })
  .state('chats', {
    url: '/chats',
    templateUrl: 'templates/chats.html',
    controller: 'chatsCtrl'
  })
  .state('chat', {
    url: '/chat',
    templateUrl: 'templates/chat.html',
    controller: 'chatCtrl',
    params: { roomId: null }
  })
  
$urlRouterProvider.otherwise('/login')

  

});