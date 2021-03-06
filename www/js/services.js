angular.module('app.services', [])
    /***** Serviços para o modulo de contatos *****/
    .service('getTipoContatoTelefonicoService', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {


        return {
            getTipoContato: function () {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getTipoContatoTelefonico").then(function (response) {


                    return response;

                });
            }
        };

    }])
    .service('getOperadorasTelefoneService', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {


        return {
            getOperadoras: function () {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getOperadorasTelefone").then(function (response) {


                    return response;

                });
            }
        };

    }])
    .service('getDadosContatosAssociado', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {

        return {

            obter: function (data) {

                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                return $http.post(WEB_METODOS.urlServicosSistema + "?m=getDadosContatosAssociado", $httpParamSerializerJQLike(data)).then(function (response) {
                    return response;
                });

            }
        };


    }])
    .service('salvarDadosContatoAssociado', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {


        return {

            salvar: function (data) {

                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                return $http.post(WEB_METODOS.urlServicosSistema + "?m=salvarDadosContatoAssociado", $httpParamSerializerJQLike(data)).then(function (response) {
                    return response;
                });

            }
        };


    }])
    .service('excluirDadosContatoAssociado', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {


        return {

            excluir: function (data) {

                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                return $http.post(WEB_METODOS.urlServicosSistema + "?m=excluirDadosContatoAssociado", $httpParamSerializerJQLike(data)).then(function (response) {
                    return response;
                });

            }
        };


    }])
    /***** Serviços para o modulo de convenios *****/
    .service('getTipoConvenioService', ['$http', '$q', 'WEB_METODOS', 'conveniosFactory', function ($http, $q, WEB_METODOS, conveniosFactory) {
        //Metodo para obter os tipos do convenio
        var listaTipoConvenio = $http.get(WEB_METODOS.urlServicosSistema + "?m=getTipoConvenio").then(function (response) {

            for (var i = 0; i < response.data.data.length; i++) {

                var id = response.data.data[i].id_tipo_convenio;
                var nmTipoConvenio = response.data.data[i].nome_tipo_convenio;
                var flPrivado = 0;
                if (response.data.data[i].privado_tipo_convenio == true) {
                    flPrivado = 1
                }
                var dsUrlImagem = WEB_METODOS.urlImagemTipoConvenio + response.data.data[i].imagem_tipo_convenio;
                conveniosFactory.insertTipoConvenio(id, nmTipoConvenio, flPrivado, dsUrlImagem);

            }

            //Verificar a melhor forma na tela bloqueada
            var deferred = $q.defer();
            conveniosFactory.selectTipoConvenio().then(function (dadosOnline) {

                deferred.resolve(dadosOnline);
            });


            return deferred.promise;


        });

        return {
            getTipoConvenio: function () {
                return listaTipoConvenio;
            }
        };




    }])
    .service('getMunicipiosConvenioService', ['$http', '$q', 'WEB_METODOS', 'conveniosFactory', function ($http, $q, WEB_METODOS, conveniosFactory) {
        //Metodo para obter os municipios do convenio
        var listaMunicipioConvenio = $http.get(WEB_METODOS.urlServicosSistema + "?m=getMunicipiosConvenio").then(function (response) {

            for (var i = 0; i < response.data.data.length; i++) {

                var id = response.data.data[i].id_municipio;
                var nmMunicipioConvenio = response.data.data[i].nome_municipio;

                conveniosFactory.insertMunicipioConvenio(id, nmMunicipioConvenio);

            }

            var deferred = $q.defer();
            conveniosFactory.selectMunicipioConvenio().then(function (dadosOnline) {

                deferred.resolve(dadosOnline);
            });

            return deferred.promise;


        });

        return {

            getMunicipiosConvenio: function () {

                return listaMunicipioConvenio;

            }
        };



    }])
    .service('getConvenioService', ['$http', '$q', 'WEB_METODOS', 'conveniosFactory', function ($http, $q, WEB_METODOS, conveniosFactory) {
        //Metodo para obter os convenios   
        var listaConvenios = $http.get(WEB_METODOS.urlServicosSistema + "?m=getConvenios").then(function (response) {

            for (var i = 0; i < response.data.data.length; i++) {

                var id = response.data.data[i].id_convenios;
                var nmConvenio = response.data.data[i].nome_convenio;
                var dsUrlImagem = response.data.data[i].imagem_convenio;
                if (response.data.data[i].imagem_convenio != "") {
                    dsUrlImagem = WEB_METODOS.urlImagemConvenio + response.data.data[i].imagem_convenio;
                }
                var dsConvenio = response.data.data[i].descricao_convenio;
                var nmContato = response.data.data[i].nome_contato;
                var dsTelefone = response.data.data[i].telefones;
                var dsEmail = response.data.data[i].email;
                var urlSite = response.data.data[i].site;
                var dsEndereco = response.data.data[i].endereco;
                var dtInicioVigencia = response.data.data[i].dt_inicio_vigencia;
                var dtTerminoVigencia = response.data.data[i].dt_termino_vigencia;
                var dsDesconto = response.data.data[i].descricao_desconto;
                var flPublicar = response.data.data[i].publicar;
                var idTipoConvenio = response.data.data[i].id_tipo_convenio;
                var nmMunicipio = response.data.data[i].nome_municipio;
                var nmEstado = response.data.data[i].nome_estado;
                var flPrivado = 0;
                if (response.data.data[i].privado_tipo_convenio == true) {
                    flPrivado = 1;
                }
                var nmPais = response.data.data[i].nome_pais;
                var urlAnexo = response.data.data[i].url_arquivo_anexo;
                var latitude = response.data.data[i].latitude;
                var longitude = response.data.data[i].longitude;

                conveniosFactory.insertConvenio(id, nmConvenio, dsUrlImagem, dsConvenio, nmContato, dsTelefone, dsEmail, urlSite, dsEndereco, dtInicioVigencia, dtTerminoVigencia, dsDesconto, flPublicar, idTipoConvenio, nmMunicipio, nmEstado, flPrivado, nmPais, urlAnexo, latitude, longitude);

            }

            //Retorno para fazer o load ficar hide.
            return 1;
        });

        return {

            getConvenio: function () {

                return listaConvenios;

            }
        };
    }])
    .service('getDadosConvenioCONAMP', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {


        return {

            obter: function (data) {

                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                return $http.post(WEB_METODOS.urlServicosSistema + "?m=getDadosConvenioCONAMP", $httpParamSerializerJQLike(data)).then(function (response) {
                    return response;
                });

            }
        };


    }])
    /***** Serviços para o modulo de login *****/
    .service('LoginService', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {
        //Metodo para realizar autentica��o no sistema Ampeb retornando os dados do usu�rio   

        return {

            logar: function (data) {

                var dados = { cpf: data.usuario, senha: data.senha };
                //Usado em requisi��es POSR ($httpParamSerializerJQLike)
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                return $http.post(WEB_METODOS.urlServicosSistema + "?m=loginAssociado", $httpParamSerializerJQLike(dados), { timeout: 30000 }).then(function (response) {
                    return response;
                });

            }
        };


    }])
    /***** Serviços para o modulo de recuperacao de senha *****/
    .service('RecuperarSenhaService', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {
        //Metodo para realizar autentica��o no sistema Ampeb retornando os dados do usu�rio   

        return {
            enviarEmailRecuperarSenha: function (data) {
                var dados = { login: data.usuario };
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                return $http.post(WEB_METODOS.urlRecuperarSenha, $httpParamSerializerJQLike(dados)).then(function (response) {
                    return response;
                });

            }
        };

    }])
    /***** Serviços para o modulo de noticias *****/
    .service('obterNoticiasService', ['$http', '$q', 'WEB_METODOS', 'noticiasFactory', 'LOCAL_STORAGE', function ($http, $q, WEB_METODOS, noticiasFactory, LOCAL_STORAGE) {




        return {
            obterNoticiasOnline: function () {

                return $http.get(WEB_METODOS.urlServicosPortalNoticias + window.localStorage.getItem(LOCAL_STORAGE.filtro_retorno_post), { headers: { 'Authorization': window.localStorage.getItem(LOCAL_STORAGE.local_token) } }).then(function (response) {

                    //Lendo todas as noticias
                    var tipoConsulta = 0;
                    var idNoticias = [];
                    var deferred = $q.defer();

                    if (window.localStorage.getItem(LOCAL_STORAGE.tipo_retorno_post) == "private") {
                        tipoConsulta = 1;
                    }

                    //Loop para verificar e exluir todos os post que sofreram modificações
                    for (var i = 0; i < response.data.length; i++) {
                        noticiasFactory.deleteNoticiasDesatualizadas(response.data[i].id, response.data[i].modified);
                        //Pegando os id das noticias que não serão excluidas
                        idNoticias.push(response.data[i].id);
                    }

                    //Excluindo do banco noticias que não estão mais disponiveis no servico
                    var noticiasExcluir = noticiasFactory.deleteNoticias(idNoticias.join(), tipoConsulta).then(function (noticiasExcluirRetorno) {
                        return noticiasExcluirRetorno;
                    });

                    var retornoNoticiasExibir = [];

                    //Executando a exclusão das noticias
                    $q.all([noticiasExcluir]).then(function (result) {

                        for (var i = 0; i < result.length; i++) {
                            retornoNoticiasExibir.push(result[i]);
                        }

                        if (retornoNoticiasExibir[0][0].retorno == 1) {

                            for (var i = 0; i < response.data.length; i++) {

                                var dsNoticia = "";
                                var dsCategoria = "";
                                var dsUrlImagem = "img/img_not_found.jpg";
                                var dsTitulo = "";
                                var dtNoticiaBD = "";
                                var dtNoticia = "";
                                var dsStatus = "";
                                var dtAtualizacao = "";
                                var categorias = [];

                                //Valida��o de categoria
                                if (response.data[i]._embedded != null) {

                                    if (response.data[i]._embedded['wp:term'] != null) {

                                        if (response.data[i]._embedded['wp:term'][0].length == 1) {

                                            if (response.data[i]._embedded['wp:term'][0][0].name != null) {
                                                dsCategoria = response.data[i]._embedded['wp:term'][0][0].name;
                                            }

                                        } else if (response.data[i]._embedded['wp:term'][0].length > 1) {

                                            for (var j = 0; j < response.data[i]._embedded['wp:term'][0].length; j++) {

                                                if (response.data[i]._embedded['wp:term'][0][j] != null) {
                                                    categorias.push(response.data[i]._embedded['wp:term'][0][j].name);
                                                }
                                            }

                                            var evento = categorias.indexOf("Próximos Eventos");

                                            if (evento > -1) {
                                                dsCategoria = categorias[evento];
                                            } else {
                                                dsCategoria = categorias[0];
                                            }

                                        }
                                    }
                                }


                                //Valida��o de titulo
                                if (response.data[i].title.rendered != null) {
                                    dsTitulo = response.data[i].title.rendered;
                                }

                                //Valida��o da descri��o
                                if (response.data[i].content.rendered != null) {
                                    dsNoticia = response.data[i].content.rendered;
                                }

                                //Valida��o da data
                                if (response.data[i].date != null) {
                                    dtNoticiaBD = response.data[i].date;
                                    //Feito para retorna no servi�o online a data ja no formato correto
                                    var dataNoticiaArray = response.data[i].date.split("T");
                                    var dataNoticia = dataNoticiaArray[0].split("-");
                                    dtNoticia = dataNoticia[2] + "/" + dataNoticia[1] + "/" + dataNoticia[0] + " " + dataNoticiaArray[1];

                                }
                                //Valida��o da url da imagem
                                if (response.data[i]._embedded.hasOwnProperty('wp:featuredmedia')) {
                                    if (response.data[i]._embedded['wp:featuredmedia'][0] != null) {
                                        if (response.data[i]._embedded['wp:featuredmedia'][0].media_details != null) {
                                            if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes != null) {
                                                if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium != null) {
                                                    if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url != null) {
                                                        dsUrlImagem = response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                //Validacao do status
                                if (response.data[i].status != null) {
                                    dsStatus = response.data[i].status;
                                }

                                //Valida��o da data
                                if (response.data[i].modified != null) {
                                    dtAtualizacao = response.data[i].modified;
                                }

                                //Tratamento para não exibir eventos em noticias
                                if (dsCategoria != "Próximos Eventos") {
                                    noticiasFactory.insert(response.data[i].id, dsCategoria, dsTitulo, dsNoticia, dtNoticiaBD, dsUrlImagem, 0, dsStatus, dtAtualizacao, tipoConsulta);

                                }

                            }

                            //Selecionando qual tipo de noticia será 
                            var tipo = window.localStorage.getItem(LOCAL_STORAGE.tipo_retorno_post);

                            //Após excluídas as noticias, seleciona as noticias salvas no banco
                            noticiasFactory.selectListaNoticias(tipo).then(function (dadosOnline) {

                                deferred.resolve(dadosOnline);
                            });

                        }

                    });

                    return deferred.promise;

                });

            }
        };

    }])
    /***** Serviços para o modulo de noticias ler mais *****/
    .service('obterNoticiasServiceObterMais', ['$http', '$q', 'WEB_METODOS', 'noticiasFactory', 'LOCAL_STORAGE', function ($http, $q, WEB_METODOS, noticiasFactory, LOCAL_STORAGE) {




        return {
            obter: function (pagina) {

                return $http.get(WEB_METODOS.urlServicosPortalNoticias + window.localStorage.getItem(LOCAL_STORAGE.filtro_retorno_post) + "&page=" + pagina, { headers: { 'Authorization': window.localStorage.getItem(LOCAL_STORAGE.local_token) } }).then(function (response) {

                    //Lendo todas as noticias
                    var tipoConsulta = 0;
                    var idNoticias = [];
                    var listaNoticias = [];
                    var deferred = $q.defer();

                    if (window.localStorage.getItem(LOCAL_STORAGE.tipo_retorno_post) == "private") {
                        tipoConsulta = 1;
                    }

                    for (var i = 0; i < response.data.length; i++) {

                        var dsNoticia = "";
                        var dsCategoria = "";
                        var dsUrlImagem = "img/img_not_found.jpg";
                        var dsTitulo = "";
                        var dtNoticiaBD = "";
                        var dtNoticia = "";
                        var dsStatus = "";
                        var dtAtualizacao = "";
                        var categorias = [];

                        //Valida��o de categoria
                        if (response.data[i]._embedded != null) {

                            if (response.data[i]._embedded['wp:term'] != null) {

                                if (response.data[i]._embedded['wp:term'][0].length == 1) {

                                    if (response.data[i]._embedded['wp:term'][0][0].name != null) {
                                        dsCategoria = response.data[i]._embedded['wp:term'][0][0].name;
                                    }

                                } else if (response.data[i]._embedded['wp:term'][0].length > 1) {

                                    for (var j = 0; j < response.data[i]._embedded['wp:term'][0].length; j++) {

                                        if (response.data[i]._embedded['wp:term'][0][j] != null) {
                                            categorias.push(response.data[i]._embedded['wp:term'][0][j].name);
                                        }
                                    }

                                    var evento = categorias.indexOf("Próximos Eventos");

                                    if (evento > -1) {

                                        dsCategoria = categorias[evento];

                                    } else {

                                        dsCategoria = categorias[0];

                                    }

                                }
                            }
                        }


                        //Valida��o de titulo
                        if (response.data[i].title.rendered != null) {
                            dsTitulo = response.data[i].title.rendered;
                        }

                        //Valida��o da descri��o
                        if (response.data[i].content.rendered != null) {
                            dsNoticia = response.data[i].content.rendered;
                        }

                        //Valida��o da data
                        if (response.data[i].date != null) {
                            dtNoticiaBD = response.data[i].date;
                            //Feito para retorna no servi�o online a data ja no formato correto
                            var dataNoticiaArray = response.data[i].date.split("T");
                            var dataNoticia = dataNoticiaArray[0].split("-");
                            dtNoticia = dataNoticia[2] + "/" + dataNoticia[1] + "/" + dataNoticia[0] + " " + dataNoticiaArray[1];

                        }
                        //Valida��o da url da imagem
                        if (response.data[i]._embedded.hasOwnProperty('wp:featuredmedia')) {
                            if (response.data[i]._embedded['wp:featuredmedia'][0] != null) {
                                if (response.data[i]._embedded['wp:featuredmedia'][0].media_details != null) {
                                    if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes != null) {
                                        if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium != null) {
                                            if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url != null) {
                                                dsUrlImagem = response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        //Validacao do status
                        if (response.data[i].status != null) {
                            dsStatus = response.data[i].status;
                        }

                        //Valida��o da data
                        if (response.data[i].modified != null) {
                            dtAtualizacao = response.data[i].modified;
                        }

                        //Tratamento para não exibir eventos em noticias
                        if (dsCategoria != "Próximos Eventos") {

                            listaNoticias.push({
                                "id": response.data[i].id,
                                "dsCategoria": dsCategoria,
                                "dsTitulo": dsTitulo,
                                "dtNoticia": dtNoticia,
                                "dsUrlImagem": dsUrlImagem
                            });

                            noticiasFactory.insert(response.data[i].id, dsCategoria, dsTitulo, dsNoticia, dtNoticiaBD, dsUrlImagem, 1, dsStatus, dtAtualizacao, tipoConsulta);

                        }

                    }

                    return listaNoticias;


                });

            }
        };

    }])
    /***** Serviços para o modulo de eventos *****/
    .service('obterEventosService', ['$http', '$q', 'WEB_METODOS', 'eventosFactory', 'LOCAL_STORAGE', function ($http, $q, WEB_METODOS, eventosFactory, LOCAL_STORAGE) {

        return {
            obterEventosOnline: function () {

                return $http.get(WEB_METODOS.urlServicosPortalEventos + window.localStorage.getItem(LOCAL_STORAGE.filtro_retorno_post), { headers: { 'Authorization': window.localStorage.getItem(LOCAL_STORAGE.local_token) } }).then(function (response) {

                    //Lendo todas as noticias
                    var tipoConsulta = 0;
                    var idNoticias = [];
                    var deferred = $q.defer();

                    if (window.localStorage.getItem(LOCAL_STORAGE.tipo_retorno_post) == "private") {
                        tipoConsulta = 1;
                    }

                    //Loop para verificar e exluir todos os post que sofreram modificações
                    for (var i = 0; i < response.data.length; i++) {

                        eventosFactory.deleteEventosDesatualizados(response.data[i].id, response.data[i].modified);
                        //Pegando os id das noticias que não serão excluidas
                        idNoticias.push(response.data[i].id);
                    }

                    //Excluindo do banco noticias que não estão mais disponiveis no servico
                    var noticiasExcluir = eventosFactory.deleteEventos(idNoticias.join(), tipoConsulta).then(function (noticiasExcluirRetorno) {
                        return noticiasExcluirRetorno;
                    });

                    var retornoNoticiasExibir = [];

                    //Executando a exclusão das noticias
                    $q.all([noticiasExcluir]).then(function (result) {

                        for (var i = 0; i < result.length; i++) {
                            retornoNoticiasExibir.push(result[i]);
                        }

                        if (retornoNoticiasExibir[0][0].retorno == 1) {

                            for (var i = 0; i < response.data.length; i++) {

                                var dsNoticia = "";
                                var dsCategoria = "";
                                var dsUrlImagem = "img/img_not_found.jpg";
                                var dsTitulo = "";
                                var dtNoticiaBD = "";
                                var dtNoticia = "";
                                var dsStatus = "";
                                var dtAtualizacao = "";
                                var categorias = [];
                                var dtEvento = "";

                                //Valida��o de categoria
                                if (response.data[i]._embedded != null) {

                                    if (response.data[i]._embedded['wp:term'] != null) {

                                        if (response.data[i]._embedded['wp:term'][0].length == 1) {

                                            if (response.data[i]._embedded['wp:term'][0][0].name != null) {
                                                dsCategoria = response.data[i]._embedded['wp:term'][0][0].name;
                                            }

                                        } else if (response.data[i]._embedded['wp:term'][0].length > 1) {

                                            for (var j = 0; j < response.data[i]._embedded['wp:term'][0].length; j++) {

                                                if (response.data[i]._embedded['wp:term'][0][j] != null) {
                                                    categorias.push(response.data[i]._embedded['wp:term'][0][j].name);
                                                }
                                            }

                                            var evento = categorias.indexOf("Próximos Eventos");

                                            if (evento > -1) {
                                                dsCategoria = categorias[evento];
                                            } else {
                                                dsCategoria = categorias[0];
                                            }

                                        }
                                    }
                                }


                                //Valida��o de titulo
                                if (response.data[i].title.rendered != null) {
                                    dsTitulo = response.data[i].title.rendered;
                                }

                                //Valida��o da descri��o
                                if (response.data[i].content.rendered != null) {
                                    dsNoticia = response.data[i].content.rendered;
                                }

                                //Valida��o da data
                                if (response.data[i].date != null) {
                                    dtNoticiaBD = response.data[i].date;
                                    //Feito para retorna no servi�o online a data ja no formato correto
                                    var dataNoticiaArray = response.data[i].date.split("T");
                                    var dataNoticia = dataNoticiaArray[0].split("-");
                                    dtNoticia = dataNoticia[2] + "/" + dataNoticia[1] + "/" + dataNoticia[0] + " " + dataNoticiaArray[1];

                                }

                                //Valida��o da data do evento
                            /*    if (response.data[i].acf.data_evento != null) {

                                    var dataEventoArray = response.data[i].acf.data_evento.split(" ");
                                    var dataEvento = dataEventoArray[0].split("/");
                                    dtEvento = dataEvento[2] + "-" + dataEvento[1] + "-" + dataEvento[0] + "T" + dataNoticiaArray[1];


                                }*/

                                //Valida��o da url da imagem
                                if (response.data[i]._embedded.hasOwnProperty('wp:featuredmedia')) {
                                    if (response.data[i]._embedded['wp:featuredmedia'][0] != null) {
                                        if (response.data[i]._embedded['wp:featuredmedia'][0].media_details != null) {
                                            if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes != null) {
                                                if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium != null) {
                                                    if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url != null) {
                                                        dsUrlImagem = response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                //Validacao do status
                                if (response.data[i].status != null) {
                                    dsStatus = response.data[i].status;
                                }

                                //Valida��o da data
                                if (response.data[i].modified != null) {
                                    dtAtualizacao = response.data[i].modified;
                                }

                                //Tratamento para não exibir eventos em noticias
                                if (dsCategoria == "Próximos Eventos") {

                                    //Valida��o da data do evento
                                    if (response.data[i].acf.data_evento != null) {

                                        var dataEventoArray = response.data[i].acf.data_evento.split(" ");
                                        var dataEvento = dataEventoArray[0].split("/");
                                        var horaEvento = dataEventoArray[0].split(":");
                                        dtEvento = dataEvento[2] + "-" + dataEvento[1] + "-" + dataEvento[0] + "T" + dataNoticiaArray[1];

                                        var objDataEvento = new Date(dataEvento[2], dataEvento[1], dataEvento[0], horaEvento[0], horaEvento[1], horaEvento[2]);
                                        var dataAtual = new Date();
                                       
                                        var eventoLido = 1; // Tratamento para não exibir badge para eventos que ja passaram da data de acontecer.
                                        //Tratamento para não exibir eventois que ja passaram
                                        if (objDataEvento > dataAtual) {
                                            eventoLido = 0;
                                            listaNoticias.push({
                                                "id": response.data[i].id,
                                                "dsCategoria": dsCategoria,
                                                "dsTitulo": dsTitulo,
                                                "dtNoticia": dtNoticia,
                                                "dsUrlImagem": dsUrlImagem
                                            });
                                        }
                                        
                                        eventosFactory.insert(response.data[i].id, dsCategoria, dsTitulo, dsNoticia, dtNoticiaBD, dsUrlImagem, eventoLido, dsStatus, dtAtualizacao, tipoConsulta, dtEvento);

                                    }


                                    

                                }

                            }

                            //Selecionando qual tipo de noticia será 
                            var tipo = window.localStorage.getItem(LOCAL_STORAGE.tipo_retorno_post);

                            //Após excluídas as noticias, seleciona as noticias salvas no banco
                            eventosFactory.selectListaNoticias(tipo).then(function (dadosOnline) {

                                deferred.resolve(dadosOnline);
                            });

                        }

                    });

                    return deferred.promise;

                });


            }
        };

    }])
    /***** Serviços para o modulo de eventos *****/
    .service('obterEventosServiceObterMais', ['$http', '$q', 'WEB_METODOS', 'eventosFactory', 'LOCAL_STORAGE', function ($http, $q, WEB_METODOS, eventosFactory, LOCAL_STORAGE) {

        return {
            obter: function (pagina) {

                return $http.get(WEB_METODOS.urlServicosPortalEventos + window.localStorage.getItem(LOCAL_STORAGE.filtro_retorno_post) + "&page=" + pagina, { headers: { 'Authorization': window.localStorage.getItem(LOCAL_STORAGE.local_token) } }).then(function (response) {

                    //Lendo todas as noticias
                    var tipoConsulta = 0;
                    var idNoticias = [];
                    var listaNoticias = [];
                    var deferred = $q.defer();

                    if (window.localStorage.getItem(LOCAL_STORAGE.tipo_retorno_post) == "private") {
                        tipoConsulta = 1;
                    }

                    for (var i = 0; i < response.data.length; i++) {

                        var dsNoticia = "";
                        var dsCategoria = "";
                        var dsUrlImagem = "img/img_not_found.jpg";
                        var dsTitulo = "";
                        var dtNoticiaBD = "";
                        var dtNoticia = "";
                        var dsStatus = "";
                        var dtAtualizacao = "";
                        var categorias = [];
                        var dtEvento = "";

                        //Valida��o de categoria
                        if (response.data[i]._embedded != null) {

                            if (response.data[i]._embedded['wp:term'] != null) {

                                if (response.data[i]._embedded['wp:term'][0].length == 1) {

                                    if (response.data[i]._embedded['wp:term'][0][0].name != null) {
                                        dsCategoria = response.data[i]._embedded['wp:term'][0][0].name;
                                    }

                                } else if (response.data[i]._embedded['wp:term'][0].length > 1) {

                                    for (var j = 0; j < response.data[i]._embedded['wp:term'][0].length; j++) {

                                        if (response.data[i]._embedded['wp:term'][0][j] != null) {
                                            categorias.push(response.data[i]._embedded['wp:term'][0][j].name);
                                        }
                                    }

                                    var evento = categorias.indexOf("Próximos Eventos");

                                    if (evento > -1) {
                                        dsCategoria = categorias[evento];
                                    } else {
                                        dsCategoria = categorias[0];
                                    }

                                }
                            }
                        }


                        //Valida��o de titulo
                        if (response.data[i].title.rendered != null) {
                            dsTitulo = response.data[i].title.rendered;
                        }

                        //Valida��o da descri��o
                        if (response.data[i].content.rendered != null) {
                            dsNoticia = response.data[i].content.rendered;
                        }

                        //Valida��o da data
                        if (response.data[i].date != null) {
                            dtNoticiaBD = response.data[i].date;
                            //Feito para retorna no servi�o online a data ja no formato correto
                            var dataNoticiaArray = response.data[i].date.split("T");
                            var dataNoticia = dataNoticiaArray[0].split("-");
                            dtNoticia = dataNoticia[2] + "/" + dataNoticia[1] + "/" + dataNoticia[0] + " " + dataNoticiaArray[1];

                        }


                        //Valida��o da url da imagem
                        if (response.data[i]._embedded.hasOwnProperty('wp:featuredmedia')) {
                            if (response.data[i]._embedded['wp:featuredmedia'][0] != null) {
                                if (response.data[i]._embedded['wp:featuredmedia'][0].media_details != null) {
                                    if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes != null) {
                                        if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium != null) {
                                            if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url != null) {
                                                dsUrlImagem = response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        //Validacao do status
                        if (response.data[i].status != null) {
                            dsStatus = response.data[i].status;
                        }

                        //Valida��o da data
                        if (response.data[i].modified != null) {
                            dtAtualizacao = response.data[i].modified;
                        }

                        //Tratamento para não exibir eventos em noticias
                        if (dsCategoria == "Próximos Eventos") {


                            //Valida��o da data do evento
                            if (response.data[i].acf.data_evento != null) {

                                var dataEventoArray = response.data[i].acf.data_evento.split(" ");
                                var dataEvento = dataEventoArray[0].split("/");
                                var horaEvento = dataEventoArray[0].split(":");
                                dtEvento = dataEvento[2] + "-" + dataEvento[1] + "-" + dataEvento[0] + "T" + dataNoticiaArray[1];

                                var objDataEvento = new Date(dataEvento[2], dataEvento[1], dataEvento[0], horaEvento[0], horaEvento[1], horaEvento[2]);
                                var dataAtual = new Date();

                                //Tratamento para não exibir eventois que ja passaram
                                if (objDataEvento > dataAtual) {
                                    listaNoticias.push({
                                        "id": response.data[i].id,
                                        "dsCategoria": dsCategoria,
                                        "dsTitulo": dsTitulo,
                                        "dtNoticia": dtNoticia,
                                        "dsUrlImagem": dsUrlImagem
                                    });
                                }

                                eventosFactory.insert(response.data[i].id, dsCategoria, dsTitulo, dsNoticia, dtNoticiaBD, dsUrlImagem, 1, dsStatus, dtAtualizacao, tipoConsulta, dtEvento);


                            }

                        }

                    }

                    return listaNoticias;

                });


            }
        };

    }])
    /***** Serviços para o modulo de meu cadastro *****/
    .service('getDadosPessoaisAssociadoService', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {


        return {
            obter: function (data) {

                var dados = { cpf: data };
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

                return $http.post(WEB_METODOS.urlServicosSistema + "?m=getDadosPessoaisAssociado", $httpParamSerializerJQLike(dados)).then(function (response) {
                    return response;
                });

            }
        };

    }])/***** Serviço para atualizar a foto do perfil *****/
    .service('atualizarFotoAssociado', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {


        return {
            atualizar: function (data) {

                var dados = { cpf: data.cpf, imagem: data.imagem, tipo_imagem: "" };
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

                return $http.post(WEB_METODOS.urlServicosSistema + "?m=atualizarFotoAssociado", $httpParamSerializerJQLike(dados)).then(function (response) {
                    return response;
                });

            }
        };

    }])/***** Serviços para o modulo de login *****/
    .service('getLoginAssociado', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {


        return {

            obter: function (data) {

                var dados = { cpf: data };
                //Usado em requisi��es POSR ($httpParamSerializerJQLike)
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                return $http.post(WEB_METODOS.urlServicosSistema + "?m=getLoginAssociado", $httpParamSerializerJQLike(dados)).then(function (response) {
                    return response;
                });

            }
        };


    }]).service('atualizarDadosPessoaisAssociado', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {


        return {

            atualizar: function (data) {

                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

                return $http.post(WEB_METODOS.urlServicosSistema + "?m=atualizarDadosPessoaisAssociado", $httpParamSerializerJQLike(data)).then(function (response) {
                    return response;
                });

            }
        };


    }])/***** Serviços para o modulo de dados pessoais *****/
    .service('getDadosDependentesAssociado', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {


        return {

            obter: function (data) {

                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                return $http.post(WEB_METODOS.urlServicosSistema + "?m=getDadosDependentesAssociado", $httpParamSerializerJQLike(data)).then(function (response) {
                    return response;
                });

            }
        };


    }])/***** Serviços para o modulo de endereços *****/
    .service('getDadosEnderecoAssociado', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function (data) {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getDadosEnderecoAssociado", { params: data }).then(function (response) {
                    return response;
                });

            }
        };


    }]).service('getTipoEndereco', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function () {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getTipoEndereco").then(function (response) {
                    return response;
                });

            }
        };


    }]).service('getEstado', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function () {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getEstado").then(function (response) {
                    return response;
                });

            }
        };


    }]).service('getMunicipios', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function (data) {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getMunicipios", { params: data }).then(function (response) {
                    return response;
                });

            }
        };


    }])
    .service('salvarDadosEnderecoAssociado', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {


        return {

            salvar: function (data) {

                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                return $http.post(WEB_METODOS.urlServicosSistema + "?m=salvarDadosEnderecoAssociado", $httpParamSerializerJQLike(data)).then(function (response) {
                    return response;
                });

            }
        };


    }])//Serviços para o modulo de contatos Ampeb
    .service('getContatosAMPEB', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function () {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getContatosAMPEB").then(function (response) {
                    return response;
                });

            }
        };

    }])//Serviços para o modulo de transmissão ao vivo
    .service('getConfiguracaoPresencaAssembleia', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function () {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getConfiguracaoPresencaAssembleia").then(function (response) {
                    return response;
                });

            }
        };

    }])//Serviços para o modulo de alteracao de senha
    .service('alterarSenha', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {

        return {

            alterar: function (data) {

                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                return $http.post(WEB_METODOS.urlServicosSistema + "?m=alterarSenha", $httpParamSerializerJQLike(data)).then(function (response) {
                    return response;
                });

            }
        };

    }])//Serviços para o modulo de alteracao de senha
    .service('getToken', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {

        return {

            obter: function (data) {

                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                return $http.post(WEB_METODOS.urlObterToken, $httpParamSerializerJQLike(data), { timeout: 30000 }).then(function (response) {
                    return response;
                });

            }
        };

    }])
    .service('obterFiquePorDentroService', ['$http', '$q', 'WEB_METODOS', 'fiquePorDentroFactory', 'LOCAL_STORAGE', function ($http, $q, WEB_METODOS, fiquePorDentroFactory, LOCAL_STORAGE) {

        return {
            obterNoticiasOnline: function () {

                return $http.get(WEB_METODOS.urlServicosPortalFiquePorDentro, { headers: { 'Authorization': window.localStorage.getItem(LOCAL_STORAGE.local_token) } }).then(function (response) {

                    //Loop para verificar e exluir todos os post que sofreram modificações
                    for (var i = 0; i < response.data.length; i++) {
                        fiquePorDentroFactory.deleteNoticiasDesatualizadas(response.data[i].id, response.data[i].modified);

                    }
                    //Lendo todas as noticias
                    var idNoticias = [];
                    for (var i = 0; i < response.data.length; i++) {

                        var dsNoticia = "";
                        var dsCategoria = "";
                        var dsUrlImagem = "img/img_not_found.jpg";
                        var dsTitulo = "";
                        var dtNoticiaBD = "";
                        var dtNoticia = "";
                        var dsStatus = "";
                        var dtAtualizacao = "";
                        var categorias = [];

                        //Valida��o de categoria
                        if (response.data[i]._embedded != null) {

                            if (response.data[i]._embedded['wp:term'] != null) {

                                if (response.data[i]._embedded['wp:term'][0].length == 1) {

                                    if (response.data[i]._embedded['wp:term'][0][0].name != null) {
                                        dsCategoria = response.data[i]._embedded['wp:term'][0][0].name;
                                    }

                                } else if (response.data[i]._embedded['wp:term'][0].length > 1) {

                                    for (var j = 0; j < response.data[i]._embedded['wp:term'][0].length; j++) {

                                        if (response.data[i]._embedded['wp:term'][0][j] != null) {
                                            categorias.push(response.data[i]._embedded['wp:term'][0][j].name);
                                        }
                                    }

                                    var evento = categorias.indexOf("Próximos Eventos");

                                    if (evento > -1) {
                                        dsCategoria = categorias[evento];
                                    } else {
                                        dsCategoria = categorias[0];
                                    }

                                }
                            }
                        }


                        //Valida��o de titulo
                        if (response.data[i].title.rendered != null) {
                            dsTitulo = response.data[i].title.rendered;
                        }

                        //Valida��o da descri��o
                        if (response.data[i].content.rendered != null) {
                            dsNoticia = response.data[i].content.rendered;
                        }

                        //Valida��o da data
                        if (response.data[i].date != null) {
                            dtNoticiaBD = response.data[i].date;
                            //Feito para retorna no servi�o online a data ja no formato correto
                            var dataNoticiaArray = response.data[i].date.split("T");
                            var dataNoticia = dataNoticiaArray[0].split("-");
                            dtNoticia = dataNoticia[2] + "/" + dataNoticia[1] + "/" + dataNoticia[0] + " " + dataNoticiaArray[1];

                        }
                        //Valida��o da url da imagem
                        if (response.data[i]._embedded.hasOwnProperty('wp:featuredmedia')) {
                            if (response.data[i]._embedded['wp:featuredmedia'][0] != null) {
                                if (response.data[i]._embedded['wp:featuredmedia'][0].media_details != null) {
                                    if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes != null) {
                                        if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium != null) {
                                            if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url != null) {
                                                dsUrlImagem = response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        //Validacao do status
                        if (response.data[i].status != null) {
                            dsStatus = response.data[i].status;
                        }

                        //Valida��o da data
                        if (response.data[i].modified != null) {
                            dtAtualizacao = response.data[i].modified;
                        }

                        //Tratamento para não exibir eventos em noticias
                        if (dsCategoria != "Próximos Eventos") {
                            fiquePorDentroFactory.insert(response.data[i].id, dsCategoria, dsTitulo, dsNoticia, dtNoticiaBD, dsUrlImagem, 0, dsStatus, dtAtualizacao);

                            //Pegando os id das noticias que não serão excluidas
                            idNoticias.push(response.data[i].id);
                        }

                    }

                    var deferred = $q.defer();

                    //Excluindo do banco noticias que não estão mais disponiveis no servico
                    var noticiasExcluir = fiquePorDentroFactory.deleteNoticias(idNoticias.join()).then(function (noticiasExcluirRetorno) {
                        return noticiasExcluirRetorno;
                    });

                    var retornoNoticiasExibir = [];

                    //Executando a exclusão das noticias
                    $q.all([noticiasExcluir]).then(function (result) {

                        for (var i = 0; i < result.length; i++) {
                            retornoNoticiasExibir.push(result[i]);
                        }

                        if (retornoNoticiasExibir[0][0].retorno == 1) {

                            //Após excluídas as noticias, seleciona as noticias salvas no banco
                            fiquePorDentroFactory.selectListaNoticias().then(function (dadosOnline) {

                                deferred.resolve(dadosOnline);
                            });

                        }

                    });

                    return deferred.promise;


                });

            }
        };

    }])
    .service('obterFiquePorDentroServiceObterMais', ['$http', '$q', 'WEB_METODOS', 'fiquePorDentroFactory', 'LOCAL_STORAGE', function ($http, $q, WEB_METODOS, fiquePorDentroFactory, LOCAL_STORAGE) {

        return {
            obter: function (pagina) {

                return $http.get(WEB_METODOS.urlServicosPortalFiquePorDentro + "&page=" + pagina, { headers: { 'Authorization': window.localStorage.getItem(LOCAL_STORAGE.local_token) } }).then(function (response) {

                    //Lendo todas as noticias
                    var tipoConsulta = 0;
                    var idNoticias = [];
                    var listaNoticias = [];
                    var deferred = $q.defer();


                    for (var i = 0; i < response.data.length; i++) {

                        var dsNoticia = "";
                        var dsCategoria = "";
                        var dsUrlImagem = "img/img_not_found.jpg";
                        var dsTitulo = "";
                        var dtNoticiaBD = "";
                        var dtNoticia = "";
                        var dsStatus = "";
                        var dtAtualizacao = "";
                        var categorias = [];

                        //Valida��o de categoria
                        if (response.data[i]._embedded != null) {

                            if (response.data[i]._embedded['wp:term'] != null) {

                                if (response.data[i]._embedded['wp:term'][0].length == 1) {

                                    if (response.data[i]._embedded['wp:term'][0][0].name != null) {
                                        dsCategoria = response.data[i]._embedded['wp:term'][0][0].name;
                                    }

                                } else if (response.data[i]._embedded['wp:term'][0].length > 1) {

                                    for (var j = 0; j < response.data[i]._embedded['wp:term'][0].length; j++) {

                                        if (response.data[i]._embedded['wp:term'][0][j] != null) {
                                            categorias.push(response.data[i]._embedded['wp:term'][0][j].name);
                                        }
                                    }

                                    var evento = categorias.indexOf("Próximos Eventos");

                                    if (evento > -1) {
                                        dsCategoria = categorias[evento];
                                    } else {
                                        dsCategoria = categorias[0];
                                    }

                                }
                            }
                        }


                        //Valida��o de titulo
                        if (response.data[i].title.rendered != null) {
                            dsTitulo = response.data[i].title.rendered;
                        }

                        //Valida��o da descri��o
                        if (response.data[i].content.rendered != null) {
                            dsNoticia = response.data[i].content.rendered;
                        }

                        //Valida��o da data
                        if (response.data[i].date != null) {
                            dtNoticiaBD = response.data[i].date;
                            //Feito para retorna no servi�o online a data ja no formato correto
                            var dataNoticiaArray = response.data[i].date.split("T");
                            var dataNoticia = dataNoticiaArray[0].split("-");
                            dtNoticia = dataNoticia[2] + "/" + dataNoticia[1] + "/" + dataNoticia[0] + " " + dataNoticiaArray[1];

                        }
                        //Valida��o da url da imagem
                        if (response.data[i]._embedded.hasOwnProperty('wp:featuredmedia')) {
                            if (response.data[i]._embedded['wp:featuredmedia'][0] != null) {
                                if (response.data[i]._embedded['wp:featuredmedia'][0].media_details != null) {
                                    if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes != null) {
                                        if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium != null) {
                                            if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url != null) {
                                                dsUrlImagem = response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        //Validacao do status
                        if (response.data[i].status != null) {
                            dsStatus = response.data[i].status;
                        }

                        //Valida��o da data
                        if (response.data[i].modified != null) {
                            dtAtualizacao = response.data[i].modified;
                        }

                        //Tratamento para não exibir eventos em noticias
                        if (dsCategoria != "Próximos Eventos") {

                            listaNoticias.push({
                                "id": response.data[i].id,
                                "dsCategoria": dsCategoria,
                                "dsTitulo": dsTitulo,
                                "dtNoticia": dtNoticia,
                                "dsUrlImagem": dsUrlImagem
                            });

                            fiquePorDentroFactory.insert(response.data[i].id, dsCategoria, dsTitulo, dsNoticia, dtNoticiaBD, dsUrlImagem, 1, dsStatus, dtAtualizacao);

                        }

                    }

                    return listaNoticias;


                });

            }
        };

    }])
    //Serviços para obter uma lsta de enquetes
    .service('getListaEnquete', ['$http', '$q', 'WEB_METODOS', 'LOCAL_STORAGE', 'enqueteFactory', function ($http, $q, WEB_METODOS, LOCAL_STORAGE, enqueteFactory) {

        return {

            obter: function () {

                return $http.get(WEB_METODOS.urlObterEnquete, { headers: { 'Authorization': window.localStorage.getItem(LOCAL_STORAGE.local_token) } }).then(function (response) {
                    //Inserindo as enquetes no banco de dados.  
                    var idEnquetes = [];
                    var enqueteVotada = 0;
                    var flLida = 0;

                    for (var i = 0; i < response.data.length; i++) {

                        //Setando a enquete votada
                        if (response.data[i].pollq_voted_user) {
                            enqueteVotada = 1;
                            flLida = 1;
                        } else {
                            enqueteVotada = 0;
                            flLida = 0;
                        }

                        enqueteFactory.insert(response.data[i].pollq_id, response.data[i].pollq_question, response.data[i].pollq_totalvotes, response.data[i].pollq_totalvoters, response.data[i].pollq_date, response.data[i].pollq_expiry, response.data[i].pollq_active, flLida, enqueteVotada);

                        idEnquetes.push(response.data[i].pollq_id);
                    }

                    var deferred = $q.defer();

                    //Excluindo do banco enquetes que não estão mais disponiveis no servico
                    var enquetesExcluir = enqueteFactory.deleteEnquetes(idEnquetes.join()).then(function (enquetesExcluirRetorno) {
                        return enquetesExcluirRetorno;
                    });

                    var enquetesExibir = [];

                    //Executando a exclusão das enquetes
                    $q.all([enquetesExcluir]).then(function (result) {

                        for (var i = 0; i < result.length; i++) {
                            enquetesExibir.push(result[i]);
                        }

                        if (enquetesExibir[0][0].retorno == 1) {

                            //Obtendo as enquetes do banco de dados.
                            enqueteFactory.selectListaEnquetes().then(function (dadosEnquete) {
                                deferred.resolve(dadosEnquete);
                            });

                        }

                    });

                    return deferred.promise;
                });

            }
        };
        //Serviços para obter uma enquete especifica
    }]).service('getEnquete', ['$http', '$q', 'WEB_METODOS', 'LOCAL_STORAGE', function ($http, $q, WEB_METODOS, LOCAL_STORAGE) {

        return {

            obter: function (id) {

                return $http.get(WEB_METODOS.urlObterEnquete + "?id=" + id, { headers: { 'Authorization': window.localStorage.getItem(LOCAL_STORAGE.local_token) } }).then(function (response) {
                    return response;
                });

            }
        };

    }]).service('votarEnquete', ['$http', '$q', 'WEB_METODOS', 'LOCAL_STORAGE', function ($http, $q, WEB_METODOS, LOCAL_STORAGE) {

        return {

            votar: function (id, id_answer) {

                return $http.get(WEB_METODOS.urlVotarEnquete + "?id=" + id + "&id_answer=" + id_answer, { headers: { 'Authorization': window.localStorage.getItem(LOCAL_STORAGE.local_token) } }).then(function (response) {

                    return response;
                });

            }
        };

    }]).service('obterTransmissaoAoVivo', ['$http', '$q', 'WEB_METODOS', 'LOCAL_STORAGE', function ($http, $q, WEB_METODOS, LOCAL_STORAGE) {

        return {

            obter: function (url) {

                return $http.get(WEB_METODOS.urlServicoTransmissaoAoVivo + url, { headers: { 'Authorization': window.localStorage.getItem(LOCAL_STORAGE.local_token) } }).then(function (response) {

                    return response;
                });

            }
        };

    }])
    .service('getConfiguracaoAplicativo', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function (data) {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getConfiguracaoAplicativo", { params: data }).then(function (response) {
                    return response;
                });

            }
        };


    }]).service('verificarConfirmacaoPresencaAssembleia', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            enviar: function (data) {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=verificarConfirmacaoPresencaAssembleia", { params: data }).then(function (response) {
                    return response;
                });

            }
        };


    }]).service('getEventos', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function () {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getEventos").then(function (response) {
                    return response;
                });
            }
        };


    }]).service('getListaConfirmacaoPresencaEvento', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function (data) {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getListaConfirmacaoPresencaEvento", { params: data }).then(function (response) {
                    return response;
                });
            }
        };

    }]).service('getDetalheEvento', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function (data) {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getEventos", { params: data }).then(function (response) {
                    return response;
                });
            }
        };

    }]).service('getQtdPresencaConfirmadaEvento', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function (data) {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getQtdPresencaConfirmadaEvento", { params: data }).then(function (response) {
                    return response;
                });
            }
        };

    }]).service('enviarEmailListaPresencaConfirmadaEvento', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function (data) {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=enviarEmailListaPresencaConfirmadaEvento", { params: data }).then(function (response) {
                    return response;
                });
            }
        };

    }]).service('verificarPresencaConfirmadaEvento', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function (data) {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=verificarPresencaConfirmadaEvento", { params: data }).then(function (response) {
                    return response;
                });
            }
        };

    }]).service('getEstadoEnderecoAssociados', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function () {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getEstadoEnderecoAssociados").then(function (response) {
                    return response;
                });

            }
        };


    }]).service('getMunicipiosEnderecoAssociados', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function (data) {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getMunicipiosEnderecoAssociados", { params: data }).then(function (response) {
                    return response;
                });

            }
        };


    }]).service('getListaAnoPosseAssociados', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function () {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getListaAnoPosseAssociados").then(function (response) {
                    return response;
                });

            }
        };

    }]).service('getCatalogoAssociados', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {

        return {


            obter: function (data) {
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                return $http.post(WEB_METODOS.urlServicosSistema + "?m=getCatalogoAssociados", $httpParamSerializerJQLike(data), { timeout: 30000 }).then(function (response) {
                    return response;
                });

            }
        };

    }]).service('getInformacoesAssociado', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {

        return {


            obter: function (data) {
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                return $http.post(WEB_METODOS.urlServicosSistema + "?m=getInformacoesAssociado", $httpParamSerializerJQLike(data), { timeout: 30000 }).then(function (response) {
                    return response;
                });

            }
        };

    }]).service('getListaDocumentosAssociado', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function (data) {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getListaDocumentosAssociado", { params: data }).then(function (response) {
                    return response;
                });

            }
        };


    }]).service('getDocumentoAssociado', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {

        return {

            obter: function (data) {

                return $http.get(WEB_METODOS.urlServicosSistema + "?m=getDocumentoAssociado", { params: data }).then(function (response) {
                    return response;
                });

            }
        };


    }]).service('getConveniosProximos', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {

        return {


            obter: function (data) {
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                return $http.post(WEB_METODOS.urlServicosSistema + "?m=getConveniosProximos", $httpParamSerializerJQLike(data), { timeout: 30000 }).then(function (response) {
                    return response;
                });

            }
        };

    }])/***** Serviços para o modulo de noticias *****/
    .service('obterNovidadesConveniosService', ['$http', '$q', 'WEB_METODOS', 'novidadesConveniosFactory', 'LOCAL_STORAGE', function ($http, $q, WEB_METODOS, novidadesConveniosFactory, LOCAL_STORAGE) {

        return {
            obterNovidadesConvenios: function (idConvenio, idNovidade = null) {

                //Tratamento para buscar somente novidades de um convenio caso seja passado o id_idConvenio ou buscar somente um registro pelo id
                var url = WEB_METODOS.urlServicosPortalNovidadesConvenios;
                if (idConvenio != null) {
                    url = url + "&id_convenio=" + idConvenio;
                } else if (idNovidade != null) {
                    url = url + "&include=" + idNovidade;
                }

                return $http.get(url, { headers: { 'Authorization': window.localStorage.getItem(LOCAL_STORAGE.local_token) } }).then(function (response) {


                    //Lendo todas as noticias                      
                    var idNovidadeConvenio = [];
                    var deferred = $q.defer();

                    if (idNovidade != null || idConvenio != null) {

                        for (var i = 0; i < response.data.length; i++) {
                            novidadesConveniosFactory.deleteNovidadesDesatualizadas(response.data[i].id, response.data[i].modified);
                        }
                        for (var i = 0; i < response.data.length; i++) {

                            var nmConvenio = "";
                            //Valida��o de categoria
                            if (response.data[i].meta.desc_convenio[0] != null) {
                                nmConvenio = response.data[i].meta.desc_convenio[0];
                            }

                            var dsTitulo = "";
                            //Valida��o de titulo
                            if (response.data[i].title.rendered != null) {
                                dsTitulo = response.data[i].title.rendered;
                            }
                            var dsNovidade = "";
                            //Valida��o da descri��o
                            if (response.data[i].content.rendered != null) {
                                dsNovidade = response.data[i].content.rendered;
                            }


                            var dtPublicacao = "";
                            //Valida��o de data de publicacao
                            if (response.data[i].meta.dt_publicacao_novidade_convenio[0] != null) {
                                dtPublicacao = response.data[i].meta.dt_publicacao_novidade_convenio[0];
                            }
                            var dtExpiracao = "";
                            if (response.data[i].meta.dt_expiracao_novidade_convenio[0] != null) {
                                dtExpiracao = response.data[i].meta.dt_expiracao_novidade_convenio[0];
                            }
                            var dtCadastro = "";
                            if (response.data[i].date != null) {
                                dtCadastro = response.data[i].date;
                            }
                            var dtAtualizacao = "";
                            if (response.data[i].modified != null) {
                                dtAtualizacao = response.data[i].modified;
                            }

                            var dsUrlImagem = "img/img_not_found.jpg";
                            //Valida��o da url da imagem
                            if (response.data[i].hasOwnProperty('_embedded')) {
                                if (response.data[i]._embedded.hasOwnProperty('wp:featuredmedia')) {
                                    if (response.data[i]._embedded['wp:featuredmedia'][0] != null) {
                                        if (response.data[i]._embedded['wp:featuredmedia'][0].media_details != null) {
                                            if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes != null) {
                                                if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium != null) {
                                                    if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url != null) {
                                                        dsUrlImagem = response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            var dsUrlPDF = "";
                            if (response.data[i].meta.pdf_convenio != null) {
                                dsUrlPDF = response.data[i].meta.pdf_convenio;
                            }

                            novidadesConveniosFactory.insert(response.data[i].id, response.data[i].meta.id_convenio[0], dtCadastro, nmConvenio, dsTitulo, dsNovidade, dtPublicacao, dtExpiracao, dsUrlImagem, dsUrlPDF, 1, dtAtualizacao);

                        }
                        if (idNovidade != null) {

                            novidadesConveniosFactory.selectNovidade(idNovidade).then(function (dadosNovidade) {

                                deferred.resolve(dadosNovidade);
                            });

                        } else if (idConvenio != null) {

                            //Após excluídas as noticias, seleciona as noticias salvas no banco
                            novidadesConveniosFactory.selectListaNovidades(idConvenio).then(function (dadosOnline) {

                                deferred.resolve(dadosOnline);
                            });

                        }


                    } else {

                        //Loop para verificar e exluir todos os post que sofreram modificações
                        for (var i = 0; i < response.data.length; i++) {

                            novidadesConveniosFactory.deleteNovidadesDesatualizadas(response.data[i].id, response.data[i].modified);
                            //Pegando os id das noticias que não serão excluidas
                            idNovidadeConvenio.push(response.data[i].id);
                        }


                        //Excluindo do banco noticias que não estão mais disponiveis no servico
                        var novidadesExcluir = novidadesConveniosFactory.deleteNovidades(idNovidadeConvenio.join()).then(function (novidadesExcluirRetorno) {
                            return novidadesExcluirRetorno;
                        });

                        var retornoNovidadesExibir = [];

                        //Executando a exclusão das noticias
                        $q.all([novidadesExcluir]).then(function (result) {

                            for (var i = 0; i < result.length; i++) {
                                retornoNovidadesExibir.push(result[i]);
                            }

                            //Se o banco foi sincronizado com sucesso
                            if (retornoNovidadesExibir[0][0].retorno == 1) {


                                for (var i = 0; i < response.data.length; i++) {

                                    var nmConvenio = "";
                                    //Valida��o de categoria
                                    if (response.data[i].meta.desc_convenio[0] != null) {
                                        nmConvenio = response.data[i].meta.desc_convenio[0];
                                    }

                                    var dsTitulo = "";
                                    //Valida��o de titulo
                                    if (response.data[i].title.rendered != null) {
                                        dsTitulo = response.data[i].title.rendered;
                                    }
                                    var dsNovidade = "";
                                    //Valida��o da descri��o
                                    if (response.data[i].content.rendered != null) {
                                        dsNovidade = response.data[i].content.rendered;
                                    }


                                    var dtPublicacao = "";
                                    //Valida��o de data de publicacao
                                    if (response.data[i].meta.dt_publicacao_novidade_convenio[0] != null) {
                                        dtPublicacao = response.data[i].meta.dt_publicacao_novidade_convenio[0];
                                    }
                                    var dtExpiracao = "";
                                    if (response.data[i].meta.dt_expiracao_novidade_convenio[0] != null) {
                                        dtExpiracao = response.data[i].meta.dt_expiracao_novidade_convenio[0];
                                    }
                                    var dtCadastro = "";
                                    if (response.data[i].date != null) {
                                        dtCadastro = response.data[i].date;
                                    }
                                    var dtAtualizacao = "";
                                    if (response.data[i].modified != null) {
                                        dtAtualizacao = response.data[i].modified;
                                    }

                                    var dsUrlImagem = "img/img_not_found.jpg";
                                    //Valida��o da url da imagem
                                    if (response.data[i].hasOwnProperty('_embedded')) {
                                        if (response.data[i]._embedded.hasOwnProperty('wp:featuredmedia')) {
                                            if (response.data[i]._embedded['wp:featuredmedia'][0] != null) {
                                                if (response.data[i]._embedded['wp:featuredmedia'][0].media_details != null) {
                                                    if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes != null) {
                                                        if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium != null) {
                                                            if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url != null) {
                                                                dsUrlImagem = response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    var dsUrlPDF = "";
                                    if (response.data[i].meta.pdf_convenio != null) {
                                        dsUrlPDF = response.data[i].meta.pdf_convenio;
                                    }

                                    novidadesConveniosFactory.insert(response.data[i].id, response.data[i].meta.id_convenio[0], dtCadastro, nmConvenio, dsTitulo, dsNovidade, dtPublicacao, dtExpiracao, dsUrlImagem, dsUrlPDF, 0, dtAtualizacao);

                                }


                                //Após excluídas as noticias, seleciona as noticias salvas no banco
                                novidadesConveniosFactory.selectListaNovidades(idConvenio).then(function (dadosOnline) {

                                    deferred.resolve(dadosOnline);
                                });

                            }

                        });
                    }

                    return deferred.promise;

                });

            },

            obterMais: function (pagina, idConvenio) {
                //Tratamento para buscar somente novidades de um convenio caso seja passado o id
                var idConvenioUrl = "";
                if (idConvenio != null) {
                    idConvenioUrl = "&id_convenio=" + idConvenio;
                }

                return $http.get(WEB_METODOS.urlServicosPortalNovidadesConvenios + "&page=" + pagina + idConvenioUrl, { headers: { 'Authorization': window.localStorage.getItem(LOCAL_STORAGE.local_token) } }).then(function (response) {

                    //Lendo todas as noticias                       
                    var listaNovidades = [];
                    var deferred = $q.defer();

                    for (var i = 0; i < response.data.length; i++) {

                        var nmConvenio = "";
                        //Valida��o de categoria
                        if (response.data[i].meta.desc_convenio[0] != null) {
                            nmConvenio = response.data[i].meta.desc_convenio[0];
                        }

                        var dsTitulo = "";
                        //Valida��o de titulo
                        if (response.data[i].title.rendered != null) {
                            dsTitulo = response.data[i].title.rendered;
                        }
                        var dsNovidade = "";
                        //Valida��o da descri��o
                        if (response.data[i].content.rendered != null) {
                            dsNovidade = response.data[i].content.rendered;
                        }


                        var dtPublicacao = "";
                        //Valida��o de data de publicacao
                        if (response.data[i].meta.dt_publicacao_novidade_convenio[0] != null) {
                            dtPublicacao = response.data[i].meta.dt_publicacao_novidade_convenio[0];
                        }
                        var dtExpiracao = "";
                        if (response.data[i].meta.dt_expiracao_novidade_convenio[0] != null) {
                            dtExpiracao = response.data[i].meta.dt_expiracao_novidade_convenio[0];
                        }
                        var dtCadastro = "";
                        if (response.data[i].date != null) {
                            dtCadastro = response.data[i].date;
                        }
                        var dtAtualizacao = "";
                        if (response.data[i].modified != null) {
                            dtAtualizacao = response.data[i].modified;
                        }

                        var dsUrlImagem = "img/img_not_found.jpg";
                        //Valida��o da url da imagem
                        if (response.data[i].hasOwnProperty('_embedded')) {
                            if (response.data[i]._embedded.hasOwnProperty('wp:featuredmedia')) {
                                if (response.data[i]._embedded['wp:featuredmedia'][0] != null) {
                                    if (response.data[i]._embedded['wp:featuredmedia'][0].media_details != null) {
                                        if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes != null) {
                                            if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium != null) {
                                                if (response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url != null) {
                                                    dsUrlImagem = response.data[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        var dsUrlPDF = "";
                        if (response.data[i].meta.pdf_convenio != null) {
                            dsUrlPDF = response.data[i].meta.pdf_convenio;
                        }


                        /*  var objDtAtual= new Date();
                          var dtExpiracaoObj= new  Date(dtExpiracao);
                          //Colocando o gmt pois a data estava ficando com um dia a menos         
                          dtExpiracaoObj = new Date(dtExpiracaoObj.getTime() + Math.abs(dtExpiracaoObj.getTimezoneOffset() * 60000));*/

                        //SO irá exibir caso não esteja expirada novidade
                        // if(dtExpiracaoObj >= objDtAtual){

                        listaNovidades.push({
                            "id": response.data[i].id,
                            "id_convenio": response.data[i].meta.id_convenio[0],
                            "nmConvenio": nmConvenio,
                            "dsTitulo": dsTitulo,
                            "dsUrlImagem": dsUrlImagem
                        });

                        //   }

                        novidadesConveniosFactory.insert(response.data[i].id, response.data[i].meta.id_convenio[0], dtCadastro, nmConvenio, dsTitulo, dsNovidade, dtPublicacao, dtExpiracao, dsUrlImagem, dsUrlPDF, 1, dtAtualizacao);

                    }

                    return listaNovidades;


                });

            },
            varificarNovidadesConvenios: function (idConvenio) {
                var url = WEB_METODOS.urlServicosPortalNovidadesConvenios + "&id_convenio=" + idConvenio;
                return $http.get(url, { headers: { 'Authorization': window.localStorage.getItem(LOCAL_STORAGE.local_token) } }).then(function (response) {

                    return response.data;
                });

            }
        };

    }])