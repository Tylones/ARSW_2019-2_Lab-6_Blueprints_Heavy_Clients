# ARSW_2019-2_Lab-6_Blueprints_Heavy_Clients

## Name :

```
Etienne Maxence Eugene REITZ
GitHub username : Tylones
```

## Build and test instructions : 

Go in the project directory :

* To build the project , run the command : ```mvn package```
* To test the project, run the command : ```mvn test```
* To compile the project, run the command : ```mvn compile```
* To run the project, run the command : ```mvn spring-boot:run```

The application is accessible at *https://localhost:8080/* 

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

## Create new Blueprint 


I coded a POST function acting as a Javascript promise :

```js
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
```



To request the name of the blueprint to the user, I used a *prompt*, and then, the blueprint is created and the list updated using a series of javascript promises :

```js

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
```


## Delete a blueprint


Finally, to delete a blueprint, it was necessary to add new functions to the persistence (to the *BlueprintPersistence* interface and to the *BlueprintServices*) :

```java

@Override
    public void removeBlueprint(String author, String name) throws BlueprintNotFoundException {
        blueprints.remove(new Tuple<>(author, name));
    }
```

And I coded a function in the *BlueprintAPIController.java* to support a DELETE HTTP request on a specific blueprint :

```java
@RequestMapping(path = "/{author}/{name}",method = RequestMethod.DELETE)	
    public ResponseEntity<?> DeleteBlueprint(@PathVariable ("author") String author, @PathVariable ("name") String name){
        
        try {
            bps.removeBlueprint(author, name);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (BlueprintNotFoundException ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(ex.getMessage(),HttpStatus.FORBIDDEN);
        }
    }
```

And finally, like the *save* and the *create* functions, I used a series of javascript promises :

*The javascript promise*
```js
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
```

*The function executed when clicking on the button*
```js
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

```

