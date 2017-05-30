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
    urlServicosSistema: 'http://ampebteste.web2319.uni5.net/homologacao_sistema/index.php/ws/initWS',
    urlRecuperarSenha: 'http://ampebteste.web2319.uni5.net/homologacao_sistema/index.php/login/enviaEmail',    
    urlServicosPortalEventos: 'http://www.ampeb.org.br/homologacao/wp-json/wp/v2/posts?_embed&categories=50&per_page=20',
    urlServicosPortalNoticias: 'http://www.ampeb.org.br/homologacao/wp-json/wp/v2/posts?_embed&categories_exclude=50,196&per_page=20', 
    urlImagemTipoConvenio: 'http://ampebteste.web2319.uni5.net/homologacao_sistema/anexos/imagens_tipo_convenio/',
    urlImagemConvenio: 'http://ampebteste.web2319.uni5.net/homologacao_sistema/anexos/imagens_convenio/'

}).constant('LOCAL_STORAGE', {
    local_dados_key: 'dadosUsuario',
    manter_logado: 'manter_logado',
    url_foto:   'http://ampebteste.web2319.uni5.net/homologacao_sistema/'
});

