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

                var numberOfPoints = newArray.reduce(function(total, val){
                  return total.value + val.value;
                })

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
      bp.points.map(function(val,index){
        if(index==0){
          ctx.moveTo(val.x, val.y);
        }else{
          ctx.lineTo(val.x, val.y);
        }
        ctx.stroke();
      })

    }

    var getCursorPosition = function (canvas, event) {
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
          console.log('get failed')
        }
      );

      return getPromise;
    }

    return {
      authorNameChanged: function () {
        selectedBp.author = document.getElementById("authorName").value;
        

        apiclient.getBlueprintsByAuthor(selectedBp.author,updateList);
      },

      drawBluePrint: function(bpName){
        selectedBp.name = bpName;
        selectedBp.author = document.getElementById("authorName").value;
        document.getElementById("currentBlueprintName").innerHTML = selectedBp.name;

        apiclient.getBlueprintsByNameAndAuthor(selectedBp.author, selectedBp.name, draw);

      },

      saveBlueprint: function(){
        if(selectedBp.name != null && selectedBp.author != null){
         blueprintPut().then(blueprintGet); 
        }
      },

      init:function(){
        var canvas = document.getElementById("myCanvas");
        console.info('initialized');
        
        //if PointerEvent is suppported by the browser:
        if(window.PointerEvent) {
          canvas.addEventListener("pointerdown", function(e){

            if(selectedBp.name != null){
              /*pointsToAdd.push("{\"x\":"+x+",\"y\":"+y+"}");
              ctx.lineTo(x, y);
              ctx.stroke();
              alert('pointerdown at '+x+','+y);*/
              getCursorPosition(canvas, e)  
            }
            
            
          });
        }
        else {
          canvas.addEventListener("mousedown", function(event){
            if(selectedBp.name != null){
              getCursorPosition(canvas, e)   

            }
  
            }
          );
        }
      }
      
    };
  
  })();