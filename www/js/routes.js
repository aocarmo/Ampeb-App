angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider



      .state('aMPEB', {
        url: '/paginaInicial',
        templateUrl: 'templates/pagina_inicial/aMPEB.html',
        controller: 'aMPEBCtrl',
        params: { user: null }
      })

      .state('aMPEBAPP', {
        url: '/login',
        templateUrl: 'templates/login/aMPEBAPP.html',
        controller: 'aMPEBAPPCtrl'
      })

      .state('menu.notCias', {
        url: '/noticias',
        views: {
          'side-menu21': {
            templateUrl: 'templates/noticias/notCias.html',
            controller: 'notCiasCtrl'
          }
        }
      })
      .state('notCias', {
        url: '/noticias',
        templateUrl: 'templates/notCias.html',
        controller: 'notCiasCtrl'
      })

      .state('menu.listaEnquetes', {
        url: '/listaEnquetes',
        views: {
          'side-menu21': {
            templateUrl: 'templates/enquete/listaEnquetes.html',
            controller: 'listaEnquetesCtrl'
          }
        }
      })

      .state('menu.prXimosEventos', {
        url: '/proximosEventos',
        views: {
          'side-menu21': {
            templateUrl: 'templates/eventos/prXimosEventos.html',
            controller: 'prXimosEventosCtrl'
          }
        }
      })
      .state('prXimosEventos', {
        url: '/proximosEventos',
        templateUrl: 'templates/eventos/prXimosEventos.html',
        controller: 'prXimosEventosCtrl'
      })

      .state('menu.meuMural', {
        url: '/meuMural',
        views: {
          'side-menu21': {
            templateUrl: 'templates/fique_por_dentro/meuMural.html',
            controller: 'meuMuralCtrl'
          }
        }
      })

      .state('menu.notCia', {
        url: '/detalheNoticia',
        params: { id: null, },
        views: {
          'side-menu21': {
            templateUrl: 'templates/noticias/notCia.html',
            controller: 'notCiaCtrl',
          }
        }
      })
      .state('notCia', {
        url: '/detalheNoticia',
        params: { id: null, },
        templateUrl: 'templates/notCia.html',
        controller: 'notCiaCtrl',

      })

      .state('menu.detalheDoEvento', {
        url: '/detalheEvento',
        params: { id: null, },
        views: {
          'side-menu21': {
            templateUrl: 'templates/eventos/detalheDoEvento.html',
            controller: 'detalheDoEventoCtrl',
          }
        }
      })

      .state('detalheDoEvento', {
        url: '/detalheEvento',
        params: { id: null, },
        templateUrl: 'templates/eventos/detalheDoEvento.html',
        controller: 'detalheDoEventoCtrl'

      })

      .state('menu.detalheDoConvNio', {
        url: '/detalheConvenio',
        params: { id: null, },
        views: {
          'side-menu21': {
            templateUrl: 'templates/convenios/detalheDoConvNio.html',
            controller: 'detalheDoConvNioCtrl',
          }
        }
      })

      .state('detalheDoConvNio', {
        url: '/detalheConvenio',
        params: { id: null, },        
        templateUrl: 'templates/convenios/detalheDoConvNio.html',
        controller: 'detalheDoConvNioCtrl',      
      })

      .state('menu.mural', {
        url: '/detalheMural',
        params: { id: null, },
        views: {
          'side-menu21': {
            templateUrl: 'templates/fique_por_dentro/mural.html',
            controller: 'muralCtrl'
          }
        }
      })

      .state('menu.meuCadastroNaAMPEB', {
        url: '/meuCadastro',
        views: {
          'side-menu21': {
            templateUrl: 'templates/meu_cadastro/meuCadastroNaAMPEB.html',
            controller: 'meuCadastroNaAMPEBCtrl'
          }
        }
      })

      .state('menu.listaDeContatos', {
        url: '/listaContatos',
        views: {
          'side-menu21': {
            templateUrl: 'templates/meu_cadastro/contato/listaDeContatos.html',
            controller: 'listaDeContatosCtrl'
          }
        }
      })

      .state('menu.dependentesAtivos', {
        url: '/dependentesAtivos',
        views: {
          'side-menu21': {
            templateUrl: 'templates/meu_cadastro/dependentes/dependentesAtivos.html',
            controller: 'dependentesAtivosCtrl'
          }
        }
      })

      .state('menu.contatosAMPEB', {
        url: '/contatosAmpeb',
        views: {
          'side-menu21': {
            templateUrl: 'templates/contatos_ampeb/contatosAMPEB.html',
            controller: 'contatosAMPEBCtrl'
          }
        }
      })

      .state('menu.listaDeEndereOs', {
        url: '/listaEnderecos',
        views: {
          'side-menu21': {
            templateUrl: 'templates/meu_cadastro/enderecos/listaDeEndereOs.html',
            controller: 'listaDeEndereOsCtrl'
          }
        }
      })

      .state('menu.listaDeConvNios', {
        url: '/listaConvenios',
        params: { idTipoConvenio: null, nmConvenio: null, nmMunicipio: null },
        views: {
          'side-menu21': {
            templateUrl: 'templates/convenios/listaDeConvNios.html',
            controller: 'listaDeConvNiosCtrl',
          }
        }
      })
      .state('listaDeConvNios', {
        url: '/listaConvenios',
        params: { idTipoConvenio: null, nmConvenio: null, nmMunicipio: null },
        templateUrl: 'templates/convenios/listaDeConvNios.html',
        controller: 'listaDeConvNiosCtrl'
      })

      .state('menu.enquete', {
        url: '/enquete',
        params: { id: null, dataExpiracao: null, flVotada: null },
        views: {
          'side-menu21': {
            templateUrl: 'templates/enquete/enquete.html',
            controller: 'enqueteCtrl'
          }
        }
      })

      .state('menu.resultadoDaEnquete', {
        url: '/resultadoEnquete',
        params: { id: null, flVotada: null },
        views: {
          'side-menu21': {
            templateUrl: 'templates/enquete/resultadoDaEnquete.html',
            controller: 'resultadoDaEnqueteCtrl'
          }
        }
      })

      .state('menu.alterarASenha', {
        url: '/alterarSenha',
        views: {
          'side-menu21': {
            templateUrl: 'templates/alterar_senha/alterarASenha.html',
            controller: 'alterarASenhaCtrl'
          }
        }
      })

      .state('esqueceuASenha', {
        url: '/esqueceuSenha',
        templateUrl: 'templates/esqueceu_senha/esqueceuASenha.html',
        controller: 'esqueceuASenhaCtrl'
      })

      .state('menu.transmissOAoVivo', {
        url: '/transmissao',
        views: {
          'side-menu21': {
            templateUrl: 'templates/transmissao_ao_vivo/transmissOAoVivo.html',
            controller: 'transmissOAoVivoCtrl'
          }
        }
      })

      .state('menu.contato', {
        url: '/contato',
        params: { id_associados_contatos_telefonicos: null, id_tipo_contatos_telefonicos: null, principal: null, permitir_divulgar: null, numero_contato: null, id_operadora_telefones: null, observacao: null },
        views: {
          'side-menu21': {
            templateUrl: 'templates/meu_cadastro/contato/contato.html',
            controller: 'contatoCtrl',
          }
        }
      })

      .state('menu.buscarConvNios', {
        url: '/filtrarConvenios',
        views: {
          'side-menu21': {
            templateUrl: 'templates/convenios/buscarConvNios.html',
            controller: 'buscarConvNiosCtrl'
          }
        }
      })
      .state('buscarConvNios', {
        url: '/filtrarConvenios',
        templateUrl: 'templates/convenios/buscarConvNios.html',
        controller: 'buscarConvNiosCtrl'

      })

      .state('menu.endereO', {
        url: '/endereco',
        params: { id_associados_enderecos: null, id_tipo_endereco: null, principal: null, descricao_endereco: null, id_estado: null, id_municipio: null, ponto_de_referencia: null, observacoes: null, chave_externa: null },
        views: {
          'side-menu21': {
            templateUrl: 'templates/meu_cadastro/enderecos/endereO.html',
            controller: 'endereOCtrl'
          }
        }
      })

      .state('menu.dadosPessoais', {
        url: '/dadosPessoais',
        views: {
          'side-menu21': {
            templateUrl: 'templates/meu_cadastro/dados_pessoais/dadosPessoais.html',
            controller: 'dadosPessoaisCtrl'
          }
        }
      })
      .state('menu.novidadesConvenios', {
        url: '/novidadesConvenios',
        views: {
          'side-menu21': {
            templateUrl: 'templates/convenios/novidadesConvenios.html',
            controller: 'novidadesConveniosCtrl'
          }
        }
      })
      .state('menu.novidadesConveniosDetalhe', {
        url: '/novidadesConveniosDetalhe',
        views: {
          'side-menu21': {
            templateUrl: 'templates/convenios/novidadesConveniosDetalhe.html',
            controller: 'novidadesConveniosDetalheCtrl'
          }
        }
      })
      .state('menu.listaEventos', {
        url: '/listaEventos',
        views: {
          'side-menu21': {
            templateUrl: 'templates/lista_eventos/listaEventos.html',
            controller: 'listaEventosCtrl'
          }
        }
      })
      .state('menu.listaPresencaConfirmada', {
        url: '/listaPresencaConfirmada',
        params: { id_evento: null },
        views: {
          'side-menu21': {
            templateUrl: 'templates/lista_eventos/listaPresencaConfirmada.html',
            controller: 'listaPresencaConfirmadaCtrl'
          }
        }
      })
      .state('menu.buscaDeAssociado', {
        url: '/buscaDeAssociado',
        views: {
          'side-menu21': {
            templateUrl: 'templates/busca_associado/buscaDeAssociado.html',
            controller: 'buscaDeAssociadoCtrl'
          }
        }
      })

      .state('menu', {
        url: '/side-menu21',
        templateUrl: 'templates/menu/menu.html',
        controller: 'menuCtrl'
      })

      .state('menu.catalogoDeAssociado', {
        url: '/catalogoDeAssociado',
        params: { nome: null, id_estado: null, id_cidade: null,  mes_anivesario: null, ano_posse: null  },
        views: {
          'side-menu21': {
            templateUrl: 'templates/busca_associado/catalogoDeAssociado.html',
            controller: 'catalogoDeAssociadoCtrl'
          }
        }
      })

      .state('menu.carteiraVirtual', {
        url: '/carteiraVirtual',
        views: {
          'side-menu21': {
            templateUrl: 'templates/carteira_ampeb/carteiraVirtual.html',
            controller: 'carteiraVirtualCtrl'
          }
        }
      })

      .state('menu.declaraODeAssociadoAMPEB', {
        url: '/declaraODeAssociadoAMPEB',
        views: {
          'side-menu21': {
            templateUrl: 'templates/documentos/declaraODeAssociadoAMPEB.html',
            controller: 'declaraODeAssociadoAMPEBCtrl'
          }
        }
      })

      .state('menu.informePlanoDeSaDeSulAmerica', {
        url: '/informePlanoDeSaDeSulAmerica',
        views: {
          'side-menu21': {
            templateUrl: 'templates/documentos/informePlanoDeSaDeSulAmerica.html',
            controller: 'informePlanoDeSaDeSulAmericaCtrl'
          }
        }
      })

      .state('menu.emissODeDocumentos', {
        url: '/emissODeDocumentos',
        views: {
          'side-menu21': {
            templateUrl: 'templates/documentos/emissODeDocumentos.html',
            controller: 'emissODeDocumentosCtrl'
          }
        }
      })

      .state('menu.home', {
        url: '/paginaInicial',
        params: { user: null },
        views: {
          'side-menu21': {
            templateUrl: 'templates/pagina_inicial/aMPEB.html',
            controller: 'aMPEBCtrl'
          }
        }
      })
      .state('menu.informacoesAssociado', {
        url: '/informacoesAssociado',
        params: { id: null },
        views: {
          'side-menu21': {
            templateUrl: 'templates/busca_associado/informacoesAssociado.html',
            controller: 'informacoesAssociadoCtrl'
          }
        }
      })
      .state('menu.conveniosProximos', {
        url: '/conveniosProximos',
        params: { raio: null },
        views: {
          'side-menu21': {
            templateUrl: 'templates/convenios/conveniosProximos.html',
            controller: 'conveniosProximosCtrl',
          }
        }
      })

      .state('conveniosProximos', {
        url: '/conveniosProximos',
        params: { raio: null},        
        templateUrl: 'templates/convenios/conveniosProximos.html',
        controller: 'conveniosProximosCtrl',      
      })
      .state('menu.aniversariantes', {
        url: '/aniversariantes',
        params: { id: null, },
        views: {
          'side-menu21': {
            templateUrl: 'templates/aniversariantes/aniversariantes.html',
            controller: 'aniversariantesCtrl',
          }
        }
      })
      .state('menu.carteiraVirtualDependentes', {
        url: '/carteiraVirtualDependentes',
        params: { dependente: null },
        views: {
          'side-menu21': {
            templateUrl: 'templates/carteira_ampeb/carteiraVirtualDependentes.html',
            controller: 'carteiraVirtualDependentesCtrl'
          }
        }
      })

    $urlRouterProvider.otherwise('/login')


  });