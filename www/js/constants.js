angular.module('app.constants', [])
 
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
 
.constant('USER_ROLES', {
  admin: 'admin_role',
  public: 'public_role'
})
.constant('WEB_METODOS', {
  urlServicosSistema: 'https://ssl-369102.uni5.net/homologacao_sistema/index.php/ws/initWS',
  urlRecuperarSenha: 'https://ssl-369102.uni5.net/homologacao_sistema/index.php/login/enviaEmail',    
  urlServicosPortalEventos: 'https://www.ampeb.org.br/homologacao/wp-json/rest-api-ampeb/v1/posts?_embed&categories=50&per_page=15',
  urlServicosPortalNoticias: 'https://www.ampeb.org.br/homologacao/wp-json/rest-api-ampeb/v1/posts?_embed&categories_exclude=50,203&per_page=15', 
  urlServicosPortalFiquePorDentro: 'https://www.ampeb.org.br/homologacao/wp-json/rest-api-ampeb/v1/posts?_embed&categories=203&status=private,publish&per_page=15',
  urlImagemTipoConvenio: 'https://ssl-369102.uni5.net/homologacao_sistema/anexos/imagens_tipo_convenio/',
  urlImagemConvenio: 'https://ssl-369102.uni5.net/homologacao_sistema/anexos/imagens_convenio/',
  urlObterToken: 'https://www.ampeb.org.br/homologacao/wp-json/jwt-auth/v1/token',
  urlObterEnquete: 'https://www.ampeb.org.br/homologacao/wp-json/rest-api-ampeb/v1/polls',
  urlVotarEnquete: 'https://www.ampeb.org.br/homologacao/wp-json/rest-api-ampeb/v1/polls/vote/',
  urlServicoTransmissaoAoVivo: 'https://www.ampeb.org.br/homologacao/'

}).constant('LOCAL_STORAGE', {
    local_dados_key: 'dadosUsuario',
    manter_logado: 'manter_logado',
    url_foto:   'https://ssl-369102.uni5.net/homologacao_sistema/',
    local_token: 'token',
    tipo_retorno_post: 'tipo',
    filtro_retorno_post: 'filtroRetornoPost',
    usuarioObterToken: 'usuario',
    senhaObterToken: 'senha',
    statusToken: 'statusToken'

});

