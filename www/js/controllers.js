angular.module('app.controllers', [])
    .constant('$ionicLoadingConfig', {
        template: '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner>',
        duration: 30000
    })
    .controller('aMPEBCtrl', ['$scope', '$stateParams', '$state', '$q', '$cordovaCamera', '$ionicPopup', 'LOCAL_STORAGE', '$timeout', 'noticiasFactory', 'eventosFactory', 'obterNoticiasService', 'obterEventosService', 'atualizarFotoAssociado', '$cordovaNetwork', '$ionicLoading', '$ionicHistory', 'fiquePorDentroFactory', 'obterFiquePorDentroService', 'getListaEnquete', 'enqueteFactory', 'getToken', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, $state, $q, $cordovaCamera, $ionicPopup, LOCAL_STORAGE, $timeout, noticiasFactory, eventosFactory, obterNoticiasService, obterEventosService, atualizarFotoAssociado, $cordovaNetwork, $ionicLoading, $ionicHistory, fiquePorDentroFactory, obterFiquePorDentroService, getListaEnquete, enqueteFactory, getToken) {


            /***************** Bloco para atualizações de notificações ********************/
            /* $scope.$on('$ionicView.beforeLeave', function() {
                  //do your stuff after leaving
                  Função para sempre fazer algo apos sair da pagina.
       
           });*/
            //Função para sempre fazer algo apos entrar na pagina.
            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.obterNotificacoes();
            });

            //Funcao para obter as notificacoes de noticias
            $scope.obterNotificacoes = function () {
                //Pega a quantidade de noticias não lidas
                var qtdNoticias = noticiasFactory.obterQtdNoticiaNaoLida().then(function (qtdNoticiaNaoLida) {
                    return qtdNoticiaNaoLida;
                });
                //Pega a quantidade de eventos não lidos

                var qtdEventos = eventosFactory.obterQtdEventosNaoLido().then(function (qtdEventoNaoLido) {
                    return qtdEventoNaoLido;
                });

                var qtdFiquePorDentro = fiquePorDentroFactory.obterQtdNoticiaNaoLida().then(function (qtdFiquePorDentroNaoLido) {
                    return qtdFiquePorDentroNaoLido;
                });

                var qtdEnquete = enqueteFactory.obterQtdEnqueteNaoLida().then(function (qtdEnqueteNaoLido) {
                    return qtdEnqueteNaoLido;
                });

                var retornoNotificacoes = [];

                //Pega o retorno de forma sincrona do ajax.
                $q.all([qtdNoticias, qtdEventos, qtdFiquePorDentro, qtdEnquete]).then(function (result) {
                    for (var i = 0; i < result.length; i++) {
                        retornoNotificacoes.push(result[i]);
                    }

                    if (retornoNotificacoes[0] != null && retornoNotificacoes[1] != null && retornoNotificacoes[2] != null && retornoNotificacoes[3] != null) {
                        //Testa caso o a quantidade seja maior que 0 exibe os itens não lidos.

                        if (retornoNotificacoes[0][0].qtdNoticiasNaoLidas > 0) {
                            //Seta o span com a quantodade notificaoes
                            document.getElementById("noticiasBadge").textContent = retornoNotificacoes[0][0].qtdNoticiasNaoLidas;
                        } else {
                            document.getElementById("noticiasBadge").textContent = "";
                        }

                        if (retornoNotificacoes[1][0].qtdEventosNaoLidos > 0) {
                            document.getElementById("eventosBadge").textContent = retornoNotificacoes[1][0].qtdEventosNaoLidos;
                        } else {
                            document.getElementById("eventosBadge").textContent = "";
                        }

                        if (retornoNotificacoes[2][0].qtdFiquePorDentroNaoLidas > 0) {
                            document.getElementById("fiquePorDentroBadge").textContent = retornoNotificacoes[2][0].qtdFiquePorDentroNaoLidas;
                        } else {
                            document.getElementById("fiquePorDentroBadge").textContent = "";
                        }

                        if (retornoNotificacoes[3][0].qtdEnqueteNaoLidas > 0) {
                            document.getElementById("enquetesBadge").textContent = retornoNotificacoes[3][0].qtdEnqueteNaoLidas;
                        } else {
                            document.getElementById("enquetesBadge").textContent = "";
                        }

                    }

                });


            };
            //Função para buscar novos dados.
            $scope.refresh = function () {

                $timeout(function () {
                    //Pegando usuario e senha da sessão para obter um novo token
                    var dadosUsuarioObterToken = {
                        username: window.localStorage.getItem(LOCAL_STORAGE.usuarioObterToken),
                        password: window.localStorage.getItem(LOCAL_STORAGE.senhaObterToken)
                    };

                    getToken.obter(dadosUsuarioObterToken).then(function (retornoToken) {

                        //Guardando as informações do token pra serviços privados.
                        window.localStorage.setItem(LOCAL_STORAGE.local_token, "Bearer " + retornoToken.data.token);

                    }, function (rejected) {

                    }).finally(function () {

                        var noticias = obterNoticiasService.obterNoticiasOnline().then(function (dadosNoticia) {
                            return dadosNoticia;
                        });

                        var eventos = obterEventosService.obterEventosOnline().then(function (dadosEvento) {

                            return dadosEvento;
                        });

                        var fiquePorDentro = obterFiquePorDentroService.obterNoticiasOnline().then(function (dadosFiquePorDentro) {
                            return dadosFiquePorDentro;
                        });

                        var enquete = getListaEnquete.obter().then(function (dadosEnquete) {
                            return dadosEnquete;
                        });

                        var retornos = [];

                        $q.all([eventos, noticias, fiquePorDentro, enquete]).then(function (result) {

                            for (var i = 0; i < result.length; i++) {
                                retornos.push(result[i]);
                            }

                            if (retornos[0] != null && retornos[1] != null && retornos[2] != null && retornos[3] != null) {
                                //Setando a variavel de sessão para informar ao controller de cada tela para buscar a informação atualizada do banco.                      
                                $scope.obterNotificacoes();

                            }
                        });

                        //Stop the ion-refresher from spinning
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }, 3000);
            };

            //Atualizando os dados para exibir notificaçoess
            $scope.atualizarDados = function () {

                var noticias = obterNoticiasService.obterNoticiasOnline().then(function (dadosNoticia) {
                    return dadosNoticia;
                });

                var eventos = obterEventosService.obterEventosOnline().then(function (dadosEvento) {
                    return dadosEvento;
                });

                var fiquePorDentro = obterFiquePorDentroService.obterNoticiasOnline().then(function (dadosFiquePorDentro) {
                    return dadosFiquePorDentro;
                });

                var enquetes = getListaEnquete.obter().then(function (dadosEnquetes) {
                    return dadosEnquetes;
                });

                var retornos = [];

                $q.all([noticias, eventos, fiquePorDentro, enquetes]).then(function (result) {
                    for (var i = 0; i < result.length; i++) {
                        retornos.push(result[i]);
                    }
                    if (retornos[0] != null && retornos[1] != null && retornos[2] != null && retornos[3] != null) {
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
                $scope.fotoUsuario = LOCAL_STORAGE.url_foto + $scope.dadosUsuario.foto_associado + '?decache=' + Math.random();

            } else {
                $scope.fotoUsuario = "img/icone_foto.png";
            }

            //Função para deslogar
            $scope.logout = function () {
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
            }

            /*****************  Fim do Bloco para login e logout ********************/

            /*****************  Bloco para alteração de foto do perfil ********************/
            $scope.alterarFoto = function () {
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

                } else {
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
                    var data = { cpf: $scope.dadosUsuario.cpf, imagem: imageData };

                    $ionicLoading.show({ template: '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner> <br/> Atualizando sua foto...' }).then(function () {

                        atualizarFotoAssociado.atualizar(data).then(function (dados) {

                            if (dados.data.result == true) {
                                //Colocado para burlar o cache da imagem
                                $scope.fotoUsuario = LOCAL_STORAGE.url_foto + $scope.dadosUsuario.foto_associado + '?decache=' + Math.random();
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
                    var data = { cpf: $scope.dadosUsuario.cpf, imagem: imageData };

                    $ionicLoading.show({ template: '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner> <br/> Atualizando sua foto...' }).then(function () {

                        atualizarFotoAssociado.atualizar(data).then(function (dados) {

                            if (dados.data.result == true) {
                                //Colocado para burlar o cache da imagem
                                $scope.fotoUsuario = LOCAL_STORAGE.url_foto + $scope.dadosUsuario.foto_associado + '?decache=' + Math.random();
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



        }])
    .controller('aMPEBAPPCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading', 'LoginService', 'LOCAL_STORAGE', '$cordovaNetwork', 'getToken',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading, LoginService, LOCAL_STORAGE, $cordovaNetwork, getToken) {

            //Variavel que indica qual a situação do token, por padrão true significa que o token esta ok, ou sera obtido após o login         
            $scope.$on('$ionicView.beforeEnter', function () {
                //Esta definição irá garantir que somente um alerta seja emitido apos a expiração do token
                window.localStorage.setItem(LOCAL_STORAGE.statusToken, "true");

            });
            $scope.data = {};
            var manteLogado = window.localStorage.getItem(LOCAL_STORAGE.manter_logado);

            if (manteLogado == "true") {

                //Pegando usuario e senha da sessão para obter um novo token

                var dadosUsuarioObterToken = {
                    username: window.localStorage.getItem(LOCAL_STORAGE.usuarioObterToken),
                    password: window.localStorage.getItem(LOCAL_STORAGE.senhaObterToken)
                };

                //Pegando um novo token
                $ionicLoading.show({ template: '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner> <br/> Aguarde...' }).then(function () {

                    getToken.obter(dadosUsuarioObterToken).then(function (retornoToken) {

                        //Guardando as informações do token pra serviços privados.
                        window.localStorage.setItem(LOCAL_STORAGE.local_token, "Bearer " + retornoToken.data.token);

                    }, function (rejected) {

                        $ionicLoading.hide();

                    }).finally(function () {
                        //Em qualquer caso remove o spinner de loading
                        $ionicLoading.hide();
                        $state.go('aMPEB');
                    });

                });
            } else {
                //Setando o token como vazio para permitir obter as noticias e eventos publicos
                window.localStorage.setItem(LOCAL_STORAGE.local_token, "");
                window.localStorage.setItem(LOCAL_STORAGE.tipo_retorno_post, 'publish');
                window.localStorage.setItem(LOCAL_STORAGE.filtro_retorno_post, '&status=publish');
            }



            $scope.login = function (form, data) {

                if (form.$valid) {

                    if ($cordovaNetwork.isOnline()) {

                        $ionicLoading.show({ template: '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner> <br/> Autenticando...' }).then(function () {

                            LoginService.logar(data).then(function (dados) {

                                if (dados.data.result == true) {

                                    var dadosUsuarioObterToken = {
                                        username: data.usuario,
                                        password: data.senha
                                    };

                                    getToken.obter(dadosUsuarioObterToken).then(function (retornoToken) {

                                        //Guardando as informações do token pra serviços privados.
                                        window.localStorage.setItem(LOCAL_STORAGE.local_token, "Bearer " + retornoToken.data.token);
                                        window.localStorage.setItem(LOCAL_STORAGE.tipo_retorno_post, 'private');
                                        window.localStorage.setItem(LOCAL_STORAGE.filtro_retorno_post, '&status=private,publish');


                                        //Guardando as informações do usuario logado na sessão.
                                        window.localStorage.setItem(LOCAL_STORAGE.local_dados_key, JSON.stringify(dados.data.data));

                                        //Testa se manter logado é true e grava no storage.
                                        if (data.manterConectado == true) {

                                            window.localStorage.setItem(LOCAL_STORAGE.manter_logado, "true");

                                            //Guardando credenciais para obter o token caso manter logado for true
                                            window.localStorage.setItem(LOCAL_STORAGE.usuarioObterToken, data.usuario);
                                            window.localStorage.setItem(LOCAL_STORAGE.senhaObterToken, data.senha);

                                        } else {
                                            window.localStorage.setItem(LOCAL_STORAGE.manter_logado, "false");

                                        }
                                        //Direciona para a tela inicial              
                                        $state.go('aMPEB');
                                    }).finally(function () {
                                        //em qualquer caso remove o spinner de loading
                                        $ionicLoading.hide();
                                    });


                                } else {

                                    $ionicLoading.hide();
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Usuário ou senha inválidos!',
                                        okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                    });
                                }
                            }, function (rejected) {
                                $ionicLoading.hide();//Validando se a rede está disponivel.
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Tente novamente',
                                    template: 'Rede apresentando lentidão ou indisponível!',
                                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                });
                            });
                        });
                    } else {

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

    .controller('notCiasCtrl', ['$scope', '$stateParams', 'obterNoticiasService', 'noticiasFactory', '$ionicPopup', 'LOCAL_STORAGE', '$ionicLoading', '$cordovaNetwork', '$ionicHistory', 'obterNoticiasServiceObterMais', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, obterNoticiasService, noticiasFactory, $ionicPopup, LOCAL_STORAGE, $ionicLoading, $cordovaNetwork, $ionicHistory, obterNoticiasServiceObterMais) {
            //Variáveis declaradas para paginação
            $scope.pagina = 1;
            $scope.listaNoticias = [];
            $scope.moreDataCanBeLoaded = true;
            //Verifica se estivar online pega dados via serviço 
            if ($cordovaNetwork.isOnline()) {

                $ionicLoading.show({ template: '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner> <br/> Buscando...' }).then(function () {

                    obterNoticiasService.obterNoticiasOnline().then(function (dados) {

                        $scope.listaNoticias = dados;

                        noticiasFactory.marcarNoticiasLidas().then(function (marcados) {

                        }).finally(function () {
                            //em qualquer caso remove o spinner de loading
                            $ionicLoading.hide();
                        });

                    });
                });

            } else {
                //Pega dados do banco
                $ionicLoading.show().then(function () {
                    noticiasFactory.selectListaNoticias($stateParams.tipo).then(function (dados) {

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

            //Função para obter mais noticias.
            $scope.obterMais = function () {

                if ($cordovaNetwork.isOnline()) {
                    //Contador para pedir proxima pagina ao seviço
                    $scope.pagina++;

                    obterNoticiasServiceObterMais.obter($scope.pagina).then(function (retorno) {

                        //Concatenando as novas informações ao array existente de noticias
                        $scope.listaNoticias = $scope.listaNoticias.concat(retorno);

                        //Teste para verificar quando tem mais posts para carregar, caso não tenha faz com que o loading do infinte scroll pare de rodar
                        if (retorno.length == 0) {
                            $scope.moreDataCanBeLoaded = false;
                        }
                        //Encerra o loading
                        $scope.$broadcast('scroll.infiniteScrollComplete');

                    });
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Sem conexão com a internet.',
                        template: 'Para obter mais dados, conecte seu dispositivo a internet.',
                        okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                    });
                }

            };



        }])

    .controller('prXimosEventosCtrl', ['$scope', '$stateParams', 'obterEventosService', '$ionicPopup', 'LOCAL_STORAGE', '$ionicLoading', '$cordovaNetwork', '$ionicHistory', 'eventosFactory', 'obterEventosServiceObterMais', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, obterEventosService, $ionicPopup, LOCAL_STORAGE, $ionicLoading, $cordovaNetwork, $ionicHistory, eventosFactory, obterEventosServiceObterMais) {

            //Variáveis declaradas para paginação
            $scope.pagina = 1;
            $scope.listaEventos = [];
            $scope.moreDataCanBeLoaded = true;

            //Verifica se estivar online pega dados via serviço 
            if ($cordovaNetwork.isOnline()) {

                $ionicLoading.show({ template: '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner> <br/> Buscando...' }).then(function () {
                    obterEventosService.obterEventosOnline().then(function (dados) {

                        $scope.listaEventos = dados;

                        eventosFactory.marcarEventosLidos().then(function (marcados) {

                        }).finally(function () {
                            //em qualquer caso remove o spinner de loading
                            $ionicLoading.hide();
                        });

                    });
                });


            } else {
                //Pega dados do banco
                $ionicLoading.show().then(function () {
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

            //Função para obter mais noticias.
            $scope.obterMais = function () {

                if ($cordovaNetwork.isOnline()) {
                    $scope.pagina++;

                    obterEventosServiceObterMais.obter($scope.pagina).then(function (retorno) {

                        $scope.listaEventos = $scope.listaEventos.concat(retorno);

                        //Teste para verificar quando tem mais posts para carregar, caso não tenha faz com que o loading do infinte scroll pare de rodar
                        if (retorno.length == 0) {
                            $scope.moreDataCanBeLoaded = false;
                        }

                        $scope.$broadcast('scroll.infiniteScrollComplete');

                    });
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Sem conexão com a internet.',
                        template: 'Para obter mais dados, conecte seu dispositivo a internet.',
                        okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                    });
                }

            };


        }])

    .controller('meuMuralCtrl', ['$scope', '$stateParams', 'obterFiquePorDentroService', '$ionicPopup', 'LOCAL_STORAGE', '$ionicLoading', '$cordovaNetwork', '$ionicHistory', 'fiquePorDentroFactory', 'obterFiquePorDentroServiceObterMais', '$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, obterFiquePorDentroService, $ionicPopup, LOCAL_STORAGE, $ionicLoading, $cordovaNetwork, $ionicHistory, fiquePorDentroFactory, obterFiquePorDentroServiceObterMais, $timeout) {
            //Variáveis declaradas para paginação
            $scope.pagina = 1;
            $scope.fiquePorDentro = [];
            $scope.moreDataCanBeLoaded = true;
            //Verifica se estivar online pega dados via serviço 
            if ($cordovaNetwork.isOnline()) {

                $ionicLoading.show({ template: '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner> <br/> Buscando...' }).then(function () {
                    obterFiquePorDentroService.obterNoticiasOnline().then(function (dados) {

                        $scope.fiquePorDentro = dados;

                        fiquePorDentroFactory.marcarNoticiasLidas().then(function (marcados) {

                        }).finally(function () {
                            //em qualquer caso remove o spinner de loading
                            $ionicLoading.hide();
                        });

                    });
                });
            } else {
                //Pega dados do banco
                $ionicLoading.show().then(function () {
                    fiquePorDentroFactory.selectListaNoticias().then(function (dadosArmazenados) {

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
                            $scope.fiquePorDentro = dadosArmazenados;

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

            //Função para obter mais noticias.
            $scope.obterMais = function () {

                if ($cordovaNetwork.isOnline()) {
                    $scope.pagina++;

                    obterFiquePorDentroServiceObterMais.obter($scope.pagina).then(function (retorno) {

                        $scope.fiquePorDentro = $scope.fiquePorDentro.concat(retorno);

                        //Teste para verificar quando tem mais posts para carregar, caso não tenha faz com que o loading do infinte scroll pare de rodar
                        if (retorno.length == 0) {
                            $scope.moreDataCanBeLoaded = false;
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Sem conexão com a internet.',
                        template: 'Para obter mais dados, conecte seu dispositivo a internet.',
                        okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                    });
                }

            };
        }])

    .controller('notCiaCtrl', ['$scope', '$stateParams', '$ionicLoading', 'noticiasFactory', '$sce', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, $ionicLoading, noticiasFactory, $sce) {
            $scope.noticia = {};
            //Pega dados do banco
            $ionicLoading.show().then(function () {

                noticiasFactory.selectNoticia($stateParams.id).then(function (dados) {

                    var str = dados[0].dsNoticia;
                    //Fazendo replace com expressão regular para abrir os links no ionic
                    var newNoticia = str.replace(/<a href(.*?)/g, "<a onclick=\"window.open(this.href, '_system'); return false;\" href");
                    $scope.noticia = dados;
                    $scope.noticia[0].dsNoticia = newNoticia;

                }).finally(function () {
                    //em qualquer caso remove o spinner de loading
                    $ionicLoading.hide();
                });

            });

            $scope.trustAsHtml = function (html) {
                return $sce.trustAsHtml(html);
            }

        }])

    .controller('detalheDoEventoCtrl', ['$scope', '$stateParams', '$ionicLoading', 'eventosFactory', '$sce', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, $ionicLoading, eventosFactory, $sce) {

            $scope.evento = {};
            //Pega dados do banco
            $ionicLoading.show().then(function () {
                eventosFactory.selectNoticia($stateParams.id).then(function (eventoBD) {


                    var str = eventoBD[0].dsNoticia;
                    //Fazendo replace com expressão regular para abrir os links no ionic
                    var newNoticia = str.replace(/<a href(.*?)/g, "<a onclick=\"window.open(this.href, '_system'); return false;\" href");
                    $scope.evento = eventoBD;
                    $scope.evento[0].dsNoticia = newNoticia;

                }).finally(function () {
                    //em qualquer caso remove o spinner de loading
                    $ionicLoading.hide();
                });

            });

            $scope.trustAsHtml = function (html) {
                return $sce.trustAsHtml(html);
            }


        }])

    .controller('detalheDoConvNioCtrl', ['$scope', '$stateParams', '$ionicLoading', 'conveniosFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, $ionicLoading, conveniosFactory) {

            $scope.convenios = {};

            //Pega dados do banco
            $ionicLoading.show().then(function () {
                conveniosFactory.selectConvenio(null, null, null, $stateParams.id).then(function (dados) {

                    $scope.convenios = dados;

                }).finally(function () {
                    //em qualquer caso remove o spinner de loading
                    $ionicLoading.hide();
                });

            });

            //Abrir o pdf com o google.
            $scope.openBrowserPdfConvenios = function (url) {

                var link = "http://docs.google.com/viewer?url=" + encodeURIComponent(url) + "&embedded=true";
                cordova.InAppBrowser.open(link, "_system", "location=no,toolbar=no,hardwareback=yes");
            };

            //Abrir o pdf com o google.
            $scope.openBrowser = function (url) {

                cordova.InAppBrowser.open(url, "_system", "location=no,toolbar=no,hardwareback=yes");
            };





        }])

    .controller('muralCtrl', ['$scope', '$stateParams', '$ionicLoading', 'fiquePorDentroFactory', '$sce', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, $ionicLoading, fiquePorDentroFactory, $sce) {

            $scope.noticia = {};
            //Pega dados do banco
            $ionicLoading.show().then(function () {

                fiquePorDentroFactory.selectNoticia($stateParams.id).then(function (dados) {

                    var str = dados[0].dsNoticia;
                    //var newNoticia =   str.replace(/rel="(.*?)"/g, "onclick=\"window.open(this.href, '_system'); return false;\""); Segunda opção.

                    //Fazendo replace com expressão regular para abrir os links no ionic
                    var newNoticia = str.replace(/<a href(.*?)/g, "<a onclick=\"window.open(this.href, '_system'); return false;\" href");
                    $scope.noticia = dados;
                    $scope.noticia[0].dsNoticia = newNoticia;

                }).finally(function () {
                    //em qualquer caso remove o spinner de loading
                    $ionicLoading.hide();
                });

            });

            $scope.trustAsHtml = function (html) {
                return $sce.trustAsHtml(html);
            }

        }])

    .controller('meuCadastroNaAMPEBCtrl', ['$scope', '$stateParams', '$cordovaNetwork', '$ionicPopup', '$ionicHistory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, $cordovaNetwork, $ionicPopup, $ionicHistory) {
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

    .controller('listaDeContatosCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicPopup', '$cordovaNetwork', 'LOCAL_STORAGE', 'getDadosContatosAssociado', 'excluirDadosContatoAssociado', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, $ionicLoading, $ionicPopup, $cordovaNetwork, LOCAL_STORAGE, getDadosContatosAssociado, excluirDadosContatoAssociado) {

            $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));

            $scope.$on('$ionicView.beforeEnter', function () {

                $scope.obterListaContatos();

            });

            $scope.obterListaContatos = function () {

                var data = { cpf: $scope.dadosUsuario.cpf };

                $scope.contatos = {};

                $ionicLoading.show().then(function () {

                    getDadosContatosAssociado.obter(data).then(function (dadosContatos) {


                        $scope.contatos = dadosContatos.data.data;



                        //Definindo os icones que serão apresentados de acordo com o tipo de endereço 
                        for (var i = 0; i < $scope.contatos.length; i++) {

                            //Descriptografando os dados
                            $scope.contatos[i].numero_contato = decodeURIComponent(escape(atob($scope.contatos[i].numero_contato)));
                            $scope.contatos[i].observacao = decodeURIComponent(escape(atob($scope.contatos[i].observacao)));

                            if ($scope.contatos[i].id_tipo_contatos_telefonicos == 1) {

                                $scope.contatos[i].icone_tipo_contato = "ion-iphone";
                                $scope.contatos[i].descricao_tipo_contato = "Cel - ";

                                //Colocando a mascara
                                if ($scope.contatos[i].numero_contato.length == 11) {
                                    var numero = "(" + $scope.contatos[i].numero_contato.substring(0, 2) + ") " + $scope.contatos[i].numero_contato.substring(2, 7) + "-" + $scope.contatos[i].numero_contato.substring(7, 11);
                                    $scope.contatos[i].numero_contato_mascara = numero;
                                } else {
                                    var numero = "(" + $scope.contatos[i].numero_contato.substring(0, 2) + ") " + $scope.contatos[i].numero_contato.substring(2, 6) + "-" + $scope.contatos[i].numero_contato.substring(6, 10);
                                    $scope.contatos[i].numero_contato_mascara = numero;
                                }



                            } else {
                                //Colocando a mascara
                                $scope.contatos[i].icone_tipo_contato = "ion-ios-telephone";
                                $scope.contatos[i].descricao_tipo_contato = "Fixo - ";

                                if ($scope.contatos[i].numero_contato.length == 11) {
                                    var numero = "(" + $scope.contatos[i].numero_contato.substring(0, 2) + ") " + $scope.contatos[i].numero_contato.substring(2, 7) + "-" + $scope.contatos[i].numero_contato.substring(7, 11);
                                    $scope.contatos[i].numero_contato_mascara = numero;
                                } else {
                                    var numero = "(" + $scope.contatos[i].numero_contato.substring(0, 2) + ") " + $scope.contatos[i].numero_contato.substring(2, 6) + "-" + $scope.contatos[i].numero_contato.substring(6, 10);
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
            $scope.excluirContato = function (id_contato) {

                var data = { cpf: $scope.dadosUsuario.cpf, id: id_contato, id_usuario: $scope.dadosUsuario.id_usuario };

                $ionicLoading.show({
                    template: '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner> <br/> Excluindo...'
                }).then(function () {

                    excluirDadosContatoAssociado.excluir(data).then(function (retorno) {


                        if (retorno.data.result == true) {

                            var alertPopup = $ionicPopup.alert({
                                title: 'Contato excluído com sucesso.',
                                okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                            });

                            alertPopup.then(function (res) {

                                $scope.obterListaContatos();

                            });

                        } else {

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

    .controller('dependentesAtivosCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicPopup', '$cordovaNetwork', 'LOCAL_STORAGE', 'getDadosDependentesAssociado', 'getConfiguracaoAplicativo', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, $ionicLoading, $ionicPopup, $cordovaNetwork, LOCAL_STORAGE, getDadosDependentesAssociado, getConfiguracaoAplicativo) {



            $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));

            var data = { cpf: $scope.dadosUsuario.cpf };
            var dataConfiguracao = { chave: "meu_cadastro_dependentes_inativos _texto" };
            $scope.dependentes = {};

            $ionicLoading.show().then(function () {

                getDadosDependentesAssociado.obter(data).then(function (dadosDependentes) {

                    getConfiguracaoAplicativo.obter(dataConfiguracao).then(function (dadosTextoRodape) {
                        $scope.textoRodape = dadosTextoRodape.data.data[0].valor;

                    });

                    $scope.dependentes = dadosDependentes.data.data;

                }).finally(function () {

                    $ionicLoading.hide();

                });

            });

        }])

    .controller('contatosAMPEBCtrl', ['$scope', '$stateParams', 'getContatosAMPEB', '$cordovaNetwork', '$ionicPopup', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, getContatosAMPEB, $cordovaNetwork, $ionicPopup, $ionicLoading) {

            $scope.contatos = {};



            if ($cordovaNetwork.isOnline()) {
                $ionicLoading.show().then(function () {
                    getContatosAMPEB.obter().then(function (dados) {

                        if (dados.data.result == true) {

                            $scope.contatos = dados.data.data;

                            for (var i = 0; i < $scope.contatos.length; i++) {

                                if ($scope.contatos[i].id_tipo_contato == 1 || $scope.contatos[i].id_tipo_contato == 2) {
                                    $scope.contatos[i].link = "tel:";
                                } else if ($scope.contatos[i].id_tipo_contato == 3) {
                                    $scope.contatos[i].link = "mailto:";
                                }
                            }



                        } else {

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

            } else {

                var alertPopup = $ionicPopup.alert({
                    title: 'Não foi possível obter as informações de contatos.',
                    template: 'Verifique sua conexão com ineternet.',
                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                });
            }





        }])

    .controller('listaDeEndereOsCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicPopup', '$cordovaNetwork', 'LOCAL_STORAGE', 'getDadosEnderecoAssociado', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, $ionicLoading, $ionicPopup, $cordovaNetwork, LOCAL_STORAGE, getDadosEnderecoAssociado) {

            $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));

            $scope.$on('$ionicView.beforeEnter', function () {

                $scope.obterListaEnderecos();

            });

            $scope.obterListaEnderecos = function () {

                var data = { cpf: $scope.dadosUsuario.cpf };

                $scope.enderecos = {};

                $ionicLoading.show().then(function () {

                    getDadosEnderecoAssociado.obter(data).then(function (dadosEnderecos) {

                        $scope.enderecos = dadosEnderecos.data.data;

                        //Definindo os icones e cores que serão apresentados de acordo com o tipo de endereço 
                        for (var i = 0; i < $scope.enderecos.length; i++) {

                            $scope.enderecos[i].descricao_endereco = decodeURIComponent(escape(atob($scope.enderecos[i].descricao_endereco)));
                            $scope.enderecos[i].ponto_de_referencia = decodeURIComponent(escape(atob($scope.enderecos[i].ponto_de_referencia)));
                            $scope.enderecos[i].observacoes = decodeURIComponent(escape(atob($scope.enderecos[i].observacoes)));

                            //Tratamento para exibir a cor verde.
                            if ($scope.enderecos[i].principal == "S") {
                                $scope.enderecos[i].cor_label_endereco = "balanced";
                            } else {
                                $scope.enderecos[i].cor_label_endereco = "dark";
                            }
                            //Tratamento para exibir os icone rescpectivos de cada endereço.
                            if ($scope.enderecos[i].id_tipo_endereco == 1) {

                                $scope.enderecos[i].icone_tipo_endereco = "ion-ios-home";
                                $scope.enderecos[i].ds_tipo_endereco = "RESIDENCIAL";

                            } else if ($scope.enderecos[i].id_tipo_endereco == 2) {

                                $scope.enderecos[i].icone_tipo_endereco = "ion-briefcase";
                                $scope.enderecos[i].ds_tipo_endereco = "TRABALHO";
                            } else {

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

    .controller('listaDeConvNiosCtrl', ['$scope', '$stateParams', '$ionicLoading', 'conveniosFactory', '$ionicHistory', '$ionicPopup', 'getDadosConvenioCONAMP', 'LOCAL_STORAGE', '$cordovaNetwork', '$cordovaInAppBrowser', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, $ionicLoading, conveniosFactory, $ionicHistory, $ionicPopup, getDadosConvenioCONAMP, LOCAL_STORAGE, $cordovaNetwork, $cordovaInAppBrowser) {
            $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));

            $scope.listaConvenios = {};
            var idTipoConvenio = null;
            var nmConvenio = null;
            var nmMunicipio = null;

            if ($stateParams.idTipoConvenio != "") {
                idTipoConvenio = $stateParams.idTipoConvenio;
            }

            if ($stateParams.nmConvenio != "") {
                nmConvenio = $stateParams.nmConvenio;
            }

            if ($stateParams.nmMunicipio != "") {
                nmMunicipio = $stateParams.nmMunicipio;
            }

            if (idTipoConvenio != 22) {
                //Pega dados do banco
                $ionicLoading.show().then(function () {

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
            } else {
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

                var data = { cpf: $scope.dadosUsuario.cpf };

                if ($cordovaNetwork.isOnline()) {

                    $ionicLoading.show().then(function () {

                        getDadosConvenioCONAMP.obter(data).then(function (dados) {

                            $scope.redirecionarConamp(dados);

                        }).finally(function () {
                            //em qualquer caso remove o spinner de loading
                            $ionicLoading.hide();

                        });
                    });

                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Não foi possível acessar os convênios CONAMP.',
                        template: 'Verifique sua conexão com ineternet.',
                        okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                    });

                    alertPopup.then(function (res) {

                        // $scope.redirecionarConamp();
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


                var pageContent = '<html><head></head><body><form id="conampForm" action="' + dados.data.data[0].url_action + '" method="post">';
                pageContent += '<input type="hidden" name="dynamuskey" value="' + dados.data.data[0].dynamuskey + '"/>';
                pageContent += '<input type="hidden" name="dynamus_username" value="' + dados.data.data[0].dynamus_username + '"/>';
                pageContent += '<input type="hidden" name="dynamus_nome" value="' + dados.data.data[0].dynamus_nome + '"/>';
                pageContent += '<input type="hidden" name="dynamus_sobrenome" value=""/>';
                pageContent += '<input type="hidden" name="dynamus_email" value="' + dados.data.data[0].dynamus_email + '"/>';
                pageContent += '<input type="hidden" name="dynamus_uf_user" value="' + dados.data.data[0].dynamus_uf_user + '"/>'
                pageContent += '<input type="hidden" name="dynamus_token" value="' + dados.data.data[0].dynamus_token + '"/>';
                pageContent += '</form> <script type="text/javascript">document.getElementById("conampForm").submit();</script></body></html>';

                var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);

                var browserRef = window.cordova.InAppBrowser.open(
                    pageContentUrl,
                    "_blank",
                    "hidden=no,location=yes,clearsessioncache=yes,clearcache=yes"
                );



            };
            //Abrir o pdf com o google.
            $scope.openBrowserPdfConvenios = function (url) {

                var link = "http://docs.google.com/viewer?url=" + encodeURIComponent(url) + "&embedded=true";
                cordova.InAppBrowser.open(link, "_system", "location=no,toolbar=no,hardwareback=yes");
            };



        }])

    .controller('enqueteCtrl', ['$scope', '$stateParams', '$cordovaNetwork', '$ionicLoading', '$ionicPopup', '$ionicHistory', 'LOCAL_STORAGE', 'getEnquete', 'votarEnquete','enqueteFactory','$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, $cordovaNetwork, $ionicLoading, $ionicPopup, $ionicHistory, LOCAL_STORAGE, getEnquete, votarEnquete, enqueteFactory,$state) {


            if ($cordovaNetwork.isOnline()) {

                $scope.enquete = {};
                $scope.flVotada = $stateParams.flVotada;//Verifica se a enquete ja foi votada para exibir ou não o botão de votar         

                $ionicLoading.show().then(function () {

                    getEnquete.obter($stateParams.id).then(function (retorno) {

                        $scope.enquete = retorno.data;
                        $scope.habilitarVoto = "";
                        //Validando se uma enquete expirou
                        if ($scope.enquete[0].pollq_expiry == "1969-12-31T21:00:00") {
                            $scope.habilitarVoto = "false";
                        } else {

                            var dataExpiracao = new Date($scope.enquete[0].pollq_expiry);
                            var dataAtual = new Date();
                            if (dataAtual > dataExpiracao) {
                                $scope.habilitarVoto = "true";
                            } else {
                                $scope.habilitarVoto = "false";
                            }
                        }


                    }).finally(function () {
                        //em qualquer caso remove o spinner de loading
                        $ionicLoading.hide();

                    });
                });

            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Não foi possível obter a enquete.',
                    template: 'Verifique sua conexão com ineternet.',
                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                });

                alertPopup.then(function (res) {
                    
                    $backView = $ionicHistory.backView();
                    $backView.go();

                });
            }
            $scope.respostaEnquete = {};
            //Função paa ataulizar os dados pessoais.
            $scope.votar = function (form, id, respostaEnquete) {

                if (form.$valid) {

                    if ($cordovaNetwork.isOnline()) {

                        $scope.enquete = {};

                        $ionicLoading.show({ template: '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner> <br/> Votando...' }).then(function () {

                            votarEnquete.votar(id, respostaEnquete.answer).then(function (retorno) {


                                if (retorno.data[0].code == 200) {

                                    var alertPopup = $ionicPopup.alert({
                                        title: retorno.data[0].message,
                                        okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                    });

                                    alertPopup.then(function (res) {
                                        //Marcando enquetes
                                       
                                        enqueteFactory.marcarEnquetesVotadas(id).then(function (marcados) {
                                           //$state.go('aMPEB');
                                             $backView = $ionicHistory.backView();
                                            $backView.go();                          
                                        });
                                       
                                    });                                   
                                   
                                } else {

                                    var alertPopup = $ionicPopup.alert({
                                        title: retorno.data[0].message,
                                        okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                    });

                                    alertPopup.then(function (res) {

                                        $backView = $ionicHistory.backView();
                                        $backView.go();

                                    });
                                }

                            }).finally(function () {
                                //em qualquer caso remove o spinner de loading
                                $ionicLoading.hide();

                            });
                        });

                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Não foi possível votar a enquete.',
                            template: 'Verifique sua conexão com ineternet.',
                            okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                            okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                        });

                    }
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Por favor, escolha uma opção de resposta para votar.',
                        okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                    });
                }

            };


        }])

    .controller('listaEnquetesCtrl', ['$scope', '$stateParams', '$cordovaNetwork', '$ionicLoading', '$ionicPopup', '$ionicHistory', 'LOCAL_STORAGE', 'getListaEnquete', 'enqueteFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, $cordovaNetwork, $ionicLoading, $ionicPopup, $ionicHistory, LOCAL_STORAGE, getListaEnquete, enqueteFactory) {

            $scope.$on('$ionicView.beforeEnter', function () {

                if ($cordovaNetwork.isOnline()) {

                    $scope.enquetes = {};
                    $scope.qtdEnquete = "";
                    
    
                    $ionicLoading.show().then(function () {
    
                        getListaEnquete.obter().then(function (retorno) {                    
                         
                            if(retorno != ""){
                                //console.log(JSON.stringify(retorno));
                                $scope.qtdEnquete = retorno.length + " Enquete(s)"; //Total de enquetes
                                $scope.enquetes = retorno;                     
                                //Marcando enquetes
                                enqueteFactory.marcarEnquetesLidas().then(function (marcados) {
        
                                });
                            }else{
    
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Não existem enquetes disponíveis.',                         
                                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                });
                
                                alertPopup.then(function (res) {            
                                    $backView = $ionicHistory.backView();
                                    $backView.go();            
                                });
                            }             
    
                        }).finally(function () {
                            //em qualquer caso remove o spinner de loading
                            $ionicLoading.hide();
    
                        });
                    });
    
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Não foi possível obter a lista de enquetes.',
                        template: 'Verifique sua conexão com ineternet.',
                        okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                    });
    
                    alertPopup.then(function (res) {
    
                        $backView = $ionicHistory.backView();
                        $backView.go();
    
                    });
                }

            });

          

        }])
    .controller('resultadoDaEnqueteCtrl', ['$scope', '$stateParams', '$cordovaNetwork', '$ionicLoading', '$ionicPopup', '$ionicHistory', 'LOCAL_STORAGE', 'getEnquete', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, $cordovaNetwork, $ionicLoading, $ionicPopup, $ionicHistory, LOCAL_STORAGE, getEnquete) {


            if ($cordovaNetwork.isOnline()) {

                $scope.flVotada = $stateParams.flVotada;
                console.log($scope.flVotada);
                $scope.enquete = {};

                $ionicLoading.show().then(function () {

                    getEnquete.obter($stateParams.id).then(function (retorno) {

                        $scope.enquete = retorno.data;

                    }).finally(function () {
                        //em qualquer caso remove o spinner de loading
                        $ionicLoading.hide();

                    });
                });

            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Não foi possível obter o resultado da enquete.',
                    template: 'Verifique sua conexão com ineternet.',
                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                });

                alertPopup.then(function (res) {

                    $backView = $ionicHistory.backView();
                    $backView.go();

                });
            }

        }])

    .controller('alterarASenhaCtrl', ['$scope', '$stateParams', 'alterarSenha', '$cordovaNetwork', '$ionicLoading', '$ionicPopup', '$ionicHistory', 'LOCAL_STORAGE', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, alterarSenha, $cordovaNetwork, $ionicLoading, $ionicPopup, $ionicHistory, LOCAL_STORAGE) {

            $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));

            $scope.alterarSenhaUsuario = function (form, data) {

                if (form.$valid) {

                    if (data.novaSenha == data.confirmaSenha) {

                        var dados = {
                            usuario: $scope.dadosUsuario.cpf,
                            senha_atual: data.senhaAtual,
                            nova_senha: data.novaSenha,

                        };
                        if ($cordovaNetwork.isOnline()) {

                            $ionicLoading.show({ template: '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner> <br/>Alterando...' }).then(function () {

                                alterarSenha.alterar(dados).then(function (retorno) {

                                    if (retorno.data.result == true) {

                                        //Setanto nova senha para obter token
                                        window.localStorage.setItem(LOCAL_STORAGE.senhaObterToken, data.novaSenha);

                                        var alertPopup = $ionicPopup.alert({
                                            title: retorno.data.data.mensagem,
                                            okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                            okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                        });

                                        alertPopup.then(function (res) {

                                            $backView = $ionicHistory.backView();
                                            $backView.go();

                                        });

                                    } else if (retorno.data.result == false) {

                                        var alertPopup = $ionicPopup.alert({
                                            title: retorno.data.data.mensagem,
                                            okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                            okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                        });
                                    }

                                }).finally(function () {
                                    //em qualquer caso remove o spinner de loading
                                    $ionicLoading.hide();

                                });
                            });

                        } else {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Não foi possível alterar senha.',
                                template: 'Verifique sua conexão com ineternet.',
                                okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                            });

                            alertPopup.then(function (res) {

                                $backView = $ionicHistory.backView();
                                $backView.go();

                            });
                        }
                    } else {

                        var alertPopup = $ionicPopup.alert({
                            title: 'ATENÇÃO!',
                            template: 'As novas senhas não conferem.',
                            okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                            okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                        });
                    }

                }
            };


        }])

    .controller('esqueceuASenhaCtrl', ['$scope', '$stateParams', '$state', 'RecuperarSenhaService', '$ionicPopup', '$cordovaNetwork', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, $state, RecuperarSenhaService, $ionicPopup, $cordovaNetwork) {

            $scope.data = {};

            $scope.recuperar = function (form, data) {
                if (form.$valid) {
                    if ($cordovaNetwork.isOnline()) {

                        RecuperarSenhaService.enviarEmailRecuperarSenha(data).then(function (dados) {

                            if (dados.data.indexOf("sucesso") != -1) {
                                var alertPopup = $ionicPopup.alert({
                                    title: dados.data,
                                    //template: 'Foi enviado um e-mail para redefinição de senha',
                                    okText: 'OK', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                });

                                alertPopup.then(function (res) {

                                    $state.go('aMPEBAPP');

                                });

                            } else if (dados.data == "Seu email não existe na base de dados.") {
                                var alertPopup = $ionicPopup.alert({
                                    title: dados.data,
                                    template: 'Verifique o CPF informado.',
                                    okText: 'OK', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                });
                            } else {
                                var alertPopup = $ionicPopup.alert({
                                    title: dados.data,
                                    template: 'Falha na solicitação, favor entrar em contato com a administração.',
                                    okText: 'OK', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                });
                            }

                        });
                    } else {
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

    .controller('transmissOAoVivoCtrl', ['$scope', '$stateParams', 'getConfiguracaoPresencaAssembleia', '$cordovaNetwork', '$ionicPopup', '$ionicHistory', 'obterTransmissaoAoVivo', '$q', 'getConfiguracaoAplicativo', '$ionicLoading', 'verificarConfirmacaoPresencaAssembleia', 'LOCAL_STORAGE', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, getConfiguracaoPresencaAssembleia, $cordovaNetwork, $ionicPopup, $ionicHistory, obterTransmissaoAoVivo, $q, getConfiguracaoAplicativo, $ionicLoading, verificarConfirmacaoPresencaAssembleia, LOCAL_STORAGE) {

            $scope.titulo = {};
            $scope.url = {};
            $scope.rodape = {};
            $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));
            var dataUser = { cpf: $scope.dadosUsuario.cpf };

            $scope.registarAssembleia = function () {

                if ($cordovaNetwork.isOnline()) {

                    var paramTitulo = { chave: "transmissao_ao_vivo_titulo" };
                    var getTitulo = getConfiguracaoAplicativo.obter(paramTitulo).then(function (retornoTitulo) {
                        return retornoTitulo;
                    });

                    var paramUrl = { chave: "transmissao_ao_vivo_url_video" };
                    var getUrl = getConfiguracaoAplicativo.obter(paramUrl).then(function (retornoUrl) {
                        return retornoUrl;
                    });

                    var paramTextoRodape = { chave: "transmissao_ao_vivo_texto_abaixo_video" };
                    var getTextoRodape = getConfiguracaoAplicativo.obter(paramTextoRodape).then(function (retornoTextoRodape) {
                        return retornoTextoRodape;
                    });

                    var paramAlerta = { chave: "transmissao_ao_vivo_exibir_alerta" };
                    var getAlerta = getConfiguracaoAplicativo.obter(paramAlerta).then(function (retornoAlerta) {
                        return retornoAlerta;
                    });

                    var paramTipoAlerta = { chave: "transmissao_ao_vivo_id_tipo_alerta" };
                    var getTipoAlerta = getConfiguracaoAplicativo.obter(paramTipoAlerta).then(function (retornoTipoAlerta) {
                        return retornoTipoAlerta;
                    });

                    var paramTextoAlerta = { chave: "transmissao_ao_vivo_texto_mensagem_alerta" };
                    var getTextoAlerta = getConfiguracaoAplicativo.obter(paramTextoAlerta).then(function (retornoTextoAlerta) {
                        return retornoTextoAlerta;
                    });


                    var paramEnviaConfirmacao = { chave: "transmissao_ao_vivo_enviar_email_confirmacao" };
                    var getEnviaConfirmacao = getConfiguracaoAplicativo.obter(paramEnviaConfirmacao).then(function (retornoEnviaConfirmacao) {
                        return retornoEnviaConfirmacao;
                    });



                    var retornoTransmissao = [];
                    $ionicLoading.show().then(function () {

                        //Pega o retorno de forma sincrona do ajax.
                        $q.all([getTitulo, getUrl, getTextoRodape, getAlerta, getTipoAlerta, getTextoAlerta, getEnviaConfirmacao]).then(function (result) {

                            for (var i = 0; i < result.length; i++) {
                                retornoTransmissao.push(result[i]);
                            }
                            $scope.titulo = retornoTransmissao[0].data.data[0].valor;
                            $scope.url = retornoTransmissao[1].data.data[0].valor;
                            $scope.rodape = retornoTransmissao[2].data.data[0].valor;

                            if (retornoTransmissao[3].data.data[0].valor == "S" && retornoTransmissao[6].data.data[0].valor == "S" && retornoTransmissao[4].data.data[0].valor == "1") {

                                var confirmPopup = $ionicPopup.confirm({
                                    title: retornoTransmissao[5].data.data[0].valor,
                                    okText: 'Sim', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                    cancelText: 'Não'

                                });

                                confirmPopup.then(function (res) {

                                    if (res) {
                                        //Enviando e-mail de confirmação
                                        $scope.enviaEmailConfirmacao(dataUser);

                                    } else {

                                        // console.log('Email não enviado!');

                                    }
                                });
                            } else if (retornoTransmissao[3].data.data[0].valor == "S" && retornoTransmissao[6].data.data[0].valor == "S" && retornoTransmissao[4].data.data[0].valor == "2") {

                                var alertPopup = $ionicPopup.alert({
                                    title: retornoTransmissao[5].data.data[0].valor,
                                    okText: 'OK', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                });

                                alertPopup.then(function (res) {

                                    //Enviando e-mail de confirmação
                                    $scope.enviaEmailConfirmacao(dataUser);

                                });
                            } else if (retornoTransmissao[3].data.data[0].valor == "N" && retornoTransmissao[6].data.data[0].valor == "S") {

                                //Enviando e-mail de confirmação
                                $scope.enviaEmailConfirmacao(dataUser);
                            }




                        }).finally(function () {
                            //em qualquer caso remove o spinner de loading
                            $ionicLoading.hide();

                        });
                    });

                } else {

                    var alertPopup = $ionicPopup.alert({
                        title: 'Transmissão ao vivo indisponível.',
                        template: 'Por favor, verifque sua conexão com a internet',
                        okText: 'OK', // String (default: 'OK'). The text of the OK button.
                        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                    });

                    alertPopup.then(function (res) {

                        $backView = $ionicHistory.backView();
                        $backView.go();

                    });
                }
            }
            $scope.enviaEmailConfirmacao = function (data) {

                verificarConfirmacaoPresencaAssembleia.enviar(data).then(function (retornoEnvioConfirmacao) {
                    // console.log(JSON.stringify(retornoEnvioConfirmacao));
                });
            }
            //Chamando a função para registrar a assembléia
            $scope.registarAssembleia();
        }])

    .controller('contatoCtrl', ['$scope', '$stateParams', 'getTipoContatoTelefonicoService', 'getOperadorasTelefoneService', '$q', 'LOCAL_STORAGE', '$ionicLoading', '$ionicHistory', '$ionicPopup', 'salvarDadosContatoAssociado', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, getTipoContatoTelefonicoService, getOperadorasTelefoneService, $q, LOCAL_STORAGE, $ionicLoading, $ionicHistory, $ionicPopup, salvarDadosContatoAssociado) {



            $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));

            $scope.tiposContato = {};
            $scope.operadoras = {};

            //Verifica se o numero é principal para setar o toggle como true
            var togglePrincipal = false;
            if ($stateParams.principal == "S") {
                togglePrincipal = true;
            }

            //Verifica se o permite divulgar para setar o toggle como true
            var toggleDivulgar = false;
            if ($stateParams.permitir_divulgar == "S") {
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
            $scope.mascaraNumero = function (tipoContato) {


                if (tipoContato == 1) {
                    $scope.dadosContato.mascara = "(99) 99999-9999";
                } else {
                    $scope.dadosContato.mascara = "(99) 9999-9999";
                }
            }

            $scope.mascaraNumero($stateParams.id_tipo_contatos_telefonicos);
            //Funcao para obter os combos da tela 
            $scope.obterCombos = function () {

                var tiposContatos = getTipoContatoTelefonicoService.getTipoContato().then(function (data) {
                    return data;
                });

                var operadoras = getOperadorasTelefoneService.getOperadoras().then(function (data) {
                    return data;
                });


                var retornoCombos = [];

                $ionicLoading.show().then(function () {
                    //Pega o retorno de forma sincrona do ajax.
                    $q.all([tiposContatos, operadoras]).then(function (result) {
                        for (var i = 0; i < result.length; i++) {
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
            $scope.salvarContato = function (form, dadosContato) {


                var contatoPrincipal = "N";

                if (dadosContato.principal == true) {
                    contatoPrincipal = "S";
                }

                var permiteDivulgar = "N";

                if (dadosContato.permitir_divulgar == true) {
                    permiteDivulgar = "S";
                }

                if (dadosContato.observacao == null) {
                    dadosContato.observacao = "";
                }


                //Testando se para inserir ou alterar
                if (dadosContato.id_associados_contatos_telefonicos != null) {
                    //Criptografando os dados
                    var data = { cpf: dadosContato.cpf, id_associados_contatos_telefonicos: dadosContato.id_associados_contatos_telefonicos, id_tipo_contatos_telefonicos: dadosContato.id_tipo_contatos_telefonicos, principal: contatoPrincipal, permitir_divulgar: permiteDivulgar, numero_contato: btoa(dadosContato.numero_contato), id_operadora_telefones: dadosContato.id_operadora_telefones, observacao: btoa(dadosContato.observacao), id_usuario: dadosContato.id_usuario };
                } else {
                    //Criptografando os dados
                    var data = { cpf: dadosContato.cpf, id_tipo_contatos_telefonicos: dadosContato.id_tipo_contatos_telefonicos, principal: contatoPrincipal, permitir_divulgar: permiteDivulgar, numero_contato: btoa(dadosContato.numero_contato), id_operadora_telefones: dadosContato.id_operadora_telefones, observacao: btoa(dadosContato.observacao), id_usuario: dadosContato.id_usuario, chave_externa: dadosContato.chave_externa };
                }


                if (form.$valid) {
                    $ionicLoading.show({
                        template: '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner> <br/> Salvando...'
                    }).then(function () {

                        salvarDadosContatoAssociado.salvar(data).then(function (retorno) {


                            if (retorno.data.result == true) {

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Contato salvo com sucesso.',
                                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                });

                                alertPopup.then(function (res) {

                                    $backView = $ionicHistory.backView();
                                    $backView.go();

                                });

                            } else {

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

    .controller('buscarConvNiosCtrl', ['$scope', '$stateParams', 'getTipoConvenioService', '$ionicLoading', 'getMunicipiosConvenioService', 'getConvenioService', '$cordovaNetwork', 'conveniosFactory', '$ionicPopup', '$ionicHistory', 'LOCAL_STORAGE', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, getTipoConvenioService, $ionicLoading, getMunicipiosConvenioService, getConvenioService, $cordovaNetwork, conveniosFactory, $ionicPopup, $ionicHistory, LOCAL_STORAGE) {

            $scope.municipiosConvenio = {};
            $scope.tiposConvenio = {};
            var dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));

            if ($cordovaNetwork.isOnline()) {

                $ionicLoading.show().then(function () {
                    getMunicipiosConvenioService.getMunicipiosConvenio().then(function (dadosMunicipio) {

                        $scope.municipiosConvenio = dadosMunicipio;

                    }).finally(function () {
                        //Apos carregar os municipios carregar os tipo de convenios
                        getTipoConvenioService.getTipoConvenio().then(function (dadosTipoConvenio) {


                            //Verificando a exibição de convenios privados (conamp)
                            for (var i = 0; i < dadosTipoConvenio.length; i++) {

                                if (dadosTipoConvenio[i].flPrivado == 1) {

                                    if (dadosUsuario == null) {
                                        dadosTipoConvenio[i].display = "none";
                                    } else {
                                        dadosTipoConvenio[i].display = "block";
                                    }

                                } else {
                                    dadosTipoConvenio[i].display = "block";
                                }

                            }

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
            } else {

                $ionicLoading.show().then(function () {

                    conveniosFactory.selectMunicipioConvenio().then(function (dadosMunicipio) {

                        $scope.municipiosConvenio = dadosMunicipio;

                    }).finally(function () {
                        conveniosFactory.selectTipoConvenio().then(function (dadosTipoConvenio) {

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

                            } else {
                                $scope.tiposConvenio = dadosTipoConvenio;
                            }


                        }).finally(function () {

                            $ionicLoading.hide();

                        });
                    });

                });

            }

        }])

    .controller('endereOCtrl', ['$scope', '$stateParams', 'getTipoEndereco', 'getEstado', 'getMunicipios', '$ionicLoading', '$q', '$state', 'LOCAL_STORAGE', 'salvarDadosEnderecoAssociado', '$ionicHistory', '$ionicPopup', 'getConfiguracaoAplicativo', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, getTipoEndereco, getEstado, getMunicipios, $ionicLoading, $q, $state, LOCAL_STORAGE, salvarDadosEnderecoAssociado, $ionicHistory, $ionicPopup, getConfiguracaoAplicativo) {
            $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));

            $scope.tiposEndereco = {};
            $scope.estados = {};
            $scope.municipios = {};

            //Verifica se o endereço é principal para setar o toggle como true
            var togglePrincipal = false;
            if ($stateParams.principal == "S") {
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
            $scope.obterCombos = function () {

                //Pega os tipos de endereços.
                var tiposEndereco = getTipoEndereco.obter().then(function (retornoTipoEndereco) {
                    return retornoTipoEndereco;
                });

                //Pega os estados.
                var estados = getEstado.obter().then(function (retornoEstados) {
                    return retornoEstados;
                });

                //Pega os municipios.
                var data = { id_estado: $scope.dadosEndereco.id_estado }; //Passando o estado como parametro.
                var municipios = getMunicipios.obter(data).then(function (retornoMunicipios) {
                    return retornoMunicipios;
                });

                //Retorna o texto de configgurção do aplicativo
                var dataConfiguracao = { chave: "meu_cadastro_endereco_principal" };
                var textoRodape = getConfiguracaoAplicativo.obter(dataConfiguracao).then(function (retornoTextoRodape) {
                    return retornoTextoRodape;
                });

                var retornoCombos = [];

                $ionicLoading.show().then(function () {

                    //Pega o retorno de forma sincrona do ajax.
                    $q.all([tiposEndereco, estados, municipios, textoRodape]).then(function (result) {
                        for (var i = 0; i < result.length; i++) {
                            retornoCombos.push(result[i]);
                        }

                        $scope.tiposEndereco = retornoCombos[0].data.data;
                        $scope.estados = retornoCombos[1].data.data;
                        $scope.municipios = retornoCombos[2].data.data;
                        $scope.textoRodape = retornoCombos[3].data.data[0].valor;
                    }).finally(function () {

                        $ionicLoading.hide();

                    });
                });


            };
            //Chama a função para obter combos
            $scope.obterCombos();

            //Função paa ataulizar os dados pessoais.
            $scope.salvarEndereco = function (form, dadosEndereco) {


                var enderecoPrincipal = "N";

                if (dadosEndereco.principal == true) {
                    enderecoPrincipal = "S";
                }

                if (dadosEndereco.ponto_de_referencia == null) {
                    dadosEndereco.ponto_de_referencia = "";
                }


                //Testando se para inserir ou alterar
                if (dadosEndereco.id_associados_enderecos != null) {

                    var data = { cpf: $scope.dadosEndereco.cpf, id_associados_enderecos: dadosEndereco.id_associados_enderecos, id_usuario: dadosEndereco.id_usuario, id_tipo_endereco: dadosEndereco.id_tipo_endereco, principal: enderecoPrincipal, descricao_endereco: btoa(dadosEndereco.descricao_endereco), id_estado: dadosEndereco.id_estado, id_municipio: dadosEndereco.id_municipio, ponto_de_referencia: btoa(dadosEndereco.ponto_de_referencia), observacoes: btoa(dadosEndereco.observacoes), chave_externa: dadosEndereco.chave_externa };
                } else {
                    var data = { cpf: $scope.dadosEndereco.cpf, id_usuario: dadosEndereco.id_usuario, id_tipo_endereco: dadosEndereco.id_tipo_endereco, principal: enderecoPrincipal, descricao_endereco: btoa(dadosEndereco.descricao_endereco), id_estado: dadosEndereco.id_estado, id_municipio: dadosEndereco.id_municipio, ponto_de_referencia: btoa(dadosEndereco.ponto_de_referencia), observacoes: btoa(dadosEndereco.observacoes), chave_externa: dadosEndereco.chave_externa };
                }


                if (form.$valid) {
                    $ionicLoading.show({
                        template: '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner> <br/> Salvando...'
                    }).then(function () {

                        salvarDadosEnderecoAssociado.salvar(data).then(function (retorno) {


                            if (retorno.data.result == true) {

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Endereço salvo com sucesso.',
                                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                });

                                alertPopup.then(function (res) {

                                    $backView = $ionicHistory.backView();
                                    $backView.go();

                                });

                            } else {

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

    .controller('dadosPessoaisCtrl', ['$scope', '$stateParams', 'getDadosPessoaisAssociadoService', '$ionicLoading', '$ionicPopup', '$cordovaNetwork', 'LOCAL_STORAGE', 'atualizarDadosPessoaisAssociado', '$ionicHistory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, getDadosPessoaisAssociadoService, $ionicLoading, $ionicPopup, $cordovaNetwork, LOCAL_STORAGE, atualizarDadosPessoaisAssociado, $ionicHistory) {

            //Pegando dados do usuário logado
            $scope.dadosUsuario = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.local_dados_key));

            $scope.dadosPessoais = {};

            $ionicLoading.show().then(function () {


                getDadosPessoaisAssociadoService.obter($scope.dadosUsuario.cpf).then(function (dadosPessoais) {
                    //Descriptografando os dados em base64
                    $scope.dadosPessoais = {
                        id_associados_dados_pessoais: dadosPessoais.data.data[0].id_associados_dados_pessoais,
                        nome_associado: decodeURIComponent(escape(atob(dadosPessoais.data.data[0].nome_associado))),
                        cpf: decodeURIComponent(escape(atob(dadosPessoais.data.data[0].cpf))),
                        identidade: decodeURIComponent(escape(atob(dadosPessoais.data.data[0].identidade))),
                        dt_nascimento: decodeURIComponent(escape(atob(dadosPessoais.data.data[0].dt_nascimento))),
                        email_associado: decodeURIComponent(escape(atob(dadosPessoais.data.data[0].email_associado))),
                        email_alternativo_associado: decodeURIComponent(escape(atob(dadosPessoais.data.data[0].email_alternativo_associado))),
                        chave_externa: dadosPessoais.data.data[0].chave_externa,
                        matricula: decodeURIComponent(escape(atob(dadosPessoais.data.data[0].matricula)))
                    };

                    //Transformando a data em objeto
                    var dataNacimentoHora = $scope.dadosPessoais.dt_nascimento.split(" ");
                    var dt = new Date(dataNacimentoHora[0]);
                    //Colocando o gmt pois a data estava ficando com um dia a menos         
                    $scope.dadosPessoais.dt_nascimento = new Date(dt.getTime() + Math.abs(dt.getTimezoneOffset() * 60000));


                }).finally(function () {

                    $ionicLoading.hide();

                });

            });

            //Função paa ataulizar os dados pessoais.
            $scope.atualizaDadosPessoais = function (form, dadosPessoais) {
                //Criptografando os dados em base64             
                var dados = { cpf: btoa($scope.dadosUsuario.cpf), nome_associado: btoa(dadosPessoais.nome_associado), identidade: btoa(dadosPessoais.identidade), dt_nascimento: btoa(dadosPessoais.dt_nascimento), email_associado: btoa(dadosPessoais.email_associado), email_alternativo_associado: btoa(dadosPessoais.email_alternativo_associado), matricula: btoa(dadosPessoais.matricula), id_usuario: $scope.dadosUsuario.id_usuario };

                if (form.$valid) {
                    $ionicLoading.show({
                        template: '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner> <br/>Atualizando...'
                    }).then(function () {

                        atualizarDadosPessoaisAssociado.atualizar(dados).then(function (retorno) {

                            if (retorno.data.result == true) {

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Dados pessoais atualizados com sucesso.',
                                    okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                                    okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                                });

                                alertPopup.then(function (res) {

                                    $backView = $ionicHistory.backView();
                                    $backView.go();

                                });

                            } else {

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
    .controller('novidadesConveniosCtrl', ['$scope', '$stateParams', 'obterNoticiasService', 'noticiasFactory', '$ionicPopup', 'LOCAL_STORAGE', '$ionicLoading', '$cordovaNetwork', '$ionicHistory', 'obterNoticiasServiceObterMais', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, obterNoticiasService, noticiasFactory, $ionicPopup, LOCAL_STORAGE, $ionicLoading, $cordovaNetwork, $ionicHistory, obterNoticiasServiceObterMais) {
            //Variáveis declaradas para paginação
            $scope.pagina = 1;
            $scope.listaNoticias = [];
            $scope.moreDataCanBeLoaded = true;
            //Verifica se estivar online pega dados via serviço 
            if ($cordovaNetwork.isOnline()) {

                $ionicLoading.show({ template: '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner> <br/> Buscando...' }).then(function () {

                    obterNoticiasService.obterNoticiasOnline().then(function (dados) {

                        $scope.listaNoticias = dados;

                        noticiasFactory.marcarNoticiasLidas().then(function (marcados) {

                        }).finally(function () {
                            //em qualquer caso remove o spinner de loading
                            $ionicLoading.hide();
                        });

                    });
                });

            } else {
                //Pega dados do banco
                $ionicLoading.show().then(function () {
                    noticiasFactory.selectListaNoticias($stateParams.tipo).then(function (dados) {

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

            //Função para obter mais noticias.
            $scope.obterMais = function () {

                if ($cordovaNetwork.isOnline()) {
                    //Contador para pedir proxima pagina ao seviço
                    $scope.pagina++;

                    obterNoticiasServiceObterMais.obter($scope.pagina).then(function (retorno) {

                        //Concatenando as novas informações ao array existente de noticias
                        $scope.listaNoticias = $scope.listaNoticias.concat(retorno);

                        //Teste para verificar quando tem mais posts para carregar, caso não tenha faz com que o loading do infinte scroll pare de rodar
                        if (retorno.length == 0) {
                            $scope.moreDataCanBeLoaded = false;
                        }
                        //Encerra o loading
                        $scope.$broadcast('scroll.infiniteScrollComplete');

                    });
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Sem conexão com a internet.',
                        template: 'Para obter mais dados, conecte seu dispositivo a internet.',
                        okText: 'Ok', // String (default: 'OK'). The text of the OK button.
                        okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
                    });
                }

            };



        }])
    .controller('novidadesConveniosDetalheCtrl', ['$scope', '$stateParams', 'obterNoticiasService', 'noticiasFactory', '$ionicPopup', 'LOCAL_STORAGE', '$ionicLoading', '$cordovaNetwork', '$ionicHistory', 'obterNoticiasServiceObterMais', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams, obterNoticiasService, noticiasFactory, $ionicPopup, LOCAL_STORAGE, $ionicLoading, $cordovaNetwork, $ionicHistory, obterNoticiasServiceObterMais) {
            //Variáveis declaradas para paginação

            //Abrir o pdf com o google.
            $scope.openBrowserPdfConvenios = function (url) {

                var link = url;
                cordova.InAppBrowser.open(link, "_system", "location=no,toolbar=no,hardwareback=yes");
            };

        }])


