﻿angular.module('app.controllers', [])
  
.controller('aMPEBCtrl', ['$scope', '$stateParams','$state','$q', '$cordovaCamera','$ionicPopup','LOCAL_STORAGE','$timeout','noticiasFactory','eventosFactory','obterNoticiasService','obterEventosService','obterEventosServiceRefresh','obterNoticiasServiceRefresh','atualizarFotoAssociado','$cordovaNetwork','$ionicLoading','$ionicHistory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state, $q,$cordovaCamera, $ionicPopup, LOCAL_STORAGE,$timeout,noticiasFactory,eventosFactory,obterNoticiasService,obterEventosService,obterEventosServiceRefresh,obterNoticiasServiceRefresh,atualizarFotoAssociado,$cordovaNetwork,$ionicLoading,$ionicHistory) {
    
  
   /***************** Bloco para atualizações de notificações ********************/
     /* $scope.$on('$ionicView.beforeLeave', function() {
           //do your stuff after leaving
           Função para sempre fazer algo apos sair da pagina.

    });*/
    //Função para sempre fazer algo apos entrar na pagina.
    $scope.$on('$ionicView.beforeEnter', function() {
       $scope.obterNotificacoes(); 
      
    });

    
    
    //Funcao para obter as notificacoes de noticias
    $scope.obterNotificacoes = function() {  
            //Pega a quantidade de noticias não lidas
          var qtdNoticias =    noticiasFactory.obterQtdNoticiaNaoLida().then(function (qtdNoticiaNaoLida) {    
            return qtdNoticiaNaoLida;
        });     
        //Pega a quantidade de eventos não lidos
        
          var qtdEventos = eventosFactory.obterQtdEventosNaoLido().then(function (qtdEventoNaoLido) {    
            return qtdEventoNaoLido;
        });   
        
        var retornoNotificacoes = [];

          //Pega o retorno de forma sincrona do ajax.
         $q.all([qtdNoticias, qtdEventos]).then(function(result){
            for (var i = 0; i < result.length; i++){
                retornoNotificacoes.push(result[i]);
            }
          
            if(retornoNotificacoes[0] != null && retornoNotificacoes[1] != null){
                //Testa caso o a quantidade seja maior que 0 exibe os itens não lidos.

                if(retornoNotificacoes[0][0].qtdNoticiasNaoLidas > 0){
                    //Seta o span com a quantodade notificaoes
                     document.getElementById("noticiasBadge").textContent=retornoNotificacoes[0][0].qtdNoticiasNaoLidas;
                }else{
                    document.getElementById("noticiasBadge").textContent="";
                }

               if(retornoNotificacoes[1][0].qtdEventosNaoLidos > 0){
                    document.getElementById("eventosBadge").textContent=retornoNotificacoes[1][0].qtdEventosNaoLidos;
                }else{
                    document.getElementById("eventosBadge").textContent="";
                }
                
             }

        });     

       
    };  
        //Função para buscar novos dados.
        $scope.refresh = function() {
           
            $timeout( function() {
                var noticias =  obterNoticiasServiceRefresh.obterNoticiasOnlineRefresh().then(function (dadosNoticia) {    
                    return dadosNoticia;
                });  

                var eventos =  obterEventosServiceRefresh.obterEventosOnlineRefresh().then(function (dadosEvento) {

                    return dadosEvento;
                });     

                var retornos = [];

                $q.all([eventos,noticias]).then(function(result){
                   
                    for (var i = 0; i < result.length; i++){
                        retornos.push(result[i]);
                    }
                 
                    if(retornos[0] != null && retornos[1] != null){
                        //Setando a variavel de sessão para informar ao controller de cada tela para buscar a informação atualizada do banco.
                         window.localStorage.setItem("eventos", true);
                         window.localStorage.setItem("noticias", true);
                        $scope.obterNotificacoes();
                    }
                });

                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            
            }, 3000);
            
        };
        
        
   //Atualizando os dados para exibir notificaçoess
    $scope.atualizarDados = function() {           

         var noticias =  obterNoticiasService.obterNoticiasOnline().then(function (dadosNoticia) {    
            return dadosNoticia;
        });     

          var eventos =  obterEventosService.obterEventosOnline().then(function (dadosEvento) {    
            return dadosEvento;
        });     

        var retornos = [];

        $q.all([noticias, eventos]).then(function(result){
            for (var i = 0; i < result.length; i++){
                retornos.push(result[i]);
            }
             if(retornos[0] != null && retornos[1] != null){
               $scope.obterNotificacoes();
             }
        });

    }

    //Sempre que entrar na tela inicial busca novos dados.
    $scope.atualizarDados();

    /***************** Fim do Bloco para atualizações de notificações ********************/


    /*****************  Bloco para login e logout ********************/
    //Pegando dados do usuário da sessão
    $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));
   
    //Verifica se existe foto, caso não exista exbir icone de camera
    if ($scope.dadosUsuario.foto_associado != "") {
      //Colocado para burlar o cache da imagem
        $scope.fotoUsuario = LOCAL_STORAGE.url_foto + $scope.dadosUsuario.foto_associado+ '?decache=' + Math.random();
      
    } else {
        $scope.fotoUsuario = "img/icone_foto.png";
    }

    //Função para deslogar
    $scope.logout = function () {
        //Removendo dados da sessão
        window.localStorage.removeItem(LOCAL_STORAGE.local_dados_key);
        window.localStorage.removeItem(LOCAL_STORAGE.manter_logado);        
        window.localStorage.removeItem("noticias");
        window.localStorage.removeItem("eventos");
        
        $state.go('aMPEBAPP');
    }
        
    /*****************  Fim do Bloco para login e logout ********************/
       
    /*****************  Bloco para alteração de foto do perfil ********************/   
	$scope.alterarFoto  = function(){
        //Caso exista conexão com a internet atualiza a foto
        if ($cordovaNetwork.isOnline()) {

            var options = {
                'buttonLabels': ['Tirar Foto', 'Escolher da Galeria'],
                'addCancelButtonWithLabel': 'Cancelar'
            };
            window.plugins.actionsheet.show(options, function (_btnIndex) {
                if (_btnIndex === 1) {
                    $scope.tirarFoto();
                } else if (_btnIndex === 2) {
                    $scope.escolherFoto();
                }
            });

        }else{
              var alertPopup = $ionicPopup.alert({
                    title: 'Sem conexão com a internet.',
                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                    });
        }
    }


    $scope.tirarFoto = function () {
        var options = {
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 250,
            targetHeight: 250,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
        //Caso precise exibir a imagem na tela imagem:  "data:image/jpeg;base64," + imageData}
        //Pegando o cpf do associado e a foto.
            var data = {cpf: $scope.dadosUsuario.cpf, imagem: imageData};            
                 
                $ionicLoading.show({template: 'Atualizando sua foto...'}).then(function (){
                    
                    atualizarFotoAssociado.atualizar(data).then(function (dados){ 
                                          
                       if(dados.data.result == true){
                            //Colocado para burlar o cache da imagem
                             $scope.fotoUsuario = LOCAL_STORAGE.url_foto + $scope.dadosUsuario.foto_associado+ '?decache=' + Math.random();
                        }         
                       
                    }).finally(function () {
                    //em qualquer caso remove o spinner de loading   
                        $ionicLoading.hide();         
                    });
                });       

        }, function (err) {
            // error
        });
    }

    $scope.escolherFoto = function () {
        var options = {
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 250,
            targetHeight: 250,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {           
            //Caso precise exibir a imagem na tela imagem:  "data:image/jpeg;base64," + imageData}
            //Pegando o cpf do associado e a foto.
            var data = {cpf: $scope.dadosUsuario.cpf, imagem: imageData};            
                 
                $ionicLoading.show({template: 'Atualizando sua foto...'}).then(function (){
                    
                    atualizarFotoAssociado.atualizar(data).then(function (dados){ 
                                          
                       if(dados.data.result == true){
                            //Colocado para burlar o cache da imagem
                             $scope.fotoUsuario = LOCAL_STORAGE.url_foto + $scope.dadosUsuario.foto_associado+ '?decache=' + Math.random();
                        }         
                       
                    }).finally(function () {
                    //em qualquer caso remove o spinner de loading   
                        $ionicLoading.hide();         
                    });
                });       

                  
              
        }, function (err) {
            // error
        });
    }
/***************** Fim do  Bloco para alteração de foto do perfil ********************/   
    $scope.registarAssembleia = function () {

        $scope.data = {}

        var alertPopup = $ionicPopup.alert({

            title: 'Presença confirmada.',

            okText: 'OK', // String (default: 'OK'). The text of the OK button.

            okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.


        });

        alertPopup.then(function (res) {

         

        });
        
    }


}])   
.controller('aMPEBAPPCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading', 'LoginService','LOCAL_STORAGE','$cordovaNetwork',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading, LoginService,LOCAL_STORAGE,$cordovaNetwork) {
  
    $scope.data = {};    
    var manteLogado =  window.localStorage.getItem(LOCAL_STORAGE.manter_logado);
  
    if(manteLogado == "true"){
        $state.go('aMPEB');
    }
   
    $scope.login = function (form,data) {

        if(form.$valid) {                    
                      
            if ($cordovaNetwork.isOnline()) {

                $ionicLoading.show({template: 'Autenticando...'}).then(function (){LoginService.logar(data).then(function (dados){
                 
                    if (dados.data.result == true) {

                        //Guardando as informações do usuario logado na sessão.
                        window.localStorage.setItem(LOCAL_STORAGE.local_dados_key, JSON.stringify(dados.data.data));
                      
                        if (data.manterConectado == true) {
                            window.localStorage.setItem(LOCAL_STORAGE.manter_logado, "true");
                              console.log(data.manterConectado);
                        }else{
                            window.localStorage.setItem(LOCAL_STORAGE.manter_logado, "false");
                              console.log(data.manterConectado);
                        }              
                        //Direciona para a tela inicial              
                        $state.go('aMPEB');
                    }else {
                        var alertPopup = $ionicPopup.alert({
                        title: 'Usuário ou senha inválidos!',
                        okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                        });
                    }
                    }).finally(function () {
                    //em qualquer caso remove o spinner de loading
                    $ionicLoading.hide();            
                    });
                });
            }else{

                var alertPopup = $ionicPopup.alert({
                    title: 'Não foi possível realizar login.',
                    template: 'Verifique sua conexão com ineternet.',
                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                });
            }
        }
    };
    
}])
   
.controller('notCiasCtrl', ['$scope', '$stateParams', 'obterNoticiasService','noticiasFactory', '$ionicPopup', 'LOCAL_STORAGE', '$ionicLoading','$cordovaNetwork','$ionicHistory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, obterNoticiasService, noticiasFactory, $ionicPopup, LOCAL_STORAGE, $ionicLoading, $cordovaNetwork, $ionicHistory) {
   
    //Verifica se estivar online pega dados via serviço 
    if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Buscando...'
        }).then(function () {
            //Verifica se e pra buscar a informação que foi atualizada recente.
            var atualizado = window.localStorage.getItem("noticias");

            //Caso verdadeiro busca a nova informação do contrario continua em cache
            if(atualizado){
                noticiasFactory.selectListaNoticias().then(function (dados) {
                         
                    $scope.listaNoticias = dados;
                    //Marcando noticias ja lidas
                    noticiasFactory.marcarNoticiasLidas().then(function (marcados) {
                       
                    });
                        
                }).finally(function () {
                    //em qualquer caso remove o spinner de loading
                    $ionicLoading.hide();
                });

            }else{
                obterNoticiasService.obterNoticiasOnline().then(function (dados) {

                    $scope.listaNoticias = dados;

                    noticiasFactory.marcarNoticiasLidas().then(function (marcados) {
                       
                    });

                }).finally(function () {
                    //em qualquer caso remove o spinner de loading
                    $ionicLoading.hide();
                });
            }

        });
    } else {
        //Pega dados do banco
        $ionicLoading.show({
            template: 'Buscando...'
        }).then(function () {
             noticiasFactory.selectListaNoticias().then(function (dados) {
             
                if (dados[0] == null) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Sem dados offline',
                        template: 'Por favor, conecte seu dispositivo a internet',
                        okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                    });

                    alertPopup.then(function (res) {


                        $backView = $ionicHistory.backView();
                        $backView.go();

                    });

                } else {
                    $scope.listaNoticias = dados;
                    noticiasFactory.marcarNoticiasLidas().then(function (marcados) {
                       
                    });
                }
               

            }).finally(function () {
                //em qualquer caso remove o spinner de loading
                $ionicLoading.hide();
            });

        });
    }

   
   // Pegando dados do usuário da sessão
    $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));
    
  
   
}])
   
.controller('prXimosEventosCtrl', ['$scope', '$stateParams', 'obterEventosService', '$ionicPopup', 'LOCAL_STORAGE', '$ionicLoading','$cordovaNetwork','$ionicHistory','eventosFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,obterEventosService, $ionicPopup, LOCAL_STORAGE, $ionicLoading, $cordovaNetwork, $ionicHistory,eventosFactory) {

 //Verifica se estivar online pega dados via serviço 
    if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Buscando...'
        }).then(function () {

            //Verifica se e pra buscar a informação que foi atualizada recente.
            var atualizado = window.localStorage.getItem("eventos");
            
            //Caso verdadeiro busca a nova informação do contrario continua em cache
            if(atualizado){

                eventosFactory.selectListaNoticias().then(function (dadosArmazenados) {
            
                    $scope.listaEventos = dadosArmazenados;
                    
                    eventosFactory.marcarEventosLidos().then(function (marcados) {
                        
                    });           

                }).finally(function () {
                    //em qualquer caso remove o spinner de loading
                    $ionicLoading.hide();
                });

            }else{
                obterEventosService.obterEventosOnline().then(function (dados) {

                    $scope.listaEventos = dados;
                
                    eventosFactory.marcarEventosLidos().then(function (marcados) {
                        
                    });     

                }).finally(function () {
                    //em qualquer caso remove o spinner de loading
                    $ionicLoading.hide();
                });
            }
            

        });
    } else {
        //Pega dados do banco
        $ionicLoading.show({
            template: 'Buscando...'
        }).then(function () {
            eventosFactory.selectListaNoticias().then(function (dadosArmazenados) {
             
                if (dadosArmazenados[0] == null) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Sem dados offline',
                        template: 'Por favor, conecte seu dispositivo a internet',
                        okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                    });

                    alertPopup.then(function (res) {

                        $backView = $ionicHistory.backView();
                        $backView.go();

                    });

                } else {
                    $scope.listaEventos = dadosArmazenados;
                    
                    marcarEventosLidos.marcar().then(function (marcados) {
                        
                    });
                }
               

            }).finally(function () {
                //em qualquer caso remove o spinner de loading
                $ionicLoading.hide();
            });

        });
    }

   
   // Pegando dados do usuário da sessão
    $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));

}])
   
.controller('meuMuralCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('notCiaCtrl', ['$scope', '$stateParams','$ionicLoading','noticiasFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, noticiasFactory) {
    $scope.noticia = {};
    //Pega dados do banco
    $ionicLoading.show({
        template: 'Buscando...'
    }).then(function () {

        noticiasFactory.selectNoticia($stateParams.id).then(function (dados) {        
         
            $scope.noticia = dados;

        }).finally(function () {
            //em qualquer caso remove o spinner de loading
            $ionicLoading.hide();
        });

    });
    
}])
   
.controller('detalheDoEventoCtrl', ['$scope', '$stateParams', '$ionicLoading','eventosFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicLoading, eventosFactory) {

    $scope.evento = {};
    //Pega dados do banco
    $ionicLoading.show({
        template: 'Buscando...'
    }).then(function () {
        eventosFactory.selectNoticia($stateParams.id).then(function (eventoBD) {
                 
            $scope.evento = eventoBD;

        }).finally(function () {
            //em qualquer caso remove o spinner de loading
            $ionicLoading.hide();
        });

    });


}])
   
.controller('detalheDoConvNioCtrl', ['$scope', '$stateParams', '$ionicLoading','conveniosFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, conveniosFactory) {

     $scope.convenios = {};

     //Pega dados do banco
    $ionicLoading.show({
        template: 'Buscando...'
    }).then(function () {
        conveniosFactory.selectConvenio(null,null,null,$stateParams.id).then(function (dados) {
                
            $scope.convenios = dados;
           
        }).finally(function () {
            //em qualquer caso remove o spinner de loading
            $ionicLoading.hide();
        });

    });


}])
   
.controller('muralCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('meuCadastroNaAMPEBCtrl', ['$scope', '$stateParams','$cordovaNetwork', '$ionicPopup','$ionicHistory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$cordovaNetwork,$ionicPopup,$ionicHistory) {
    //Caso não tenha conexção com a internet solicita ao usuario que conect antes de entrar
     if ($cordovaNetwork.isOffline()) {

         var alertPopup = $ionicPopup.alert({
                title: 'Não é possível visualizar seu cadastro na AMPEB.',    
                template: 'Por favor, conecte seu dispositivo a internet.',                  
                okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
            });

            alertPopup.then(function (res) {

                $backView = $ionicHistory.backView();
                $backView.go();

            });

     }
        

}])
   
.controller('listaDeContatosCtrl', ['$scope', '$stateParams','$ionicLoading','$ionicPopup','$cordovaNetwork','LOCAL_STORAGE','getDadosContatosAssociado','excluirDadosContatoAssociado', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading,$ionicPopup,$cordovaNetwork,LOCAL_STORAGE,getDadosContatosAssociado,excluirDadosContatoAssociado) {

    $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));

        $scope.$on('$ionicView.beforeEnter', function() {

        $scope.obterListaContatos(); 
        
        });

        $scope.obterListaContatos = function () {

            var data = {cpf : $scope.dadosUsuario.cpf};

            $scope.contatos = {};
                
                $ionicLoading.show({
                    template: 'Carregando...'
                }).then(function () {

                    getDadosContatosAssociado.obter(data).then(function (dadosContatos) {
                    
                        $scope.contatos = dadosContatos.data.data;

                    //Definindo os icones que serão apresentados de acordo com o tipo de endereço 
                        for (var i = 0; i < $scope.contatos.length; i++) {

                            if ($scope.contatos[i].id_tipo_contatos_telefonicos == 1){

                                $scope.contatos[i].icone_tipo_contato = "ion-iphone";
                                $scope.contatos[i].descricao_tipo_contato = "Cel - ";
                               
                               //Colocando a mascara
                                if($scope.contatos[i].numero_contato.length == 11){
                                    var numero = "(" + $scope.contatos[i].numero_contato.substring(0,2) + ") " + $scope.contatos[i].numero_contato.substring(2,7) + "-" + $scope.contatos[i].numero_contato.substring(7,11);
                                    $scope.contatos[i].numero_contato_mascara = numero;
                                }else{
                                     var numero = "(" + $scope.contatos[i].numero_contato.substring(0,2) + ") " + $scope.contatos[i].numero_contato.substring(2,6) + "-" + $scope.contatos[i].numero_contato.substring(6,10);
                                    $scope.contatos[i].numero_contato_mascara = numero;
                                }                               
                             


                            }else{
                                //Colocando a mascara
                                $scope.contatos[i].icone_tipo_contato  = "ion-ios-telephone";
                                $scope.contatos[i].descricao_tipo_contato = "Fixo - ";

                                if($scope.contatos[i].numero_contato.length == 11){
                                    var numero = "(" + $scope.contatos[i].numero_contato.substring(0,2) + ") " + $scope.contatos[i].numero_contato.substring(2,7) + "-" + $scope.contatos[i].numero_contato.substring(7,11);
                                    $scope.contatos[i].numero_contato_mascara = numero;
                                }else{
                                     var numero = "(" + $scope.contatos[i].numero_contato.substring(0,2) + ") " + $scope.contatos[i].numero_contato.substring(2,6) + "-" + $scope.contatos[i].numero_contato.substring(6,10);
                                    $scope.contatos[i].numero_contato_mascara = numero;
                                }
                            }
                        }

                    
                    
                    }).finally(function () {
                
                        $ionicLoading.hide();
                        
                    });

                });
        };

    //Função paa ataulizar os dados pessoais.
    $scope.excluirContato = function(id_contato) { 

        var data = { cpf: $scope.dadosUsuario.cpf, id: id_contato, id_usuario: $scope.dadosUsuario.id_usuario}; 
    
                $ionicLoading.show({
                    template: 'Excluindo...'
                    }).then(function () {

                        excluirDadosContatoAssociado.excluir(data).then(function (retorno) {
                            
                             
                            if(retorno.data.result == true){

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Contato excluído com sucesso.',    
                                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                });      

                                alertPopup.then(function (res) {

                                    $scope.obterListaContatos(); 

                                });         

                            }else{

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Não foi possível excluir o contato.',    
                                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                });           
                            }

                        }).finally(function () {
                            $ionicLoading.hide();
                        });
                });
            
            
        };    

}])
   
.controller('dependentesAtivosCtrl', ['$scope', '$stateParams', '$ionicLoading','$ionicPopup','$cordovaNetwork','LOCAL_STORAGE','getDadosDependentesAssociado', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, $ionicPopup, $cordovaNetwork, LOCAL_STORAGE, getDadosDependentesAssociado) {

  

    $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));

    var data = {cpf : $scope.dadosUsuario.cpf};

    $scope.dependentes = {}; 
              
            $ionicLoading.show({
                template: 'Buscando...'
            }).then(function () {

                getDadosDependentesAssociado.obter(data).then(function (dadosDependentes) {

                 
                    $scope.dependentes = dadosDependentes.data.data;
                
                }).finally(function () {
            
                    $ionicLoading.hide();
                    
                });

            });

}])
   
.controller('contatosAMPEBCtrl', ['$scope', '$stateParams','getContatosAMPEB','$cordovaNetwork','$ionicPopup','$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,getContatosAMPEB,$cordovaNetwork,$ionicPopup,$ionicLoading) {

    $scope.contatos = {};

            

    if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Buscando...'
        }).then(function () {
            getContatosAMPEB.obter().then(function (dados) {

                if (dados.data.result == true) {         

                    $scope.contatos = dados.data.data; 

                    for (var i = 0; i < $scope.contatos.length; i++) {
                        
                        if($scope.contatos[i].id_tipo_contato == 1 || $scope.contatos[i].id_tipo_contato == 2){
                            $scope.contatos[i].link = "tel:";
                        }else if($scope.contatos[i].id_tipo_contato == 3){
                            $scope.contatos[i].link = "mailto:";
                        }
                    }
                
                

                }else{

                    var alertPopup = $ionicPopup.alert({
                        title: dados.data,
                        template: 'Não foi possível obter as informações de contatos.',
                        okText: 'OK', // String (default: 'OK'). The text of the OK button.
                        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                    });
                }

            }).finally(function () {
            
                    $ionicLoading.hide();
                    
            });
        });

    }else{

        var alertPopup = $ionicPopup.alert({
            title: 'Não foi possível obter as informações de contatos.',
            template: 'Verifique sua conexão com ineternet.',
            okText: 'Ok', // String (default: 'OK'). The text of the OK button.
            okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
        });
    }   
       
     



}])
   
.controller('listaDeEndereOsCtrl', ['$scope', '$stateParams', '$ionicLoading','$ionicPopup','$cordovaNetwork','LOCAL_STORAGE','getDadosEnderecoAssociado', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading,$ionicPopup,$cordovaNetwork,LOCAL_STORAGE,getDadosEnderecoAssociado) {

     $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));

     $scope.$on('$ionicView.beforeEnter', function() {

       $scope.obterListaEnderecos(); 
      
    });

    $scope.obterListaEnderecos = function () {

         var data = {cpf : $scope.dadosUsuario.cpf};

        $scope.enderecos = {};
              
            $ionicLoading.show({
                template: 'Carregando...'
            }).then(function () {

                getDadosEnderecoAssociado.obter(data).then(function (dadosEnderecos) {
                 
                    $scope.enderecos = dadosEnderecos.data.data;

                   //Definindo os icones que serão apresentados de acordo com o tipo de endereço 
                    for (var i = 0; i < $scope.enderecos.length; i++) {

                        if ($scope.enderecos[i].id_tipo_endereco == 1){

                            $scope.enderecos[i].icone_tipo_endereco = "ion-ios-home";
                            $scope.enderecos[i].ds_tipo_endereco = "RESIDENCIAL";

                        }else if($scope.enderecos[i].id_tipo_endereco == 2){

                            $scope.enderecos[i].icone_tipo_endereco = "ion-briefcase";
                            $scope.enderecos[i].ds_tipo_endereco = "TRABALHO";
                        }else{

                            $scope.enderecos[i].icone_tipo_endereco = "ion-compose";
                            $scope.enderecos[i].ds_tipo_endereco = "RECADO";
                        }
                    }

                  
                  
                }).finally(function () {
            
                    $ionicLoading.hide();
                    
                });

            });
    };

  

   

}])
   
.controller('listaDeConvNiosCtrl', ['$scope', '$stateParams','$ionicLoading','conveniosFactory','$ionicHistory','$ionicPopup','getDadosConvenioCONAMP','LOCAL_STORAGE','$cordovaNetwork','$cordovaInAppBrowser', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicLoading,conveniosFactory,$ionicHistory,$ionicPopup,getDadosConvenioCONAMP,LOCAL_STORAGE,$cordovaNetwork,$cordovaInAppBrowser) {
    $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));

    $scope.listaConvenios = {};
    var idTipoConvenio = null; 
    var nmConvenio = null;
    var nmMunicipio = null;
 
    if($stateParams.idTipoConvenio != ""){
        idTipoConvenio = $stateParams.idTipoConvenio;
    }

    if($stateParams.nmConvenio != ""){
        nmConvenio = $stateParams.nmConvenio;
    }

     if($stateParams.nmMunicipio != ""){
        nmMunicipio = $stateParams.nmMunicipio;
    }

    if(idTipoConvenio != 22){
        //Pega dados do banco
        $ionicLoading.show({
            template: 'Buscando...'
        }).then(function () {

            conveniosFactory.selectConvenio(idTipoConvenio, nmConvenio, nmMunicipio, null).then(function (dados) {      
                
                if (dados[0] == null) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Não existem dados cadastrados para a pesquisa informada.',                      
                            okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                            okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                        });

                        alertPopup.then(function (res) {

                            $backView = $ionicHistory.backView();
                            $backView.go();

                        });

                    } else {
                        $scope.listaConvenios = dados;
                    }
            
            }).finally(function () {
                //em qualquer caso remove o spinner de loading
                $ionicLoading.hide();
            });

        });
    }else{
            var alertPopup = $ionicPopup.alert({
                title: 'Você será redirecionado para a página da CONAMP.',                      
                okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
            });

            alertPopup.then(function (res) {

                $scope.acessarConamp();
                $backView = $ionicHistory.backView();
                $backView.go();

            });
    }

      $scope.acessarConamp = function () {
       
        var data = {cpf: $scope.dadosUsuario.cpf};

            if ($cordovaNetwork.isOnline()) {
                
                $ionicLoading.show({template: 'Buscando...'}).then(function () {
                
                    getDadosConvenioCONAMP.obter(data).then(function (dados) {
                                        
                        $scope.redirecionarConamp(dados); 
 

                    }).finally(function () {
                        //em qualquer caso remove o spinner de loading
                        $ionicLoading.hide();                       
                       
                    });
                });

            }else{
               var alertPopup = $ionicPopup.alert({
                    title: 'Não foi possível acessar os convênios CONAMP.',
                    template: 'Verifique sua conexão com ineternet.',
                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                });

                alertPopup.then(function (res) {

                    $scope.redirecionarConamp();
                    $backView = $ionicHistory.backView();
                    $backView.go();

                });
            }   
       

    };

    $scope.redirecionarConamp = function (dados) {
    
   //So funciona no iphone no android entra em loop inifnito
   /*var script = 'alert("eqweqwe");'   
    script += 'document.body.innerHTML = \'<form id="conampForm" action="'+dados.data.data[0].url_action+'" method="post">';
    script += '<input type="hidden" name="dynamuskey" value="'+dados.data.data[0].dynamuskey+'"/>';
    script += '<input type="hidden" name="dynamus_username" value="'+dados.data.data[0].dynamus_username+'"/>';
    script += '<input type="hidden" name="dynamus_nome" value="'+dados.data.data[0].dynamus_nome+'"/>';
    script += '<input type="hidden" name="dynamus_sobrenome" value=""/>';
    script += '<input type="hidden" name="dynamus_email" value="'+dados.data.data[0].dynamus_email+'"/>';
    script += '<input type="hidden" name="dynamus_uf_user" value="'+dados.data.data[0].dynamus_uf_user+'"/>'
    script += '<input type="hidden" name="dynamus_token" value="'+dados.data.data[0].dynamus_token+'"/>';                        
    script += '</form>\';';

    script += 'document.getElementById("conampForm").submit();'; */

    /*var ref = cordova.InAppBrowser.open("https://conamp.dynamus.club/template-autologin.php", '_blank', 'hidden=no,location=yes,clearsessioncache=yes,clearcache=yes');

    ref.addEventListener('loadstart', function() {
       
        ref.executeScript({code: script});
    });*/


    var pageContent = '<html><head></head><body><form id="conampForm" action="'+dados.data.data[0].url_action+'" method="post">';
    pageContent += '<input type="hidden" name="dynamuskey" value="'+dados.data.data[0].dynamuskey+'"/>';
    pageContent += '<input type="hidden" name="dynamus_username" value="'+dados.data.data[0].dynamus_username+'"/>';
    pageContent += '<input type="hidden" name="dynamus_nome" value="'+dados.data.data[0].dynamus_nome+'"/>';
    pageContent += '<input type="hidden" name="dynamus_sobrenome" value=""/>';
    pageContent += '<input type="hidden" name="dynamus_email" value="'+dados.data.data[0].dynamus_email+'"/>';
    pageContent += '<input type="hidden" name="dynamus_uf_user" value="'+dados.data.data[0].dynamus_uf_user+'"/>'
    pageContent += '<input type="hidden" name="dynamus_token" value="'+dados.data.data[0].dynamus_token+'"/>';   
    pageContent += '</form> <script type="text/javascript">document.getElementById("conampForm").submit();</script></body></html>';

    var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);

    var browserRef = window.cordova.InAppBrowser.open(
        pageContentUrl ,
        "_blank",
        "hidden=no,location=yes,clearsessioncache=yes,clearcache=yes"
    );

   
 
    
    

    };




}])
   
.controller('enqueteCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('resultadoDaEnqueteCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('alterarASenhaCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('esqueceuASenhaCtrl', ['$scope', '$stateParams', '$state', 'RecuperarSenhaService', '$ionicPopup','$cordovaNetwork', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, RecuperarSenhaService, $ionicPopup,$cordovaNetwork) {

    $scope.data = {};

    $scope.recuperar = function (form,data) {
        if(form.$valid) {
            if ($cordovaNetwork.isOnline()) {

                RecuperarSenhaService.enviarEmailRecuperarSenha(data).then(function (dados) {
            
                if (dados.data == "Confirmação executada com sucesso.") {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Solicitação enviada com sucesso.',
                        template: 'Foi enviado um e-mail para redefinição de senha',
                        okText: 'OK', // String (default: 'OK'). The text of the OK button.
                        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                    });

                    alertPopup.then(function (res) {

                        $state.go('aMPEBAPP');

                    });             
                
                }else if(dados.data == "Seu email não existe na base de dados."){
                    var alertPopup = $ionicPopup.alert({
                        title: dados.data,
                        template: 'Verifique o CPF informado.',
                        okText: 'OK', // String (default: 'OK'). The text of the OK button.
                        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                    });
                }

            });
            }else{
               var alertPopup = $ionicPopup.alert({
                    title: 'Não foi possível enviar o e-mail de recuperação de senha.',
                    template: 'Verifique sua conexão com ineternet.',
                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                });
            }   
       
        }
        

    };

}])
   
.controller('transmissOAoVivoCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('contatoCtrl', ['$scope', '$stateParams','getTipoContatoTelefonicoService','getOperadorasTelefoneService','$q','LOCAL_STORAGE','$ionicLoading','$ionicHistory','$ionicPopup','salvarDadosContatoAssociado', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,getTipoContatoTelefonicoService,getOperadorasTelefoneService,$q,LOCAL_STORAGE,$ionicLoading,$ionicHistory,$ionicPopup,salvarDadosContatoAssociado) {

     

    $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));

    $scope.tiposContato = {};
    $scope.operadoras = {};  

    //Verifica se o numero é principal para setar o toggle como true
    var togglePrincipal = false;
    if($stateParams.principal == "S"){
        togglePrincipal = true;
    }

     //Verifica se o permite divulgar para setar o toggle como true
    var toggleDivulgar = false;
    if($stateParams.permitir_divulgar == "S"){
        toggleDivulgar = true;
    }   

    $scope.dadosContato = { 
        cpf: $scope.dadosUsuario.cpf,       
        id_associados_contatos_telefonicos: $stateParams.id_associados_contatos_telefonicos,   
        id_tipo_contatos_telefonicos: $stateParams.id_tipo_contatos_telefonicos,     
        principal: togglePrincipal, 
        permitir_divulgar: toggleDivulgar,
        numero_contato: $stateParams.numero_contato, 
        id_operadora_telefones: $stateParams.id_operadora_telefones,        
        id_usuario: $scope.dadosUsuario.id_usuario,
        observacao: $stateParams.observacao, 
        chave_externa: $scope.dadosUsuario.chave_externa
    }
    
     //Funcao para obter os combos da tela 
    $scope.mascaraNumero = function(tipoContato) {     
    
       
        if(tipoContato == 1){
            $scope.dadosContato.mascara = "(99) 99999-9999";
        }else{
            $scope.dadosContato.mascara = "(99) 9999-9999";
        }
    }     
      
    $scope.mascaraNumero($stateParams.id_tipo_contatos_telefonicos);
     //Funcao para obter os combos da tela 
    $scope.obterCombos = function() {          
        
        var tiposContatos =    getTipoContatoTelefonicoService.getTipoContato().then(function (data) {    
            return data;
        });    

        var operadoras =    getOperadorasTelefoneService.getOperadoras().then(function (data) {    
            return data;
        });   
         
        
        var retornoCombos = [];
        
        $ionicLoading.show({template: 'Carregando...'

        }).then(function () {
            //Pega o retorno de forma sincrona do ajax.
            $q.all([tiposContatos, operadoras]).then(function(result){
                for (var i = 0; i < result.length; i++){
                    retornoCombos.push(result[i]);
                }

                $scope.tiposContato = retornoCombos[0].data.data;
                $scope.operadoras = retornoCombos[1].data.data;
                        

            }).finally(function () {
                                
                $ionicLoading.hide();
                                                    
            });        

        });
    }
    //Chama a função para obter combos
    $scope.obterCombos();

       //Função paa ataulizar os dados pessoais.
      $scope.salvarContato = function(form,dadosContato) {
           
      
        var contatoPrincipal = "N";

        if(dadosContato.principal == true){
            contatoPrincipal = "S";
        }

        var permiteDivulgar = "N";

        if(dadosContato.permitir_divulgar == true){
            permiteDivulgar = "S";
        }

        if(dadosContato.observacao == null){
           dadosContato.observacao = "";
        }

       
        //Testando se para inserir ou alterar
        if(dadosContato.id_associados_contatos_telefonicos != null){

            var data = { cpf: dadosContato.cpf, id_associados_contatos_telefonicos: dadosContato.id_associados_contatos_telefonicos, id_tipo_contatos_telefonicos: dadosContato.id_tipo_contatos_telefonicos, principal: contatoPrincipal, permitir_divulgar: permiteDivulgar, numero_contato: dadosContato.numero_contato, id_operadora_telefones: dadosContato.id_operadora_telefones, observacao: dadosContato.observacao, id_usuario: dadosContato.id_usuario}; 
        }else{
            var data = { cpf: dadosContato.cpf, id_tipo_contatos_telefonicos: dadosContato.id_tipo_contatos_telefonicos, principal: contatoPrincipal, permitir_divulgar: permiteDivulgar, numero_contato: dadosContato.numero_contato, id_operadora_telefones: dadosContato.id_operadora_telefones,  observacao: dadosContato.observacao, id_usuario: dadosContato.id_usuario, chave_externa:dadosContato.chave_externa};
        }
           
               
            if(form.$valid) {   
                $ionicLoading.show({
                    template: 'Salvando...'
                    }).then(function () {

                        salvarDadosContatoAssociado.salvar(data).then(function (retorno) {
                            
                             
                            if(retorno.data.result == true){

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Contato salvo com sucesso.',    
                                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                });      

                                alertPopup.then(function (res) {

                                    $backView = $ionicHistory.backView();
                                    $backView.go();

                                });         

                            }else{

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Não foi possível salvar as informações.',    
                                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                });           
                            }

                        }).finally(function () {
                            $ionicLoading.hide();
                        });
                });
            }
            
        };        
}])
   
.controller('buscarConvNiosCtrl', ['$scope', '$stateParams','getTipoConvenioService','$ionicLoading','getMunicipiosConvenioService','getConvenioService','$cordovaNetwork','conveniosFactory','$ionicPopup','$ionicHistory','LOCAL_STORAGE', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,getTipoConvenioService,$ionicLoading,getMunicipiosConvenioService,getConvenioService,$cordovaNetwork,conveniosFactory,$ionicPopup,$ionicHistory,LOCAL_STORAGE) {
   
    $scope.municipiosConvenio = {};
    $scope.tiposConvenio = {};
    var dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));
    
    if ($cordovaNetwork.isOnline()) {
        
        $ionicLoading.show({
            template: 'Buscando...'
        }).then(function () {
            getMunicipiosConvenioService.getMunicipiosConvenio().then(function (dadosMunicipio) {
                
                $scope.municipiosConvenio = dadosMunicipio;
            
            }).finally(function () {
            //Apos carregar os municipios carregar os tipo de convenios
                getTipoConvenioService.getTipoConvenio().then(function (dadosTipoConvenio) {
                    
                    $scope.tiposConvenio = dadosTipoConvenio;
                    //Verificando a exibição de convenios privados (conamp)

                    for (var i = 0; i < $scope.tiposConvenio.length; i++){
                      
                        if(dadosUsuario == null){

                            if($scope.tiposConvenio[i].flPrivado == 1){

                                $scope.tiposConvenio[i].display = "none";

                            }else{
                                $scope.tiposConvenio[i].display = "block";
                   ;
                            }

                        }else{

                            $scope.tiposConvenio[i].display = "block";
                        }

                   
                    }
              

                }).finally(function () {

                    getConvenioService.getConvenio().then(function (dadosConvenio) {
                        var retorno = dadosConvenio;
                    }).finally(function () {
                        $ionicLoading.hide();
                    });               
                
                });
            });

        });
    }else{

         $ionicLoading.show({
            template: 'Buscando...'
        }).then(function () {

            conveniosFactory.selectMunicipioConvenio().then(function  (dadosMunicipio) {
                           
                $scope.municipiosConvenio = dadosMunicipio;
            
            }).finally(function () {
                conveniosFactory.selectTipoConvenio().then(function  (dadosTipoConvenio) {
               
                    if (dadosTipoConvenio[0] == null) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Sem dados offiline',    
                            template: 'Por favor, conecte seu dispositivo a internet',                  
                            okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                            okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                        });

                        alertPopup.then(function (res) {

                            $backView = $ionicHistory.backView();
                            $backView.go();

                        });

                    }else {
                        $scope.tiposConvenio = dadosTipoConvenio;
                    }
                        
                    
                    }).finally(function () {
                        
                            $ionicLoading.hide();
                                               
                    });
            });

        });

    }
    
}])
   
.controller('endereOCtrl', ['$scope', '$stateParams','getTipoEndereco','getEstado','getMunicipios','$ionicLoading','$q','$state','LOCAL_STORAGE','salvarDadosEnderecoAssociado','$ionicHistory','$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, getTipoEndereco, getEstado, getMunicipios,$ionicLoading,$q,$state,LOCAL_STORAGE,salvarDadosEnderecoAssociado,$ionicHistory,$ionicPopup) {
    $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));

    $scope.tiposEndereco = {};
    $scope.estados = {};
    $scope.municipios = {};

    //Verifica se o endereço é principal para setar o toggle como true
    var togglePrincipal = false;
    if($stateParams.principal == "S"){
        togglePrincipal = true;
    }

    //Verifica se é um novo endereço através do id
  

    $scope.dadosEndereco = { 
        cpf: $scope.dadosUsuario.cpf,
        id_usuario: $scope.dadosUsuario.id_usuario,
        id_associados_enderecos: $stateParams.id_associados_enderecos, 
        id_tipo_endereco: $stateParams.id_tipo_endereco, 
        principal: togglePrincipal, 
        descricao_endereco: $stateParams.descricao_endereco, 
        id_estado: $stateParams.id_estado, 
        id_municipio: $stateParams.id_municipio, 
        ponto_de_referencia: $stateParams.ponto_de_referencia, 
        observacoes: "", 
        chave_externa: $scope.dadosUsuario.chave_externa 
    }

    
  
      
     //Funcao para obter os combos da tela 
    $scope.obterCombos = function() {          
      
        //Pega os tipos de endereços.
        var tiposEndereco = getTipoEndereco.obter().then(function (retornoTipoEndereco) {    
            return retornoTipoEndereco;
        }); 

        //Pega os estados.
        var estados = getEstado.obter().then(function (retornoEstados) {    
            return retornoEstados;
        }); 

        //Pega os municipios.
        var data = {id_estado: $scope.dadosEndereco.id_estado}; //Passando o estado como parametro.

        var municipios = getMunicipios.obter(data).then(function (retornoMunicipios) {    
            return retornoMunicipios;
        });     
          
      
        var retornoCombos = [];

        $ionicLoading.show({template: 'Carregando...'
        }).then(function () {

            //Pega o retorno de forma sincrona do ajax.
            $q.all([tiposEndereco, estados, municipios]).then(function(result){
                for (var i = 0; i < result.length; i++){
                    retornoCombos.push(result[i]);
                }
            
            $scope.tiposEndereco = retornoCombos[0].data.data;
            $scope.estados = retornoCombos[1].data.data;
            $scope.municipios = retornoCombos[2].data.data;       

            }).finally(function () {
                            
                $ionicLoading.hide();
                                                
            });   
        });  

       
    }; 
    //Chama a função para obter combos
    $scope.obterCombos();

       //Função paa ataulizar os dados pessoais.
      $scope.salvarEndereco = function(form,dadosEndereco) {
           
      
        var enderecoPrincipal = "N";

        if(dadosEndereco.principal == true){
            enderecoPrincipal = "S";
        }

          if(dadosEndereco.ponto_de_referencia == null){
           dadosEndereco.ponto_de_referencia = "";
        }

       
        //Testando se para inserir ou alterar
        if(dadosEndereco.id_associados_enderecos != null){

            var data = { cpf: $scope.dadosEndereco.cpf, id_associados_enderecos: dadosEndereco.id_associados_enderecos, id_usuario: dadosEndereco.id_usuario, id_tipo_endereco: dadosEndereco.id_tipo_endereco, principal: enderecoPrincipal, descricao_endereco: dadosEndereco.descricao_endereco, id_estado: dadosEndereco.id_estado, id_municipio: dadosEndereco.id_municipio, ponto_de_referencia: dadosEndereco.ponto_de_referencia, observacoes: dadosEndereco.observacoes, chave_externa: dadosEndereco.chave_externa}; 
        }else{
            var data = { cpf: $scope.dadosEndereco.cpf, id_usuario: dadosEndereco.id_usuario, id_tipo_endereco: dadosEndereco.id_tipo_endereco, principal: enderecoPrincipal, descricao_endereco: dadosEndereco.descricao_endereco, id_estado: dadosEndereco.id_estado, id_municipio: dadosEndereco.id_municipio, ponto_de_referencia: dadosEndereco.ponto_de_referencia, observacoes: dadosEndereco.observacoes, chave_externa: dadosEndereco.chave_externa}; 
        }
            
               
            if(form.$valid) {   
                $ionicLoading.show({
                    template: 'Salvando...'
                    }).then(function () {

                        salvarDadosEnderecoAssociado.salvar(data).then(function (retorno) {
                            
                             
                            if(retorno.data.result == true){

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Endereço salvo com sucesso.',    
                                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                });      

                                alertPopup.then(function (res) {

                                    $backView = $ionicHistory.backView();
                                    $backView.go();

                                });         

                            }else{

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Não foi possível salvar as informações.',    
                                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                });           
                            }

                        }).finally(function () {
                            $ionicLoading.hide();
                        });
                });
            }
            
        };        
   
           




}])
   
.controller('dadosPessoaisCtrl', ['$scope', '$stateParams','getDadosPessoaisAssociadoService','$ionicLoading','$ionicPopup','$cordovaNetwork','LOCAL_STORAGE','atualizarDadosPessoaisAssociado','$ionicHistory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,getDadosPessoaisAssociadoService,$ionicLoading,$ionicPopup,$cordovaNetwork,LOCAL_STORAGE,atualizarDadosPessoaisAssociado,$ionicHistory) {

    //Pegando dados do usuário logado
    $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));

    $scope.dadosPessoais = {};     
              
            $ionicLoading.show({
                template: 'Carregando...'
            }).then(function () {
                getDadosPessoaisAssociadoService.obter($scope.dadosUsuario.cpf).then(function (dadosPessoais) {
                    
                    $scope.dadosPessoais = dadosPessoais.data.data[0];
                 
                    //Transformando a data em objeto
                    var dataNacimentoHora = $scope.dadosPessoais.dt_nascimento.split(" ");                   
                    var dt = new Date(dataNacimentoHora[0]);    
                    //Colocando o gmt pois a data estava ficando com um dia a menos         
                    $scope.dadosPessoais.dt_nascimento = new Date( dt.getTime() + Math.abs(dt.getTimezoneOffset()*60000));
                   
                
                }).finally(function () {
            
                    $ionicLoading.hide();
                    
                });

            });

        //Função paa ataulizar os dados pessoais.
      $scope.atualizaDadosPessoais = function(form,dadosPessoais) {
           
            var dados = { cpf: $scope.dadosUsuario.cpf, nome_associado: dadosPessoais.nome_associado, identidade: dadosPessoais.identidade, dt_nascimento: dadosPessoais.dt_nascimento, email_associado: dadosPessoais.email_associado, email_alternativo_associado: dadosPessoais.email_alternativo_associado, matricula: dadosPessoais.matricula, id_usuario: $scope.dadosUsuario.id_usuario}; 

            if(form.$valid) {   
                $ionicLoading.show({
                    template: 'Atualizando...'
                    }).then(function () {

                        atualizarDadosPessoaisAssociado.atualizar(dados).then(function (retorno) {
                            
                            if(retorno.data.result == true){

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Dados pessoais atualizados com sucesso.',    
                                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                });      

                                alertPopup.then(function (res) {

                                    $backView = $ionicHistory.backView();
                                    $backView.go();

                                });         

                            }else{

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Não foi possível atualizar as informações.',    
                                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                });           
                            }

                        }).finally(function () {
                            $ionicLoading.hide();
                        });
                });
            }
            
        };
        
            
        


}])
 