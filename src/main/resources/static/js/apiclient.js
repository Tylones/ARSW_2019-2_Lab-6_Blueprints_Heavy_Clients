var apiclient = (function () {

    var findElement = function (arr, propName, propValue) {
    for (var i=0; i < arr.length; i++)
      if (arr[i][propName] == propValue)
        return arr[i];
  
    // will return undefined if not found; you could return a default instead
  }


  
  return {
    getBlueprintsByAuthor: function (author, callback) {
        var str = "http://localhost:8080/blueprints/"+author;
        $.get(str, function(data){
            callback(
                data
            );
        });
    },

    getBlueprintsByNameAndAuthor: function(author, name, callback){
        var str = "http://localhost:8080/blueprints/"+author+"/"+name;
        $.get(str, function(data){
            callback(
                data
            );
        });
      
    }
  };


  

})();
