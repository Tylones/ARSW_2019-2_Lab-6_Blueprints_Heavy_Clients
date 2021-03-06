var Module = (function () {


    var selectedBp = {
      author: null,
      name: null,
      points: []
    }

    var updateList = function (BPs) {
            if(BPs){
                document.getElementById("authorsNameLabel").innerHTML = selectedBp.author;
                var newArray = BPs.map(function(val, index){
                    return {key:val.name, value:val.points.length}
                })

                $("#blueprintTable tbody").empty();
                newArray.map(function(val,index){
                  var toAdd = '<tr><td>' + val.key + '</td><td>' + val.value + '</td><td><button type="button" class="btn btn-secondary" onclick="Module.drawBluePrint(this.value)" value="'+val.key+'">Draw '+ val.key + '</button></td></tr>';
                  $("#blueprintTable tbody").append(toAdd);
                })
                var a = 0;
                var numberOfPoints = BPs.reduce(function(a, val){
                  return a + val.points.length;
                }, a);

                document.getElementById("labelUserPoints").innerHTML = numberOfPoints;
                
            }
      };

    var draw = function (bp){
      selectedBp = bp;
      var c = document.getElementById("myCanvas");
      var ctx = c.getContext("2d");
      ctx.save();

      // Use the identity matrix while clearing the canvas
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, c.width, c.height);

      // Restore the transform
      ctx.restore();
      ctx.beginPath();
      
      bp.points.map(function(val,index){
        if(index==0){
          ctx.moveTo(val.x, val.y);
        }else{
          ctx.lineTo(val.x, val.y);
        }
        ctx.stroke();
      })

    }

    var drawLineCanvas = function (canvas, event) {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      var ctx = canvas.getContext("2d");
      selectedBp.points.push({x: x,y: y})
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    var blueprintPut = function (){
      
      var putPromise = $.ajax({
        url: "/blueprints/"+selectedBp.author+"/"+selectedBp.name,
        type: 'PUT',
        data: JSON.stringify(selectedBp),
        contentType: "application/json"
      });

      putPromise.then(
        function () {
          console.info("OK");
        },
        function () {
            console.info("ERROR");
        }
      );

      return putPromise;
    }

    var blueprintGet = function(){
      var getPromise = $.get("http://localhost:8080/blueprints/"+selectedBp.author);

      getPromise.then(
        function(data){
          updateList(data)
        },
        function(){
          document.getElementById("authorsNameLabel").innerHTML = selectedBp.author;
          $("#blueprintTable tbody").empty();
          document.getElementById("labelUserPoints").innerHTML = 0;
          console.log('get failed')
        }
      );

      return getPromise;
    }

    var blueprintDelete = function(){
      var deletePromise = $.ajax({
        url: "/blueprints/"+selectedBp.author+"/"+selectedBp.name,
        type: 'DELETE',
        contentType: "application/json"
      });

      deletePromise.then(
        function(){
          console.info('Delete OK');
        },
        function(){
          console.info('Delete NOK');
        }
      );

      return deletePromise;
    }

    var blueprintPost = function(){
      var postPromise = $.ajax({
        url: "/blueprints",
        type: 'POST',
        data: JSON.stringify(selectedBp),
        contentType: "application/json"
      });

      postPromise.then(
        function(){
          console.info('Delete OK');
        },
        function(){
          console.info('Delete NOK');
        }
      );

      return postPromise;
    }

    return {
      authorNameChanged: function () {
        selectedBp.author = document.getElementById("authorName").value;
        

        blueprintGet().then();
      },

      drawBluePrint: function(bpName){
        selectedBp.name = bpName;
        selectedBp.author = document.getElementById("authorName").value;
        document.getElementById("currentBlueprintName").innerHTML = selectedBp.name;

        apiclient.getBlueprintsByNameAndAuthor(selectedBp.author, selectedBp.name, draw);

      },

      createBlueprint: function(){
        selectedBp.author = document.getElementById("authorName").value;
        if(selectedBp.author == null){
          alert('Author name can\'t be empty');
        }
        else{
          selectedBp.name = prompt('Name of blueprint');
          selectedBp.points = [];
        }
        blueprintPost().then(blueprintGet).then(function(){
          document.getElementById("currentBlueprintName").innerHTML = selectedBp.name;
        });

      },


      saveBlueprint: function(){
        if(selectedBp.name != null && selectedBp.author != null){
         blueprintPut().then(blueprintGet); 
        }
      },

      deleteBlueprint: function(){
        if(selectedBp.name != null && selectedBp.author != null){
          blueprintDelete().then(blueprintGet).then(function(){
            selectedBp.name = null;
            document.getElementById("currentBlueprintName").innerHTML = 'None';
            var c = document.getElementById("myCanvas");
            var ctx = c.getContext("2d");
            ctx.save();

            // Use the identity matrix while clearing the canvas
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, c.width, c.height);

            // Restore the transform
            ctx.restore();
            ctx.beginPath();
          });
        }
      },

      init:function(){
        var canvas = document.getElementById("myCanvas");
        console.info('initialized');
        //if PointerEvent is suppported by the browser:
        if(window.PointerEvent) {
          canvas.addEventListener("pointerdown", function(e){
            if(selectedBp.name != null){
              drawLineCanvas(canvas, e)  
            }
          });
        }
        else {
          canvas.addEventListener("mousedown", function(event){
            if(selectedBp.name != null){
              drawLineCanvas(canvas, e)   
            }
          });
        }
      }
      
    };
  
  })();