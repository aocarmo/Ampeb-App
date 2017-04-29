var db = null;
var sqlite = angular.module('sqlite', ['ionic', 'ngCordova']);

sqlite.run(function ($ionicPlatform, $cordovaSQLite) {
    $ionicPlatform.ready(function () {
        
       
        if (window.cordova) {
            // used in cell phones
            db = $cordovaSQLite.openDB({ name: "my.db", location: 'default' });
        } else {
            // used in web browsers
            db = window.openDatabase("my.db", "1.0", "AmpebApp", -1);
        }    

        //$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS noticias (id integer primary key, dsCategoria varchar(50), dsTitulo varchar(250), dsNoticia text, dtNoticia text, dsUrlImagem varchar(200), flLido integer)");
    });
});

sqlite.factory('noticiasFactory', function ($q, $cordovaSQLite) {
    return {
        insert: function (id, dsCategoria, dsTitulo, dsNoticia, dtNoticia, dsUrlImagem, flLido) {
            var query = "INSERT INTO noticia (id, dsCategoria, dsTitulo, dsNoticia, dtNoticia, dsUrlImagem, flLido) VALUES (?, ?, ?, ?, ?, ?, ?)";
            var values = [id, dsCategoria, dsTitulo, dsNoticia, dtNoticia, dsUrlImagem, flLido];
            var outputs = [];
            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();

            $cordovaSQLite.execute(db, query, values).then(
              function (res) {
                  
                  outputs.push({ "retorno": res.insertId });
                  deferred.resolve(outputs);
                  //console.log('INSERTED ID: ' + res.insertId);
              },
              function (err) {
                  deferred.reject(err);
                  //console.log("Insert Erro: " + JSON.stringify(err));
                  //console.log('ERROR: ' + err);
                 
              }

            );
            
            return deferred.promise;
        },
        selectNoticia: function (id) {
            var query = "SELECT  id, dsCategoria, dsTitulo, dsNoticia, strftime('%d/%m/%Y %H:%M:%S', datetime(dtNoticia)) as dtNoticia, dsUrlImagem, flLido FROM noticia WHERE id=?";
            var values = [id];
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query,values).then(function (data) {
                if (data.rows.length > 0) {

                    for (var i = 0; i < data.rows.length; i++) {
                        outputs.push({
                            "id": data.rows.item(i).id,
                            "dsCategoria": data.rows.item(i).dsCategoria,
                            "dsTitulo": data.rows.item(i).dsTitulo,
                            "dtNoticia": data.rows.item(i).dtNoticia,
                            "dsNoticia": data.rows.item(i).dsNoticia,
                            "dsUrlImagem": data.rows.item(i).dsUrlImagem,
                            "flLido": data.rows.item(i).flLido,
                        });
                    }

                    deferred.resolve(outputs);

                } else {
                    var retorno = null;
                    outputs.push(retorno);
                    deferred.resolve(outputs);
                }
            }, function (error) {

                deferred.reject(error);
            });

            return deferred.promise;
        },
        selectListaNoticias: function () {
            var query = "SELECT id, dsCategoria, dsTitulo, strftime('%d/%m/%Y %H:%M:%S', datetime(dtNoticia)) as dtNoticia, dsUrlImagem FROM noticia ORDER BY date(dtNoticia) DESC";
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                if (data.rows.length > 0) {

                   for (var i = 0; i < data.rows.length; i++) {
                        outputs.push({
                            "id": data.rows.item(i).id,
                            "dsCategoria": data.rows.item(i).dsCategoria,
                            "dsTitulo": data.rows.item(i).dsTitulo,                          
                            "dtNoticia": data.rows.item(i).dtNoticia,
                            "dsUrlImagem": data.rows.item(i).dsUrlImagem,
                        });
                    }

                   deferred.resolve(outputs);

                } else {
                    var retorno = null;
                    outputs.push(retorno);
                    deferred.resolve(outputs);
                }
            }, function (error) {

                deferred.reject(error);
            });

            return deferred.promise;  //This line was missing

           
        },
        verificaNoticia: function (id) {
            var query = "SELECT 1 as retorno FROM noticia WHERE id=?";
            var values = [id];
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query, values).then(function (data) {
                if (data.rows.length > 0) {

                    outputs.push({ "retorno": data.rows.item(i).retorno });
                    deferred.resolve(outputs);

                } else {
                    
                    outputs.push({ "retorno": 0 });
                    deferred.resolve(outputs);
                }
            }, function (error) {

                outputs.push({ "retorno": error });
                deferred.reject(error);
            });

            return deferred.promise;
        }
       
    }
});

sqlite.factory('eventosFactory', function ($q, $cordovaSQLite) {
    return {
        insert: function (id, dsCategoria, dsTitulo, dsNoticia, dtNoticia, dsUrlImagem, flLido) {
            var query = "INSERT INTO evento (id, dsCategoria, dsTitulo, dsNoticia, dtNoticia, dsUrlImagem, flLido) VALUES (?, ?, ?, ?, ?, ?, ?)";
            var values = [id, dsCategoria, dsTitulo, dsNoticia, dtNoticia, dsUrlImagem, flLido];
            var outputs = [];
            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();

            $cordovaSQLite.execute(db, query, values).then(
              function (res) {
                  
                  outputs.push({ "retorno": res.insertId });
                  deferred.resolve(outputs);
                  //console.log('INSERTED ID: ' + res.insertId);
              },
              function (err) {
                  deferred.reject(err);
                  //console.log("Insert Erro: " + JSON.stringify(err));
                  //console.log('ERROR: ' + err);
                 
              }

            );
            
            return deferred.promise;
        },
        selectNoticia: function (id) {
            var query = "SELECT  id, dsCategoria, dsTitulo, dsNoticia, strftime('%d/%m/%Y %H:%M:%S', datetime(dtNoticia)) as dtNoticia, dsUrlImagem, flLido FROM evento WHERE id=?";
            var values = [id];
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query,values).then(function (data) {
                if (data.rows.length > 0) {

                    for (var i = 0; i < data.rows.length; i++) {
                        outputs.push({
                            "id": data.rows.item(i).id,
                            "dsCategoria": data.rows.item(i).dsCategoria,
                            "dsTitulo": data.rows.item(i).dsTitulo,
                            "dtNoticia": data.rows.item(i).dtNoticia,
                            "dsNoticia": data.rows.item(i).dsNoticia,
                            "dsUrlImagem": data.rows.item(i).dsUrlImagem,
                            "flLido": data.rows.item(i).flLido,
                        });
                    }

                    deferred.resolve(outputs);

                } else {
                    var retorno = null;
                    outputs.push(retorno);
                    deferred.resolve(outputs);
                }
            }, function (error) {

                deferred.reject(error);
            });

            return deferred.promise;
        },
        selectListaNoticias: function () {
            var query = "SELECT id, dsCategoria, dsTitulo, strftime('%d/%m/%Y %H:%M:%S', datetime(dtNoticia)) as dtNoticia, dsUrlImagem FROM evento ORDER BY date(dtNoticia) DESC";
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                if (data.rows.length > 0) {

                   for (var i = 0; i < data.rows.length; i++) {
                        outputs.push({
                            "id": data.rows.item(i).id,
                            "dsCategoria": data.rows.item(i).dsCategoria,
                            "dsTitulo": data.rows.item(i).dsTitulo,                          
                            "dtNoticia": data.rows.item(i).dtNoticia,
                            "dsUrlImagem": data.rows.item(i).dsUrlImagem,
                        });
                    }

                   deferred.resolve(outputs);

                } else {
                    var retorno = null;
                    outputs.push(retorno);
                    deferred.resolve(outputs);
                }
            }, function (error) {

                deferred.reject(error);
            });

            return deferred.promise;  //This line was missing

           
        },
        verificaNoticia: function (id) {
            var query = "SELECT 1 as retorno FROM evento WHERE id=?";
            var values = [id];
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query, values).then(function (data) {
                if (data.rows.length > 0) {

                    outputs.push({ "retorno": data.rows.item(i).retorno });
                    deferred.resolve(outputs);

                } else {
                    
                    outputs.push({ "retorno": 0 });
                    deferred.resolve(outputs);
                }
            }, function (error) {

                outputs.push({ "retorno": error });
                deferred.reject(error);
            });

            return deferred.promise;
        }
       
    }
});

sqlite.factory('conveniosFactory', function ($q, $cordovaSQLite) {
    return {
        insertTipoConvenio: function (id, nmTipoConvenio, flPrivado, dsUrlImagem) {
            var query = "INSERT INTO tipo_convenio (id, nmTipoConvenio, flPrivado, dsUrlImagem) VALUES (?, ?, ?, ?)";
            var values = [id, nmTipoConvenio, flPrivado, dsUrlImagem];
            var outputs = [];
            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();

            $cordovaSQLite.execute(db, query, values).then(
              function (res) {
                  
                  outputs.push({ "retorno": res.insertId });
                  deferred.resolve(outputs);
                  
              },
              function (err) {
                 
                  deferred.reject(err);                
                 
              }

            );
            
            return deferred.promise;
        },
        selectTipoConvenio: function (tipo) {
            var query = "SELECT * FROM tipo_convenio where flPrivado = 0";
            
            if(tipo == "privado"){
                query = "SELECT * FROM tipo_convenio";
            }
             
           
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar estar completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                if (data.rows.length > 0) {

                    for (var i = 0; i < data.rows.length; i++) {
                        outputs.push({
                            "id": data.rows.item(i).id,
                            "nmTipoConvenio": data.rows.item(i).nmTipoConvenio,
                            "flPrivado": data.rows.item(i).flPrivado,
                            "dsUrlImagem": data.rows.item(i).dsUrlImagem,                          
                        });
                    }

                    deferred.resolve(outputs);

                } else {
                    var retorno = null;
                    outputs.push(retorno);
                    deferred.resolve(outputs);
                }
            }, function (error) {

                deferred.reject(error);
            });

            return deferred.promise;
        },
        insertMunicipioConvenio: function (id, nmMunicipioConvenio) {
            var query = "INSERT INTO municipio_convenio (id, nmMunicipioConvenio) VALUES (?, ?)";
            var values = [id, nmMunicipioConvenio];
            var outputs = [];
            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();

            $cordovaSQLite.execute(db, query, values).then(
              function (res) {
                 
                  outputs.push({ "retorno": res.insertId });
                  deferred.resolve(outputs);
                  
              },
              function (err) {
                
                  deferred.reject(err);                
                 
              }

            );
            
            return deferred.promise;
        },
        selectMunicipioConvenio: function () {
            var query = "SELECT * FROM municipio_convenio";
           
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar estar completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                if (data.rows.length > 0) {

                    for (var i = 0; i < data.rows.length; i++) {
                        outputs.push({
                            "id": data.rows.item(i).id,
                            "nmMunicipioConvenio": data.rows.item(i).nmMunicipioConvenio,         
                        });
                    }

                    deferred.resolve(outputs);

                } else {
                    var retorno = null;
                    outputs.push(retorno);
                    deferred.resolve(outputs);
                }
            }, function (error) {

                deferred.reject(error);
            });

            return deferred.promise;
        },
        insertConvenio: function (id, nmConvenio, dsUrlImagem, dsConvenio, nmContato, dsTelefone, dsEmail, urlSite, dsEndereco, dtInicioVigencia, dtTerminoVigencia, dsDesconto,flPublicar, idTipoConvenio, nmMunicipio, nmEstado, flPrivado) {
            var query = "INSERT INTO convenio (id, nmConvenio, dsUrlImagem, dsConvenio, nmContato, dsTelefone, dsEmail, urlSite, dsEndereco, dtInicioVigencia, dtTerminoVigencia, dsDesconto,flPublicar, idTipoConvenio, nmMunicipio, nmEstado, flPrivado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            var values = [id, nmConvenio, dsUrlImagem, dsConvenio, nmContato, dsTelefone, dsEmail, urlSite, dsEndereco, dtInicioVigencia, dtTerminoVigencia, dsDesconto,flPublicar, idTipoConvenio, nmMunicipio, nmEstado, flPrivado];
            var outputs = [];
            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();

            $cordovaSQLite.execute(db, query, values).then(
              function (res) {
                 
                  outputs.push({ "retorno": res.insertId });
                  deferred.resolve(outputs);
                  
              },
              function (err) {
                  
                  deferred.reject(err);                
                 
              }

            );
            
            return deferred.promise;
        },
        selectConvenio: function (idTipoConvenio, nmConvenio, nmMunicipio, idConvenio) {

            var filtroIdTipoConvenio = "";
            var filtroNmConvenio = "";
            var filtroNmMunicipio = "";
            var filtroIdConvenio = "";

            if(idTipoConvenio != null){
               filtroIdTipoConvenio =  " AND idTipoConvenio = " + idTipoConvenio;
            }

            if(nmConvenio != null){
               filtroNmConvenio =  " AND nmConvenio LIKE '%" + nmConvenio + "%'";
            }

            if(nmMunicipio != null){
               filtroNmMunicipio =  " AND nmMunicipio LIKE '%" + nmMunicipio + "%'";
            }
           
            if(idConvenio != null){
               filtroIdConvenio =  " AND id = " + idConvenio;
            }

            var query = "SELECT id, nmConvenio, dsUrlImagem, dsConvenio, nmContato, dsTelefone, dsEmail, urlSite, dsEndereco, strftime('%d/%m/%Y', datetime(dtInicioVigencia)) as dtInicioVigencia, CASE WHEN dtTerminoVigencia IS NOT NULL THEN strftime('%d/%m/%Y', datetime(dtTerminoVigencia)) ELSE dtTerminoVigencia END as dtTerminoVigencia, dsDesconto,flPublicar, idTipoConvenio, nmMunicipio, nmEstado, flPrivado FROM convenio WHERE 1=1 " + filtroIdTipoConvenio + filtroNmConvenio + filtroNmMunicipio + filtroIdConvenio;
         
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar estar completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                if (data.rows.length > 0) {

                    for (var i = 0; i < data.rows.length; i++) {
                        outputs.push({
                            "id": data.rows.item(i).id,                          
                            "nmConvenio":data.rows.item(i).nmConvenio,
                            "dsUrlImagem":data.rows.item(i).dsUrlImagem,
                            "dsConvenio":data.rows.item(i).dsConvenio,
                            "nmContato":data.rows.item(i).nmContato,
                            "dsTelefone":data.rows.item(i).dsTelefone,
                            "dsEmail":data.rows.item(i).dsEmail,
                            "urlSite":data.rows.item(i).urlSite,
                            "dsEndereco":data.rows.item(i).dsEndereco,
                            "dtInicioVigencia":data.rows.item(i).dtInicioVigencia,
                            "dtTerminoVigencia":data.rows.item(i).dtTerminoVigencia,
                            "dsDesconto":data.rows.item(i).dsDesconto,
                            "flPublicar":data.rows.item(i).flPublicar,
                            "idTipoConvenio":data.rows.item(i).idTipoConvenio,
                            "nmMunicipio":data.rows.item(i).nmMunicipio,
                            "nmEstado":data.rows.item(i).nmEstado,
                            "flPrivado":data.rows.item(i).flPrivado,
                        });
                    }

                    deferred.resolve(outputs);

                } else {
                    var retorno = null;
                    outputs.push(retorno);
                    deferred.resolve(outputs);
                }
            }, function (error) {

                deferred.reject(error);
            });

            return deferred.promise;
        }              
    }
});