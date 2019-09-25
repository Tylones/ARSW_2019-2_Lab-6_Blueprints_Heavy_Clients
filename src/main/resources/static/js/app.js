var Module = (function () {

    var selectedAuthorName;
    var bpList=[];

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

    return {
      authorNameChanged: function () {
        selectedAuthorName = document.getElementById("authorName").value;
        

        apiclient.getBlueprintsByAuthor(selectedAuthorName,updateList);
      },

      drawBluePrint: function(bpName){
        selectedAuthorName = document.getElementById("authorName").value;

        apiclient.getBlueprintsByNameAndAuthor(selectedAuthorName, bpName, draw);

      }
      
    };
  
  })();