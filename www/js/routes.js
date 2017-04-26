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
    controller: 'detalheDoEventoCtrl'
  })

  .state('detalheDoConvNio', {
    url: '/detalheConvenio',
    templateUrl: 'templates/detalheDoConvNio.html',
    controller: 'detalheDoConvNioCtrl'
  })

  .state('mural', {
    url: '/detalheMural',
    templateUrl: 'templates/mural.html',
    controller: 'muralCtrl'
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
    controller: 'listaDeConvNiosCtrl'
  })

  .state('enquete', {
    url: '/enquete',
    templateUrl: 'templates/enquete.html',
    controller: 'enqueteCtrl'
  })

  .state('resultadoDaEnquete', {
    url: '/resultadoEnquete',
    templateUrl: 'templates/resultadoDaEnquete.html',
    controller: 'resultadoDaEnqueteCtrl'
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
    controller: 'contatoCtrl'
  })

  .state('buscarConvNios', {
    url: '/filtrarConvenios',
    templateUrl: 'templates/buscarConvNios.html',
    controller: 'buscarConvNiosCtrl'
  })

  .state('endereO', {
    url: '/endereco',
    templateUrl: 'templates/endereO.html',
    controller: 'endereOCtrl'
  })

  .state('dadosPessoais', {
    url: '/dadosPessoais',
    templateUrl: 'templates/dadosPessoais.html',
    controller: 'dadosPessoaisCtrl'
  })

$urlRouterProvider.otherwise('/login')

  

});