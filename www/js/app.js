// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js


angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives', 'app.services', 'ngCordova', 'app.constants', 'ngMask', 'sqlite', 'ionicImgCache', 'ngMessages'])

  .config(function ($ionicConfigProvider, $sceDelegateProvider) {


    $sceDelegateProvider.resourceUrlWhitelist(['self', '*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

  }).config(function (ionicImgCacheProvider) {
    // Enable imgCache debugging.
    ionicImgCacheProvider.debug(false);

    // Set storage size quota to 100 MB.
    ionicImgCacheProvider.quota(500);

    // Set foleder for cached files.
    //ionicImgCacheProvider.folder('my-cache');
  }).config(function ($provide, $httpProvider) {

    // Intercept http calls.
    $provide.factory('MyHttpInterceptor', function ($q, $injector) {
      return {
        // On request success
        request: function (config) {
          // console.log(config); // Contains the data about the request before it is sent.
          // Return the config or wrap it in a promise if blank.
          return config || $q.when(config);
        },

        // On request failure
        requestError: function (rejection) {
          // console.log(rejection); // Contains the data about the error on the request.
          // Return the promise rejection.
          return $q.reject(rejection);
        },

        // On response success
        response: function (response) {
          // console.log(response); // Contains the data from the response.
          // Return the response or promise.
          return response || $q.when(response);
        },

        // On response failture
        responseError: function (rejection) {
          
          var $ionicPopup = $injector.get('$ionicPopup');
          var LOCAL_STORAGE = $injector.get('LOCAL_STORAGE');
          var $state = $injector.get('$state');
          var $ionicLoading = $injector.get('$ionicLoading');

          //Tratamento de erros em caso de invalidez do token
          if (rejection.data.code == "jwt_auth_invalid_token") {

            var statusToken = window.localStorage.getItem(LOCAL_STORAGE.statusToken);

            if (statusToken == "true") {
             
               //Para não exibir o alert mais de uma vez
              window.localStorage.setItem(LOCAL_STORAGE.statusToken, "false");
              //Remove o spinig que estasendo exibido na tela
              $ionicLoading.hide();

              //Pegando usuar803io e senha da sessão para obter um novo token
              var alertPopup = $ionicPopup.alert({
                title: 'Prezado(a), seu login expirou',
                template: 'Você será redirecionado(a) para a tela de login.',
                okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
              });

              alertPopup.then(function (res) {
              
                //Removendo dados da sessão
                window.localStorage.removeItem(LOCAL_STORAGE.local_dados_key);
                window.localStorage.removeItem(LOCAL_STORAGE.manter_logado);
                window.localStorage.removeItem(LOCAL_STORAGE.usuarioObterToken);
                window.localStorage.removeItem(LOCAL_STORAGE.senhaObterToken);

                //Setando o token como vazio para permitir obter somente as noticias e eventos publicos
                window.localStorage.setItem(LOCAL_STORAGE.local_token, "");
                window.localStorage.setItem(LOCAL_STORAGE.tipo_retorno_post, 'publish');
                window.localStorage.setItem(LOCAL_STORAGE.filtro_retorno_post, '&status=publish');
                
                //Redireciona para pagina de login
                $state.go('aMPEBAPP');

              });
            }

          }else if (rejection.data.code.indexOf("incorrect_password") != -1) {

            var statusToken = window.localStorage.getItem(LOCAL_STORAGE.statusToken);
          
            if (statusToken == "true") {              

              //Para não exibir o alert mais de uma vez
              window.localStorage.setItem(LOCAL_STORAGE.statusToken, "false");
              //Remove o spinig que estasendo exibido na tela
              $ionicLoading.hide();

              var alertPopup = $ionicPopup.alert({
                title: 'Prezado(a), sua senha está incorreta para acessar o aplicativo.',
                template: 'Você será redirecionado(a) para a tela de login.',
                okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
              });
            
              alertPopup.then(function (res) {
              
                //Removendo dados da sessão
                window.localStorage.removeItem(LOCAL_STORAGE.local_dados_key);
                window.localStorage.removeItem(LOCAL_STORAGE.manter_logado);
                window.localStorage.removeItem(LOCAL_STORAGE.usuarioObterToken);
                window.localStorage.removeItem(LOCAL_STORAGE.senhaObterToken);

                //Setando o token como vazio para permitir obter somente as noticias e eventos publicos
                window.localStorage.setItem(LOCAL_STORAGE.local_token, "");
                window.localStorage.setItem(LOCAL_STORAGE.tipo_retorno_post, 'publish');
                window.localStorage.setItem(LOCAL_STORAGE.filtro_retorno_post, '&status=publish');
                
                //Redireciona para pagina de login
                $state.go('aMPEBAPP');

              });
            }
          }else{

              //Pegando usuar803io e senha da sessão para obter um novo token
              var alertPopup = $ionicPopup.alert({
                title: 'Ocorreu um erro, entre contato com a administração do aplicativo',
                template: JSON.stringify(rejection),
                okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
              });

          }
          return $q.reject(rejection);
        }
      };
    });

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('MyHttpInterceptor');

  })
  .run(function ($ionicPlatform, $cordovaSQLite,$ionicPopup,$injector,LOCAL_STORAGE) {
    $ionicPlatform.ready(function () {
        var $state = $injector.get('$state');
      // Enable to debug issues.
      // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
      
      //Push notifications config
      var notificationOpenedCallback = function (jsonData) {
        //console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    
        //Verifica se está logado
        var tipo_retorno_post =  window.localStorage.getItem(LOCAL_STORAGE.tipo_retorno_post);
        //tratamento feito provisóriamente para saber quando é uma novidade
        if(tipo_retorno_post != 'publish'){
          if(jsonData.notification.payload.additionalData.cat ==""){                 
            $state.go('menu.novidadesConveniosDetalhe', { id: jsonData.notification.payload.additionalData.id_post, isPush: true });
          }
        }else{

            var alertPopup = $ionicPopup.alert({
              title: 'Autenticação Necessária!',
              template: 'É necessário estar logado para ver este conteúdo.',
              okText: 'Ok', 
              okType: 'button-assertive', 
            });

        }
     

      };
   // .startInit("b47e67f6-405e-4041-9597-571b12e2f80d")
   //.startInit("774c0150-e398-4ed0-a600-e9d32ac8a6b5")
      window.plugins.OneSignal    
       .startInit("774c0150-e398-4ed0-a600-e9d32ac8a6b5")
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();

      // Call syncHashedEmail anywhere in your app if you have the user's email.
      // This improves the effectiveness of OneSignal's "best-time" notification scheduling feature.
      // window.plugins.OneSignal.syncHashedEmail(userEmail);
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)

      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      var db = null;
      if (window.cordova) {
        // used in cell phones
        db = $cordovaSQLite.openDB({ name: "my.db", location: 'default' });
      } else {
        // used in web browsers
        db = window.openDatabase("my.db", "1.0", "AmpebApp", -1);
      }

      //Criando tabelas
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS noticia (id integer primary key, dsCategoria varchar(50), dsTitulo varchar(250), dsNoticia text, dtNoticia text, dsUrlImagem text, flLido integer, status varchar(25), dtAtualizacao text, tpConsulta integer)");
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS fique_por_dentro (id integer primary key, dsCategoria varchar(50), dsTitulo varchar(250), dsNoticia text, dtNoticia text, dsUrlImagem text, flLido integer, status varchar(25), dtAtualizacao text)");
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS evento (id integer primary key, dsCategoria varchar(50), dsTitulo varchar(250), dsNoticia text, dtNoticia text, dsUrlImagem text, flLido integer, status varchar(25), dtAtualizacao text, tpConsulta integer)");
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS municipio_convenio (id integer primary key, nmMunicipioConvenio varchar(100))");
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS tipo_convenio (id integer primary key, nmTipoConvenio varchar(50), flPrivado integer, dsUrlImagem text)");
      
      $cordovaSQLite.execute(db, "DROP TABLE IF EXISTS convenio"); //Tratamento para atualizar novas colunas nas tabelas em dispositivos que ja tem o app instalado
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS convenios (id integer primary key, nmConvenio varchar(100), dsUrlImagem text, dsConvenio text, nmContato varchar(100), dsTelefone text, dsEmail varchar(100), urlSite varchar(100), dsEndereco varchar(200), dtInicioVigencia text, dtTerminoVigencia text NULL, dsDesconto varchar(100),flPublicar integer, idTipoConvenio integer, nmMunicipio varchar(100), nmEstado varchar(50), flPrivado integer, nmPais varchar(50), urlAnexo text, latitude varchar(50), longitude varchar(50))");
      $cordovaSQLite.execute(db, "DROP TABLE IF EXISTS enquetes"); //Tratamento para atualizar novas colunas nas tabelas em dispositivos que ja tem o app instalado
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS enquete (id integer primary key, dsEnquete varchar(250), totalVotos integer, totalVotantes integer, dtCadastro text, dtExpiracao text, flAtivo int, flLido integer, flVotada integer)");
      
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS novidadesConvenios (id integer primary key, id_convenio integer, dtCadastro text, nmConvenio varchar(100), dsTitulo varchar(150), dsNovidade text, dtPublicacao text, dtExpiracao text, dsUrlImagem text, dsUrlPdf text, flLido integer, dtAtualizacao text)");

      //Apagando dados sempre que inicializar o app   
      $cordovaSQLite.execute(db, "DELETE FROM municipio_convenio");
      $cordovaSQLite.execute(db, "DELETE FROM tipo_convenio");
      $cordovaSQLite.execute(db, "DELETE FROM convenio");


    });


  })

  /*
    This directive is used to disable the "drag to open" functionality of the Side-Menu
    when you are dragging a Slider component.
  */
  .directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function ($ionicSideMenuDelegate, $rootScope) {
    return {
      restrict: "A",
      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

        function stopDrag() {
          $ionicSideMenuDelegate.canDragContent(false);
        }

        function allowDrag() {
          $ionicSideMenuDelegate.canDragContent(true);
        }

        $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
        $element.on('touchstart', stopDrag);
        $element.on('touchend', allowDrag);
        $element.on('mousedown', stopDrag);
        $element.on('mouseup', allowDrag);

      }]
    };
  }])

  /*
    This directive is used to open regular and dynamic href links inside of inappbrowser.
  */
  .directive('hrefInappbrowser', function () {
    return {
      restrict: 'A',
      replace: false,
      transclude: false,
      link: function (scope, element, attrs) {
        var href = attrs['hrefInappbrowser'];

        attrs.$observe('hrefInappbrowser', function (val) {
          href = val;
        });

        element.bind('click', function (event) {

          window.open(href, '_system', 'location=yes');

          event.preventDefault();
          event.stopPropagation();

        });
      }
    };
  });
