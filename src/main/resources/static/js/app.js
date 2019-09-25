var Module = (function () {

    var selectedAuthorName = null;
    var selectedBpName = null;
    var bpList=[];
    var pointsToAdd=[];

    var updateList = function (BPs) {
            if(BPs){
                document.getElementById("authorsNameLabel").innerHTML = selectedAuthorName;
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
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    return {
      authorNameChanged: function () {
        selectedAuthorName = document.getElementById("authorName").value;
        

        apiclient.getBlueprintsByAuthor(selectedAuthorName,updateList);
      },

      drawBluePrint: function(bpName){
        pointsToAdd = [];
        selectedBpName = bpName;
        selectedAuthorName = document.getElementById("authorName").value;
        document.getElementById("currentBlueprintName").innerHTML = selectedBpName;

        apiclient.getBlueprintsByNameAndAuthor(selectedAuthorName, bpName, draw);

      },

      init:function(){
        var canvas = document.getElementById("myCanvas");
        console.info('initialized');
        
        //if PointerEvent is suppported by the browser:
        if(window.PointerEvent) {
          canvas.addEventListener("pointerdown", function(e){
            var x;
            var y;
            if (e.pageX || e.pageY) { 
              x = e.pageX;
              y = e.pageY;
            }
            else { 
              x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
              y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
            } 
            x -= canvas.offsetLeft;
            y -= canvas.offsetTop;
            if(selectedBpName != null){
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
            if(selectedBpName != null){
              alert('mousedown at '+event.clientX+','+event.clientY);  

            }
  
            }
          );
        }
      }
      
    };
  
  })();