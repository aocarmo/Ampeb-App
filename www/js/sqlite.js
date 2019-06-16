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
        insert: function (id, dsCategoria, dsTitulo, dsNoticia, dtNoticia, dsUrlImagem, flLido, status, dtAtualizacao, tpConsulta) {
            var query = "INSERT INTO noticia (id, dsCategoria, dsTitulo, dsNoticia, dtNoticia, dsUrlImagem, flLido, status, dtAtualizacao, tpConsulta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            var values = [id, dsCategoria, dsTitulo, dsNoticia, dtNoticia, dsUrlImagem, flLido, status, dtAtualizacao, tpConsulta];
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
        selectListaNoticias: function (tipo) {
          
            var query = "SELECT id, dsCategoria, dsTitulo, strftime('%d/%m/%Y %H:%M:%S', datetime(dtNoticia)) as dtNoticia, dsUrlImagem FROM noticia WHERE status = 'publish' ORDER BY datetime(dtNoticia) DESC";

            if(tipo == "private"){
             
                query = "SELECT id, dsCategoria, dsTitulo, strftime('%d/%m/%Y %H:%M:%S', datetime(dtNoticia)) as dtNoticia, dsUrlImagem FROM noticia ORDER BY datetime(dtNoticia) DESC";
            }
          
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
        obterQtdNoticiaNaoLida: function () {
            var query = "SELECT count(*) as qtd FROM noticia WHERE flLido = 0";
           
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                if (data.rows.length > 0) {

                    outputs.push({ "qtdNoticiasNaoLidas": data.rows.item(0).qtd});
                    deferred.resolve(outputs);

                } else {
                    
                    var retorno = null;
                    outputs.push(retorno);
                    deferred.resolve(outputs);
                }
            }, function (error) {

                outputs.push({ "retorno": error });
                deferred.reject(error);
            });

            return deferred.promise;
        },
        marcarNoticiasLidas: function () {
            var query = "UPDATE noticia SET flLido = 1 WHERE flLido = 0";
           
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                    outputs.push({ "atualizado": data});
                    deferred.resolve(outputs);
               
            }, function (error) {

                outputs.push({ "retorno": error });
                deferred.reject(error);
            });

            return deferred.promise;
        },
        deleteNoticias: function (id,tpConsulta) {
            var query = "DELETE FROM noticia WHERE id NOT IN ("+id+") AND tpConsulta = "+tpConsulta;
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {

                    outputs.push({ "retorno": 1});
                    deferred.resolve(outputs);
               
            }, function (error) {

                deferred.reject(error);
            });

            return deferred.promise;  //This line was missing

           
        },
        deleteNoticiasDesatualizadas: function (id,dtAtualizacao) {
            var query = "DELETE FROM noticia WHERE id = "+id+" AND dtAtualizacao <> '"+dtAtualizacao+"'";
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                  
                    outputs.push({ "retorno": 1});
                    deferred.resolve(outputs);
               
            }, function (error) {

                deferred.reject(error);
            });

            return deferred.promise;  //This line was missing

           
        }
       
    }
});

sqlite.factory('eventosFactory', function ($q, $cordovaSQLite) {
    return {
        insert: function (id, dsCategoria, dsTitulo, dsNoticia, dtNoticia, dsUrlImagem, flLido, status, dtAtualizacao, tpConsulta, dtEvento) {
            var query = "INSERT INTO evento (id, dsCategoria, dsTitulo, dsNoticia, dtNoticia, dsUrlImagem, flLido, status, dtAtualizacao, tpConsulta, dtEvento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            var values = [id, dsCategoria, dsTitulo, dsNoticia, dtNoticia, dsUrlImagem, flLido, status, dtAtualizacao, tpConsulta, dtEvento];
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
        selectNoticia: function (id) {
            var query = "SELECT  id, dsCategoria, dsTitulo, dsNoticia, strftime('%d/%m/%Y %H:%M:%S', datetime(dtNoticia)) as dtNoticia, dsUrlImagem, flLido, strftime('%d/%m/%Y %H:%M', datetime(dtEvento)) as dtEvento FROM evento WHERE id=?";
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
                            "dtEvento": data.rows.item(i).dtEvento,
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
        selectListaNoticias: function (tipo) {
          
            var query = "SELECT id, dsCategoria, dsTitulo, strftime('%d/%m/%Y %H:%M:%S', datetime(dtNoticia)) as dtNoticia, dsUrlImagem, strftime('%d/%m/%Y %H:%M', datetime(dtEvento)) as dtEvento FROM evento WHERE status = 'publish' and datetime(dtEvento) >= DATE('now')  ORDER BY datetime(dtEvento) ASC";

            if(tipo == "private"){
             
                query = "SELECT id, dsCategoria, dsTitulo, strftime('%d/%m/%Y %H:%M:%S', datetime(dtNoticia)) as dtNoticia, dsUrlImagem, strftime('%d/%m/%Y %H:%M', datetime(dtEvento)) as dtEvento FROM evento WHERE datetime(dtEvento) >= DATE('now') ORDER BY datetime(dtEvento) ASC";
            }
          
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
                            "dtEvento": data.rows.item(i).dtEvento,
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
        obterQtdEventosNaoLido: function () {
            var query = "SELECT count(*) as qtd FROM evento WHERE flLido = 0";
           
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                if (data.rows.length > 0) {

                    outputs.push({ "qtdEventosNaoLidos": data.rows.item(0).qtd});
                    deferred.resolve(outputs);

                } else {
                    
                    var retorno = null;
                    outputs.push(retorno);
                    deferred.resolve(outputs);
                }
            }, function (error) {

                outputs.push({ "retorno": error });
                deferred.reject(error);
            });

            return deferred.promise;
        },
        marcarEventosLidos: function () {
            var query = "UPDATE evento SET flLido = 1 WHERE flLido = 0";
           
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                    outputs.push({ "atualizado": data});
                    deferred.resolve(outputs);
               
            }, function (error) {

                outputs.push({ "retorno": error });
                deferred.reject(error);
            });

            return deferred.promise;
        },
        deleteEventos: function (id,tpConsulta) {
            var query = "DELETE FROM evento WHERE id NOT IN ("+id+") AND tpConsulta = "+tpConsulta;
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {

                    outputs.push({ "retorno": 1});
                    deferred.resolve(outputs);
               
            }, function (error) {

                deferred.reject(error);
            });

            return deferred.promise;  //This line was missing

           
        },
        deleteEventosDesatualizados: function (id,dtAtualizacao) {
            var query = "DELETE FROM evento WHERE id = "+id+" AND dtAtualizacao <> '"+dtAtualizacao+"'";
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                  
                    outputs.push({ "retorno": 1});
                    deferred.resolve(outputs);
               
            }, function (error) {

                deferred.reject(error);
            });

            return deferred.promise;  //This line was missing

           
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
        selectTipoConvenio: function () {
            var query = "SELECT * FROM tipo_convenio ORDER BY nmTipoConvenio ASC";
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
            var query = "SELECT * FROM municipio_convenio ORDER BY nmMunicipioConvenio ASC";
           
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
        insertConvenio: function (id, nmConvenio, dsUrlImagem, dsConvenio, nmContato, dsTelefone, dsEmail, urlSite, dsEndereco, dtInicioVigencia, dtTerminoVigencia, dsDesconto,flPublicar, idTipoConvenio, nmMunicipio, nmEstado, flPrivado, nmPais, urlAnexo, latitude, longitude) {
            var query = "INSERT INTO convenios (id, nmConvenio, dsUrlImagem, dsConvenio, nmContato, dsTelefone, dsEmail, urlSite, dsEndereco, dtInicioVigencia, dtTerminoVigencia, dsDesconto,flPublicar, idTipoConvenio, nmMunicipio, nmEstado, flPrivado, nmPais, urlAnexo, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            var values = [id, nmConvenio, dsUrlImagem, dsConvenio, nmContato, dsTelefone, dsEmail, urlSite, dsEndereco, dtInicioVigencia, dtTerminoVigencia, dsDesconto,flPublicar, idTipoConvenio, nmMunicipio, nmEstado, flPrivado, nmPais, urlAnexo, latitude, longitude];
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

            var query = "SELECT id, nmConvenio, dsUrlImagem, dsConvenio, nmContato, dsTelefone, dsEmail, urlSite, dsEndereco, strftime('%d/%m/%Y', datetime(dtInicioVigencia)) as dtInicioVigencia, CASE WHEN dtTerminoVigencia IS NOT NULL THEN strftime('%d/%m/%Y', datetime(dtTerminoVigencia)) ELSE dtTerminoVigencia END as dtTerminoVigencia, dsDesconto,flPublicar, idTipoConvenio, nmMunicipio, nmEstado, flPrivado, nmPais, urlAnexo, latitude, longitude FROM convenios WHERE 1=1 " + filtroIdTipoConvenio + filtroNmConvenio + filtroNmMunicipio + filtroIdConvenio + " ORDER BY nmConvenio ASC";
            
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
                            "nmPais":data.rows.item(i).nmPais,
                            "urlAnexo":data.rows.item(i).urlAnexo,
                            "latitude":data.rows.item(i).latitude,
                            "longitude":data.rows.item(i).longitude                           
                           
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

sqlite.factory('fiquePorDentroFactory', function ($q, $cordovaSQLite) {
    return {
        insert: function (id, dsCategoria, dsTitulo, dsNoticia, dtNoticia, dsUrlImagem, flLido, status, dtAtualizacao) {
            var query = "INSERT INTO fique_por_dentro (id, dsCategoria, dsTitulo, dsNoticia, dtNoticia, dsUrlImagem, flLido, status, dtAtualizacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            var values = [id, dsCategoria, dsTitulo, dsNoticia, dtNoticia, dsUrlImagem, flLido, status, dtAtualizacao];
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
        selectNoticia: function (id) {
            var query = "SELECT  id, dsCategoria, dsTitulo, dsNoticia, strftime('%d/%m/%Y %H:%M:%S', datetime(dtNoticia)) as dtNoticia, dsUrlImagem, flLido FROM fique_por_dentro WHERE id=?";
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

            query = "SELECT id, dsCategoria, dsTitulo, strftime('%d/%m/%Y %H:%M:%S', datetime(dtNoticia)) as dtNoticia, dsUrlImagem FROM fique_por_dentro ORDER BY datetime(dtNoticia) DESC";
           
       
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
        obterQtdNoticiaNaoLida: function () {
            var query = "SELECT count(*) as qtd FROM fique_por_dentro WHERE flLido = 0";
           
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                
                if (data.rows.length > 0) {
                    
                    outputs.push({ "qtdFiquePorDentroNaoLidas": data.rows.item(0).qtd});
                    deferred.resolve(outputs);

                } else {
                    
                    var retorno = null;
                    outputs.push(retorno);
                    deferred.resolve(outputs);
                }
            }, function (error) {

                outputs.push({ "retorno": error });
                deferred.reject(error);
            });

            return deferred.promise;
        },
        marcarNoticiasLidas: function () {
            var query = "UPDATE fique_por_dentro SET flLido = 1 WHERE flLido = 0";
           
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                    outputs.push({ "atualizado": data});
                    deferred.resolve(outputs);
               
            }, function (error) {

                outputs.push({ "retorno": error });
                deferred.reject(error);
            });

            return deferred.promise;
        },
        deleteNoticias: function (id) {
            var query = "DELETE FROM fique_por_dentro WHERE id NOT IN ("+id+")";
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {

                    outputs.push({ "retorno": 1});
                    deferred.resolve(outputs);
               
            }, function (error) {

                deferred.reject(error);
            });

            return deferred.promise;  //This line was missing

           
        },
        deleteNoticiasDesatualizadas: function (id,dtAtualizacao) {
            var query = "DELETE FROM fique_por_dentro WHERE id = "+id+" AND dtAtualizacao <> '"+dtAtualizacao+"'";
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                   
                    outputs.push({ "retorno": 1});
                    deferred.resolve(outputs);
               
            }, function (error) {

                deferred.reject(error);
            });

            return deferred.promise;  //This line was missing

           
        }
       
    }
});

sqlite.factory('enqueteFactory', function ($q, $cordovaSQLite) {
    return {
        insert: function (id, dsEnquete, totalVotos, totalVotantes, dtCadastro, dtExpiracao, flAtivo, flLido, flVotada) {
            var query = "INSERT INTO enquete (id, dsEnquete, totalVotos, totalVotantes, dtCadastro, dtExpiracao, flAtivo, flLido, flVotada) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            var values = [id, dsEnquete, totalVotos, totalVotantes, dtCadastro, dtExpiracao, flAtivo, flLido, flVotada];
            var outputs = [];
            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();

            $cordovaSQLite.execute(db, query, values).then(
              function (res) {
                
                  outputs.push({ "retorno": res.insertId });
                  deferred.resolve(outputs);
                  
              },
              function (err) {

                if(err.code == 6){
                    query = "UPDATE enquete SET dsEnquete = ?, totalVotos = ?, totalVotantes = ?, dtCadastro = ?, dtExpiracao = ?, flAtivo = ?, flLido = ?, flVotada = ? WHERE  id =  ?";
                    values = [dsEnquete, totalVotos, totalVotantes, dtCadastro, dtExpiracao, flAtivo, flLido, flVotada, id];
                    outputs = [];
                    //Usada para fazer o retorno do banco aguardar esta completa
                   

                    $cordovaSQLite.execute(db, query,values).then(function (data) {
                        outputs.push({ "atualizado": data});
                        deferred.resolve(outputs);
                
                    }, function (error) {

                        outputs.push({ "retorno": error });
                        deferred.reject(error);
                    });
            
                }
                    deferred.reject(err);
                }

            );
            
            return deferred.promise;
        },
        selectListaEnquetes: function () {

            query = "SELECT id, dsEnquete, totalVotos, totalVotantes, strftime('%d/%m/%Y %H:%M:%S', datetime(dtCadastro)) as dtCadastro, strftime('%d/%m/%Y %H:%M:%S', datetime(dtExpiracao)) as dtExpiracao, flAtivo, flVotada FROM enquete ORDER BY datetime(dtCadastro) DESC";
                  
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                if (data.rows.length > 0) {

                   for (var i = 0; i < data.rows.length; i++) {
                        outputs.push({
                            "id": data.rows.item(i).id,
                            "dsEnquete": data.rows.item(i).dsEnquete,
                            "totalVotos": data.rows.item(i).totalVotos,                          
                            "totalVotantes": data.rows.item(i).totalVotantes,
                            "dtCadastro": data.rows.item(i).dtCadastro,
                            "dtExpiracao": data.rows.item(i).dtExpiracao,
                            "flAtivo": data.rows.item(i).flAtivo,
                            "flVotada": data.rows.item(i).flVotada
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
        obterQtdEnqueteNaoLida: function () {
            var query = "SELECT count(*) as qtd FROM enquete WHERE flLido = 0";
           
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                
                if (data.rows.length > 0) {
                    
                    outputs.push({ "qtdEnqueteNaoLidas": data.rows.item(0).qtd});
                    deferred.resolve(outputs);

                } else {
                    
                    var retorno = null;
                    outputs.push(retorno);
                    deferred.resolve(outputs);
                }
            }, function (error) {

                outputs.push({ "retorno": error });
                deferred.reject(error);
            });

            return deferred.promise;
        },
        marcarEnquetesLidas: function () {
            var query = "UPDATE enquete SET flLido = 1 WHERE flLido = 0";
           
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                    outputs.push({ "atualizado": data});
                    deferred.resolve(outputs);
               
            }, function (error) {

                outputs.push({ "retorno": error });
                deferred.reject(error);
            });

            return deferred.promise;
        },
        marcarEnquetesVotadas: function (id) {
           
            var query = "UPDATE enquete SET flVotada = 1 WHERE id = ?";
            var values = [id];
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query, values).then(function (data) {
                    outputs.push({ "atualizado": data});
                    deferred.resolve(outputs);
               
            }, function (error) {

                outputs.push({ "retorno": error });
                deferred.reject(error);
            });

            return deferred.promise;
        },
        deleteEnquetes: function (id) {
            var query = "DELETE FROM enquete WHERE id NOT IN ("+id+")";
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {

                    outputs.push({ "retorno": 1});
                    deferred.resolve(outputs);
               
            }, function (error) {

                deferred.reject(error);
            });

            return deferred.promise;  //This line was missing

        }
       
    }
});

sqlite.factory('novidadesConveniosFactory', function ($q, $cordovaSQLite) {
    return {
        insert: function (id, id_convenio, dtCadastro, nmConvenio, dsTitulo, dsNovidade, dtPublicacao, dtExpiracao, dsUrlImagem, dsUrlPdf, flLido, dtAtualizacao) {
           
            var query = "INSERT INTO novidadesConvenios (id, id_convenio, dtCadastro, nmConvenio, dsTitulo, dsNovidade, dtPublicacao, dtExpiracao, dsUrlImagem, dsUrlPdf, flLido, dtAtualizacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            var values = [id, id_convenio, dtCadastro, nmConvenio, dsTitulo, dsNovidade, dtPublicacao, dtExpiracao, dsUrlImagem, dsUrlPdf, flLido, dtAtualizacao];
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
        selectNovidade: function (id) {
     
            var query = "SELECT  id, id_convenio, nmConvenio, dsTitulo, dsNovidade, strftime('%d/%m/%Y', datetime(dtPublicacao)) as dtPublicacao, strftime('%d/%m/%Y', datetime(dtExpiracao)) as dtExpiracao, dsUrlImagem, dsUrlPdf, flLido FROM novidadesConvenios WHERE id=?";
            var values = [id];
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query,values).then(function (data) {
            
                if (data.rows.length > 0) {
                 
                    for (var i = 0; i < data.rows.length; i++) {
                        outputs.push({
                            "id": data.rows.item(i).id,
                            "id_convenio": data.rows.item(i).id_convenio,
                            "nmConvenio": data.rows.item(i).nmConvenio,
                            "dsTitulo": data.rows.item(i).dsTitulo,
                            "dsNovidade": data.rows.item(i).dsNovidade,
                            "dtPublicacao": data.rows.item(i).dtPublicacao,
                            "dtExpiracao": data.rows.item(i).dtExpiracao,
                            "dsUrlImagem": data.rows.item(i).dsUrlImagem,
                            "dsUrlPdf": data.rows.item(i).dsUrlPdf,                            
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
        selectListaNovidades: function (idConvenio) {
          
            var query = "";
            if(idConvenio != null ){
                 query = "SELECT  id, id_convenio, nmConvenio, dsTitulo, dsNovidade, strftime('%d/%m/%Y %H:%M:%S', datetime(dtPublicacao)) as dtPublicacao, strftime('%d/%m/%Y %H:%M:%S', datetime(dtExpiracao)) as dtExpiracao, dsUrlImagem, dsUrlPdf, flLido FROM novidadesConvenios WHERE id_convenio = "+idConvenio+" ORDER BY datetime(dtCadastro) DESC";
            }else{
                 query = "SELECT  id, id_convenio, nmConvenio, dsTitulo, dsNovidade, strftime('%d/%m/%Y %H:%M:%S', datetime(dtPublicacao)) as dtPublicacao, strftime('%d/%m/%Y %H:%M:%S', datetime(dtExpiracao)) as dtExpiracao, dsUrlImagem, dsUrlPdf, flLido FROM novidadesConvenios ORDER BY datetime(dtCadastro) DESC";
            }
      
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
               
                if (data.rows.length > 0) {

                   for (var i = 0; i < data.rows.length; i++) {
                        outputs.push({
                            "id": data.rows.item(i).id,
                            "id_convenio": data.rows.item(i).id_convenio,
                            "nmConvenio": data.rows.item(i).nmConvenio,
                            "dsTitulo": data.rows.item(i).dsTitulo,   
                            "dsUrlImagem": data.rows.item(i).dsUrlImagem               
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
        obterQtdNovidadeNaoLida: function () {
            var query = "SELECT count(*) as qtd FROM novidadesConvenios WHERE flLido = 0";
           
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                
                if (data.rows.length > 0) {

                    outputs.push({ "qtdNovidadesNaoLidas": data.rows.item(0).qtd});
                    deferred.resolve(outputs);

                } else {
                    
                    var retorno = null;
                    outputs.push(retorno);
                    deferred.resolve(outputs);
                }
            }, function (error) {

                outputs.push({ "retorno": error });
                deferred.reject(error);
            });

            return deferred.promise;
        },
        marcarNovidadesLidas: function (idConvenio, idNovidade) {

            var query = "";
            if(idConvenio != null){
                query = "UPDATE novidadesConvenios SET flLido = 1 WHERE flLido = 0 and id_convenio = "+idConvenio;
            }else if(idNovidade != null){
                query = "UPDATE novidadesConvenios SET flLido = 1 WHERE flLido = 0 and id = "+idNovidade;
            }else{
                query = "UPDATE novidadesConvenios SET flLido = 1 WHERE flLido = 0";
            }
          
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
                    outputs.push({ "atualizado": data});
                    deferred.resolve(outputs);
               
            }, function (error) {

                outputs.push({ "retorno": error });
                deferred.reject(error);
            });

            return deferred.promise;
        },
        deleteNovidades: function (id) {
            var query = "DELETE FROM novidadesConvenios WHERE id NOT IN ("+id+")";
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {

                    outputs.push({ "retorno": 1});
                    deferred.resolve(outputs);
               
            }, function (error) {

                deferred.reject(error);
            });

            return deferred.promise;  //This line was missing

           
        },
        deleteNovidadesDesatualizadas: function (id,dtAtualizacao) {
            var query = "DELETE FROM novidadesConvenios WHERE id = "+id+" and dtAtualizacao != '"+dtAtualizacao+"'";
            var outputs = [];

            //Usada para fazer o retorno do banco aguardar esta completa
            var deferred = $q.defer();
            $cordovaSQLite.execute(db, query).then(function (data) {
           
                    outputs.push({ "retorno": 1});
                    deferred.resolve(outputs);
               
            }, function (error) {
          
                deferred.reject(error);
            });

            return deferred.promise;  //This line was missing

           
        }
       
    }
});