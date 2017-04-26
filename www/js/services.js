angular.module('app.services', [])
.factory('BlankFactory', [function () {

}])
.service('LoginService', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {
    //Metodo para realizar autenticação no sistema Ampeb retornando os dados do usuário   

    return {

        logar: function (data) {
           
            var dados = { cpf: data.usuario, senha: data.senha };
            //Usado em requisições POSR ($httpParamSerializerJQLike)
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            return $http.post(WEB_METODOS.urlServicosSistema + "?m=loginAssociado", $httpParamSerializerJQLike(dados)).then(function (response) {
                return response;
            });

        }
    };


}])
.service('RecuperarSenhaService', ['$http', '$q', 'WEB_METODOS', '$httpParamSerializerJQLike', function ($http, $q, WEB_METODOS, $httpParamSerializerJQLike) {
    //Metodo para realizar autenticação no sistema Ampeb retornando os dados do usuário   

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
            

            // sempre dispara o serviço pra checar dados mais recentes
         var teste =   $http.get(WEB_METODOS.urlServicosPortal + "?taxonomies=noticias").then(function (response) {
               
                //Lendo todas as noticias
                var noticia = [];
                for (var i = 0; i < response.data.length; i++) {

                    var dsNoticia = "";
                    var dsCategoria = "";
                    var dsUrlImagem = "";
                    var dsTitulo = "";
                    var dtNoticiaBD = "";
                    var dtNoticia = "";
                    //Validação de categoria
                    if (response.data[i].terms != null) {
                        if (response.data[i].terms.category != null) {
                            if (response.data[i].terms.category[0].name != null) {
                                dsCategoria = response.data[i].terms.category[0].name;
                            }
                        }
                    }
                    //Validação de titulo
                    if (response.data[i].title != null) {
                        dsTitulo = response.data[i].title;
                    }

                    //Validação da descrição
                    if (response.data[i].content != null) {
                        dsNoticia = response.data[i].content.replace(/(<([^>]+)>)/ig, "");
                    }

                    //Validação da data
                    if (response.data[i].date != null) {
                        dtNoticiaBD = response.data[i].date;
                        //Feito para retorna no serviço online a data ja no formato correto
                        var dataNoticiaArray = response.data[i].date.split("T");
                        var dataNoticia  = dataNoticiaArray[0].split("-");
                        dtNoticia = dataNoticia[2] + "-" + dataNoticia[1] + "-" + dataNoticia[0] + " " + dataNoticiaArray[1];
                        
                    }
                    //Validação da url da imagem
                    if (response.data[i].featured_image != null) {
                        if (response.data[i].featured_image.attachment_meta != null) {
                            if (response.data[i].featured_image.attachment_meta.sizes != null) {
                                if (response.data[i].featured_image.attachment_meta.sizes.large != null) {
                                    if (response.data[i].featured_image.attachment_meta.sizes.large.url != null) {
                                        dsUrlImagem = response.data[i].featured_image.attachment_meta.sizes.large.url;
                                    }
                                }
                            }
                        }
                    }



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


                return noticia;
            });

         return teste;

        }
    };
        
}]).service('obterNoticiasBD', ['$http', '$q', 'noticiasFactory',   function ($http, $q, noticiasFactory) {
    //Metodo para realizar autenticação no sistema Ampeb retornando os dados do usuário   

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
    //Metodo para realizar autenticação no sistema Ampeb retornando os dados do usuário   

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

}]);