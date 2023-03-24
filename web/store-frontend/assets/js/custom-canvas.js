var front_canvas = new fabric.Canvas('front-canvas', {
    fireRightClick: true,
    stopContextMenu: true,
    controlsAboveOverlay: true
});

var back_canvas = new fabric.Canvas('back-canvas', {
    fireRightClick: true,
    stopContextMenu: true,
    controlsAboveOverlay: true
});

var left_canvas = new fabric.Canvas('left-canvas', {
    fireRightClick: true,
    stopContextMenu: true,
    controlsAboveOverlay: true
});

var right_canvas = new fabric.Canvas('right-canvas', {
    fireRightClick: true,
    stopContextMenu: true,
    controlsAboveOverlay: true
});

var canvas_view_type = $('.canvas_view_input[name="canvas_view_type"]:checked').attr('view_type');
var canvas = front_canvas;
// if(canvas_view_type == 'back'){
//     canvas = back_canvas;
// }else if(canvas_view_type == 'right'){
//     canvas = right_canvas;
// }else if(canvas_view_type == 'left'){
//     canvas = left_canvas;
// }else{
//     canvas = front_canvas;
// }

// Change canvas type like :- [front, back, right, left]
function changeCanvasType(type) {
    console.log("canvas type => ", type);
    var variant_val = $('.prd_color_box input[name="product_color"]:checked').attr('data-variant-name');
    var selected_variant_img = $('.product_variant[data-variant="'+variant_val+'"][data-style="'+type+'"]').attr('data-src');
    $('#customiserImage').attr('src', selected_variant_img);
    $('.custom_canvas').css('display','none');
    if(type == 'back'){
        $('#backCanvasWrap').css('display','block');
        canvas = back_canvas;
        fireEvents();
        // canvas.deactivateAllWithDispatch();
        // canvas.calcOffset();
    }else if(type == 'right'){
        $('#rightCanvasWrap').css('display','block');
        canvas = right_canvas;
        fireEvents();
        // canvas.deactivateAllWithDispatch();
        // canvas.calcOffset();
    }else if(type =='left'){
        $('#leftCanvasWrap').css('display','block');
        canvas = left_canvas;
        fireEvents();
        // canvas.deactivateAllWithDispatch();
        // canvas.calcOffset();
    }else{
        $('#frontCanvasWrap').css('display','block');
        canvas = front_canvas;
        fireEvents();
        // canvas.deactivateAllWithDispatch();
        // canvas.calcOffset();
    }
}


//Disable context menu
fabric.util.addListener(document.getElementsByClassName('upper-canvas')[0], 'contextmenu', function(e) {
    e.preventDefault();
});

// delete object code START
var resizeIcon = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJfMDAtYm91bmRpbmctc2NhbGUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDM5IDM5IiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBmaWxsPSIjMDM5Q0I1IiBkPSJNMjUuNiAxOS43djMuOEwxNS41IDEzLjRoMy43di0zaC04Ljh2OC44aDN2LTMuN2wxMC4xIDEwLjFoLTMuOHYzaDguOXYtOC45eiI+PC9wYXRoPjwvc3ZnPg==';

var img = document.createElement('img');
img.src = resizeIcon;

 // Initialise delete icon for text
// fabric.Textbox.prototype.controls.deleteControl = new fabric.Control({
//     x: -0.5,
//     y: -0.5,
//     offsetY: -16,
//     offsetX: -16,
//     cursorStyle: 'pointer',
//     mouseUpHandler: deleteObject,
//     render: renderIcon,
//     cornerSize: 24,
//     position: { x: -0.5, y: -0.5 }, // position the delete icon outside the canvas
//   renderOnAddition: true
// });

 // Initialise delete icon for image
// fabric.Image.prototype.controls.deleteControl = new fabric.Control({
//     x: -0.5,
//     y: -0.5,
//     offsetY: -16,
//     offsetX: -16,
//     cursorStyle: 'pointer',
//     mouseUpHandler: deleteObject,
//     render: renderIcon,
//     cornerSize: 24,
//     position: { x: -0.5, y: -0.5 }, // position the delete icon outside the canvas
//     renderOnAddition: true
// });

// Change bottom right scalling option 
// var scalingIcon = '';
// var scalingIconImg = document.createElement('img');
// scalingIconImg.src = scalingIcon;

fabric.Object.prototype.controls.br = new fabric.Control({
  x: 0.5,
  y: 0.5,
  cursorStyle: 'nw-resize',
  actionHandler: fabric.controlsUtils.scalingEqually,
  actionName: 'resize',
  render: renderIcon,
  cornerSize: 20,
  renderOnAddRemove: true
});

// rect.addControl('br');

// Render the control outside the canvas region
canvas.renderOnAddRemove = true;
// canvas.addControl(rect.controls.br);


// objectControls.mr = new fabric.Control({
//   x: 0.5,
//   y: 0,
//   cursorStyleHandler: scaleSkewStyleHandler,
//   actionHandler: scalingXOrSkewingY,
//   getActionName: scaleOrSkewActionName,
// });



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

// function for text resize when object width is greater than canvas
function fitToObject(event) {
   var obj = event;

    var font_size = obj.fontSize;
    var text_val = obj.text;
    var font_family = obj.fontFamily;
    var tempData = $.measureText(text_val, {fontFamily:font_family, fontSize:font_size});
    console.log(tempData)
    if(tempData.width > canvas.width){
        console.log("condition 1")
        var text_width = tempData.width;
        while (text_width > canvas.width) {
            console.log('text width : ', text_width , " | canvas width : ", canvas.width, " | font size : ", font_size);
          font_size = font_size-1;
          var tempData = $.measureText(text_val, {fontFamily: font_family, fontSize:font_size});
          text_width = tempData.width;
        }
    }
    obj.set({
        text: text_val,
        width: tempData.width,
        height: tempData.height,
        fontSize: font_size
    });
    $('#textFontSize').val(font_size);
}

// function for object can not go outside of canvas mark
function setObjectInside(e) {
    var obj = e;
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

}

// function for custom action(resize and delete) icon position
function actionIconPosition(obj){
    var icon_width = 20;
    
        var obj_width = obj.width;
        var obj_height = obj.height;
        if(obj.type == "art" || obj.type == 'image'){
            obj_width = (obj.width * obj.scaleX);
            obj_height = (obj.height * obj.scaleY);
        }

        // for delete icon position
        var del_icon_pos = obj.aCoords.tl;
        var check_width = obj_width+del_icon_pos.x;
        var check_height = obj_height+del_icon_pos.y;
        var del_top_pos = del_icon_pos.y-icon_width;
        var del_left_pos = del_icon_pos.x-icon_width;

        // for resize icon position
        var resize_icon_pos = obj.aCoords.br;
        var res_top_pos = resize_icon_pos.y;
        var res_left_pos = resize_icon_pos.x;
       
        if(del_icon_pos.y <= 0){
            del_top_pos = -icon_width; // we have assign icon width above
            res_top_pos = obj_height;
        }
        if(del_icon_pos.x <= 0){
            del_left_pos = -icon_width; // don't touch this icon width with minus
            res_left_pos = obj_width
        }
        if(check_width > obj.canvas.width){
            del_left_pos = obj.canvas.width - obj_width;
            del_left_pos = del_left_pos-icon_width;
            res_left_pos = obj.canvas.width;
        }
        if(check_height > obj.canvas.height){
            del_top_pos = obj.canvas.height - obj_height;
            del_top_pos = del_top_pos-icon_width
            res_top_pos = obj.canvas.height;
        }
        
        $('.delete_icon_wrap').css({"top":del_top_pos, "left":del_left_pos});
        $('.scale_icon_wrap').css({"top":res_top_pos, "left":res_left_pos});
}

function reSizeObject(){
    console.log("It worked!");
    resize();
}


//function fireevent start
function fireEvents(){

canvas.clipTo = function(ctx) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.closePath();
  ctx.restore();
};
canvas.renderAllBoundaries = true;

// This function will work when click on canvas 
canvas.on('mouse:down', function(options) {
    var obj_target = options.target
    
  // checking when you click on canvas then object was selected on not.
  if(obj_target) {
    actionIconPosition(obj_target);
    if (obj_target.type == 'text') {
        console.log('Text object was clicked! ', obj_target);
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

    if (obj_target.type == 'art') {
        console.log('Art object was clicked! ', obj_target);
        console.log(" Width => ", obj_target.scaleToWidth);
        console.log(" height => ", obj_target.scaleToHeight);
        // editTextFunction(options.target);
        $('.ct_content_tab').removeClass("active_tab");
        $('.settings_title_wrapper>ul>li').removeClass("active");
        $('li.art_tab').addClass("active");
        $('#artSettings').addClass("active_tab");

        $('#addArtTab').css("display","none");
        $('#editArtTab').css("display","block");
    }else{
        $('#editArtTab').css("display","none");
        $('#addArtTab').css("display","block");
    }

    if(obj_target.type == 'image') {
        console.log('Image object was clicked! ', obj_target);
        console.log(" Width => ", obj_target.scaleToWidth);
        console.log(" height => ", obj_target.scaleToHeight);
        // editTextFunction(options.target);
        $('.ct_content_tab').removeClass("active_tab");
        $('.settings_title_wrapper>ul>li').removeClass("active");
        $('li.upload_tab').addClass("active");
        $('#uploadSettings').addClass("active_tab");

        $('#addUploadTab').css("display","none");
        $('#editUploadTab').css("display","block");
    }else{
        $('#editUploadTab').css("display","none");
        $('#addUploadTab').css("display","block");
    }

    
  }else{
    $('#editTextTab').css("display","none");
    $('#editArtTab').css("display","none");
    $('#editUploadTab').css("display","none");
    $('.ct_content_tab').removeClass("active_tab");
    $('.settings_title_wrapper>ul>li').removeClass("active");

    $('#defaultSettings').addClass("active_tab");
  }

  //  Show context menu when click on right button of mouse
  if(options.e.button === 2) {
        var top_pos = options.e.layerY + 10;
        var left_pos = options.e.layerX + 10;
        $('.context_menu_wrap').css({"display":"block", "top": top_pos, "left": left_pos});
    }else{
        $('.context_menu_wrap').css("display","none");
    }
});


canvas.on('object:moving', function(e) {
    var obj = e.target;

    if(obj.height > obj.canvas.height || obj.width > obj.canvas.width){
        return;
    }else{
        actionIconPosition(obj);
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

    console.log("scaling");
    // setObjectInside(e.target);
    // fitToObject(e.target);
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
        actionIconPosition(obj);
    }
});


canvas.on('object:modified', function(event) {

    actionIconPosition(event.target)
    console.log("modified");
    if (event.target.type == 'text') {
       var newfontsize = (event.target.fontSize * event.target.scaleX);

       var tempData = $.measureText(event.target.text, {fontFamily: event.target.fontFamily, fontSize:newfontsize});

       console.log('text width : ', tempData.width , " | canvas width : ", canvas.width, " | font size : ", newfontsize);

       event.target.set({
            fontSize: parseInt(newfontsize, 10),
            scaleX: 1,
            scaleY:1,
            width: tempData.width,
            height: tempData.height
        })
        
        $('#textFontSize').val(parseInt(newfontsize, 10));
       // fitToObject(event.target)
    }
    if (event.target.type == 'art' || event.target.type == 'image') {
        var newWidth = (event.target.width * event.target.scaleX);
        var newHeight = (event.target.height * event.target.scaleY);
        console.log("Image width :", newWidth , " | height : ", newHeight);
        event.target.set({
            // width: newWidth,
            // height: newHeight,
            // scaleX:1,
            // scaleY:1,
            scaleToWidth:newWidth,
            scaleToHeight:newHeight
        })
    }
  });

} // fireEvents fucntion end

fireEvents();

// truncate fucntion for font text
const truncateString = (string = '', maxLength = 50) => 
  string.length > maxLength 
    ? `${string.substring(0, maxLength)}…`
    : string




$("#textContent").keypress(function(e) {
    if(e.which == 13) {
        // alert('You pressed enter!');
        $("#addTextContent").trigger("click");
    }
});
$("#addTextContent").click(function(){
    console.log("test");
    var text_val = $("#textContent").val().trim();
    text_val = text_val.replace(/\s+/g, " ");;
    console.log("value is => ", text_val);
    if(text_val != ""){
        var font_size = 26;
        var tempData = $.measureText(text_val, {fontFamily:"Arial", fontSize:font_size});
        console.log(tempData)
        if(tempData.width > canvas.width-5){
            console.log("condition 1")
            var text_width = tempData.width;
            while (text_width > canvas.width-5) {
                console.log('text width : ', text_width , " | canvas width : ", canvas.width, " | font size : ", font_size);
              font_size = font_size-1;
              var tempData = $.measureText(text_val, {fontFamily: "Arial", fontSize:font_size});
              text_width = tempData.width;
            }
        }
        $('#textFontSize').val(font_size);
    	var textBox = new fabric.Textbox(text_val,{
    	    fontSize: font_size,
    	    fontFamily: 'Arial',
    	    textAlign: 'center', 
    	    fontWeight:'normal', 
    	    width: tempData.width, // for 20 characters
            editable: false,
            lockUniScaling: true,
            fixedWidth:200,
            type: 'text'
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
            mtr: false
        });

	    canvas.add(textBox);
        canvas.setActiveObject(textBox);
	    canvas.renderAll();
	    $("#textContent").val("");
        $('#addTextTab').css("display","none");
        $('#editTextContent').val(text_val);
        $('#editTextTab').css("display","block");
        var font_text = truncateString(text_val, 10);
        $('ul#allFonts>li>span.active_text').text(font_text);
	}
})


$("#editTextContent").keyup(function(){
    var text_val = $(this).val().trim();
    text_val = text_val.replace(/\s+/g, " ");
    console.log("value is => ", text_val);

    var selectedObject = canvas.getActiveObject();      

    if(text_val == ''){
        var text_static_val = 'No Text';
            var noTextData = $.measureText(text_static_val, {fontFamily: selectedObject.fontFamily, fontSize:selectedObject.fontSize});
            console.log('text width : ', noTextData.width , " | canvas width : ", canvas.width, " | font size : ", selectedObject.fontSize);
            selectedObject.set({
                text: text_static_val,
                width: noTextData.width,
                height: noTextData.height,
                fontSize: selectedObject.fontSize
            });
    }else{
        var tempData = $.measureText(text_val, {fontFamily: selectedObject.fontFamily, fontSize:selectedObject.fontSize});

        // selectedObject.set('text', text_val);  
        var font_size = selectedObject.fontSize;
        console.log('text width : ', tempData.width , " | canvas width : ", canvas.width, " | font size : ", font_size);

        if(tempData.width > canvas.width){
            console.log("condition 1")
            var text_width = tempData.width;
            while (text_width > canvas.width) {
                
              font_size = font_size-1;
              var tempData = $.measureText(text_val, {fontFamily: selectedObject.fontFamily, fontSize:font_size});
              text_width = tempData.width;
            }
        }else{
            console.log("condition 2")
        }

        selectedObject.set({
            text: text_val,
            width: tempData.width,
            height: tempData.height,
            fontSize: font_size
        }); 
        $('#textFontSize').val(font_size);
    }     
    setObjectInside(selectedObject);
    canvas.renderAll(); 
    var font_text = truncateString(text_val, 10);
    $('ul#allFonts>li>span.active_text').text(font_text);
})

// text font family js
function changeTextFont(font){
    var selectedObject = canvas.getActiveObject();
    selectedObject.set('fontFamily', font);
    $('.selected_font_name').text(font);
    fitToObject(selectedObject);
    setObjectInside(selectedObject);
    canvas.renderAll(); 
    
}
function changeTextEffect(effect){
    alert(effect)
}
// text color js
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
    var selectedObject = canvas.getActiveObject();
    // selectedObject.set('angle', parseFloat(val));
    selectedObject.rotate(parseFloat(val));
    fitToObject(selectedObject);
    setObjectInside(selectedObject);
    canvas.renderAll();
}
function changeInputValue(val){
    document.getElementById("rotatTextNumber").value = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
    // showValue1(val);
    var selectedObject = canvas.getActiveObject();
    // selectedObject.set('angle', parseFloat(val));
    selectedObject.rotate(parseFloat(val));
    fitToObject(selectedObject);
    setObjectInside(selectedObject);
    canvas.renderAll();
}

// text outline js
function changeTxtOutlineColor(color, name){
    var thickness_val =  $('#textOutlineThickness').val();
    var selectedObject = canvas.getActiveObject();
    selectedObject.set({'stroke': color, 'strokeWidth': thickness_val, 'paintFirst': "stroke"});
    $('.selected_outline_name').text(name);
    canvas.renderAll(); 
}
function changeTextOutlineThick(){
    var selected_color = $(".color_box>input[name='text_outline_input']:checked").attr('data-color-code');
    var selected_name = $(".color_box>input[name='text_outline_input']:checked").attr('data-color-name');
    changeTxtOutlineColor(selected_color, selected_name);
}
function removeTxtOutline(){
    var selectedObject = canvas.getActiveObject();
    selectedObject.set({'stroke': "transparent", 'strokeWidth': 0, 'paintFirst': "none"});
    $('.selected_outline_name').text("none");
    canvas.renderAll(); 
    $('#textOutlineThickness').val(2);
    $(".color_box>input[name='text_outline_input'][data-color-name='none']").prop("checked", true);
    $('.text_outline_wrapper').css("display","none");
}
// end text outline js

// text font size js
function changeTxtFontSize(value){
    var selectedObject = canvas.getActiveObject();
    // var newData = $.measureText(selectedObject.text, {fontFamily: selectedObject.fontFamily, fontSize:Number(value)});
    // console.log("MY DATA START--------");
    // console.log(selectedObject.text)
    // console.log(selectedObject.fontFamily)
    // console.log(value)
    // console.log(newData)
    // console.log("MY DATA END--------");
    // return true;
    if(value < 10){
        $('#textFontSize').val(10);
        selectedObject.set('fontSize', 10);
    }else{
        // selectedObject.set('fontSize', value);
        var font_size = Number(value);
        console.log("active text => ", selectedObject.text, " | font family => ", selectedObject.fontFamily ," | text size val => ", value);
        var newData = $.measureText(selectedObject.text, {fontFamily: selectedObject.fontFamily, fontSize:font_size});

 
        console.log('text width : ', newData.width , " | canvas width : ", canvas.width," | font size : ", font_size);

        if(newData.width > canvas.width){
            console.log("condition 1");
            var text_width = newData.width;
            while (text_width > canvas.width) {
              font_size = font_size-1;
              var newData = $.measureText(selectedObject.text, {fontFamily: selectedObject.fontFamily, fontSize:font_size});
              text_width = newData.width;
            }
        }else{
            console.log("condition 2")
        }

        selectedObject.set({
            width: newData.width,
            height: newData.height,
            fontSize: font_size,
        }); 
        $('#textFontSize').val(font_size);
    }
    setObjectInside(selectedObject);
    canvas.renderAll();
}

// text horizontal center
function centerTextObject(){
    var selectedObject = canvas.getActiveObject();
    // selectedObject.centerV();
    selectedObject.centerH();
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
            left: clonedObj.left + 15,
            top: clonedObj.top + 15,
            evented: true,
            editable: false,
            lockUniScaling: true,
            fixedWidth:200
        });
        clonedObj.setControlsVisibility({
            tl: false,
            bl: false,
            tr: false,
            br: true,
            ml: false,
            mb: false,
            mr: false,
            mt: false,
            mtr: false
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
        img.scaleToHeight(80);
        img.scaleToWidth(80); 
        img.set({
            "type":'art',
            left:0,
            top:0
        })
        // canvas.centerObject(img);
        img.setControlsVisibility({
            tl: false,
            bl: false,
            tr: false,
            br: true,
            ml: false,
            mb: false,
            mr: false,
            mt: false,
            mtr: false
        });
        canvas.add(img);

        console.log(" before : width => ", img.width ," | height => ", img.height );
        var newWidth = (img.width * img.scaleX);
        var newHeight = (img.height * img.scaleY);
        img.set({
            // width: newWidth,
            // height: newHeight,
            // scaleX:1,
            // scaleY:1,
            scaleToWidth:newWidth,
            scaleToHeight:newHeight
        });
        console.log("After Image width :", newWidth , " | height : ", newHeight);
        canvas.setActiveObject(img);
        canvas.renderAll();
    });
}

function addArtDesign(path) {
   updateTshirtImage(path);
   $('#addArtTab').css("display","none");
   $('#editArtTab').css("display","block");
}

// Art center js
function centerArtObject(){
    var selectedObject = canvas.getActiveObject();
    // canvas.centerObject(selectedObject);
    selectedObject.centerH();
    canvas.renderAll();
}
// Art flip x js
function flipXArt(){
    var selectedObject = canvas.getActiveObject();
    console.log("Flip Horizontal");
    selectedObject.toggle('flipX')
    // selectedObject.set('flipX', true);
    selectedObject.setCoords();
    canvas.renderAll();
    // selectedObject.set('flipX', false);
    // canvas.renderAll();
}
// Art flip y js
function flipYArt(){
    var selectedObject = canvas.getActiveObject();
    console.log("Flip Verticle");
    // selectedObject.set('flipY', true);
    selectedObject.toggle('flipY')
    selectedObject.setCoords();
    // selectedObject.set('flipY', false);
    canvas.renderAll();
}


// Art Rotation js
function changeArtRangeValue(val){
    document.getElementById("rotatArtRangeSlide").value = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
    // showValue1(val);
    var selectedObject = canvas.getActiveObject();
    // selectedObject.set('angle', parseInt(val));
    selectedObject.rotate(parseFloat(val));
    // fitToObject(selectedObject);
    setObjectInside(selectedObject);
    canvas.renderAll();
}
function changeArtInputValue(val){
    document.getElementById("rotatArtNumber").value = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
    // showValue1(val);
    var selectedObject = canvas.getActiveObject();
    // selectedObject.set('angle', parseInt(val));
    selectedObject.rotate(parseFloat(val));
    // fitToObject(selectedObject);
    setObjectInside(selectedObject);
    canvas.renderAll();
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
document.getElementById('uploadFile').addEventListener("change", function(e){
    var reader = new FileReader();
    
    reader.onload = function (event){
        console.log("first");
        var imgObj = new Image();
        imgObj.src = event.target.result;

        // When the picture loads, create the image in Fabric.js
        imgObj.onload = function () {
            var img = new fabric.Image(imgObj);

            img.scaleToHeight(80);
            img.scaleToWidth(80); 
            img.set({
                "type":'image',
                left:0,
                top:0,
                width:80,
                height:80
            })
            // canvas.centerObject(img);
            img.setControlsVisibility({
                tl: false,
                bl: false,
                tr: false,
                br: true,
                ml: false,
                mb: false,
                mr: false,
                mt: false,
                mtr: false
            });
            // canvas.centerObject(img);
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();

            $('#addUploadTab').css("display","none");
            $('#editUploadTab').css("display","block");
        };
    };

    // If the user selected a picture, load it
    if(e.target.files[0]){
        var file = e.target.files[0]
        if(file.type == "application/pdf"){
            console.log("last | file type => ", file.type);
        }else{
            reader.readAsDataURL(e.target.files[0]);
        }        
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

