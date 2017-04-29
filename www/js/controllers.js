angular.module('app.controllers', [])
  
.controller('aMPEBCtrl', ['$scope', '$stateParams','$state', '$cordovaCamera','$ionicPopup','LOCAL_STORAGE', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state, $cordovaCamera, $ionicPopup, LOCAL_STORAGE) {
    
    //Pegando dados do usuário da sessão
    $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));
   
    //Verifica se existe foto, caso não exista exbir icone de camera
    if ($scope.dadosUsuario.foto_associado != "") {
        $scope.fotoUsuario = LOCAL_STORAGE.url_foto + $scope.dadosUsuario.foto_associado;
    } else {
        $scope.fotoUsuario = "img/icone_foto.png";
    }

    //Função para deslogar
    $scope.logout = function () {
        window.localStorage.removeItem(LOCAL_STORAGE.local_dados_key);
        window.localStorage.removeItem(LOCAL_STORAGE.manter_logado);
        $state.go('aMPEBAPP');
    }
       
	$scope.alterarFoto  = function(){

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
            $scope.srcImage = "data:image/jpeg;base64," + imageData;
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
            $scope.srcImage = "data:image/jpeg;base64," + imageData;
        }, function (err) {
            // error
        });
    }

    $scope.registarAssembleia = function () {

        $scope.data = {}

        var alertPopup = $ionicPopup.alert({

            title: 'Presença confirmada.',

            okText: 'OK', // String (default: 'OK'). The text of the OK button.

            okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.


        });

        alertPopup.then(function (res) {

            console.log('Thanks');

        });
        
    }


}])   
.controller('aMPEBAPPCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading', 'LoginService','LOCAL_STORAGE','$cordovaNetwork',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading, LoginService,LOCAL_STORAGE,$cordovaNetwork) {

    $scope.data = {};    
    var manteLogado =  window.localStorage.getItem(LOCAL_STORAGE.manter_logado);
    
    if(manteLogado){
        $state.go('aMPEB');
    }
   
    $scope.login = function (data) {
                
            if ($cordovaNetwork.isOnline()) {

                $ionicLoading.show({template: 'Autenticando...'}).then(function (){LoginService.logar(data).then(function (dados){

                    if (dados.data.result == true) {

                        //Guardando as informações do usuario logado na sessão.
                        window.localStorage.setItem(LOCAL_STORAGE.local_dados_key, JSON.stringify(dados.data.data));
                        if (data.manterConectado == true) {
                        window.localStorage.setItem(LOCAL_STORAGE.manter_logado, true);
                        } else {
                        window.localStorage.setItem(LOCAL_STORAGE.manter_logado, false);
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
        
    };
    
}])
   
.controller('notCiasCtrl', ['$scope', '$stateParams', 'obterNoticiasService','obterNoticiasBD', '$ionicPopup', 'LOCAL_STORAGE', '$ionicLoading','$cordovaNetwork','$ionicHistory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, obterNoticiasService, obterNoticiasBD, $ionicPopup, LOCAL_STORAGE, $ionicLoading, $cordovaNetwork, $ionicHistory) {
   
    //Verifica se estivar online pega dados via serviço 
    if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Buscando...'
        }).then(function () {
            obterNoticiasService.obterNoticiasOnline().then(function (dados) {

                $scope.listaNoticias = dados;


            }).finally(function () {
                //em qualquer caso remove o spinner de loading
                $ionicLoading.hide();
            });

        });
    } else {
        //Pega dados do banco
        $ionicLoading.show({
            template: 'Buscando...'
        }).then(function () {
            obterNoticiasBD.obterListaNoticiasBD().then(function (dados) {
             
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
   
.controller('prXimosEventosCtrl', ['$scope', '$stateParams', 'obterEventosService','obterEventosBD', '$ionicPopup', 'LOCAL_STORAGE', '$ionicLoading','$cordovaNetwork','$ionicHistory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,obterEventosService, obterEventosBD, $ionicPopup, LOCAL_STORAGE, $ionicLoading, $cordovaNetwork, $ionicHistory) {

 //Verifica se estivar online pega dados via serviço 
    if ($cordovaNetwork.isOnline()) {
        $ionicLoading.show({
            template: 'Buscando...'
        }).then(function () {
            obterEventosService.obterEventosOnline().then(function (dados) {

                $scope.listaEventos = dados;


            }).finally(function () {
                //em qualquer caso remove o spinner de loading
                $ionicLoading.hide();
            });

        });
    } else {
        //Pega dados do banco
        $ionicLoading.show({
            template: 'Buscando...'
        }).then(function () {
            obterEventosBD.obterListaEventosBD().then(function (dados) {
             
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
                    $scope.listaEventos = dados;
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
   
.controller('notCiaCtrl', ['$scope', '$stateParams','$ionicLoading','obterDetalheNoticiaBD', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, obterDetalheNoticiaBD) {
    $scope.noticia = {};
    //Pega dados do banco
    $ionicLoading.show({
        template: 'Buscando...'
    }).then(function () {
        obterDetalheNoticiaBD.detalheNoticiaBD($stateParams.id).then(function (dados) {
         
            $scope.noticia = dados;

        }).finally(function () {
            //em qualquer caso remove o spinner de loading
            $ionicLoading.hide();
        });

    });
    
}])
   
.controller('detalheDoEventoCtrl', ['$scope', '$stateParams', '$ionicLoading','obterDetalheEventosBD', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicLoading, obterDetalheEventosBD) {

    $scope.evento = {};
    //Pega dados do banco
    $ionicLoading.show({
        template: 'Buscando...'
    }).then(function () {
        obterDetalheEventosBD.detalheEventoBD($stateParams.id).then(function (dados) {
         
            $scope.evento = dados;

        }).finally(function () {
            //em qualquer caso remove o spinner de loading
            $ionicLoading.hide();
        });

    });


}])
   
.controller('detalheDoConvNioCtrl', ['$scope', '$stateParams', '$ionicLoading','obterListaConvenioBD', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicLoading, obterListaConvenioBD) {

     $scope.convenios = {};

     //Pega dados do banco
    $ionicLoading.show({
        template: 'Buscando...'
    }).then(function () {
        obterListaConvenioBD.ListaConvenioBD(null,null,null,$stateParams.id).then(function (dados) {
         
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
   
.controller('meuCadastroNaAMPEBCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('listaDeContatosCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('dependentesAtivosCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('contatosAMPEBCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('listaDeEndereOsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('listaDeConvNiosCtrl', ['$scope', '$stateParams','$ionicLoading','obterListaConvenioBD','$ionicHistory','$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicLoading,obterListaConvenioBD,$ionicHistory,$ionicPopup) {

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

     //Pega dados do banco
    $ionicLoading.show({
        template: 'Buscando...'
    }).then(function () {
        obterListaConvenioBD.ListaConvenioBD(idTipoConvenio, nmConvenio, nmMunicipio, null).then(function (dados) {
             
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
   
.controller('esqueceuASenhaCtrl', ['$scope', '$stateParams', '$state', 'RecuperarSenhaService', '$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, RecuperarSenhaService, $ionicPopup) {

    $scope.data = {};

    $scope.recuperar = function (data) {

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

    };

}])
   
.controller('transmissOAoVivoCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('contatoCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('buscarConvNiosCtrl', ['$scope', '$stateParams','getTipoConvenioService','$ionicLoading','getMunicipiosConvenioService','getConvenioService','$cordovaNetwork','ObterMunicipiosConvenioBD','ObterTipoConvenioBD','$ionicPopup','$ionicHistory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,getTipoConvenioService,$ionicLoading,getMunicipiosConvenioService,getConvenioService,$cordovaNetwork,ObterMunicipiosConvenioBD,ObterTipoConvenioBD,$ionicPopup,$ionicHistory) {

    $scope.municipiosConvenio = {};
    $scope.tiposConvenio = {};
    
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
            ObterMunicipiosConvenioBD.ListaMunicipiosConvenioBD().then(function (dadosMunicipio) {
                
                $scope.municipiosConvenio = dadosMunicipio;
            
            }).finally(function () {

                ObterTipoConvenioBD.ListaTipoConvenioBD().then(function (dadosTipoConvenio) {
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
   
.controller('endereOCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('dadosPessoaisCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
 