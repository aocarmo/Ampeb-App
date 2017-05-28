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
.service('getDadosContatosAssociado', ['$http', '$q', 'WEB_METODOS','$httpParamSerializerJQLike',  function ($http, $q, WEB_METODOS,$httpParamSerializerJQLike) {

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
         var listaPost =   $http.get(WEB_METODOS.urlServicosPortalNoticias).then(function (response) {
                
                //Retorno da lista de noticias para serem exibidas
                var deferred = $q.defer();
                //Id das noticias que não serão excluidas                          
                var idNoticias = [];
                //Array de objetos de noticias
                var arrNoticias = [];
                //Objeto noticia
                var noticia = {};
                //Variaveis que receberão dados de categoria e url de imagem do post
                var dsCategoria = "";
                var dsUrlImagem = "";

                //Montando o objeto noticia com os dados disponiveis no primeiro JSON retornado.
                for (var i = 0; i < response.data.length; i++) {
                                     
                    var dsNoticia = "";                  
                    var dsTitulo = "";
                    var dtNoticiaBD = "";
                    var dtNoticia = "";
                    var categorias = [];                
                                 
                    //Validação de titulo
                    if (response.data[i].title != null) {
                        if (response.data[i].title.rendered != null) {
                             dsTitulo = response.data[i].title.rendered;
                        }                       
                    }
                   
                    //Valida��o da descri��o
                    if (response.data[i].content != null) {

                        if (response.data[i].content.rendered != null) {
                            dsNoticia = response.data[i].content.rendered.replace(/(<([^>]+)>)/ig, "");
                        }
                       
                    }
                           
                    //Valida��o da data
                    if (response.data[i].date != null) {
                        dtNoticiaBD = response.data[i].date;
                        //Feito para retorna no servi�o online a data ja no formato correto
                        var dataNoticiaArray = response.data[i].date.split("T");
                        var dataNoticia  = dataNoticiaArray[0].split("-");
                        dtNoticia = dataNoticia[2] + "-" + dataNoticia[1] + "-" + dataNoticia[0] + " " + dataNoticiaArray[1];
                        
                    }
                    //Variaveis criadas para receber valores da feature_media caso tenha imagens no post
                    var url_service_featured_media = "";
                    var id_feature_media= 0;

                    //Testando se existe imagens para setar a url da feature media
                    if(response.data[i].featured_media > 0){
                        url_service_featured_media = WEB_METODOS.urlServicosPortalMedia+response.data[i].featured_media;
                        id_feature_media = response.data[i].featured_media;
                    }

                    noticia = { idNoticiaInserir: response.data[i].id, 
                                dsCategoriaInserir: WEB_METODOS.urlServicosPortalCategoria+response.data[i].id, 
                                dsTituloInserir: dsTitulo,
                                dsNoticiaInserir: dsNoticia, 
                                dtNoticiaBDInserir: dtNoticiaBD, 
                                dsUrlImagemInserir: url_service_featured_media,
                                featuredMedia: id_feature_media
                            };

                    arrNoticias.push(noticia);                   

                }
                
                //Buscando as categorias e imagem da noticia.
                var promisesUrlImagem = [];
                var promisesCategoria = [];
                var promissesInserir = [];

                //Montagem das requisições sincronas para obter categorias e imagens
                for(var i = 0; i < arrNoticias.length; i++) {
                    //So cria promisses para os post que tem imagem
                    if(arrNoticias[i].dsUrlImagemInserir != ""){
                        var promiseUrlImagem = $http.get(arrNoticias[i].dsUrlImagemInserir);
                        promisesUrlImagem.push(promiseUrlImagem);
                    }                    

                    var promiseCategoria = $http.get(arrNoticias[i].dsCategoriaInserir);
                    promisesCategoria.push(promiseCategoria);

                }

                //Chamada do primeiro conjunto de requisições sincronas para obter as url de imagens
                $q.all(promisesUrlImagem).then(function(resultUrlImagem){
                       
                    //Tratando o retorno e populando o arr de noticias com as url de imagens para cada noticia
                    for(var i = 0; i < resultUrlImagem.length; i++) {  

                         if (resultUrlImagem[i].data != null) {                             
                            if (resultUrlImagem[i].data.media_details != null) {
                                if (resultUrlImagem[i].data.media_details.sizes != null) {
                                    if (resultUrlImagem[i].data.media_details.sizes.medium != null) {
                                        if (resultUrlImagem[i].data.media_details.sizes.medium.source_url != null) {                                         
                                             dsUrlImagem = resultUrlImagem[i].data.media_details.sizes.medium.source_url;                                         
                                        }
                                    }
                                }
                            }
                        }    

                        for(var j = 0; j < arrNoticias.length; j++) {  

                            if(arrNoticias[j].featuredMedia == resultUrlImagem[i].data.id){
                                 arrNoticias[j].dsUrlImagemInserir = dsUrlImagem;
                            }
                            
                        }
                          
                    }
               
                    //Chamada do segundo conjunto de requisições sincronas para obter as categorias
                    $q.all(promisesCategoria).then(function(result){

                        //Tratando o retorno e populando o arr de noticias com as categorias                    
                        for(var i = 0; i < result.length; i++) {

                            if (result[i].data != null) {

                               // if(result[i].data.length == 1){

                                    if (result[i].data[0].name != null) {
                                      
                                       dsCategoria = result[i].data[0].name;
                                    }

                               /* }else if(result[i].data.length > 1){

                                    for (var j = 0; j < result[i].data.length; j++) {

                                        if (result[i].data[j].name != null) {
                                            categorias.push(result[i].data[j].name);
                                        }
                                    }

                                    var evento = categorias.indexOf("Próximos Eventos");

                                    if(evento > -1){
                                        dsCategoria = categorias[evento];
                                    }else{
                                        dsCategoria = categorias[0];
                                    }

                                }*/
                            }
                           
                           arrNoticias[i].dsCategoriaInserir = dsCategoria;                            

                        }     
                        
                        //Montagem das requisições sincronas para inserir as noticias
                        for (var j = 0; j < arrNoticias.length; j++) {
                             //Tratamento para não exibir eventos em noticias
                            if(arrNoticias[j].dsCategoriaInserir != "Próximos Eventos"){

                                var promiseInserir = noticiasFactory.insert(arrNoticias[j].idNoticiaInserir, arrNoticias[j].dsCategoriaInserir, arrNoticias[j].dsTituloInserir, arrNoticias[j].dsNoticiaInserir,  arrNoticias[j].dtNoticiaBDInserir, arrNoticias[j].dsUrlImagemInserir, 0);
                                promissesInserir.push(promiseInserir);
                                //Pegando os id das noticias que não serão excluidas
                                idNoticias.push(arrNoticias[j].idNoticiaInserir);                            
                           
                            }
                        }    
                        //Chamada do terceiro conjunto de requisições sincronas para inserir as noticias
                        $q.all(promissesInserir).then(function(resultInserir){
                            
                           //Excluindo do banco noticias que não estão mais disponiveis no servico
                            var noticiasExcluir =  noticiasFactory.deleteNoticias(idNoticias.join()).then(function (noticiasExcluirRetorno) {    
                                return noticiasExcluirRetorno;
                            });                                          

                            var retornoNoticiasExibir = [];
                            
                            //Executando a exclusão das noticias
                            $q.all([noticiasExcluir]).then(function(result){

                                for (var i = 0; i < result.length; i++){
                                    retornoNoticiasExibir.push(result[i]);
                                }

                                if(retornoNoticiasExibir[0][0].retorno == 1){
                                    //Após excluídas as noticias, seleciona as noticias salvas no banco
                                    noticiasFactory.selectListaNoticias().then(function (dadosOnline) {
                    
                                        deferred.resolve(dadosOnline);
                                    });
                            
                                }
                                
                            }); 
                           
                        });         

                    });
                     
                });
              //Retorno das noticias salvas
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
          
            return $http.get(WEB_METODOS.urlServicosPortalNoticias).then(function (response) {
               
                //Retorno da lista de noticias para serem exibidas
                var deferred = $q.defer();
                //Id das noticias que não serão excluidas                          
                var idNoticias = [];
                //Array de objetos de noticias
                var arrNoticias = [];
                //Objeto noticia
                var noticia = {};
                //Variaveis que receberão dados de categoria e url de imagem do post
                var dsCategoria = "";
                var dsUrlImagem = "";

                //Montando o objeto noticia com os dados disponiveis no primeiro JSON retornado.
                for (var i = 0; i < response.data.length; i++) {
                                     
                    var dsNoticia = "";                  
                    var dsTitulo = "";
                    var dtNoticiaBD = "";
                    var dtNoticia = "";
                    var categorias = [];                
                                 
                    //Validação de titulo
                    if (response.data[i].title != null) {
                        if (response.data[i].title.rendered != null) {
                             dsTitulo = response.data[i].title.rendered;
                        }                       
                    }
                   
                    //Valida��o da descri��o
                    if (response.data[i].content != null) {

                        if (response.data[i].content.rendered != null) {
                            dsNoticia = response.data[i].content.rendered.replace(/(<([^>]+)>)/ig, "");
                        }
                       
                    }
                           
                    //Valida��o da data
                    if (response.data[i].date != null) {
                        dtNoticiaBD = response.data[i].date;
                        //Feito para retorna no servi�o online a data ja no formato correto
                        var dataNoticiaArray = response.data[i].date.split("T");
                        var dataNoticia  = dataNoticiaArray[0].split("-");
                        dtNoticia = dataNoticia[2] + "-" + dataNoticia[1] + "-" + dataNoticia[0] + " " + dataNoticiaArray[1];
                        
                    }
                    //Variaveis criadas para receber valores da feature_media caso tenha imagens no post
                    var url_service_featured_media = "";
                    var id_feature_media= 0;

                    //Testando se existe imagens para setar a url da feature media
                    if(response.data[i].featured_media > 0){
                        url_service_featured_media = WEB_METODOS.urlServicosPortalMedia+response.data[i].featured_media;
                        id_feature_media = response.data[i].featured_media;
                    }

                    noticia = { idNoticiaInserir: response.data[i].id, 
                                dsCategoriaInserir: WEB_METODOS.urlServicosPortalCategoria+response.data[i].id, 
                                dsTituloInserir: dsTitulo,
                                dsNoticiaInserir: dsNoticia, 
                                dtNoticiaBDInserir: dtNoticiaBD, 
                                dsUrlImagemInserir: url_service_featured_media,
                                featuredMedia: id_feature_media
                            };

                    arrNoticias.push(noticia);                   

                }
                
                //Buscando as categorias e imagem da noticia.
                var promisesUrlImagem = [];
                var promisesCategoria = [];
                var promissesInserir = [];

                //Montagem das requisições sincronas para obter categorias e imagens
                for(var i = 0; i < arrNoticias.length; i++) {
                    //So cria promisses para os post que tem imagem
                    if(arrNoticias[i].dsUrlImagemInserir != ""){
                        var promiseUrlImagem = $http.get(arrNoticias[i].dsUrlImagemInserir);
                        promisesUrlImagem.push(promiseUrlImagem);
                    }                    

                    var promiseCategoria = $http.get(arrNoticias[i].dsCategoriaInserir);
                    promisesCategoria.push(promiseCategoria);

                }
                
                //Chamada do primeiro conjunto de requisições sincronas para obter as url de imagens
                $q.all(promisesUrlImagem).then(function(resultUrlImagem){
                       
                    //Tratando o retorno e populando o arr de noticias com as url de imagens para cada noticia
                    for(var i = 0; i < resultUrlImagem.length; i++) {  

                         if (resultUrlImagem[i].data != null) {                             
                            if (resultUrlImagem[i].data.media_details != null) {
                                if (resultUrlImagem[i].data.media_details.sizes != null) {
                                    if (resultUrlImagem[i].data.media_details.sizes.medium != null) {
                                        if (resultUrlImagem[i].data.media_details.sizes.medium.source_url != null) {                                         
                                             dsUrlImagem = resultUrlImagem[i].data.media_details.sizes.medium.source_url;                                         
                                        }
                                    }
                                }
                            }
                        }    

                        for(var j = 0; j < arrNoticias.length; j++) {  

                            if(arrNoticias[j].featuredMedia == resultUrlImagem[i].data.id){
                                 arrNoticias[j].dsUrlImagemInserir = dsUrlImagem;
                            }
                            
                        }
                          
                    }
               
                    //Chamada do segundo conjunto de requisições sincronas para obter as categorias
                    $q.all(promisesCategoria).then(function(result){

                        //Tratando o retorno e populando o arr de noticias com as categorias                    
                        for(var i = 0; i < result.length; i++) {

                            if (result[i].data != null) {

                                //if(result[i].data.length == 1){

                                    if (result[i].data[0].name != null) {
                                      
                                       dsCategoria = result[i].data[0].name;
                                    }

                                /*}else if(result[i].data.length > 1){

                                    for (var j = 0; j < result[i].data.length; j++) {

                                        if (result[i].data[j].name != null) {
                                            categorias.push(result[i].data[j].name);
                                        }
                                    }

                                    var evento = categorias.indexOf("Próximos Eventos");

                                    if(evento > -1){
                                        dsCategoria = categorias[evento];
                                    }else{
                                        dsCategoria = categorias[0];
                                    }

                                }*/
                            }
                           
                           arrNoticias[i].dsCategoriaInserir = dsCategoria;                            

                        }     
                        
                        //Montagem das requisições sincronas para inserir as noticias
                        for (var j = 0; j < arrNoticias.length; j++) {
                             //Tratamento para não exibir eventos em noticias
                            if(arrNoticias[j].dsCategoriaInserir != "Próximos Eventos"){

                                var promiseInserir = noticiasFactory.insert(arrNoticias[j].idNoticiaInserir, arrNoticias[j].dsCategoriaInserir, arrNoticias[j].dsTituloInserir, arrNoticias[j].dsNoticiaInserir,  arrNoticias[j].dtNoticiaBDInserir, arrNoticias[j].dsUrlImagemInserir, 0);
                                promissesInserir.push(promiseInserir);
                                //Pegando os id das noticias que não serão excluidas
                                idNoticias.push(arrNoticias[j].idNoticiaInserir);                            
                           
                            }
                        }    
                        //Chamada do terceiro conjunto de requisições sincronas para inserir as noticias
                        $q.all(promissesInserir).then(function(resultInserir){
                            
                           //Excluindo do banco noticias que não estão mais disponiveis no servico
                            var noticiasExcluir =  noticiasFactory.deleteNoticias(idNoticias.join()).then(function (noticiasExcluirRetorno) {    
                                return noticiasExcluirRetorno;
                            });                                          

                            var retornoNoticiasExibir = [];
                            
                            //Executando a exclusão das noticias
                            $q.all([noticiasExcluir]).then(function(result){

                                for (var i = 0; i < result.length; i++){
                                    retornoNoticiasExibir.push(result[i]);
                                }

                                if(retornoNoticiasExibir[0][0].retorno == 1){
                                    //Após excluídas as noticias, seleciona as noticias salvas no banco
                                    noticiasFactory.selectListaNoticias().then(function (dadosOnline) {
                    
                                        deferred.resolve(dadosOnline);
                                    });
                            
                                }
                                
                            }); 
                           
                        });         

                    });
                     
                });
              //Retorno das noticias salvas
              return deferred.promise;
             
            });

        }
    };
        
}])
/***** Serviços para o modulo de eventos *****/
.service('obterEventosService', ['$http', '$q', 'WEB_METODOS', 'eventosFactory',  function ($http, $q, WEB_METODOS, eventosFactory) {

      // sempre dispara o servi�o pra checar dados mais recentes
         var listaPost =   $http.get(WEB_METODOS.urlServicosPortalEventos).then(function (response) {
               
                //Retorno da lista de noticias para serem exibidas
                var deferred = $q.defer();
                //Id das noticias que não serão excluidas                          
                var idNoticias = [];
                //Array de objetos de noticias
                var arrNoticias = [];
                //Objeto noticia
                var noticia = {};
                //Variaveis que receberão dados de categoria e url de imagem do post
                var dsCategoria = "";
                var dsUrlImagem = "";

                //Montando o objeto noticia com os dados disponiveis no primeiro JSON retornado.
                for (var i = 0; i < response.data.length; i++) {
                                     
                    var dsNoticia = "";                  
                    var dsTitulo = "";
                    var dtNoticiaBD = "";
                    var dtNoticia = "";
                    var categorias = [];                
                                 
                    //Validação de titulo
                    if (response.data[i].title != null) {
                        if (response.data[i].title.rendered != null) {
                             dsTitulo = response.data[i].title.rendered;
                        }                       
                    }
                   
                    //Valida��o da descri��o
                    if (response.data[i].content != null) {

                        if (response.data[i].content.rendered != null) {
                            dsNoticia = response.data[i].content.rendered.replace(/(<([^>]+)>)/ig, "");
                        }
                       
                    }
                           
                    //Valida��o da data
                    if (response.data[i].date != null) {
                        dtNoticiaBD = response.data[i].date;
                        //Feito para retorna no servi�o online a data ja no formato correto
                        var dataNoticiaArray = response.data[i].date.split("T");
                        var dataNoticia  = dataNoticiaArray[0].split("-");
                        dtNoticia = dataNoticia[2] + "-" + dataNoticia[1] + "-" + dataNoticia[0] + " " + dataNoticiaArray[1];
                        
                    }
                    //Variaveis criadas para receber valores da feature_media caso tenha imagens no post
                    var url_service_featured_media = "";
                    var id_feature_media= 0;

                    //Testando se existe imagens para setar a url da feature media
                    if(response.data[i].featured_media > 0){
                        url_service_featured_media = WEB_METODOS.urlServicosPortalMedia+response.data[i].featured_media;
                        id_feature_media = response.data[i].featured_media;
                    }

                    noticia = { idNoticiaInserir: response.data[i].id, 
                                dsCategoriaInserir: WEB_METODOS.urlServicosPortalCategoria+response.data[i].id, 
                                dsTituloInserir: dsTitulo,
                                dsNoticiaInserir: dsNoticia, 
                                dtNoticiaBDInserir: dtNoticiaBD, 
                                dsUrlImagemInserir: url_service_featured_media,
                                featuredMedia: id_feature_media
                            };

                    arrNoticias.push(noticia);                   

                }
                
                //Buscando as categorias e imagem da noticia.
                var promisesUrlImagem = [];
                var promisesCategoria = [];
                var promissesInserir = [];

                //Montagem das requisições sincronas para obter categorias e imagens
                for(var i = 0; i < arrNoticias.length; i++) {
                    //So cria promisses para os post que tem imagem
                    if(arrNoticias[i].dsUrlImagemInserir != ""){
                        var promiseUrlImagem = $http.get(arrNoticias[i].dsUrlImagemInserir);
                        promisesUrlImagem.push(promiseUrlImagem);
                    }                    

                    var promiseCategoria = $http.get(arrNoticias[i].dsCategoriaInserir);
                    promisesCategoria.push(promiseCategoria);

                }
                
                //Chamada do primeiro conjunto de requisições sincronas para obter as url de imagens
                $q.all(promisesUrlImagem).then(function(resultUrlImagem){
                       
                    //Tratando o retorno e populando o arr de noticias com as url de imagens para cada noticia
                    for(var i = 0; i < resultUrlImagem.length; i++) {  

                         if (resultUrlImagem[i].data != null) {                             
                            if (resultUrlImagem[i].data.media_details != null) {
                                if (resultUrlImagem[i].data.media_details.sizes != null) {
                                    if (resultUrlImagem[i].data.media_details.sizes.medium != null) {
                                        if (resultUrlImagem[i].data.media_details.sizes.medium.source_url != null) {                                         
                                             dsUrlImagem = resultUrlImagem[i].data.media_details.sizes.medium.source_url;                                         
                                        }
                                    }
                                }
                            }
                        }    

                        for(var j = 0; j < arrNoticias.length; j++) {  

                            if(arrNoticias[j].featuredMedia == resultUrlImagem[i].data.id){
                                 arrNoticias[j].dsUrlImagemInserir = dsUrlImagem;
                            }
                            
                        }
                          
                    }
               
                    //Chamada do segundo conjunto de requisições sincronas para obter as categorias
                    $q.all(promisesCategoria).then(function(result){

                        //Tratando o retorno e populando o arr de noticias com as categorias                    
                        for(var i = 0; i < result.length; i++) {

                            if (result[i].data != null) {

                                //if(result[i].data.length == 1){

                                    if (result[i].data[0].name != null) {
                                      
                                       dsCategoria = result[i].data[0].name;
                                    }

                               /* }else if(result[i].data.length > 1){

                                    for (var j = 0; j < result[i].data.length; j++) {

                                        if (result[i].data[j].name != null) {
                                            categorias.push(result[i].data[j].name);
                                        }
                                    }

                                    var evento = categorias.indexOf("Próximos Eventos");

                                    if(evento > -1){
                                        dsCategoria = categorias[evento];
                                    }else{
                                        dsCategoria = categorias[0];
                                    }

                                }*/
                            }
                           
                           arrNoticias[i].dsCategoriaInserir = dsCategoria;                            

                        }     
                        
                        //Montagem das requisições sincronas para inserir as noticias
                        for (var j = 0; j < arrNoticias.length; j++) {
                             //Tratamento para não exibir eventos em noticias
                            if(arrNoticias[j].dsCategoriaInserir == "Próximos Eventos"){

                                var promiseInserir = eventosFactory.insert(arrNoticias[j].idNoticiaInserir, arrNoticias[j].dsCategoriaInserir, arrNoticias[j].dsTituloInserir, arrNoticias[j].dsNoticiaInserir,  arrNoticias[j].dtNoticiaBDInserir, arrNoticias[j].dsUrlImagemInserir, 0);
                                promissesInserir.push(promiseInserir);
                                //Pegando os id das noticias que não serão excluidas
                                idNoticias.push(arrNoticias[j].idNoticiaInserir);                            
                           
                            }
                        }    
                        //Chamada do terceiro conjunto de requisições sincronas para inserir as noticias
                        $q.all(promissesInserir).then(function(resultInserir){
                            
                           //Excluindo do banco noticias que não estão mais disponiveis no servico
                            var noticiasExcluir =  eventosFactory.deleteEventos(idNoticias.join()).then(function (noticiasExcluirRetorno) {    
                                return noticiasExcluirRetorno;
                            });                                          

                            var retornoNoticiasExibir = [];
                            
                            //Executando a exclusão das noticias
                            $q.all([noticiasExcluir]).then(function(result){

                                for (var i = 0; i < result.length; i++){
                                    retornoNoticiasExibir.push(result[i]);
                                }

                                if(retornoNoticiasExibir[0][0].retorno == 1){
                                    //Após excluídas as noticias, seleciona as noticias salvas no banco
                                    eventosFactory.selectListaNoticias().then(function (dadosOnline) {
                    
                                        deferred.resolve(dadosOnline);
                                    });
                            
                                }
                                
                            }); 
                           
                        });         

                    });
                     
                });
              //Retorno das noticias salvas
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
          
         return $http.get(WEB_METODOS.urlServicosPortalEventos).then(function (response) {
               
                //Retorno da lista de noticias para serem exibidas
                var deferred = $q.defer();
                //Id das noticias que não serão excluidas                          
                var idNoticias = [];
                //Array de objetos de noticias
                var arrNoticias = [];
                //Objeto noticia
                var noticia = {};
                //Variaveis que receberão dados de categoria e url de imagem do post
                var dsCategoria = "";
                var dsUrlImagem = "";

                //Montando o objeto noticia com os dados disponiveis no primeiro JSON retornado.
                for (var i = 0; i < response.data.length; i++) {
                                     
                    var dsNoticia = "";                  
                    var dsTitulo = "";
                    var dtNoticiaBD = "";
                    var dtNoticia = "";
                    var categorias = [];                
                                 
                    //Validação de titulo
                    if (response.data[i].title != null) {
                        if (response.data[i].title.rendered != null) {
                             dsTitulo = response.data[i].title.rendered;
                        }                       
                    }
                   
                    //Valida��o da descri��o
                    if (response.data[i].content != null) {

                        if (response.data[i].content.rendered != null) {
                            dsNoticia = response.data[i].content.rendered.replace(/(<([^>]+)>)/ig, "");
                        }
                       
                    }
                           
                    //Valida��o da data
                    if (response.data[i].date != null) {
                        dtNoticiaBD = response.data[i].date;
                        //Feito para retorna no servi�o online a data ja no formato correto
                        var dataNoticiaArray = response.data[i].date.split("T");
                        var dataNoticia  = dataNoticiaArray[0].split("-");
                        dtNoticia = dataNoticia[2] + "-" + dataNoticia[1] + "-" + dataNoticia[0] + " " + dataNoticiaArray[1];
                        
                    }
                    //Variaveis criadas para receber valores da feature_media caso tenha imagens no post
                    var url_service_featured_media = "";
                    var id_feature_media= 0;

                    //Testando se existe imagens para setar a url da feature media
                    if(response.data[i].featured_media > 0){
                        url_service_featured_media = WEB_METODOS.urlServicosPortalMedia+response.data[i].featured_media;
                        id_feature_media = response.data[i].featured_media;
                    }

                    noticia = { idNoticiaInserir: response.data[i].id, 
                                dsCategoriaInserir: WEB_METODOS.urlServicosPortalCategoria+response.data[i].id, 
                                dsTituloInserir: dsTitulo,
                                dsNoticiaInserir: dsNoticia, 
                                dtNoticiaBDInserir: dtNoticiaBD, 
                                dsUrlImagemInserir: url_service_featured_media,
                                featuredMedia: id_feature_media
                            };

                    arrNoticias.push(noticia);                   

                }
                
                //Buscando as categorias e imagem da noticia.
                var promisesUrlImagem = [];
                var promisesCategoria = [];
                var promissesInserir = [];

                //Montagem das requisições sincronas para obter categorias e imagens
                for(var i = 0; i < arrNoticias.length; i++) {
                    //So cria promisses para os post que tem imagem
                    if(arrNoticias[i].dsUrlImagemInserir != ""){
                        var promiseUrlImagem = $http.get(arrNoticias[i].dsUrlImagemInserir);
                        promisesUrlImagem.push(promiseUrlImagem);
                    }                    

                    var promiseCategoria = $http.get(arrNoticias[i].dsCategoriaInserir);
                    promisesCategoria.push(promiseCategoria);

                }
                
                //Chamada do primeiro conjunto de requisições sincronas para obter as url de imagens
                $q.all(promisesUrlImagem).then(function(resultUrlImagem){
                       
                    //Tratando o retorno e populando o arr de noticias com as url de imagens para cada noticia
                    for(var i = 0; i < resultUrlImagem.length; i++) {  

                         if (resultUrlImagem[i].data != null) {                             
                            if (resultUrlImagem[i].data.media_details != null) {
                                if (resultUrlImagem[i].data.media_details.sizes != null) {
                                    if (resultUrlImagem[i].data.media_details.sizes.medium != null) {
                                        if (resultUrlImagem[i].data.media_details.sizes.medium.source_url != null) {                                         
                                             dsUrlImagem = resultUrlImagem[i].data.media_details.sizes.medium.source_url;                                         
                                        }
                                    }
                                }
                            }
                        }    

                        for(var j = 0; j < arrNoticias.length; j++) {  

                            if(arrNoticias[j].featuredMedia == resultUrlImagem[i].data.id){
                                 arrNoticias[j].dsUrlImagemInserir = dsUrlImagem;
                            }
                            
                        }
                          
                    }
               
                    //Chamada do segundo conjunto de requisições sincronas para obter as categorias
                    $q.all(promisesCategoria).then(function(result){

                        //Tratando o retorno e populando o arr de noticias com as categorias                    
                        for(var i = 0; i < result.length; i++) {

                            if (result[i].data != null) {

                               // if(result[i].data.length == 1){

                                    if (result[i].data[0].name != null) {
                                      
                                       dsCategoria = result[i].data[0].name;
                                    }

                              /*  }else if(result[i].data.length > 1){

                                    for (var j = 0; j < result[i].data.length; j++) {

                                        if (result[i].data[j].name != null) {
                                            categorias.push(result[i].data[j].name);
                                        }
                                    }

                                    var evento = categorias.indexOf("Próximos Eventos");

                                    if(evento > -1){
                                        dsCategoria = categorias[evento];
                                    }else{
                                        dsCategoria = categorias[0];
                                    }

                                }*/
                            }
                           
                           arrNoticias[i].dsCategoriaInserir = dsCategoria;                            

                        }     
                        
                        //Montagem das requisições sincronas para inserir as noticias
                        for (var j = 0; j < arrNoticias.length; j++) {
                             //Tratamento para não exibir eventos em noticias
                            if(arrNoticias[j].dsCategoriaInserir == "Próximos Eventos"){

                                var promiseInserir = eventosFactory.insert(arrNoticias[j].idNoticiaInserir, arrNoticias[j].dsCategoriaInserir, arrNoticias[j].dsTituloInserir, arrNoticias[j].dsNoticiaInserir,  arrNoticias[j].dtNoticiaBDInserir, arrNoticias[j].dsUrlImagemInserir, 0);
                                promissesInserir.push(promiseInserir);
                                //Pegando os id das noticias que não serão excluidas
                                idNoticias.push(arrNoticias[j].idNoticiaInserir);                            
                           
                            }
                        }    
                        //Chamada do terceiro conjunto de requisições sincronas para inserir as noticias
                        $q.all(promissesInserir).then(function(resultInserir){
                            
                           //Excluindo do banco noticias que não estão mais disponiveis no servico
                            var noticiasExcluir =  eventosFactory.deleteEventos(idNoticias.join()).then(function (noticiasExcluirRetorno) {    
                                return noticiasExcluirRetorno;
                            });                                          

                            var retornoNoticiasExibir = [];
                            
                            //Executando a exclusão das noticias
                            $q.all([noticiasExcluir]).then(function(result){

                                for (var i = 0; i < result.length; i++){
                                    retornoNoticiasExibir.push(result[i]);
                                }

                                if(retornoNoticiasExibir[0][0].retorno == 1){
                                    //Após excluídas as noticias, seleciona as noticias salvas no banco
                                    eventosFactory.selectListaNoticias().then(function (dadosOnline) {
                    
                                        deferred.resolve(dadosOnline);
                                    });
                            
                                }
                                
                            }); 
                           
                        });         

                    });
                     
                });
              //Retorno das noticias salvas
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
.service('getDadosEnderecoAssociado', ['$http', '$q', 'WEB_METODOS',  function ($http, $q, WEB_METODOS) {

    return {

        obter: function (data) {    

            return $http.get(WEB_METODOS.urlServicosSistema + "?m=getDadosEnderecoAssociado", {params: data}).then(function (response) {
                return response;
            });

        }
    };


}]).service('getTipoEndereco', ['$http', '$q', 'WEB_METODOS',  function ($http, $q, WEB_METODOS) {

    return {

        obter: function () {    

            return $http.get(WEB_METODOS.urlServicosSistema + "?m=getTipoEndereco").then(function (response) {
                return response;
            });

        }
    };


}]).service('getEstado', ['$http', '$q', 'WEB_METODOS',  function ($http, $q, WEB_METODOS) {

    return {

        obter: function () {    

            return $http.get(WEB_METODOS.urlServicosSistema + "?m=getEstado").then(function (response) {
                return response;
            });

        }
    };


}]).service('getMunicipios', ['$http', '$q', 'WEB_METODOS',  function ($http, $q, WEB_METODOS) {

    return {

        obter: function (data) {    

            return $http.get(WEB_METODOS.urlServicosSistema + "?m=getMunicipios", {params: data}).then(function (response) {
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
.service('getContatosAMPEB', ['$http', '$q', 'WEB_METODOS',  function ($http, $q, WEB_METODOS) {

    return {

        obter: function () {    

            return $http.get(WEB_METODOS.urlServicosSistema + "?m=getContatosAMPEB").then(function (response) {
                return response;
            });

        }
    };

}])//Serviços para o modulo de transmissão ao vivo
.service('getConfiguracaoPresencaAssembleia', ['$http', '$q', 'WEB_METODOS',  function ($http, $q, WEB_METODOS) {

    return {

        obter: function () {    

            return $http.get(WEB_METODOS.urlServicosSistema + "?m=getConfiguracaoPresencaAssembleia").then(function (response) {
                return response;
            });

        }
    };

}])//Serviços para o modulo de alteracao de senha
.service('alterarSenha', ['$http', '$q', 'WEB_METODOS','$httpParamSerializerJQLike',  function ($http, $q, WEB_METODOS,$httpParamSerializerJQLike) {

     return {

        alterar: function (data) {
                                 
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            return $http.post(WEB_METODOS.urlServicosSistema + "?m=alterarSenha", $httpParamSerializerJQLike(data)).then(function (response) {
                return response;
            });

        }
    };

}]);