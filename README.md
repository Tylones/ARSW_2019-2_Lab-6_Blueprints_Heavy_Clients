# ARSW_2019-2_Lab-6_Blueprints_Heavy_Clients

## Click listener

As show in the codepen, I added an event handler to the page to capture the clicks of the user, and with it draw the blueprints when the user clicks in the canvas (if a blueprint has been selected) :

*the function to init the listener :*
```js
return{
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
}


```

*The function draw a line in the canvas :*

```js 
var drawLineCanvas = function (canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    var ctx = canvas.getContext("2d");
    selectedBp.points.push({x: x,y: y})
    ctx.lineTo(x, y);
    ctx.stroke();
}

```

It is important to note that, each time the user clicks in the canvas, a line is drawn to the new point, and the new is added to the *selectedBP* private object in the app.js. 

```js
var selectedBp = {
      author: null,
      name: null,
      points: []
    }

```

## Save Button

To update a blueprint, I simply used a Javascript promise : 


```js
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

```


To update the list of blueprints after saving, I used a series of javascript promises : 

```js 
saveBlueprint: function(){
    if(selectedBp.name != null && selectedBp.author != null){
        blueprintPut().then(blueprintGet); 
    }
},
```

