// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives', 'app.services', 'ngCordova', 'app.constants', 'ngMask', 'sqlite','ionicImgCache','ngMessages'])

.config(function($ionicConfigProvider, $sceDelegateProvider){
  

  $sceDelegateProvider.resourceUrlWhitelist([ 'self','*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

}).config(function(ionicImgCacheProvider) {
    // Enable imgCache debugging.
    ionicImgCacheProvider.debug(false);

    // Set storage size quota to 100 MB.
    ionicImgCacheProvider.quota(500);
    
    // Set foleder for cached files.
    //ionicImgCacheProvider.folder('my-cache');
  })

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
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

    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS noticia (id integer primary key, dsCategoria varchar(50), dsTitulo varchar(250), dsNoticia text, dtNoticia text, dsUrlImagem text, flLido integer)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS evento (id integer primary key, dsCategoria varchar(50), dsTitulo varchar(250), dsNoticia text, dtNoticia text, dsUrlImagem text, flLido integer)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS municipio_convenio (id integer primary key, nmMunicipioConvenio varchar(100))");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS tipo_convenio (id integer primary key, nmTipoConvenio varchar(50), flPrivado integer, dsUrlImagem text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS convenio (id integer primary key, nmConvenio varchar(100), dsUrlImagem text, dsConvenio text, nmContato varchar(100), dsTelefone text, dsEmail varchar(100), urlSite varchar(100), dsEndereco varchar(200), dtInicioVigencia text, dtTerminoVigencia text NULL, dsDesconto varchar(100),flPublicar integer, idTipoConvenio integer, nmMunicipio varchar(100), nmEstado varchar(50), flPrivado integer)");
  

  });
})

/*
  This directive is used to disable the "drag to open" functionality of the Side-Menu
  when you are dragging a Slider component.
*/
.directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function($ionicSideMenuDelegate, $rootScope) {
    return {
        restrict: "A",  
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            function stopDrag(){
              $ionicSideMenuDelegate.canDragContent(false);
            }

            function allowDrag(){
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
.directive('hrefInappbrowser', function() {
  return {
    restrict: 'A',
    replace: false,
    transclude: false,
    link: function(scope, element, attrs) {
      var href = attrs['hrefInappbrowser'];

      attrs.$observe('hrefInappbrowser', function(val){
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