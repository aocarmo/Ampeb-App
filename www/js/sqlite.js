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

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS noticias (id integer primary key, dsCategoria varchar(50), dsTitulo varchar(250), dsNoticia text, dtNoticia text, dsUrlImagem varchar(200), flLido integer)");
    });
});

sqlite.factory('noticiasFactory', function ($q, $cordovaSQLite) {
    return {
        insert: function (id, dsCategoria, dsTitulo, dsNoticia, dtNoticia, dsUrlImagem, flLido) {
            var query = "INSERT INTO noticias (id, dsCategoria, dsTitulo, dsNoticia, dtNoticia, dsUrlImagem, flLido) VALUES (?, ?, ?, ?, ?, ?, ?)";
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
            var query = "SELECT  id, dsCategoria, dsTitulo, dsNoticia, strftime('%d-%m-%Y %H:%M:%S', datetime(dtNoticia)) as dtNoticia, dsUrlImagem, flLido FROM noticias WHERE id=?";
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
            var query = "SELECT id, dsCategoria, dsTitulo, strftime('%d-%m-%Y %H:%M:%S', datetime(dtNoticia)) as dtNoticia, dsUrlImagem FROM noticias ORDER BY date(dtNoticia) DESC";
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
            var query = "SELECT 1 as retorno FROM noticias WHERE id=?";
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