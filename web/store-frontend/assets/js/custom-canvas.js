var canvas = new fabric.Canvas('tshirt-canvas', {
    fireRightClick: true,
    stopContextMenu: true
});

//Disable context menu
fabric.util.addListener(document.getElementsByClassName('upper-canvas')[0], 'contextmenu', function(e) {
    e.preventDefault();
});

// delete object code START
var deleteIcon = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjAiIHk9IjAiIHZpZXdCb3g9IjAgMCAxNyAxNyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGNpcmNsZSBmaWxsPSIjRkZGIiBjeD0iOC41IiBjeT0iOC41IiByPSI4LjUiPjwvY2lyY2xlPjxnIGZpbGw9IiNlZTM1MjQiPjxwYXRoIGQ9Im0xMS4xMyA0Ljk3LTYuMTYgNi4xNmMtLjI1LjI1LS4yNS42NSAwIC45cy42NS4yNS45IDBsNi4xNi02LjE2Yy4yNS0uMjUuMjUtLjY1IDAtLjlhLjYzNC42MzQgMCAwIDAtLjkgMCI+PC9wYXRoPjxwYXRoIGQ9Ik0xMi4wMyAxMS4xNCA1Ljg2IDQuOTdhLjYzNC42MzQgMCAwIDAtLjkgMGMtLjI1LjI1LS4yNS42NSAwIC45bDYuMTYgNi4xNmMuMjUuMjUuNjUuMjUuOSAwIC4yNi0uMjQuMjYtLjY1LjAxLS44OSI+PC9wYXRoPjwvZz48L3N2Zz4=';

var img = document.createElement('img');
img.src = deleteIcon;

fabric.Textbox.prototype.controls.deleteControl = new fabric.Control({
    x: -0.5,
    y: -0.5,
    offsetY: -16,
    offsetX: -16,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderIcon,
    cornerSize: 24
});

function deleteObject(eventData, transform){
  var target = transform.target;
  var canvas = target.canvas;
  canvas.remove(target);
  canvas.requestRenderAll();
  $('.top_layer').css("display","block");
  $('.child_layer').css("display","none");
}

function renderIcon(ctx, left, top, styleOverride, fabricObject) {
  var size = this.cornerSize;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}

// delete object code END


canvas.on('mouse:down', function(options) {
  if(options.target) {
    console.log('an object was clicked! ', options.target);
    // editTextFunction(options.target);
    $('.ct_content_tab').removeClass("active_tab");
    $('.settings_title_wrapper>ul>li').removeClass("active");
    $('li.text_tab').addClass("active");
    $('#textSettings').addClass("active_tab");

    $('#addTextTab').css("display","none");
    $('#editTextContent').val(options.target.text);
    $('#editTextTab').css("display","block");
    $('.selected_font_name').text(options.target.fontFamily);
  }else{
    $('#editTextTab').css("display","none");
    $('#addTextTab').css("display","block");
  }

  console.log("event => ", options.e);
  if(options.e.button === 2) {
        console.log("right click");
        var top_pos = options.e.layerY + 10;
        var left_pos = options.e.layerX + 10;
        $('.context_menu_wrap').css({"display":"block", "top": top_pos, "left": left_pos});
    }else{
        $('.context_menu_wrap').css("display","none");
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
    	    fontWeight:'normal', 
    	    width: tempData.width, // for 20 characters
            editable: false
	    });
        textBox.setControlsVisibility({
            tl: false,
            bl: false,
            tr: false,
            br: true,
            ml: false,
            mb: false,
            mr: false,
            mt: false,
            mtr: true
        });

	    canvas.add(textBox);
        canvas.setActiveObject(textBox);
	    canvas.renderAll();
	    $("#textContent").val("");
        $('#addTextTab').css("display","none");
        $('#editTextContent').val(text_val);
        $('#editTextTab').css("display","block");
	}
})


$("#editTextContent").keyup(function(){
    var text_val = $(this).val();
    console.log("value is => ", text_val);

    var selectedObject = canvas.getActiveObject();
    if(text_val == ''){
        selectedObject.set('text', 'No Text');
    }else{
        selectedObject.set('text', text_val);    
    }
    
    canvas.renderAll(); 
})

function changeTextFont(font){
    var selectedObject = canvas.getActiveObject();
    selectedObject.set('fontFamily', font);
    $('.selected_font_name').text(font);
    canvas.renderAll(); 
}
function changeTextColor(color, name){
    var selectedObject = canvas.getActiveObject();
    selectedObject.set('fill', color);
    $('.selected_color_name').text(name);
    canvas.renderAll(); 
}

// text Rotation js
function changeRangeValue(val){
    document.getElementById("rotatTextRangeSlide").value = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
    // showValue1(val);
    // var selectedObject = canvas.getActiveObject();
    // selectedObject.set('angle', parseFloat(val));
    // canvas.renderAll();
}
function changeInputValue(val){
    document.getElementById("rotatTextNumber").value = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
    // showValue1(val);
    // var selectedObject = canvas.getActiveObject();
    // selectedObject.set('angle', parseFloat(val));
    // canvas.renderAll();
}


function Cut() {
    // clone what are you copying since you
    // may want copy and paste on different moment.
    // and you do not want the changes happened
    // later to reflect on the copy.
    canvas.getActiveObject().clone(function(cloned) {
        _clipboard = cloned;
    });
    canvas.remove(canvas.getActiveObject())
}
function Delete() {
    canvas.remove(canvas.getActiveObject())
}


function Copy() {
    // clone what are you copying since you
    // may want copy and paste on different moment.
    // and you do not want the changes happened
    // later to reflect on the copy.
    canvas.getActiveObject().clone(function(cloned) {
        _clipboard = cloned;
    });
}
function Paste() {
    // clone again, so you can do multiple copies.
    _clipboard.clone(function(clonedObj) {
        canvas.discardActiveObject();
        clonedObj.set({
            left: clonedObj.left + 10,
            top: clonedObj.top + 10,
            evented: true,
        });
        if (clonedObj.type === 'activeSelection') {
            // active selection needs a reference to the canvas.
            clonedObj.canvas = canvas;
            clonedObj.forEachObject(function(obj) {
                canvas.add(obj);
            });
            // this should solve the unselectability
            clonedObj.setCoords();
        } else {
            canvas.add(clonedObj);
        }
        _clipboard.top += 10;
        _clipboard.left += 10;
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
    });
}


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
// document.getElementById("tshirt-color").addEventListener("change", function(){
//     document.getElementById("tshirt-div").style.backgroundColor = this.value;
// }, false);

// Update the TShirt color according to the selected color by the user
// document.getElementById("tshirt-design").addEventListener("change", function(){

//     // Call the updateTshirtImage method providing as first argument the URL
//     // of the image provided by the select
//     updateTshirtImage(this.value);
// }, false);

// When the user clicks on upload a custom picture
// document.getElementById('tshirt-custompicture').addEventListener("change", function(e){
//     var reader = new FileReader();
    
//     reader.onload = function (event){
//         var imgObj = new Image();
//         imgObj.src = event.target.result;

//         // When the picture loads, create the image in Fabric.js
//         imgObj.onload = function () {
//             var img = new fabric.Image(imgObj);

//             img.scaleToHeight(300);
//             img.scaleToWidth(300); 
//             canvas.centerObject(img);
//             canvas.add(img);
//             canvas.renderAll();
//         };
//     };

//     // If the user selected a picture, load it
//     if(e.target.files[0]){
//         reader.readAsDataURL(e.target.files[0]);
//     }
// }, false);

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