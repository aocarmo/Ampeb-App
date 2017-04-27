angular.module('app.services', [])
.factory('BlankFactory', [function () {

}])
.service('LoginService', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {
    //Metodo para realizar autentica��o no sistema Ampeb retornando os dados do usu�rio   

    return {

        logar: function (data) {
           
            var dados = { cpf: data.usuario, senha: data.senha };
            //Usado em requisi��es POSR ($httpParamSerializerJQLike)
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            return $http.post(WEB_METODOS.urlServicosSistema + "?m=loginAssociado", $httpParamSerializerJQLike(dados)).then(function (response) {
                return response;
            });

        }
    };


}])
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

}]).service('obterNoticiasService', ['$http', '$q', 'WEB_METODOS', 'noticiasFactory',  function ($http, $q, WEB_METODOS, noticiasFactory) {


    return {
        obterNoticiasOnline: function () {
            

            // sempre dispara o servi�o pra checar dados mais recentes
         var listaPost =   $http.get(WEB_METODOS.urlServicosPortal + "?taxonomies=noticias").then(function (response) {
               
                //Lendo todas as noticias
                var noticia = [];
                for (var i = 0; i < response.data.length; i++) {

                    var dsNoticia = "";
                    var dsCategoria = "";
                    var dsUrlImagem = "";
                    var dsTitulo = "";
                    var dtNoticiaBD = "";
                    var dtNoticia = "";
                    var categorias = [];
                    
                         //Valida��o de categoria
                    if (response.data[i].terms != null) {

                        if (response.data[i].terms.category != null) {

                            if(response.data[i].terms.category.length == 1){

                                if (response.data[i].terms.category[0].name != null) {
                                    dsCategoria = response.data[i].terms.category[0].name;
                                }

                            }else if(response.data[i].terms.category.length > 1){

                                for (var j = 0; j < response.data[i].terms.category.length; j++) {

                                    if (response.data[i].terms.category[j].name != null) {
                                        categorias.push(response.data[i].terms.category[j].name);
                                    }
                                }

                                var evento = categorias.indexOf("Próximos Eventos");

                                if(evento > -1){
                                    dsCategoria = categorias[evento];
                                }else{
                                    dsCategoria = categorias[0];
                                }

                            }
                        }
                    }
                    
                   
                    //Valida��o de titulo
                    if (response.data[i].title != null) {
                        dsTitulo = response.data[i].title;
                    }

                    //Valida��o da descri��o
                    if (response.data[i].content != null) {
                        dsNoticia = response.data[i].content.replace(/(<([^>]+)>)/ig, "");
                    }

                    //Valida��o da data
                    if (response.data[i].date != null) {
                        dtNoticiaBD = response.data[i].date;
                        //Feito para retorna no servi�o online a data ja no formato correto
                        var dataNoticiaArray = response.data[i].date.split("T");
                        var dataNoticia  = dataNoticiaArray[0].split("-");
                        dtNoticia = dataNoticia[2] + "-" + dataNoticia[1] + "-" + dataNoticia[0] + " " + dataNoticiaArray[1];
                        
                    }
                    //Valida��o da url da imagem
                    if (response.data[i].featured_image != null) {
                        if (response.data[i].featured_image.attachment_meta != null) {
                            if (response.data[i].featured_image.attachment_meta.sizes != null) {
                                if (response.data[i].featured_image.attachment_meta.sizes.medium != null) {
                                    if (response.data[i].featured_image.attachment_meta.sizes.medium.url != null) {
                                        dsUrlImagem = response.data[i].featured_image.attachment_meta.sizes.medium.url;
                                    }
                                }
                            }
                        }
                    }

                    //Tratamento para não exibir eventos em noticias
                    if(dsCategoria != "Próximos Eventos"){
                        noticiasFactory.insert(response.data[i].ID, dsCategoria, dsTitulo, dsNoticia, dtNoticiaBD, dsUrlImagem, '0');
                        noticia.push({
                            id: response.data[i].ID,
                            dsCategoria: dsCategoria,
                            dsTitulo: dsTitulo,
                            dsNoticia: dsNoticia,
                            dtNoticia: dtNoticia,
                            dsUrlImagem: dsUrlImagem
                        });

                    }
                   
                }


                return noticia;
            });

         return listaPost;

        }
    };
        
}]).service('obterNoticiasBD', ['$http', '$q', 'noticiasFactory',   function ($http, $q, noticiasFactory) {
    //Metodo para realizar autentica��o no sistema Ampeb retornando os dados do usu�rio   

    return {
        obterListaNoticiasBD: function () {

            var noticias = noticiasFactory.selectListaNoticias().then(function (dadosArmazenados) {
            
                var noticiaBD;
                //if (dadosArmazenados[0] != null) {

                    noticiaBD = $q(function (resolve, reject) {
                        resolve(dadosArmazenados);
                    });

                //}
                return noticiaBD;

            });

            return noticias;

        }
    };

}]).service('obterDetalheNoticiaBD', ['$http', '$q', 'noticiasFactory',   function ($http, $q, noticiasFactory) {
    //Metodo para realizar autentica��o no sistema Ampeb retornando os dados do usu�rio   

    return {
       detalheNoticiaBD: function (id) {
         
            var noticias = noticiasFactory.selectNoticia(id).then(function (noticiaArmazenada) {
                
                var noticiaBD;
                if (noticiaArmazenada[0] != null) {
                   
                    noticiaBD = $q(function (resolve, reject) {
                        resolve(noticiaArmazenada);
                    });

                }
                return noticiaBD;

            });

            return noticias;

        }
    };

}]).service('obterEventosService', ['$http', '$q', 'WEB_METODOS', 'eventosFactory',  function ($http, $q, WEB_METODOS, eventosFactory) {


    return {
        obterEventosOnline: function () {
            

            // sempre dispara o servi�o pra checar dados mais recentes
         var listaPost =   $http.get(WEB_METODOS.urlServicosPortal + "?taxonomies=noticias").then(function (response) {
               
                //Lendo todas as noticias
                var noticia = [];
                for (var i = 0; i < response.data.length; i++) {

                    var dsNoticia = "";
                    var dsCategoria = "";
                    var dsUrlImagem = "";
                    var dsTitulo = "";
                    var dtNoticiaBD = "";
                    var dtNoticia = "";
                    var categorias = [];
                    
                         //Valida��o de categoria
                    if (response.data[i].terms != null) {

                        if (response.data[i].terms.category != null) {

                            if(response.data[i].terms.category.length == 1){

                                if (response.data[i].terms.category[0].name != null) {
                                    dsCategoria = response.data[i].terms.category[0].name;
                                }

                            }else if(response.data[i].terms.category.length > 1){

                                for (var j = 0; j < response.data[i].terms.category.length; j++) {

                                    if (response.data[i].terms.category[j].name != null) {
                                        categorias.push(response.data[i].terms.category[j].name);
                                    }
                                }

                                var evento = categorias.indexOf("Próximos Eventos");

                                if(evento > -1){
                                    dsCategoria = categorias[evento];
                                }else{
                                    dsCategoria = categorias[0];
                                }

                            }
                        }
                    }
                    
                   
                    //Valida��o de titulo
                    if (response.data[i].title != null) {
                        dsTitulo = response.data[i].title;
                    }

                    //Valida��o da descri��o
                    if (response.data[i].content != null) {
                        dsNoticia = response.data[i].content.replace(/(<([^>]+)>)/ig, "");
                    }

                    //Valida��o da data
                    if (response.data[i].date != null) {
                        dtNoticiaBD = response.data[i].date;
                        //Feito para retorna no servi�o online a data ja no formato correto
                        var dataNoticiaArray = response.data[i].date.split("T");
                        var dataNoticia  = dataNoticiaArray[0].split("-");
                        dtNoticia = dataNoticia[2] + "-" + dataNoticia[1] + "-" + dataNoticia[0] + " " + dataNoticiaArray[1];
                        
                    }
                    //Valida��o da url da imagem
                    if (response.data[i].featured_image != null) {
                        if (response.data[i].featured_image.attachment_meta != null) {
                            if (response.data[i].featured_image.attachment_meta.sizes != null) {
                                if (response.data[i].featured_image.attachment_meta.sizes.medium != null) {
                                    if (response.data[i].featured_image.attachment_meta.sizes.medium.url != null) {
                                        dsUrlImagem = response.data[i].featured_image.attachment_meta.sizes.medium.url;
                                    }
                                }
                            }
                        }
                    }

                    //Tratamento para não exibir eventos em noticias
                    if(dsCategoria == "Próximos Eventos"){
                        eventosFactory.insert(response.data[i].ID, dsCategoria, dsTitulo, dsNoticia, dtNoticiaBD, dsUrlImagem, '0');
                        noticia.push({
                            id: response.data[i].ID,
                            dsCategoria: dsCategoria,
                            dsTitulo: dsTitulo,
                            dsNoticia: dsNoticia,
                            dtNoticia: dtNoticia,
                            dsUrlImagem: dsUrlImagem
                        });

                    }
                   
                }


                return noticia;
            });

         return listaPost;

        }
    };
        
}]).service('obterEventosBD', ['$http', '$q', 'eventosFactory',   function ($http, $q, eventosFactory) {
    //Metodo para realizar autentica��o no sistema Ampeb retornando os dados do usu�rio   

    return {
        obterListaEventosBD: function () {

            var noticias = eventosFactory.selectListaNoticias().then(function (dadosArmazenados) {
            
                var noticiaBD;
                noticiaBD = $q(function (resolve, reject) {
                    resolve(dadosArmazenados);
                });
             
                return noticiaBD;

            });

            return noticias;

        }
    };

}]).service('obterDetalheEventosBD', ['$http', '$q', 'eventosFactory',   function ($http, $q, eventosFactory) {
    //Metodo para realizar autentica��o no sistema Ampeb retornando os dados do usu�rio   

    return {
       detalheEventoBD: function (id) {
         
            var noticias = eventosFactory.selectNoticia(id).then(function (noticiaArmazenada) {
                
                var noticiaBD;
                if (noticiaArmazenada[0] != null) {
                   
                    noticiaBD = $q(function (resolve, reject) {
                        resolve(noticiaArmazenada);
                    });

                }
                return noticiaBD;

            });

            return noticias;

        }
    };

}]);