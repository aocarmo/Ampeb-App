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
    urlServicosPortalNoticias: 'http://www.ampeb.org.br/homologacao/wp-json/wp/v2/posts?taxonomies=noticias&per_page=18&categories_exclude=50',
    urlServicosPortalEventos: 'http://www.ampeb.org.br/homologacao/wp-json/wp/v2/posts?taxonomies=noticias&per_page=18&categories=50',
    urlServicosPortalMedia: 'http://www.ampeb.org.br/homologacao/wp-json/wp/v2/media/',
    urlServicosPortalCategoria: 'http://www.ampeb.org.br/homologacao/wp-json/wp/v2/categories?post=',
    urlImagemTipoConvenio: 'http://ampebteste.web2319.uni5.net/homologacao_sistema/anexos/imagens_tipo_convenio/',
    urlImagemConvenio: 'http://ampebteste.web2319.uni5.net/homologacao_sistema/anexos/imagens_convenio/'

}).constant('LOCAL_STORAGE', {
    local_dados_key: 'dadosUsuario',
    manter_logado: 'manter_logado',
    url_foto:   'http://ampebteste.web2319.uni5.net/homologacao_sistema/'
});

