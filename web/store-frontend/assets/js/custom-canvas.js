var front_canvas = new fabric.Canvas('front-canvas', {
    fireRightClick: true,
    stopContextMenu: true,
    controlsAboveOverlay: true,
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


var minX, minY, maxX, maxY, CANVAS_WIDTH, CANVAS_HEIGHT;
var canvas_padding = 80; // canvas padding like 50 = 25 for left + 25 for right(25 for each side)
// Define the background rectangle dimensions
    // front canvas width height
    var frontbgWidth = front_canvas.width - canvas_padding;
    var frontbgHeight = front_canvas.height - canvas_padding;

    // back canvas width height
    var backbgWidth = back_canvas.width - canvas_padding;
    var backbgHeight = back_canvas.height - canvas_padding;

    // sleeve left canvas width height
    var leftSlvbgWidth = left_canvas.width - canvas_padding;
    var leftSlvbgHeight = left_canvas.height - canvas_padding;

    // sleeve right canvas width height
    var rightSlvbgWidth = right_canvas.width - canvas_padding;
    var rightSlvbgHeight = right_canvas.height - canvas_padding;

    var bgLeft = canvas_padding / 2;
    var bgTop = canvas_padding / 2;

// Create the background rectangle

    var frontbgRect = new fabric.Rect({
        left: bgLeft,
        top: bgTop,
        width: frontbgWidth,
        height: frontbgHeight,
        fill: 'transparent',
        stroke: '#cacaca',
        strokeWidth: 1
    });

    var backbgRect = new fabric.Rect({
        left: bgLeft,
        top: bgTop,
        width: backbgWidth,
        height: backbgHeight,
        fill: 'transparent',
        stroke: '#cacaca',
        strokeWidth: 1
    });

    var leftbgRect = new fabric.Rect({
        left: bgLeft,
        top: bgTop,
        width: leftSlvbgWidth,
        height: leftSlvbgHeight,
        fill: 'transparent',
        stroke: '#cacaca',
        strokeWidth: 1
    });

    var rightbgRect = new fabric.Rect({
        left: bgLeft,
        top: bgTop,
        width: rightSlvbgWidth,
        height: rightSlvbgHeight,
        fill: 'transparent',
        stroke: '#cacaca',
        strokeWidth: 1
    });
    
// Add the background rectangle to the canvas
    front_canvas.setBackgroundImage(frontbgRect);
    back_canvas.setBackgroundImage(backbgRect);
    left_canvas.setBackgroundImage(leftbgRect);
    right_canvas.setBackgroundImage(rightbgRect);

    front_canvas.renderAll();
    back_canvas.renderAll();
    left_canvas.renderAll();
    right_canvas.renderAll();

minX = frontbgRect.left;
maxX = frontbgRect.left+frontbgRect.width;
minY = frontbgRect.top;
maxY = frontbgRect.top+frontbgRect.height;
CANVAS_WIDTH = maxX;
CANVAS_HEIGHT = maxY;


// Change canvas type like :- [front, back, right, left]
function changeCanvasType(type) {
    console.log("canvas type => ", type);
    var variant_val = $('.prd_color_box input[name="product_color"]:checked').attr('data-variant-name');
    var selected_variant_img = $('.product_variant[data-variant="'+variant_val+'"][data-style="'+type+'"]').attr('data-src');
    $('#customiserImage').attr('src', selected_variant_img);
    $('.custom_canvas').css('display','none');
    if(type == 'back'){
        $('#backCanvasWrap').css('display','block');
        minX = backbgRect.left;
        maxX = backbgRect.left+backbgRect.width;
        minY = backbgRect.top;
        maxY = backbgRect.top+backbgRect.height;
        CANVAS_WIDTH = maxX;
        CANVAS_HEIGHT = maxY;
        canvas = back_canvas;
        fireEvents();
        // canvas.calcOffset();
    }else if(type == 'right'){
        $('#rightCanvasWrap').css('display','block');
        minX = rightbgRect.left;
        maxX = rightbgRect.left+rightbgRect.width;
        minY = rightbgRect.top;
        maxY = rightbgRect.top+rightbgRect.height;
        CANVAS_WIDTH = maxX;
        CANVAS_HEIGHT = maxY;
        canvas = right_canvas;
        fireEvents();
    }else if(type =='left'){
        $('#leftCanvasWrap').css('display','block');
        minX = leftbgRect.left;
        maxX = leftbgRect.left+leftbgRect.width;
        minY = leftbgRect.top;
        maxY = leftbgRect.top+leftbgRect.height;
        CANVAS_WIDTH = maxX;
        CANVAS_HEIGHT = maxY;
        canvas = left_canvas;
        fireEvents();
    }else{
        $('#frontCanvasWrap').css('display','block');
        minX = frontbgRect.left;
        maxX = frontbgRect.left+frontbgRect.width;
        minY = frontbgRect.top;
        maxY = frontbgRect.top+frontbgRect.height;
        CANVAS_WIDTH = maxX;
        CANVAS_HEIGHT = maxY;
        canvas = front_canvas;
        fireEvents();
    }
}
 
//Disable context menu
fabric.util.addListener(document.getElementsByClassName('upper-canvas')[0], 'contextmenu', function(e) {
    e.preventDefault();
});

// delete object code START
var deleteIcon = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjAiIHk9IjAiIHZpZXdCb3g9IjAgMCAxNyAxNyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGNpcmNsZSBmaWxsPSIjRkZGIiBjeD0iOC41IiBjeT0iOC41IiByPSI4LjUiPjwvY2lyY2xlPjxnIGZpbGw9IiNlZTM1MjQiPjxwYXRoIGQ9Im0xMS4xMyA0Ljk3LTYuMTYgNi4xNmMtLjI1LjI1LS4yNS42NSAwIC45cy42NS4yNS45IDBsNi4xNi02LjE2Yy4yNS0uMjUuMjUtLjY1IDAtLjlhLjYzNC42MzQgMCAwIDAtLjkgMCI+PC9wYXRoPjxwYXRoIGQ9Ik0xMi4wMyAxMS4xNCA1Ljg2IDQuOTdhLjYzNC42MzQgMCAwIDAtLjkgMGMtLjI1LjI1LS4yNS42NSAwIC45bDYuMTYgNi4xNmMuMjUuMjUuNjUuMjUuOSAwIC4yNi0uMjQuMjYtLjY1LjAxLS44OSI+PC9wYXRoPjwvZz48L3N2Zz4=';

var deleteImg = document.createElement('img');
deleteImg.src = deleteIcon;

 // Initialise delete icon for text
fabric.Textbox.prototype.controls.deleteControl = new fabric.Control({
    x: -0.5,
    y: -0.5,
    offsetY: -10,
    offsetX: -10,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderIcon(deleteImg),
    cornerSize: 20,
    position: { x: -0.5, y: -0.5 }, // position the delete icon outside the canvas
  renderOnAddition: true
});

 // Initialise delete icon for image
fabric.Image.prototype.controls.deleteControl = new fabric.Control({
    x: -0.5,
    y: -0.5,
    offsetY: -10,
    offsetX: -10,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderIcon(deleteImg),
    cornerSize: 20,
    position: { x: -0.5, y: -0.5 }, // position the delete icon outside the canvas
    renderOnAddition: true
});
 
// Change bottom right scalling (resize) option icon
var resizeIcon = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJfMDAtYm91bmRpbmctc2NhbGUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDM5IDM5IiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBmaWxsPSIjMDM5Q0I1IiBkPSJNMjUuNiAxOS43djMuOEwxNS41IDEzLjRoMy43di0zaC04Ljh2OC44aDN2LTMuN2wxMC4xIDEwLjFoLTMuOHYzaDguOXYtOC45eiI+PC9wYXRoPjwvc3ZnPg==';

var resizeImg = document.createElement('img');
resizeImg.src = resizeIcon;


 // Initialise resize icon for object
fabric.Object.prototype.controls.br = new fabric.Control({
  x: 0.5,
  y: 0.5,
  offsetY: 10,
  offsetX: 10,
  cursorStyle: 'nw-resize',
  actionHandler: fabric.controlsUtils.scalingEqually,
  actionName: 'resize',
  render: renderIcon(resizeImg),
  cornerSize: 20,
  renderOnAddRemove: true
});

 // Initialise resize icon for text
fabric.Textbox.prototype.controls.br = new fabric.Control({
  x: 0.5,
  y: 0.5,
  offsetY: 10,
  offsetX: 10,
  cursorStyle: 'nw-resize',
  actionHandler: fabric.controlsUtils.scalingEqually,
  actionName: 'resizing',
  render: renderIcon(resizeImg),
  cornerSize: 20,
  renderOnAddRemove: true
});


function deleteObject(eventData, transform){
  var target = transform.target;
  var canvas = target.canvas;
  canvas.remove(target);
  canvas.requestRenderAll();
  $('.top_layer').css("display","block");
  $('.child_layer').css("display","none");
}

function renderIcon(icon) {
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
      var size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(icon, -size/2, -size/2, size, size);
      ctx.restore();
    }
  }

// delete object code END

// function for text resize when object width is greater than canvas
function fitToObject(event) {
    console.log("Call fit to object function")
   var obj = event;

   if if(obj.type == 'text' && obj.text_effect == 'curve'){

   }else if(obj.type == 'text'){
        var canvas_space_width = 5;
        if(parseInt(obj.outline_width) > 5 && obj.outline_color_name !== "none"){
            canvas_space_width = 15;
        }else if(parseInt(obj.outline_width) > 1 && obj.outline_color_name !== "none"){
            canvas_space_width = 10;
        }else{
            canvas_space_width = 0;
        }
        console.log("canvas space => ", canvas_space_width);
        console.log("canvas => scale to width : ",  obj.scaleToWidth , " | width " , (CANVAS_WIDTH-minX) , " | height : ", obj.scaleToHeight, " | ", parseInt(obj.scaleToWidth) > parseInt(CANVAS_WIDTH-minX) )
        if(parseInt(obj.scaleToWidth) > parseInt(CANVAS_WIDTH-minX)){
            var font_size = obj.text_font_size;
            var text_val = obj.text;
            var font_family = obj.text_font_family;
            var tempData = $.measureText(text_val, {fontFamily:font_family, fontSize:parseFloat(font_size)});
            console.log("canvas => temp to width : ",  tempData.width , " | width " , parseInt(CANVAS_WIDTH-minX-canvas_space_width), " | font_size ", font_size );
            if(tempData.width > parseInt(CANVAS_WIDTH-minX-canvas_space_width)){
                    var text_width = tempData.width;
                    while (text_width > (CANVAS_WIDTH-minX-canvas_space_width)){
                        console.log('text width : ', text_width , " | canvas width : ", (CANVAS_WIDTH-minX-canvas_space_width), " | font size : ", font_size);
                        font_size = font_size-0.1;
                        var updateData = $.measureText(text_val, {fontFamily: font_family, fontSize:font_size});
                        text_width = updateData.width;
                    }
            }

            $.ajax({
              url: "http://customizer.sketchthemes.com:8080/textGenerate.php?text="+text_val+"&effect="+obj.text_effect+"&font_color="+obj.text_color.replace("#","")+"&font_size="+font_size+"&fontName="+obj.text_font_family+"&outline_color="+obj.outline_color.replace("#","")+"&outline_width="+obj.outline_width,
              xhrFields: {
                responseType: 'blob'
              },
              beforeSend: function() {
                $('.customiseLoader').css("display","flex");
              },
              success: function (img, status, xhr) {
                $('#textFontSize').val(parseFloat(font_size).toFixed(1));

                obj.set({
                    scaleToWidth:xhr.getResponseHeader('x-img-width'),
                    scaleToHeight:xhr.getResponseHeader('x-img-height'),
                    scaleX: 1,
                    scaleY:1,
                    "text_font_size": font_size,
                })
                obj.setSrc(URL.createObjectURL(img));                
                        
                setTimeout(function(){
                    setObjectInside(obj);
                    canvas.renderAll(); 
                    $('.customiseLoader').css("display","none");
                }, 200)
              },
              error: function (jqXhr, textStatus, errorMessage) {
                console.log("Error => ",errorMessage);
                $('.customiseLoader').css("display","none");
              }
            })    

        }else{
            setObjectInside(obj);
            canvas.renderAll(); 
            $('.customiseLoader').css("display","none"); 

        }
        
   }
   console.log("End fit to object Function!");

    // var font_size = obj.fontSize;
    // var text_val = obj.text;
    // var font_family = obj.fontFamily;
    // var tempData = $.measureText(text_val, {fontFamily:font_family, fontSize:font_size});
    // if(tempData.width > (CANVAS_WIDTH-minX)){
    //         var text_width = tempData.width;
    //         while (text_width > (CANVAS_WIDTH-minX)){
    //            console.log('text width : ', text_width , " | canvas width : ", CANVAS_WIDTH, " | font size : ", font_size);
    //         font_size = font_size-1;
    //         var updateData = $.measureText(text_val, {fontFamily: font_family, fontSize:font_size});
    //         text_width = updateData.width;
    //     }
    // }
    // if(obj.type == 'shape'){
    //     var new_height = tempData.height+obj.path.height;
    //     console.log("shape edit height => ", new_height);
    //     obj.set({
    //         text: text_val,
    //         width: tempData.width,
    //         fontSize: font_size
    //     });
    //     obj.set({height: new_height})
    // }else{
    //     obj.set({
    //         text: text_val,
    //         width: tempData.width,
    //         height: tempData.height,
    //         fontSize: font_size
    //     });
    // }
    // $('#textFontSize').val(font_size);
}

// function for object can not go outside of canvas mark
function setObjectInside(e) {
    var obj = e;
    if(obj.height > CANVAS_HEIGHT || obj.width > CANVAS_WIDTH){
        return;
    }       
    
    obj.setCoords(); 

    if(obj.getBoundingRect().top < minY || obj.getBoundingRect().left < minX){
        obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top+minY);
        obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left+minX);
        if(obj.top < minY){
            obj.top = minY;
        }
        if(obj.left < minX){
            obj.left = minX;
        }
    }

    if(obj.getBoundingRect().top+obj.getBoundingRect().height  > CANVAS_HEIGHT || obj.getBoundingRect().left+obj.getBoundingRect().width  > CANVAS_WIDTH){
        obj.top = Math.min(obj.top, CANVAS_HEIGHT-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, CANVAS_WIDTH-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
    }  

}

// calculate text font size when object scaling or modified
function calculateFontSize(text, width, height){
    let selectedObject = canvas.getActiveObject();
    let fontSize = selectedObject.text_font_size; // Starting font size
    let font_family = selectedObject.text_font_family;
    let lowest_font_size = 5;

    let tempData = $.measureText(text, {fontFamily:font_family, fontSize:fontSize});
    let tempWidthTolerance = 4;

    const content_canvas = document.createElement('canvas');
    const context = content_canvas.getContext('2d');
    
    // Set content_canvas dimensions to match text element
    content_canvas.width = width;
    content_canvas.height = height;
    console.log("=== check first ====");
    console.log(parseFloat(selectedObject.scaleToWidth) ," > ", parseFloat(width));
    console.log("=== check last ====");
    if(parseFloat(selectedObject.scaleToWidth) > parseFloat(width)){
        console.log("Decrease size");
        while (fontSize >= lowest_font_size) { // Add minimum font size condition
          // Set the font size and measure the text
          context.font = fontSize + 'px '+font_family;
          const textWidth = context.measureText(text).width;
          const textHeight = context.measureText(text).height;
          
          // Add a tolerance value to the text width calculation
          const widthWithTolerance = width;
          // If the text fits within the canvas, return the font size
          console.log("Condition | ", textWidth ," <= ", widthWithTolerance ," | ", fontSize , " <= ", height)
          if (textWidth <= widthWithTolerance || textHeight <= height) {
            return fontSize;
          }      
          // Decrease the font size by 1 and try again
          fontSize = fontSize-0.1;
          // fontSize--;
        }
    }else if(parseFloat(selectedObject.scaleToWidth) < parseFloat(width)){
        console.log("Increase size");
        while (fontSize >= lowest_font_size) { // Add minimum font size condition
          // Set the font size and measure the text
          context.font = fontSize + 'px '+font_family;
          const textWidth = context.measureText(text).width;
          const textHeight = context.measureText(text).height;
          
          // Add a tolerance value to the text width calculation
          const widthWithTolerance = width;
          // If the text fits within the canvas, return the font size
          console.log("Condition | ", textWidth ," <= ", widthWithTolerance ," | ", fontSize , " <= ", height)
          if (textWidth >= widthWithTolerance || textHeight >= height) {
            return fontSize;
          }      
          // Increase the font size by 1 and try again
          // fontSize++;
          fontSize = fontSize+0.1;
        }
    }else if(parseFloat(selectedObject.scaleToWidth) == parseFloat(width)){
        console.log("same size");
        return fontSize; // Return null if font size is too small
    }
    
    return lowest_font_size; // Return null if font size is too small
    
}



//function fire event start this function will call whenever we change canvas type(front, back)
function fireEvents(){

canvas.clipTo = function(ctx) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.beginPath();
  ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.closePath();
  ctx.restore();
};
canvas.renderAllBoundaries = true;

// ------------ Resize canvas function --------

// window.addEventListener('resize', resizeCanvas, false);
// function resizeCanvas() {
//     var imgWidth = $('#customiserImage').width();
//     var imgHeight = $('#customiserImage').height();
//     var canvasWidth = imgWidth*65/100 ;
//     var canvasHeight = imgHeight*70/100 ;

//     var bgWidth = canvasWidth-canvas_padding;
//     var bgHeight = canvasHeight-canvas_padding;

//     // let bgLeft = canvas_padding / 2;
//     // let bgTop = canvas_padding / 2;

//     minX = bgLeft;
//     maxX = bgLeft+bgWidth;
//     minY = bgTop;
//     maxY = bgTop+bgHeight;
//     CANVAS_WIDTH = maxX;
//     CANVAS_HEIGHT = maxY;

//     canvas.setHeight(canvasHeight);
//     canvas.setWidth(canvasWidth);
//     canvas.backgroundImage.set({
//         width:bgWidth,
//         height:bgHeight,
//         left:bgLeft,
//         top:bgTop
//     });
//     canvas.renderAll();
// }
// resizeCanvas();

// This function will work when click on canvas 
canvas.on('mouse:down', function(options) {
    var obj_target = options.target
    
  // checking when you click on canvas then object was selected on not.
  if(obj_target) {
    if (obj_target.type == 'text') {
        console.log('Text object was clicked! ', obj_target);
        // editTextFunction(options.target);
        $('.ct_content_tab').removeClass("active_tab");
        $('.settings_title_wrapper>ul>li').removeClass("active");
        $('li.text_tab').addClass("active");
        $('#textSettings').addClass("active_tab");

        $('#addTextTab').css("display","none");
        if(options.target.text == 'No Text'){
            $('#editTextContent').val('');
        }else{
            $('#editTextContent').val(options.target.text);
        }
        $('#editTextTab').css("display","block");
        $('.selected_font_name').text(options.target.fontFamily);

        // default settings value when added new text
        $('.selected_font_name').text(obj_target.text_font_family);
        $('.selected_color_name').text(obj_target.text_color_name);
        $('.selected_color>.color_box').css('background-color', obj_target.text_color);
        $('.selected_color>.color_name').text(obj_target.text_color_name);
        $(".color_box>input[name='text_color_input'][data-color-code='"+obj_target.text_color+"']").prop("checked",true);

        
        $('.txt_shape_container').removeClass('active_shape');
        $('.txt_shape_container.'+obj_target.text_effect+'_text').addClass('active_shape');
        if(obj_target.text_effect == 'normal'){
            $('.selected_shape_name').text('None');
        }else{
            $('.selected_shape_name').text(obj_target.text_effect);
        }

        $('.selected_outline_color>.color_box').css('background-color', obj_target.outline_color);
        $('.selected_outline_color>.color_name').text(obj_target.outline_color_name);
        $('.selected_outline_name').text(obj_target.outline_color_name);

        $('#rotatTextRangeSlide').val(obj_target.angle);
        $('#rotatTextNumber').val(obj_target.angle);

        $('#textFontSize').val(parseFloat(obj_target.text_font_size).toFixed(1));

        var font_text = truncateString(obj_target.text, 10);
        $('ul#allFonts>li>span.active_text').text(font_text);


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
  console.log(options)
  //  Show context menu when click on right button of mouse
  if(options.e.button === 2) {
        var top_pos = options.e.layerY + 10;
        var left_pos = options.e.layerX + 10;
        $('.context_menu_wrap').css({"display":"block", "top": top_pos, "left": left_pos});
    }else{
        $('.context_menu_wrap').css("display","none");
    }
});

// function work when object move
canvas.on('object:moving', function(e) {
    var obj = e.target;

    if(obj.height > CANVAS_HEIGHT || obj.width > CANVAS_WIDTH){
        return;
    }

    obj.setCoords();   
    if(obj.getBoundingRect().top < minY || obj.getBoundingRect().left < minX){
        obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top+minY);
        obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left+minX);
        if(obj.top < minY){
            obj.top = minY;
        }
        if(obj.left < minX){
            obj.left = minX;
        }
    }
    if(obj.getBoundingRect().top+obj.getBoundingRect().height  > CANVAS_HEIGHT || obj.getBoundingRect().left+obj.getBoundingRect().width  > CANVAS_WIDTH){
        obj.top = Math.min(obj.top, CANVAS_HEIGHT-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, CANVAS_WIDTH-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
    }

});

var left1 = minX;
var top1 = minY;
var scale1x = 0 ;    
var scale1y = 0 ;    
var width1 = 0 ;    
var height1 = 0 ;

// function work on object scaling
canvas.on('object:scaling', function (e){

    console.log("scaling => ", e.target.type);
    // setObjectInside(e.target);
    // fitToObject(e.target);
    var obj = e.target;

        obj.setCoords();
        var brNew = obj.getBoundingRect();

        if (((brNew.width+brNew.left)>=CANVAS_WIDTH) || ((brNew.height+brNew.top)>=CANVAS_HEIGHT) || ((brNew.left<minX) || (brNew.top<minY))) {
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


canvas.on('object:modified', function(event) {
    console.log("modified");
    if (event.target.type == 'text') {
        console.log(" data => ", event.target);
        var newWidth = (event.target.width * event.target.scaleX);
        var newHeight = (event.target.height * event.target.scaleY);
        let updateFontSize = calculateFontSize(event.target.text, newWidth, newHeight);
        console.log("New font size :", updateFontSize);
        if(parseFloat(event.target.scaleToWidth) !== parseFloat(newWidth)){
        $.ajax({
              url: "http://customizer.sketchthemes.com:8080/textGenerate.php?text="+event.target.text+"&effect="+event.target.text_effect+"&font_color="+event.target.text_color.replace("#","")+"&font_size="+updateFontSize+"&fontName="+event.target.text_font_family+"&outline_color="+event.target.outline_color.replace("#","")+"&outline_width="+event.target.outline_width,
              xhrFields: {
                responseType: 'blob'
              },
              beforeSend: function() {
                $('.customiseLoader').css("display","flex");
              },
              success: function (img, status, xhr) {
                console.log("XHR header response Width=> ", xhr.getResponseHeader('x-img-width'));
                console.log("XHR header response => Height", xhr.getResponseHeader('x-img-height'));
                $('#textFontSize').val(parseFloat(updateFontSize).toFixed(1));
                event.target.set({
                    scaleToWidth:xhr.getResponseHeader('x-img-width'),
                    scaleToHeight:xhr.getResponseHeader('x-img-height'),
                    scaleX: 1,
                    scaleY:1,
                    "text_font_size": updateFontSize
                })
                event.target.setSrc(URL.createObjectURL(img));
                        
                setTimeout(function(){
                    fitToObject(event.target)
                    // setObjectInside(event.target);
                    // canvas.renderAll(); 
                    // $('.customiseLoader').css("display","none");
                }, 200)
              },
              error: function (jqXhr, textStatus, errorMessage) {
                console.log("Error => ",errorMessage);
                $('.customiseLoader').css("display","none");
              }
            }) 
         }
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

// truncate fucntion for font family section text
const truncateString = (string = '', maxLength = 50) => 
  string.length > maxLength 
    ? `${string.substring(0, maxLength)}…`
    : string


// call add text button when hit enter button
$("#textContent").keypress(function(e) {
    if(e.which == 13){
        // alert('You pressed enter!');
        $("#addTextContent").trigger("click");
    }
});
// add text function
$("#addTextContent").click(function(){
    
    var text_val = $("#textContent").val().trim();
    text_val = text_val.replace(/\s+/g, " ");;
    if(text_val != ""){
        var font_size = 30;
        var tempData = $.measureText(text_val, {fontFamily:"Arial", fontSize:font_size});
        var textWidth = tempData.width;
        var textHeight = tempData.height;

        console.log(tempData)
        if(tempData.width > (CANVAS_WIDTH-minX-5)){
            console.log("condition 1")
            var text_width = tempData.width;
            var text_height = tempData.height;
            while (text_width > (CANVAS_WIDTH-minX-5)) {
                console.log('text width : ', text_width , " | canvas width : ", (CANVAS_WIDTH-minX-5), " | font size : ", font_size);
              font_size = font_size-1;
              var updateData = $.measureText(text_val, {fontFamily: "Arial", fontSize:font_size});
              text_width = updateData.width;
              text_height = updateData.height;
            }
            textWidth = text_width;
            textHeight = text_height;
        }

        $.ajax({
          url: "http://customizer.sketchthemes.com:8080/textGenerate.php?text="+text_val+"&effect=normal&font_color=000000&font_size="+font_size+"&fontName=Arial&outline_color=00000000&outline_width=1",
          xhrFields: {
            responseType: 'blob'
          },
          beforeSend: function() {
            $('.customiseLoader').css("display","flex");
          },
          success: function (img, status, xhr) {
            $('#textFontSize').val(parseFloat(font_size).toFixed(1));
                fabric.Image.fromURL(window.URL.createObjectURL(img), function(img) {
                    img.set({
                        scaleToWidth:xhr.getResponseHeader('x-img-width'),
                        scaleToHeight:xhr.getResponseHeader('x-img-height'),
                        scaleX: 1,
                        scaleY:1,
                        "type":'text',
                        "text":text_val,
                        "text_effect":"normal",
                        "text_color": "#000000",
                        "text_color_name": "black",
                        "text_font_size": font_size,
                        "text_font_family": "Arial",
                        "outline_color": "#00000000",
                        "outline_color_name": "None",
                        "outline_width": "1",
                        left:minX,
                        top:minY,
                        lockScalingFlip: true
                    })
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
                    // add the image to the canvas
                    canvas.add(img);
                    var newWidth = (img.width * img.scaleX);
                    var newHeight = (img.height * img.scaleY);
                    img.set({
                        scaleToWidth:newWidth,
                        scaleToHeight:newHeight
                    });
                            
                    setTimeout(function(){
                        console.log("Active obejct omg => ", img);
                        setObjectInside(img);
                        canvas.setActiveObject(img);
                        canvas.renderAll(); 
                        $('.customiseLoader').css("display","none");
                    }, 200)
                });
              },
              error: function (jqXhr, textStatus, errorMessage) {
                console.log("Error => ",errorMessage);
                $('.customiseLoader').css("display","none");
              }

        }) 

        // default settings value when added new text
        $('.selected_font_name').text('Arial');
        $('.selected_color_name').text('Black');
        $('.selected_color>.color_box').css('background-color', '#000000');
        $('.selected_color>.color_name').text('Black');
        $(".color_box>input[name='text_color_input'][data-color-name='Black']").prop("checked",true);

        $('.txt_shape_container').removeClass('active_shape');
        $('.txt_shape_container.normal_text').addClass('active_shape');
        $('.selected_shape_name').text('None');

        $('.selected_outline_color>.color_box').css('background-color', '#00000000');
        $('.selected_outline_color>.color_name').text('None');
        $('.selected_outline_name').text('None');

        $('#rotatTextRangeSlide').val(0);
        $('#rotatTextNumber').val(0);

	    $("#textContent").val("");
        $('#addTextTab').css("display","none");
        $('#editTextContent').val(text_val);
        $('#editTextTab').css("display","block");
        var font_text = truncateString(text_val, 10);
        $('ul#allFonts>li>span.active_text').text(font_text);
	}

})


$("#editTextContent").change(function(){
    let text_val = $(this).val().trim();
    text_val = text_val.replace(/\s+/g, " ");
    console.log("value is => ", text_val);

    let selectedObject = canvas.getActiveObject(); 
    var canvas_space_width = 5;
    if(parseInt(selectedObject.outline_width) > 5 && selectedObject.outline_color_name !== "none"){
        canvas_space_width = 15;
    }else if(parseInt(selectedObject.outline_width) > 1 && selectedObject.outline_color_name !== "none"){
        canvas_space_width = 10;
    }else{
        canvas_space_width = 0;
    }

        if(text_val == ''){
            text_val = 'No Text';
            // var text_static_val = 'No Text';
            //     var noTextData = $.measureText(text_static_val, {fontFamily: selectedObject.fontFamily, fontSize:selectedObject.fontSize});
            //     console.log('text width : ', noTextData.width , " | canvas width : ", CANVAS_WIDTH, " | font size : ", selectedObject.fontSize);
               
        }
        var font_size = selectedObject.text_font_size;
        var tempData = $.measureText(text_val, {fontFamily: selectedObject.text_font_family, fontSize:selectedObject.text_font_size});

        // selectedObject.set('text', text_val);  
        
        console.log('text width : ', tempData.width , " | canvas width : ", CANVAS_WIDTH-minX-canvas_space_width, " | font size : ", font_size);

        if(tempData.width > (CANVAS_WIDTH-minX-canvas_space_width)){
            console.log("Width is greater than canvas width1")
            var text_width = tempData.width;
            while (text_width > (CANVAS_WIDTH-minX-canvas_space_width)){
                
              font_size = font_size-1;
              var updateData = $.measureText(text_val, {fontFamily: selectedObject.fontFamily, fontSize:font_size});
              text_width = updateData.width;
            }
        }


            $.ajax({
              url: "http://customizer.sketchthemes.com:8080/textGenerate.php?text="+text_val+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+font_size+"&fontName="+selectedObject.text_font_family+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width,
              xhrFields: {
                responseType: 'blob'
              },
              beforeSend: function() {
                $('.customiseLoader').css("display","flex");
              },
              success: function (img, status, xhr) {
                $('#textFontSize').val(parseFloat(font_size).toFixed(1));

                selectedObject.set({
                    scaleToWidth:xhr.getResponseHeader('x-img-width'),
                    scaleToHeight:xhr.getResponseHeader('x-img-height'),
                    scaleX: 1,
                    scaleY:1,
                    "text_font_size": font_size,
                    "text": text_val
                })
                selectedObject.setSrc(URL.createObjectURL(img));                
                        
                setTimeout(function(){
                    setObjectInside(selectedObject);
                    canvas.renderAll(); 
                    $('.customiseLoader').css("display","none");
                }, 200)
              },
              error: function (jqXhr, textStatus, errorMessage) {
                console.log("Error => ",errorMessage);
                $('.customiseLoader').css("display","none");
              }
            })         
      
    setObjectInside(selectedObject);
    canvas.renderAll(); 
    var font_text = truncateString(text_val, 10);
    $('ul#allFonts>li>span.active_text').text(font_text);
})

// text font family js
const changeTextFont = async(font) => {
    var selectedObject = canvas.getActiveObject();
    $.ajax({
      url: "http://customizer.sketchthemes.com:8080/textGenerate.php?text="+selectedObject.text+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+selectedObject.text_font_size+"&fontName="+font+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width,
      xhrFields: {
        responseType: 'blob'
      },
      beforeSend: function() {
        $('.customiseLoader').css("display","flex");
      },
      success: function (img, status, xhr) {
        selectedObject.set({
            scaleToWidth:xhr.getResponseHeader('x-img-width'),
            scaleToHeight:xhr.getResponseHeader('x-img-height'),
            scaleX: 1,
            scaleY:1,
            "text_font_size": selectedObject.text_font_size,
            "text": selectedObject.text
        })
        selectedObject.setSrc(URL.createObjectURL(img));
        // $('.customiseLoader').css("display","none");            
        setTimeout(function(){
            fitToObject(selectedObject);
            // setObjectInside(selectedObject);
            // canvas.renderAll(); 
            
        }, 200)
      },
      error: function (jqXhr, textStatus, errorMessage) {
        console.log("Error => ",errorMessage);
        $('.customiseLoader').css("display","none");
      }
    })
    selectedObject.set("text_font_family", font)
     $('.selected_font_name').text(font);    
     setObjectInside(selectedObject);
     canvas.renderAll();
}


// text color js
function changeTextColor(color, name){
    var selectedObject = canvas.getActiveObject();
    $.ajax({
      url: "http://customizer.sketchthemes.com:8080/textGenerate.php?text="+selectedObject.text+"&effect="+selectedObject.text_effect+"&font_color="+color.replace("#","")+"&font_size="+selectedObject.text_font_size+"&fontName="+selectedObject.text_font_family+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width,
      xhrFields: {
        responseType: 'blob'
      },
      beforeSend: function() {
        $('.customiseLoader').css("display","flex");
      },
      success: function (img) {
        selectedObject.set({"text_color": color, "text_color_name": name});
        $('.selected_color_name').text(name);
        selectedObject.setSrc(URL.createObjectURL(img));
                
        setTimeout(function(){
            setObjectInside(selectedObject);
            canvas.renderAll(); 
            $('.customiseLoader').css("display","none");
        }, 200)
      },
      error: function (jqXhr, textStatus, errorMessage) {
        console.log("Error => ",errorMessage);
        $('.customiseLoader').css("display","none");
      }
    })

    canvas.renderAll(); 
}

// text Rotation js
function changeRangeValue(val){
    document.getElementById("rotatTextRangeSlide").value = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
    var selectedObject = canvas.getActiveObject();
    // selectedObject.set('angle', parseFloat(val));
    selectedObject.rotate(parseFloat(val));
    fitToObject(selectedObject);
    // setObjectInside(selectedObject);
    // canvas.renderAll();
}
function changeInputValue(val){
    document.getElementById("rotatTextNumber").value = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
    var selectedObject = canvas.getActiveObject();
    // selectedObject.set('angle', parseFloat(val));
    selectedObject.rotate(parseFloat(val));
    fitToObject(selectedObject);
    // setObjectInside(selectedObject);
    // canvas.renderAll();
}

// text outline js
function changeTxtOutlineColor(color, name){
    var thickness_val =  $('#textOutlineThickness').val();
    var selectedObject = canvas.getActiveObject();

    $.ajax({
      url: "http://customizer.sketchthemes.com:8080/textGenerate.php?text="+selectedObject.text+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+selectedObject.text_font_size+"&fontName="+selectedObject.text_font_family+"&outline_color="+color.replace("#","")+"&outline_width="+thickness_val,
      xhrFields: {
        responseType: 'blob'
      },
      beforeSend: function() {
        $('.customiseLoader').css("display","flex");
      },
      success: function (img, status, xhr) {
        $('.selected_outline_name').text(name);
        selectedObject.set({
            scaleToWidth:xhr.getResponseHeader('x-img-width'),
            scaleToHeight:xhr.getResponseHeader('x-img-height'),
            scaleX: 1,
            scaleY:1,
            "outline_color":color,
            "outline_width": thickness_val,
            "outline_color_name": name
        })
        selectedObject.setSrc(URL.createObjectURL(img));
        // $('.customiseLoader').css("display","none");
              
        setTimeout(function(){
            fitToObject(selectedObject)
            // setObjectInside(selectedObject);  
            // canvas.renderAll(); 
        }, 200)
      },
      error: function (jqXhr, textStatus, errorMessage) {
        console.log("Error => ",errorMessage);
        $('.customiseLoader').css("display","none");
      }
    })      

    // selectedObject.set({"outline_color":color, "outline_width": thickness_val, "outline_color_name": name});
    // $('.selected_outline_name').text(name);
    // canvas.renderAll(); 
}
function changeTextOutlineThick(){
    var selected_color = $(".color_box>input[name='text_outline_input']:checked").attr('data-color-code');
    var selected_name = $(".color_box>input[name='text_outline_input']:checked").attr('data-color-name');
    changeTxtOutlineColor(selected_color, selected_name);
}
function removeTxtOutline(){
    var selectedObject = canvas.getActiveObject();

    $.ajax({
      url: "http://customizer.sketchthemes.com:8080/textGenerate.php?text="+selectedObject.text+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+selectedObject.text_font_size+"&fontName="+selectedObject.text_font_family+"&outline_color=00000000&outline_width="+1,
      xhrFields: {
        responseType: 'blob'
      },
      beforeSend: function() {
        $('.customiseLoader').css("display","flex");
      },
      success: function (img, status, xhr) {
        $('.selected_outline_name').text("none");
        $('#textOutlineThickness').val(1);
        $(".color_box>input[name='text_outline_input'][data-color-name='none']").prop("checked", true);
        $('.text_outline_wrapper').css("display","none");
        $('.selected_outline_color>.color_box').css('background-color', '#00000000');
        $('.selected_outline_color>.color_name').text('None');

        selectedObject.set({
            scaleToWidth:xhr.getResponseHeader('x-img-width'),
            scaleToHeight:xhr.getResponseHeader('x-img-height'),
            scaleX: 1,
            scaleY:1,
            "outline_color":'#00000000',
            "outline_width": 1,
            "outline_color_name": "none"
        })
        selectedObject.setSrc(URL.createObjectURL(img));
        // $('.customiseLoader').css("display","none");
               
        setTimeout(function(){
            fitToObject(selectedObject)
            // setObjectInside(selectedObject); 
            // canvas.renderAll(); 
        }, 200)
      },
      error: function (jqXhr, textStatus, errorMessage) {
        console.log("Error => ",errorMessage);
        $('.customiseLoader').css("display","none");
      }
    })
    // selectedObject.set({'stroke': "transparent", 'strokeWidth': 0, 'paintFirst': "none"});
    
    // canvas.renderAll(); 
    
}
// end text outline js


// text transform effect section js

function changeTextEffect(effect){
    $('.txt_shape_container').removeClass('active_shape');
    console.log('type => ', effect)
    var selectedObject = canvas.getActiveObject();
    var selected_shap = $('.selected_shape_name').text();
    console.log('selected_shap => ', selected_shap)
    
    $.ajax({
      url: "http://customizer.sketchthemes.com:8080/textGenerate.php?text="+selectedObject.text+"&effect="+effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+selectedObject.text_font_size+"&fontName="+selectedObject.text_font_family+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width,
      xhrFields: {
        responseType: 'blob'
      },
      beforeSend: function() {
        $('.customiseLoader').css("display","flex");
      },
      success: function (img, status, xhr){
        if(effect == 'normal'){
            $('.selected_shape_name').text('None');
        }else{
            $('.selected_shape_name').text(effect);
        }
        $('.txt_shape_container.'+effect+'_text').addClass('active_shape');

        selectedObject.set({
            "text_effect": effect,
            scaleToWidth:xhr.getResponseHeader('x-img-width'),
            scaleToHeight:xhr.getResponseHeader('x-img-height'),
            scaleX: 1,
            scaleY:1,
        });
        selectedObject.setSrc(URL.createObjectURL(img));
        
               
        setTimeout(function(){
            fitToObject(selectedObject);
            // setObjectInside(selectedObject); 
            // canvas.renderAll(); 
            // $('.customiseLoader').css("display","none");
        }, 200)
      },
      error: function (jqXhr, textStatus, errorMessage) {
        console.log("Error => ",errorMessage);
        $('.customiseLoader').css("display","none");
      }
    })


    
    setObjectInside(selectedObject);
    canvas.renderAll();
    
    
}

function removeTxtShape(){
    changeTextEffect('normal');
    $('.text_shape_wrapper').css("display","none");
}



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
    if(value < 5){
        value = 5; 
    }

        $.ajax({
          url: "http://customizer.sketchthemes.com:8080/textGenerate.php?text="+selectedObject.text+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+value+"&fontName="+selectedObject.text_font_family+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width,
          xhrFields: {
            responseType: 'blob'
          },
          beforeSend: function() {
            $('.customiseLoader').css("display","flex");
          },
          success: function (img, status, xhr) {
            $('#textFontSize').val(parseFloat(value).toFixed(1));
            selectedObject.set({
                scaleToWidth:xhr.getResponseHeader('x-img-width'),
                scaleToHeight:xhr.getResponseHeader('x-img-height'),
                scaleX: 1,
                scaleY:1,
                "text_font_size": value,
            })
            selectedObject.setSrc(URL.createObjectURL(img));
            
                    
            setTimeout(function(){
                fitToObject(selectedObject)
                // setObjectInside(selectedObject);
                // canvas.renderAll(); 
                // $('.customiseLoader').css("display","none");
            }, 200)
          },
          error: function (jqXhr, textStatus, errorMessage) {
            console.log("Error => ",errorMessage);
            $('.customiseLoader').css("display","none");
          }
        })   
    

    // if(value < 10){
    //     $('#textFontSize').val(10);
    //     selectedObject.set('fontSize', 10);
    // }else{
    //     // selectedObject.set('fontSize', value);
    //     var font_size = Number(value);
    //     console.log("active text => ", selectedObject.text, " | font family => ", selectedObject.fontFamily ," | text size val => ", value);
    //     var newData = $.measureText(selectedObject.text, {fontFamily: selectedObject.fontFamily, fontSize:font_size});

 
    //     console.log('text width : ', newData.width , " | canvas width : ", CANVAS_WIDTH," | font size : ", font_size);

    //     if(newData.width > CANVAS_WIDTH){
    //         console.log("condition 1");
    //         var text_width = newData.width;
    //         while (text_width > CANVAS_WIDTH) {
    //           font_size = font_size-1;
    //           var newData = $.measureText(selectedObject.text, {fontFamily: selectedObject.fontFamily, fontSize:font_size});
    //           text_width = newData.width;
    //         }
    //     }else{
    //         console.log("condition 2")
    //     }

    //     selectedObject.set({
    //         width: newData.width,
    //         height: newData.height,
    //         fontSize: font_size,
    //     }); 
    //     $('#textFontSize').val(font_size);
    // }
    

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
            left:minX,
            top:minY
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
   if(edit_art == true){
    console.log("Update Art !")
      let selectedObject = canvas.getActiveObject();
       selectedObject.set({
            scaleToWidth:selectedObject.scaleToWidth,
        });
       selectedObject.setSrc(path);
       edit_art == false;
       $('#addArtTab').css("display","none");
       $('#editArtTab').css("display","block");
       setTimeout(function(){
        setObjectInside(selectedObject);
        canvas.setActiveObject(selectedObject);
        canvas.renderAll();
       }, 200);
       
   }else{
       updateTshirtImage(path);
       $('#addArtTab').css("display","none");
       $('#editArtTab').css("display","block");
    }
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
                left:minX,
                top:minY,
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
    // console.log("key code => ", keyCode);

    if(keyCode == 46){
        console.log("Removing selected element on Fabric.js on DELETE key !");
        canvas.remove(canvas.getActiveObject());
        $('#editTextTab').css("display","none");
        $('#addTextTab').css("display","block");
    }
}, false);


