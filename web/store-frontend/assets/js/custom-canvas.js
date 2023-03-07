let canvas = new fabric.Canvas('tshirt-canvas');

//Disable context menu
fabric.util.addListener(document.getElementsByClassName('upper-canvas')[0], 'contextmenu', function(e) {
    e.preventDefault();
    
});

canvas.on('mouse:down', function(options) {
  if(options.target) {
    console.log('an object was clicked! ', options.target);
    // editTextFunction(options.target);
    $('.ct_content_tab').removeClass("active_tab");
    $('.settings_title_wrapper>ul>li').removeClass("active");
    $('li.text_tab').addClass("active");
    $('#textSettings').addClass("active_tab");

    $('#addTextTab').css("display","none");
    $('#editTextTab').css("display","block");
  }
});

canvas.on('object:moving', function (e) {
        var obj = e.target;
        if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
            return;
        }        
        obj.setCoords();   
        if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
            obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
            obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
        }
        if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
            obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
            obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
        }
});

    var left1 = 0;
    var top1 = 0 ;
    var scale1x = 0 ;    
    var scale1y = 0 ;    
    var width1 = 0 ;    
    var height1 = 0 ;
  canvas.on('object:scaling', function (e){
    var obj = e.target;
    obj.setCoords();
    var brNew = obj.getBoundingRect();
    
    if (((brNew.width+brNew.left)>=obj.canvas.width) || ((brNew.height+brNew.top)>=obj.canvas.height) || ((brNew.left<0) || (brNew.top<0))) {
    obj.left = left1;
    obj.top=top1;
    obj.scaleX=scale1x;
    obj.scaleY=scale1y;
    obj.width=width1;
    obj.height=height1;
  }
    else{    
      left1 =obj.left;
      top1 =obj.top;
      scale1x = obj.scaleX;
      scale1y=obj.scaleY;
      width1=obj.width;
      height1=obj.height;
    }
 });


$("#addTextContent").click(function(){
    console.log("test");
    var text_val = $("#textContent").val();
    console.log("value is => ", text_val);
    if(text_val != ""){
        var tempData = $.measureText(text_val, {fontFamily:"Arial", fontSize:26});
        console.log(tempData)
    	var textBox = new fabric.Textbox(text_val,{
    	    fontSize: 26,
    	    fontFamily: 'Arial',
    	    textAlign: 'left', 
    	    fontWeight:'bold', 
    	    width: tempData.width, // for 20 characters
            editable: false
	    });

	    canvas.add(textBox);
	    canvas.renderAll();
	    $("#textContent").val("");
	}
})
       

function updateTshirtImage(imageURL){
    fabric.Image.fromURL(imageURL, function(img) {                   
        img.scaleToHeight(300);
        img.scaleToWidth(300); 
        canvas.centerObject(img);
        canvas.add(img);
        canvas.renderAll();
    });
}

// Update the TShirt color according to the selected color by the user
document.getElementById("tshirt-color").addEventListener("change", function(){
    document.getElementById("tshirt-div").style.backgroundColor = this.value;
}, false);

// Update the TShirt color according to the selected color by the user
document.getElementById("tshirt-design").addEventListener("change", function(){

    // Call the updateTshirtImage method providing as first argument the URL
    // of the image provided by the select
    updateTshirtImage(this.value);
}, false);

// When the user clicks on upload a custom picture
document.getElementById('tshirt-custompicture').addEventListener("change", function(e){
    var reader = new FileReader();
    
    reader.onload = function (event){
        var imgObj = new Image();
        imgObj.src = event.target.result;

        // When the picture loads, create the image in Fabric.js
        imgObj.onload = function () {
            var img = new fabric.Image(imgObj);

            img.scaleToHeight(300);
            img.scaleToWidth(300); 
            canvas.centerObject(img);
            canvas.add(img);
            canvas.renderAll();
        };
    };

    // If the user selected a picture, load it
    if(e.target.files[0]){
        reader.readAsDataURL(e.target.files[0]);
    }
}, false);

// When the user selects a picture that has been added and press the DEL key
// The object will be removed !
document.addEventListener("keydown", function(e) {
    var keyCode = e.keyCode;
    console.log("key code => ", keyCode);

    if(keyCode == 46){
        console.log("Removing selected element on Fabric.js on DELETE key !");
        canvas.remove(canvas.getActiveObject());
    }
}, false);