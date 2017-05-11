angular.module('app.services', [])
/***** Serviços para o modulo de contatos *****/
.service('getTipoContatoTelefonicoService', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {
    
    
    return {
        getTipoContato: function () {
            
            return $http.get(WEB_METODOS.urlServicosSistema + "?m=getTipoContatoTelefonico").then(function (response) {

                        console.log(JSON.stringify(response));
                        return response;                               
                                
                    });
        }
    };

}])
.service('getOperadorasTelefoneService', ['$http', '$q', 'WEB_METODOS', function ($http, $q, WEB_METODOS) {
    
    
    return {
        getOperadoras: function () {
            
            return $http.get(WEB_METODOS.urlServicosSistema + "?m=getOperadorasTelefone").then(function (response) {

                        console.log(JSON.stringify(response));
                        return response;                               
                                
                    });
        }
    };

}])
/***** Serviços para o modulo de convenios *****/
.service('getTipoConvenioService', ['$http', '$q', 'WEB_METODOS','conveniosFactory', function ($http, $q, WEB_METODOS,conveniosFactory) {
    //Metodo para obter os tipos do convenio
    var listaTipoConvenio = $http.get(WEB_METODOS.urlServicosSistema + "?m=getTipoConvenio").then(function (response) {
                                   
                                for (var i = 0; i < response.data.data.length; i++) {
                                    
                                    var id = response.data.data[i].id_tipo_convenio;
                                    var nmTipoConvenio = response.data.data[i].nome_tipo_convenio;
                                    var flPrivado = 0;
                                    if(response.data.data[i].privado_tipo_convenio == true){
                                            flPrivado = 1
                                    }                                   
                                    var dsUrlImagem = WEB_METODOS.urlImagemTipoConvenio + response.data.data[i].imagem_tipo_convenio;
                                    conveniosFactory.insertTipoConvenio(id,nmTipoConvenio,flPrivado,dsUrlImagem);

                                }

                                //Verificar a melhor forma na tela bloqueada
                                var deferred = $q.defer();
                                conveniosFactory.selectTipoConvenio("publico").then(function (dadosOnline) {
                            
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
.service('getMunicipiosConvenioService', ['$http', '$q', 'WEB_METODOS','conveniosFactory', function ($http, $q, WEB_METODOS,conveniosFactory) {
    //Metodo para obter os municipios do convenio
     var listaMunicipioConvenio = $http.get(WEB_METODOS.urlServicosSistema + "?m=getMunicipiosConvenio").then(function (response) {
                                   
                                for (var i = 0; i < response.data.data.length; i++) {
                                    
                                    var id = response.data.data[i].id_municipio;
                                    var nmMunicipioConvenio = response.data.data[i].nome_municipio;                                                             
                                  
                                    conveniosFactory.insertMunicipioConvenio(id,nmMunicipioConvenio);

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
.service('getConvenioService', ['$http', '$q', 'WEB_METODOS','conveniosFactory', function ($http, $q, WEB_METODOS,conveniosFactory) {
                //Metodo para obter os convenios   
               var listaConvenios = $http.get(WEB_METODOS.urlServicosSistema + "?m=getConvenios").then(function (response) {
                                   
                                for (var i = 0; i < response.data.data.length; i++) {
                                    
                                    var id = response.data.data[i].id_convenios;
                                    var nmConvenio = response.data.data[i].nome_convenio;
                                    var dsUrlImagem = response.data.data[i].imagem_convenio; 
                                    if(response.data.data[i].imagem_convenio != ""){
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
                                    if(response.data.data[i].privado_tipo_convenio == true){
                                        flPrivado = 1;
                                    }                                    
                                    
                                    conveniosFactory.insertConvenio(id, nmConvenio, dsUrlImagem, dsConvenio, nmContato, dsTelefone, dsEmail, urlSite, dsEndereco, dtInicioVigencia, dtTerminoVigencia, dsDesconto,flPublicar, idTipoConvenio, nmMunicipio, nmEstado, flPrivado);
                                    
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
/***** Serviços para o modulo de login *****/
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
.service('obterNoticiasService', ['$http', '$q', 'WEB_METODOS', 'noticiasFactory',  function ($http, $q, WEB_METODOS, noticiasFactory) {

         // sempre dispara o servi�o pra checar dados mais recentes
         var listaPost =   $http.get(WEB_METODOS.urlServicosPortal + "?taxonomies=noticias").then(function (response) {
               
                //Lendo todas as noticias
                //var noticia = [];
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
                        noticiasFactory.insert(response.data[i].ID, dsCategoria, dsTitulo, dsNoticia, dtNoticiaBD, dsUrlImagem, 0);
                        /*noticia.push({
                            id: response.data[i].ID,
                            dsCategoria: dsCategoria,
                            dsTitulo: dsTitulo,
                            dsNoticia: dsNoticia,
                            dtNoticia: dtNoticia,
                            dsUrlImagem: dsUrlImagem
                        });*/

                    }
                   
                }
               
                //Verificar a melhor forma na tela bloqueada
                var deferred = $q.defer();
                noticiasFactory.selectListaNoticias().then(function (dadosOnline) {
            
                    deferred.resolve(dadosOnline);
                });

                //return noticia;
                return deferred.promise;
            });
             
          
    return {
        obterNoticiasOnline: function () {
           return listaPost;

        }
    };
        
}]).service('obterNoticiasServiceRefresh', ['$http', '$q', 'WEB_METODOS', 'noticiasFactory',  function ($http, $q, WEB_METODOS, noticiasFactory) {

    return {
        obterNoticiasOnlineRefresh: function () {
          
         return  $http.get(WEB_METODOS.urlServicosPortal + "?taxonomies=noticias").then(function (response) {
               
                //Lendo todas as noticias
                //var noticia = [];
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
                        noticiasFactory.insert(response.data[i].ID, dsCategoria, dsTitulo, dsNoticia, dtNoticiaBD, dsUrlImagem, 0);
                        /*noticia.push({
                            id: response.data[i].ID,
                            dsCategoria: dsCategoria,
                            dsTitulo: dsTitulo,
                            dsNoticia: dsNoticia,
                            dtNoticia: dtNoticia,
                            dsUrlImagem: dsUrlImagem
                        });*/

                    }
                   
                }
               
                //Verificar a melhor forma na tela bloqueada
                var deferred = $q.defer();
                noticiasFactory.selectListaNoticias().then(function (dadosOnline) {
            
                    deferred.resolve(dadosOnline);
                });

                //return noticia;
                return deferred.promise;
            });

        }
    };
        
}])
/***** Serviços para o modulo de eventos *****/
.service('obterEventosService', ['$http', '$q', 'WEB_METODOS', 'eventosFactory',  function ($http, $q, WEB_METODOS, eventosFactory) {

      // sempre dispara o servi�o pra checar dados mais recentes
         var listaPost =   $http.get(WEB_METODOS.urlServicosPortal + "?taxonomies=noticias").then(function (response) {
               
                //Lendo todas as noticias
                //var noticia = [];
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
                        eventosFactory.insert(response.data[i].ID, dsCategoria, dsTitulo, dsNoticia, dtNoticiaBD, dsUrlImagem, 0);
                       /* noticia.push({
                            id: response.data[i].ID,
                            dsCategoria: dsCategoria,
                            dsTitulo: dsTitulo,
                            dsNoticia: dsNoticia,
                            dtNoticia: dtNoticia,
                            dsUrlImagem: dsUrlImagem
                        });*/

                    }
                   
                }


                //return noticia;
                var deferred = $q.defer();
                eventosFactory.selectListaNoticias().then(function (dadosOnline) {
            
                    deferred.resolve(dadosOnline);
                });

                //return noticia;
                return deferred.promise;
            });


    return {
        obterEventosOnline: function () {
          
         return listaPost;

        }
    };
        
}]).service('obterEventosServiceRefresh', ['$http', '$q', 'WEB_METODOS', 'eventosFactory',  function ($http, $q, WEB_METODOS, eventosFactory) {

    return {
        obterEventosOnlineRefresh: function () {
          
         return $http.get(WEB_METODOS.urlServicosPortal + "?taxonomies=noticias").then(function (response) {
               
                //Lendo todas as noticias
                //var noticia = [];
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
                        eventosFactory.insert(response.data[i].ID, dsCategoria, dsTitulo, dsNoticia, dtNoticiaBD, dsUrlImagem, 0);
                   
                    }
                   
                }


                //return noticia;
                var deferred = $q.defer();
                eventosFactory.selectListaNoticias().then(function (dadosOnline) {
            
                    deferred.resolve(dadosOnline);
                });

                //return noticia;
                return deferred.promise;
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

            var dados = { cpf: data.cpf, imagem: data.imagem , tipo_imagem: ""};
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
           
            var dados = { cpf: data};
            //Usado em requisi��es POSR ($httpParamSerializerJQLike)
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            return $http.post(WEB_METODOS.urlServicosSistema + "?m=getLoginAssociado", $httpParamSerializerJQLike(dados)).then(function (response) {
                return response;
            });

        }
    };


}]);