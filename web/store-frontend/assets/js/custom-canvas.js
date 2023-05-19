var API_URL = 'http://staging.whattocookai.com:8080';
var zoomOption = false;
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

var canvas = front_canvas;


var minX, minY, maxX, maxY, CANVAS_WIDTH, CANVAS_HEIGHT;
var canvas_padding = 20; // canvas padding like 50 = 25 for left + 25 for right(25 for each side)
// Define the background rectangle dimensions
    // front canvas width height
    var frontbgWidth = front_canvas.width - (front_canvas.width*canvas_padding)/100;
    var frontbgHeight = front_canvas.height - (front_canvas.height*canvas_padding)/100;

    // back canvas width height
    var backbgWidth = back_canvas.width - canvas_padding;
    var backbgHeight = back_canvas.height - canvas_padding;

    // sleeve left canvas width height
    var leftSlvbgWidth = left_canvas.width - canvas_padding;
    var leftSlvbgHeight = left_canvas.height - canvas_padding;

    // sleeve right canvas width height
    var rightSlvbgWidth = right_canvas.width - canvas_padding;
    var rightSlvbgHeight = right_canvas.height - canvas_padding;

    var bgLeft = ((front_canvas.width*canvas_padding)/100) / 2;
    var bgTop = ((front_canvas.height*canvas_padding)/100) / 2;

// Create the background rectangle

    var frontbgRect = new fabric.Rect({
        left: bgLeft,
        top: bgTop,
        width: frontbgWidth,
        height: frontbgHeight,
        fill: 'transparent',
        stroke: '#cacaca',
        strokeWidth: 0
    });

    var backbgRect = new fabric.Rect({
        left: bgLeft,
        top: bgTop,
        width: backbgWidth,
        height: backbgHeight,
        fill: 'transparent',
        stroke: '#cacaca',
        strokeWidth: 0
    });

    var leftbgRect = new fabric.Rect({
        left: bgLeft,
        top: bgTop,
        width: leftSlvbgWidth,
        height: leftSlvbgHeight,
        fill: 'transparent',
        stroke: '#cacaca',
        strokeWidth: 0
    });

    var rightbgRect = new fabric.Rect({
        left: bgLeft,
        top: bgTop,
        width: rightSlvbgWidth,
        height: rightSlvbgHeight,
        fill: 'transparent',
        stroke: '#cacaca',
        strokeWidth: 0
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

window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
    // console.log("function called");
    var imgWidth = $('#customiserImage').width();
    var imgHeight = $('#customiserImage').height();

    let canvas_view_type = $('.canvas_view_input[name="canvas_view_type"]:checked').attr('view_type');
    if(canvas_view_type == 'left' || canvas_view_type == 'right'){
      var canvasWidth = imgWidth*30/100;
      var canvasHeight = imgHeight*35/100;
    }else{
      var canvasWidth = imgWidth*55/100;
      var canvasHeight = imgHeight*70/100;
    }

    
    // console.log(" canvas width : ",canvasWidth, " | height : ",canvasHeight );
    var width_outer_space = (canvasWidth*canvas_padding)/100;
    var height_outer_space = (canvasHeight*canvas_padding)/100;

    var bgWidth = canvasWidth-width_outer_space;
    var bgHeight = canvasHeight-height_outer_space;

    // let bgLeft = canvas_padding / 2;
    // let bgTop = canvas_padding / 2;
    bgLeft = width_outer_space / 2;
    bgTop = height_outer_space / 2;

    minX = bgLeft;
    maxX = bgLeft+bgWidth;
    minY = bgTop;
    maxY = bgTop+bgHeight;
    CANVAS_WIDTH = maxX;
    CANVAS_HEIGHT = maxY;

    // console.log("bgLeft : ", bgLeft, " | bgTOP :", bgTop,  " | minx : ",minX, " | maxX :", maxX, " | minY : ", minY, " | maxY : ", maxY, " | canvas-width :", CANVAS_WIDTH, " | canvas-height : ", CANVAS_HEIGHT);

    canvas.setHeight(canvasHeight);
    canvas.setWidth(canvasWidth);
    canvas.backgroundImage.set({
        width:bgWidth,
        height:bgHeight,
        left:bgLeft,
        top:bgTop
    });
    // fireEvents();
    setAllObjects();
    canvas.renderAll();
}


// Change canvas type like :- [front, back, right, left]
function changeCanvasType(type) {
    // console.log("canvas type => ", type);
    var variant_val = $('.prd_color_box input[name="product_color"]:checked').attr('data-variant-name');
    var selected_variant_img = $('.product_variant[data-variant="'+variant_val+'"][data-style="'+type+'"]').attr('data-src');
    $('#customiserImage').attr('src', selected_variant_img);
    $('.custom_canvas').css('display','none');
    $('.drawing-area').css({"top":"45%","left":"50%"});
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
        resizeCanvas();
        // canvas.calcOffset();
    }else if(type == 'right'){
      $('#rightCanvasWrap').parent('.drawing-area').css({"top":"48%","left":"46%"});
        $('#rightCanvasWrap').css('display','block');
        minX = rightbgRect.left;
        maxX = rightbgRect.left+rightbgRect.width;
        minY = rightbgRect.top;
        maxY = rightbgRect.top+rightbgRect.height;
        CANVAS_WIDTH = maxX;
        CANVAS_HEIGHT = maxY;
        canvas = right_canvas;
        fireEvents(); 
        resizeCanvas();
    }else if(type =='left'){
        $('#leftCanvasWrap').parent('.drawing-area').css({"top":"48%","left":"54%"});
        $('#leftCanvasWrap').css('display','block');
        minX = leftbgRect.left;
        maxX = leftbgRect.left+leftbgRect.width;
        minY = leftbgRect.top;
        maxY = leftbgRect.top+leftbgRect.height;
        CANVAS_WIDTH = maxX;
        CANVAS_HEIGHT = maxY;
        canvas = left_canvas;
        fireEvents();
        resizeCanvas();
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
        resizeCanvas();
    }
    ChooseSettingtab('', 'defaultSettings');
    canvas.discardActiveObject();

    // if(zoomOption == true){
    //   zoomIn();
    // }

    canvas.renderAll();
}

var state;
var frontState;
var backState;
var leftState;
var rightState;

var undoFront = [];
var undoBack = [];
var undoLeft = [];
var undoRight = [];

var redoFront = [];
var redoBack = [];
var redoLeft = [];
var redoRight = [];


    async function saveState() {
        var undo = [];
        var redo = [];
      let canvas_view_type = $('.canvas_view_input[name="canvas_view_type"]:checked').attr('view_type');
      if(canvas_view_type == 'back'){
        state = backState;
        undo = undoBack;
        redo = redoBack;
      }else if(canvas_view_type == 'left'){
        state = leftState;
        undo = undoLeft;
        redo = redoLeft;
      }else if(canvas_view_type == 'right'){
        state = rightState;
        undo = undoRight;
        redo = redoRight;
      }else{
        state = frontState;
        undo = undoFront;
        redo = redoFront;
      }

      redo = [];
      $('#redo').prop('disabled', true);
      if (state) {
        undo.push(state);
        $('#undo').prop('disabled', false);
      }
      
   
        var myCustomProperties = [];
        await canvas.getObjects().forEach(function(object) {
          // Get an array of all properties for this object
          var allProperties = Object.getOwnPropertyNames(object);

          // Filter out the default properties that come with Fabric.js
          myCustomProperties = allProperties.filter(function(prop) {
            return !fabric.Object.prototype.hasOwnProperty(prop);
          });
          myCustomProperties.concat(myCustomProperties);
        });
        forDeletion = ["canvas","_element","_originalElement","_cacheCanvas","_cacheContext"];
        myCustomProperties = myCustomProperties.filter(item => !forDeletion.includes(item))
        myCustomProperties.push("scaleToHeight");
        myCustomProperties.push("scaleToWidth");
        var myCustomJson = canvas.toJSON(myCustomProperties);
        // console.log(JSON.stringify(myCustomJson))
        state = JSON.stringify(myCustomJson);

          if(canvas_view_type == 'back'){
            backState = state;
             undoBack = undo;
             redoBack = redo;
          }else if(canvas_view_type == 'left'){
            leftState = state;
            undoLeft = undo;
            redoLeft = redo;
          }else if(canvas_view_type == 'right'){
            rightState = state;
            undoRight = undo;
            redoRight = redo;
          }else{
            frontState = state;
            undoFront = undo;
            redoFront = redo;
          }
          // // console.log("Undo val => ", undo);
          // // console.log("Redo val => ", redo);
          // console.log("canvas val => ", state);
      

    }
    function replay(playStack, saveStack, buttonsOn, buttonsOff) {   
    let canvas_view_type = $('.canvas_view_input[name="canvas_view_type"]:checked').attr('view_type');   
      if(canvas_view_type == 'back'){
        state = backState;
      }else if(canvas_view_type == 'left'){
        state = leftState;
      }else if(canvas_view_type == 'right'){
        state = rightState;
      }else{
        state = frontState;
      }

      // // console.log("On click Undo val => ", playStack);
      // // console.log("On click Redo val => ", saveStack);
      // // console.log("On click canvas val => ", state);

      saveStack.push(state);
      state = playStack.pop();
      var on = $(buttonsOn);
      var off = $(buttonsOff);
      // turn both buttons off for the moment to prevent rapid clicking
      on.prop('disabled', true);
      off.prop('disabled', true);
      canvas.clear();
      // console.log("json state val => ", state);
      canvas.loadFromJSON(state, function() {
        canvas.renderAll();
        // now turn the buttons back on if applicable
        on.prop('disabled', false);
        if (playStack.length) {
          off.prop('disabled', false);
        }
        objectMouseDown(canvas.getActiveObject()) // call mouse down function for update values
      });
      if(canvas_view_type == 'back'){
        backState = state;
      }else if(canvas_view_type == 'left'){
        leftState = state;
      }else if(canvas_view_type == 'right'){
        rightStat = state;
      }else{
        frontState = state;
      }

      // // console.log("After click Undo val => ", playStack);
      // // console.log("After click Redo val => ", saveStack);
      // // console.log("After click canvas val => ", state);
    }
    // undo and redo buttons
    $('#undo').click(function() {
        // console.log("click undo");

      let canvas_view_type = $('.canvas_view_input[name="canvas_view_type"]:checked').attr('view_type');
      if(canvas_view_type == 'back'){
        state = backState;
        undo = undoBack;
        redo = redoBack;
      }else if(canvas_view_type == 'left'){
        state = leftState;
        undo = undoLeft;
        redo = redoLeft;
      }else if(canvas_view_type == 'right'){
        state = rightState;
        undo = undoRight;
        redo = redoRight;
      }else{
        state = frontState;
        undo = undoFront;
        redo = redoFront;
      }

        replay(undo, redo, '#redo', this);
    });
    $('#redo').click(function() {
        // console.log("click redo");
        let canvas_view_type = $('.canvas_view_input[name="canvas_view_type"]:checked').attr('view_type');
          if(canvas_view_type == 'back'){
            state = backState;
            undo = undoBack;
            redo = redoBack;
          }else if(canvas_view_type == 'left'){
            state = leftState;
            undo = undoLeft;
            redo = redoLeft;
          }else if(canvas_view_type == 'right'){
            state = rightState;
            undo = undoRight;
            redo = redoRight;
          }else{
            state = frontState;
            undo = undoFront;
            redo = redoFront;
          }


        replay(redo, undo, '#undo', this);
    })

 
//Disable context menu
fabric.util.addListener(document.getElementsByClassName('upper-canvas')[0], 'contextmenu', function(e) {
    e.preventDefault();
});

// delete object code START
var deleteIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAABmJLR0QA/wD/AP+gvaeTAAABM0lEQVQ4jZ2TO07DQBCGRxQ0OLdAuQHKEWgokcUdAikQBUZCHIYQhYQoQBUlhNv4EQSuXNiW7I9ibYg3u+HxN6udnfl2NPuviCagBfSAJRAAebUugTPA0Wt0wAmwYrsiwLUBroDyB0CtEvBMHfwWsA5ya4BTtVgdlRSr0FhVRIEeWgEtQQ3xOzH0iTtt0umwkZ1OBsSdtumCU0FNvVkwHSrQuK/2j/dqP7o1NbgQwNh7DUquz7cBAHwBMttpcnNBfLBP4vVsKQDpjoh8mJ48expJPnuW3cMjyV9nkj3c2ez1LsDLBlqbgT4jTXNBWflLRRSogsmgCR731eu8RWjq1j5pDNfgB1tc+aQynMv/HHusW9/7A6gELm2f0MXimzWFGx0YQA7QBRaAj/KRD8yr+J5e8wku5nAYlAMFMAAAAABJRU5ErkJggg==';

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
var resizeIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAMAAAC7faEHAAAAP1BMVEUAAAAA//8AgIAAmbMAmbMAnLUAnrQGm7cFm7QDnLYDnLQDm7QDm7QCnLUDnbUDnLUDnbYDm7UDnLUDnLX////SASVmAAAAE3RSTlMAAQIUHh8iLjNNVVxmZ5SYmZzfrqPYfQAAAAFiS0dEFJLfyTUAAAB2SURBVDjL7dMxDoAgDAVQUFGEIljuf1chlJV2YGDwzy8/LSlK/Vk0PlGOsUuZYic6DAC7pO/duD2KwwKj5h08gsbqtABWpwTQWFs21ZFmPJ0bPlBvhJyTEkDWEQysazMi71oj6wxAQIG7++FMclc/bP9/8lXzAeGoC3Obh6WqAAAAAElFTkSuQmCC';

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
  // canvas.remove(target);
  Delete();
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


function setAllObjects(){

  var objArr = canvas.getObjects();
  for(var a=0; a<objArr.length;a++){

    objArr[a].setCoords(); 

    if(objArr[a].getBoundingRect().top < minY || objArr[a].getBoundingRect().left < minX){
        objArr[a].top = Math.max(objArr[a].top, objArr[a].top-objArr[a].getBoundingRect().top+minY);
        objArr[a].left = Math.max(objArr[a].left, objArr[a].left-objArr[a].getBoundingRect().left+minX);
        if(objArr[a].top < minY){
            objArr[a].top = minY;
        }
        if(objArr[a].left < minX){
            objArr[a].left = minX;
        }
    }

    if(objArr[a].getBoundingRect().top+objArr[a].getBoundingRect().height  > CANVAS_HEIGHT || objArr[a].getBoundingRect().left+objArr[a].getBoundingRect().width  > CANVAS_WIDTH){
        objArr[a].top = Math.min(objArr[a].top, CANVAS_HEIGHT-objArr[a].getBoundingRect().height+objArr[a].top-objArr[a].getBoundingRect().top);
        objArr[a].left = Math.min(objArr[a].left, CANVAS_WIDTH-objArr[a].getBoundingRect().width+objArr[a].left-objArr[a].getBoundingRect().left);
    }

    // if(objArr[a].top < minY){
    //   objArr[a].top = minY;
    // }
    // if(objArr[a].left < minX){
    //   objArr[a].left = minX;
    // }
  }
}


// function for text resize when object width is greater than canvas
function fitToObject(event) {
    // console.log("Call fit to object function")
   var obj = event;

    if(obj.object_type == 'text'){
        var canvas_space_width = 0;
        // if(parseInt(obj.outline_width) > 5 && obj.outline_color_name !== "none"){
        //     canvas_space_width = 15;
        // }else if(parseInt(obj.outline_width) > 1 && obj.outline_color_name !== "none"){
        //     canvas_space_width = 10;
        // }else{
        //     canvas_space_width = 0;
        // }
        // console.log("canvas space => ", canvas_space_width);
        // console.log("canvas => scale to width : ",  obj.scaleToWidth , " | width " , (CANVAS_WIDTH-minX) , " | height : ", obj.scaleToHeight, " | ", parseInt(obj.scaleToWidth) > parseInt(CANVAS_WIDTH-minX) )
        if(parseFloat(obj.scaleToWidth) > parseFloat(CANVAS_WIDTH-minX)){
            var font_size = obj.text_font_size;
            var text_val = obj.text;
            var font_family = obj.text_font_family;
            // var tempData = $.measureText(text_val, {fontFamily:font_family, fontSize:parseFloat(font_size)});
            // // console.log("canvas => temp to width : ",  tempData.width , " | width " , parseFloat(CANVAS_WIDTH-minX-canvas_space_width), " | font_size ", font_size );
            // if(tempData.width > parseFloat(CANVAS_WIDTH-minX-canvas_space_width)){
            //         var text_width = tempData.width;
            //         while(text_width > (CANVAS_WIDTH-minX-canvas_space_width)){
            //             // console.log('text width : ', text_width , " | canvas width : ", (CANVAS_WIDTH-minX-canvas_space_width), " | font size : ", font_size);
            //             font_size = font_size-0.1;
            //             var updateData = $.measureText(text_val, {fontFamily: font_family, fontSize:font_size});
            //             text_width = updateData.width;
            //         }
            // }

            $.ajax({
              url: API_URL+"/textGenerate.php?text="+obj.text+"&effect="+obj.text_effect+"&font_color="+obj.text_color.replace("#","")+"&font_size="+obj.text_font_size+"&font_width="+parseFloat(obj.scaleToWidth).toFixed(2)+","+parseFloat(newWidth).toFixed(2)+"&font_height="+parseFloat(obj.scaleToHeight).toFixed(2)+","+parseFloat(newHeight).toFixed(2)+"&canvas_width="+parseFloat(CANVAS_WIDTH-minX).toFixed(2)+"&fontName="+obj.text_font_family+"&outline_color="+obj.outline_color.replace("#","")+"&outline_width="+obj.outline_width,

              // url: API_URL+"/textGenerate.php?text="+text_val+"&effect="+obj.text_effect+"&font_color="+obj.text_color.replace("#","")+"&font_size="+font_size+"&fontName="+obj.text_font_family+"&outline_color="+obj.outline_color.replace("#","")+"&outline_width="+obj.outline_width,
              xhrFields: {
                responseType: 'blob'
              },
              beforeSend: function() {
                $('.customiseLoader').css("display","flex");
              },
              success: function (img, status, xhr) {
                $('#textFontSize').val(parseFloat(xhr.getResponseHeader('x-font-size')).toFixed(1));

                obj.set({
                    scaleToWidth:xhr.getResponseHeader('x-img-width'),
                    scaleToHeight:xhr.getResponseHeader('x-img-height'),
                    scaleX: 1,
                    scaleY:1,
                    "text_font_size": xhr.getResponseHeader('x-font-size'),
                })
                obj.setSrc(URL.createObjectURL(img));                
                        
                setTimeout(function(){
                    
                    setObjectInside(obj);
                    canvas.renderAll(); 
                    saveState()  // call this function for save object in undo redo
                    $('.customiseLoader').css("display","none");
                }, 200)
              },
              error: function (jqXhr, textStatus, errorMessage) {
                // console.log("Error => ",errorMessage);
                $('.customiseLoader').css("display","none");
              }
            })    

        }else{
            setObjectInside(obj);
            canvas.renderAll(); 
            saveState()  // call this function for save object in undo redo
            $('.customiseLoader').css("display","none"); 
        }
   }
   // console.log("End fit to object Function!");
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
// ------------ Resize canvas function --------


function objectMouseDown(obj_target){
    // checking when you click on canvas then object was selected on not.
  if(obj_target) {
    if (obj_target.object_type == 'text') {

        let tempData = $.measureText(obj_target.text, {fontFamily:obj_target.text_font_family, fontSize:parseFloat(obj_target.text_font_size)});
        // console.log('Text => ', obj_target.text, " | font family ", obj_target.text_font_family, " | font size ", obj_target.text_font_size);
        // console.log('Temporary data => ', tempData);
        // console.log('Text object was clicked! ', obj_target);

        // editTextFunction(options.target);
        $('.ct_content_tab').removeClass("active_tab");
        $('.settings_title_wrapper>ul>li').removeClass("active");
        $('li.text_tab').addClass("active");
        $('#textSettings').addClass("active_tab");

        $('#addTextTab').css("display","none");
        if(obj_target.text == 'No Text'){
            $('#editTextContent').val('');
        }else{
            $('#editTextContent').val(obj_target.text);
        }
        $('#editTextTab').css("display","block");
        // $('.selected_font_name').text(options.target.fontFamily);

        // default settings value when added new text
        $('.selected_font_name').text(obj_target.text_font_family);
        $('.selected_font_name').css('font-family',obj_target.text_font_family);
        // $('.selected_color_name').text(obj_target.text_color_name);
        $('.selected_color>.color_box').css('background-color', obj_target.text_color);
        $('.selected_color>.color_name').text(obj_target.text_color_name);
        $(".color_box>input[name='text_color_input'][data-color-code='"+obj_target.text_color+"']").prop("checked",true);

        
        $('.txt_shape_container').removeClass('active_shape');
        $('.txt_shape_container.'+obj_target.text_effect+'_text').addClass('active_shape');
        if(obj_target.text_effect == 'normal'){
            $('.selected_shape_name').text('None');
            $('.selected_shape_name').attr('shape-type','none');
        }else{
            $('.selected_shape_name').text(obj_target.text_effect);
            $('.selected_shape_name').attr('shape-type',obj_target.text_effect);
        }

        $('.selected_outline_color>.color_box').css('background-color', obj_target.outline_color);
        $('.selected_outline_color>.color_box').attr("color-name",obj_target.outline_color_name);
        $('.selected_outline_color>.color_name').text(obj_target.outline_color_name);
        
        window.clickPipsSlider.noUiSlider.set(parseInt(obj_target.outline_width));

        // $('.selected_outline_name').text(obj_target.outline_color_name);

        // $('#rotatTextRangeSlide').val(obj_target.angle);
        window.textRotationSlider.noUiSlider.set(obj_target.angle);
        $('#rotatTextNumber').val(obj_target.angle);

        $('#textFontSize').val(parseFloat(obj_target.text_font_size).toFixed(1));

        var font_text = truncateString(obj_target.text, 10);
        $('ul#allFonts>li>span.active_text').text(font_text);


    }else{
        $('#editTextTab').css("display","none");
        $('#addTextTab').css("display","block");
    }

    if (obj_target.object_type == 'art') {
        // console.log('Art object was clicked! ', obj_target);
        // console.log(" Width => ", obj_target.scaleToWidth);
        // console.log(" height => ", obj_target.scaleToHeight);
        $("#artWidth").val(parseFloat(obj_target.scaleToWidth).toFixed(2));
        $("#artHeight").val(parseFloat(obj_target.scaleToHeight).toFixed(2));
        // document.getElementById("rotatArtRangeSlide").value = obj_target.angle;
        window.artRotationSlider.noUiSlider.set(obj_target.angle);
        document.getElementById("rotatArtNumber").value = obj_target.angle;

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

    if(obj_target.object_type == 'image') {
        // console.log('Image object was clicked! ', obj_target);
        // console.log(" Width => ", obj_target.scaleToWidth);
        // console.log(" height => ", obj_target.scaleToHeight);
         $("#imageWidth").val(parseFloat(obj_target.scaleToWidth).toFixed(2));
        $("#imageHeight").val(parseFloat(obj_target.scaleToHeight).toFixed(2));
        // document.getElementById("rotatImageRangeSlide").value = obj_target.angle;
        window.imageRotationSlider.noUiSlider.set(obj_target.angle);
        document.getElementById("rotatImageNumber").value = obj_target.angle;
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
}


 // all object selection function

 function selectAllObject(){
  if(canvas.getObjects().length > 0){
     var selection = new fabric.ActiveSelection(canvas.getObjects(), {
      canvas: canvas });
    canvas.setActiveObject(selection).renderAll();
    if(canvas.getActiveObject()!=null && canvas.getActiveObjects().length > 1){
          canvas.getActiveObject().setControlsVisibility({
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
          canvas.renderAll();
      }
    }
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

// This function will work when click on canvas 
canvas.on('mouse:down', function(options) {
    var obj_target = options.target
    objectMouseDown(obj_target) // call mouse down function for update values
  
  //  Show context menu when click on right button of mouse
  if(options.e.button === 2) {
    // console.log("object target => ", options.e);
        var top_pos = options.e.offsetY + 10;
        var left_pos = options.e.offsetX + 10;
        $('.context_menu_wrap').css({"display":"block", "top": top_pos, "left": left_pos});
    }else{
        $('.context_menu_wrap').css("display","none");
        if(canvas.getActiveObject()!=null && canvas.getActiveObjects().length > 1){
          canvas.getActiveObject().setControlsVisibility({
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
          canvas.renderAll();
        }
    }
});
canvas.on('selection:created', function(options) {
    if(canvas.getActiveObject()!=null && canvas.getActiveObjects().length > 1){
          canvas.getActiveObject().setControlsVisibility({
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
          canvas.renderAll();
        }
});

// function work when object move
canvas.on('object:moving', function(e) {
    canvas.backgroundImage.set({
      strokeWidth:1
    })
    var obj = e.target;
    if(obj.object_type == 'image'){
      
        if(obj.scaleToHeight > CANVAS_HEIGHT || obj.scaleToWidth > CANVAS_WIDTH){
            return;
        }
    }else{
      console.log(obj.height, CANVAS_HEIGHT, CANVAS_WIDTH)
        if(obj.height > CANVAS_HEIGHT || obj.width > CANVAS_WIDTH){
            return;
        }
    }

    
// console.log(obj.getBoundingRect())
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
    canvas.backgroundImage.set({
      strokeWidth:1
    })
    // console.log("scaling => ", e.target.type);
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

// canvas.on('object:scaling', function (e) {
//       var obj = e.target;
//       obj.setCoords();
//       let top = obj.getBoundingRect().top;
//       let left = obj.getBoundingRect().left;
//       let height = obj.getBoundingRect().height;
//       let width = obj.getBoundingRect().width;

//       // restrict scaling below bottom of canvas
//       if (top + height > CANVAS_HEIGHT-minY) {
//         obj.scaleY = 1;
//         obj.setCoords();
//         let h = obj.getScaledHeight();

//         obj.scaleY = (CANVAS_HEIGHT - top) / h;
//         obj.setCoords();
//         canvas.renderAll();

//         obj.lockScalingX = true;
//         obj.lockScalingY = true;
//         // obj.lockMovementX = true;
//         // obj.lockMovementY = true;
//       }

//       // restrict scaling above top of canvas
//       if (top < minY) {
//         obj.scaleY = 1;
//         obj.setCoords();
//         let h = obj.getScaledHeight();
//         obj.scaleY = (height + top) / h;
//         obj.top = minY;
//         obj.setCoords();
//         canvas.renderAll();

//         obj.lockScalingX = true;
//         obj.lockScalingY = true;
//         // obj.lockMovementX = true;
//         // obj.lockMovementY = true;
//       }

//       // restrict scaling over right of canvas
//       if (left + width > CANVAS_WIDTH-minX) {
//         obj.scaleX = 1;
//         obj.setCoords();
//         let w = obj.getScaledWidth();

//         obj.scaleX = (CANVAS_WIDTH - left) / w;
//         obj.setCoords();
//         canvas.renderAll();

//         obj.lockScalingX = true;
//         obj.lockScalingY = true;
//         // obj.lockMovementX = true;
//         // obj.lockMovementY = true;
//       }

//       // restrict scaling over left of canvas
//       if(left < minX) {
//         obj.scaleX = 1;
//         obj.setCoords();
//         let w = obj.getScaledWidth();
//         obj.scaleX = (width + left) / w;
//         obj.left = minX;
//         obj.setCoords();
//         canvas.renderAll();
//         obj.lockScalingX = true;
//         obj.lockScalingY = true;
//         // obj.lockMovementX = true;
//         // obj.lockMovementY = true;
//       }
//     });


canvas.on('object:modified', function(event) {
    // console.log("modified");
    if (event.target.object_type == 'text') {
        console.log(" data => ", event.target);
        var newWidth = (event.target.width * event.target.scaleX);
        var newHeight = (event.target.height * event.target.scaleY);
        console.log("width => ", newWidth);
        console.log("height => ", newHeight);

        // if(event.target.text_effect == 'curve'){
            if(parseFloat(event.target.scaleToWidth) !== parseFloat(newWidth)){
            $.ajax({
              url: API_URL+"/textGenerate.php?text="+event.target.text+"&effect="+event.target.text_effect+"&font_color="+event.target.text_color.replace("#","")+"&font_size="+event.target.text_font_size+"&font_width="+parseFloat(event.target.scaleToWidth).toFixed(2)+","+parseFloat(newWidth).toFixed(2)+"&font_height="+parseFloat(event.target.scaleToHeight).toFixed(2)+","+parseFloat(newHeight).toFixed(2)+"&canvas_width="+parseFloat(CANVAS_WIDTH-minX).toFixed(2)+"&fontName="+event.target.text_font_family+"&outline_color="+event.target.outline_color.replace("#","")+"&outline_width="+event.target.outline_width,
              xhrFields: {
                responseType: 'blob'
              },
              beforeSend: function() {
                $('.customiseLoader').css("display","flex");
              },
              success: function (img, status, xhr) {
                // console.log("XHR header response Width=> ", xhr.getResponseHeader('x-img-width'));
                // console.log("XHR header response => Height", xhr.getResponseHeader('x-img-height'));
                $('#textFontSize').val(parseFloat(xhr.getResponseHeader('x-font-size')).toFixed(1));
                event.target.set({
                        scaleToWidth:xhr.getResponseHeader('x-img-width'),
                        scaleToHeight:xhr.getResponseHeader('x-img-height'),
                        // width: xhr.getResponseHeader('x-img-width'),
                        // height: xhr.getResponseHeader('x-img-height'),
                        scaleX: 1,
                        scaleY:1,
                        "text_font_size": xhr.getResponseHeader('x-font-size')
                    })
                event.target.setSrc(URL.createObjectURL(img));
                        
                setTimeout(function(){
                    
                    // event.target.scaleToWidth(parseFloat(newWidth))

                    // fitToObject(event.target)
                    setObjectInside(event.target);
                    canvas.renderAll(); 
                    saveState()  // call this function for save object in undo redo
                    // console.log("called save state function !")
                    $('.customiseLoader').css("display","none");
                }, 200)
              },
              error: function (jqXhr, textStatus, errorMessage) {
                // console.log("Error => ",errorMessage);
                $('.customiseLoader').css("display","none");
              }
            }) 
         }else{
            saveState()  // call this function for save object in undo redo
         }

    }else if (event.target.object_type == 'art') {
        var newWidth = (event.target.width * event.target.scaleX);
        var newHeight = (event.target.height * event.target.scaleY);
        // console.log("Image width :", newWidth , " | height : ", newHeight);
        $("#artWidth").val(parseFloat(newWidth).toFixed(2));
        $("#artHeight").val(parseFloat(newHeight).toFixed(2));
        // document.getElementById("rotatArtRangeSlide").value = event.target.angle;
        window.artRotationSlider.noUiSlider.set(event.target.angle);
        document.getElementById("rotatArtNumber").value = event.target.angle;

        event.target.set({
            // width: newWidth,
            // height: newHeight,
            // scaleX:1,
            // scaleY:1,
            scaleToWidth:newWidth,
            scaleToHeight:newHeight
        })
        saveState()  // call this function for save object in undo redo
    }else if(event.target.object_type == 'image'){
        var newWidth = (event.target.width * event.target.scaleX);
        var newHeight = (event.target.height * event.target.scaleY);
        // console.log("Image width :", newWidth , " | height : ", newHeight);
        $("#imageWidth").val(parseFloat(newWidth).toFixed(2));
        $("#imageHeight").val(parseFloat(newHeight).toFixed(2));
        // document.getElementById("rotatImageRangeSlide").value = event.target.angle;
        window.imageRotationSlider.noUiSlider.set(event.target.angle);
        document.getElementById("rotatImageNumber").value = event.target.angle;

        event.target.set({
            // width: newWidth,
            // height: newHeight,
            // scaleX:1,
            // scaleY:1,
            scaleToWidth:newWidth,
            scaleToHeight:newHeight
        })
        saveState()  // call this function for save object in undo redo
    }
    canvas.backgroundImage.set({
      strokeWidth:0
    })
    
});

// resizeCanvas();

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
        var tempData = $.measureText(text_val, {fontFamily:"Abel", fontSize:font_size});
        var textWidth = tempData.width;
        var textHeight = tempData.height;

        // console.log(tempData)
        if(tempData.width > (CANVAS_WIDTH-minX-5)){
            // console.log("condition 1")
            var text_width = tempData.width;
            var text_height = tempData.height;
            while (text_width > (CANVAS_WIDTH-minX-5)) {
                // console.log('text width : ', text_width , " | canvas width : ", (CANVAS_WIDTH-minX-5), " | font size : ", font_size);
              font_size = font_size-1;
              var updateData = $.measureText(text_val, {fontFamily: "Abel", fontSize:font_size});
              text_width = updateData.width;
              text_height = updateData.height;
            }
            textWidth = text_width;
            textHeight = text_height;
        }

        $.ajax({
          url: API_URL+"/textGenerate.php?text="+text_val+"&effect=normal&font_color=000000&font_size="+font_size+"&fontName=Abel&outline_color=00000000&outline_width=2",
          xhrFields: {
            responseType: 'blob'
          },
          beforeSend: function() {
            $('.customiseLoader').css("display","flex");
          },
          success: function (img, status, xhr) {
            $('#textFontSize').val(parseFloat(xhr.getResponseHeader('x-font-size')).toFixed(1));
                fabric.Image.fromURL(window.URL.createObjectURL(img), function(img) {
                  console.log("minx : ", minX, " | min Y : ", minY);
                  // img.scaleToWidth(xhr.getResponseHeader('x-img-width'));
                  // img.scaleToHeight(xhr.getResponseHeader('x-img-height'));
                    img.set({
                        scaleToWidth:xhr.getResponseHeader('x-img-width'),
                        scaleToHeight:xhr.getResponseHeader('x-img-height'),
                        scaleX: 1,
                        scaleY:1,
                        "object_type":'text',
                        "text":text_val,
                        "text_effect":"normal",
                        "text_color": "#000000",
                        "text_color_name": "black",
                        "text_font_size": xhr.getResponseHeader('x-font-size'),
                        "text_font_family": "Abel",
                        "outline_color": "#00000000",
                        "outline_color_name": "None",
                        "outline_width": "1",
                        left:minX,
                        top:minY,
                        lockScalingFlip: true,
                        padding:1
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
                            
                    setTimeout(async function(){
                        console.log("Active obejct omg => ", img);
                        setObjectInside(img);
                        canvas.setActiveObject(img);
                        canvas.renderAll(); 
                        saveState();  // call this function for save object in undo redo
                        $('.customiseLoader').css("display","none");
                    }, 200)
                });
              },
              error: function (jqXhr, textStatus, errorMessage) {
                // console.log("Error => ",errorMessage);
                $('.customiseLoader').css("display","none");
              }

        }) 

        // default settings value when added new text
        $('.selected_font_name').text('Abel');
        $('.selected_font_name').css('font-family', 'Abel');
        // $('.selected_color_name').text('Black');
        $('.selected_color>.color_box').css('background-color', '#000000');
        $('.selected_color>.color_name').text('Black');
        $(".color_box>input[name='text_color_input'][data-color-name='Black']").prop("checked",true);

        $('.txt_shape_container').removeClass('active_shape');
        $('.txt_shape_container.normal_text').addClass('active_shape');
        $('.selected_shape_name').text('None');
        $('.selected_shape_name').attr('shape-type','none');

        $('.selected_outline_color>.color_box').css('background-color', '#00000000');
        $('.selected_outline_color>.color_box').attr("color-name","none");
        $('.selected_outline_color>.color_name').text('None');

        window.clickPipsSlider.noUiSlider.set(2);
        // $('.selected_outline_name').text('None');

        // $('#rotatTextRangeSlide').val(0);
        window.textRotationSlider.noUiSlider.set(0);
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
    // console.log("value is => ", text_val);

    let selectedObject = canvas.getActiveObject(); 
    var canvas_space_width = 0;
    // if(parseInt(selectedObject.outline_width) > 5 && selectedObject.outline_color_name !== "none"){
    //     canvas_space_width = 15;
    // }else if(parseInt(selectedObject.outline_width) > 1 && selectedObject.outline_color_name !== "none"){
    //     canvas_space_width = 10;
    // }else{
    //     canvas_space_width = 0;
    // }

        if(text_val == ''){
            text_val = 'No Text';
            // var text_static_val = 'No Text';
            //     var noTextData = $.measureText(text_static_val, {fontFamily: selectedObject.fontFamily, fontSize:selectedObject.fontSize});
            //     // console.log('text width : ', noTextData.width , " | canvas width : ", CANVAS_WIDTH, " | font size : ", selectedObject.fontSize);
               
        }
        var font_size = parseFloat(selectedObject.text_font_size);

        // if(selectedObject.text_effect == 'curve'){

            $.ajax({
              url: API_URL+"/textGenerate.php?text="+text_val+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+selectedObject.text_font_size+"&canvas_width="+parseFloat(CANVAS_WIDTH-minX).toFixed(2)+"&fontName="+selectedObject.text_font_family+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width,
              xhrFields: {
                responseType: 'blob'
              },
              beforeSend: function() {
                $('.customiseLoader').css("display","flex");
              },
              success: function (img, status, xhr) {
                // console.log("XHR header response Width=> ", xhr.getResponseHeader('x-img-width'));
                // console.log("XHR header response => Height", xhr.getResponseHeader('x-img-height'));
                $('#textFontSize').val(parseFloat(xhr.getResponseHeader('x-font-size')).toFixed(1));
                selectedObject.set({
                    scaleToWidth:xhr.getResponseHeader('x-img-width'),
                    scaleToHeight:xhr.getResponseHeader('x-img-height'),
                    scaleX: 1,
                    scaleY:1,
                    "text_font_size": xhr.getResponseHeader('x-font-size'),
                    "text": text_val
                })
                selectedObject.setSrc(URL.createObjectURL(img));
                        
                setTimeout(function(){
                    // fitToObject(selectedObject)
                    setObjectInside(selectedObject);
                    canvas.renderAll(); 
                    saveState()  // call this function for save object in undo redo
                    $('.customiseLoader').css("display","none");
                }, 200)
              },
              error: function (jqXhr, textStatus, errorMessage) {
                // console.log("Error => ",errorMessage);
                $('.customiseLoader').css("display","none");
              }
            }) 

        // }else{

        // var tempData = $.measureText(text_val, {fontFamily: selectedObject.text_font_family, fontSize:selectedObject.text_font_size});

        // // selectedObject.set('text', text_val);  
        
        // // console.log('text width : ', tempData.width , " | canvas width : ", CANVAS_WIDTH-minX-canvas_space_width, " | font size : ", font_size);

        // if(tempData.width > (CANVAS_WIDTH-minX-canvas_space_width)){
        //     // console.log("Width is greater than canvas width1")
        //     var text_width = tempData.width;
        //     while (text_width > (CANVAS_WIDTH-minX-canvas_space_width)){
                
        //       font_size = font_size-0.1;
        //       var updateData = $.measureText(text_val, {fontFamily: selectedObject.fontFamily, fontSize:font_size});
        //       text_width = updateData.width;
        //     }
        // }


        //     $.ajax({
        //       url: API_URL+"/textGenerate.php?text="+text_val+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+font_size+"&fontName="+selectedObject.text_font_family+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width,
        //       xhrFields: {
        //         responseType: 'blob'
        //       },
        //       beforeSend: function() {
        //         $('.customiseLoader').css("display","flex");
        //       },
        //       success: function (img, status, xhr) {
        //         $('#textFontSize').val(parseFloat(font_size).toFixed(1));

        //         selectedObject.set({
        //             scaleToWidth:xhr.getResponseHeader('x-img-width'),
        //             scaleToHeight:xhr.getResponseHeader('x-img-height'),
        //             scaleX: 1,
        //             scaleY:1,
        //             "text_font_size": parseFloat(font_size),
        //             "text": text_val
        //         })
        //         selectedObject.setSrc(URL.createObjectURL(img));                
                        
        //         setTimeout(function(){
        //             setObjectInside(selectedObject);
        //             canvas.renderAll(); 
        //             $('.customiseLoader').css("display","none");
        //         }, 200)
        //       },
        //       error: function (jqXhr, textStatus, errorMessage) {
        //         // console.log("Error => ",errorMessage);
        //         $('.customiseLoader').css("display","none");
        //       }
        //     })         
        // }
      
    setObjectInside(selectedObject);
    canvas.renderAll(); 
    var font_text = truncateString(text_val, 10);
    $('ul#allFonts>li>span.active_text').text(font_text);
})

// text font family js
const changeTextFont = async(font) => {
    var selectedObject = canvas.getActiveObject();

    // if(selectedObject.text_effect == 'curve'){

            $.ajax({
              url: API_URL+"/textGenerate.php?text="+selectedObject.text+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+selectedObject.text_font_size+"&canvas_width="+parseFloat(CANVAS_WIDTH-minX).toFixed(2)+"&fontName="+font+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width,
              xhrFields: {
                responseType: 'blob'
              },
              beforeSend: function() {
                $('.customiseLoader').css("display","flex");
              },
              success: function (img, status, xhr) {
                // console.log("XHR header response Width=> ", xhr.getResponseHeader('x-img-width'));
                // console.log("XHR header response => Height", xhr.getResponseHeader('x-img-height'));
                $('#textFontSize').val(parseFloat(xhr.getResponseHeader('x-font-size')).toFixed(1));
                selectedObject.set({
                    scaleToWidth:xhr.getResponseHeader('x-img-width'),
                    scaleToHeight:xhr.getResponseHeader('x-img-height'),
                    scaleX: 1,
                    scaleY:1,
                    "text_font_size": xhr.getResponseHeader('x-font-size'),
                    "text_font_family": font
                })
                selectedObject.setSrc(URL.createObjectURL(img));
                        
                setTimeout(function(){
                    // fitToObject(selectedObject)
                    $('.selected_font_name').text(font);
                    $('.selected_font_name').css('font-family',font);
                    setObjectInside(selectedObject);
                    canvas.renderAll(); 
                    saveState()  // call this function for save object in undo redo
                    $('.customiseLoader').css("display","none");
                }, 200)
              },
              error: function (jqXhr, textStatus, errorMessage) {
                // console.log("Error => ",errorMessage);
                $('.customiseLoader').css("display","none");
              }
            }) 

//         }else{

//     $.ajax({
//       url: API_URL+"/textGenerate.php?text="+selectedObject.text+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+selectedObject.text_font_size+"&fontName="+font+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width,
//       xhrFields: {
//         responseType: 'blob'
//       },
//       beforeSend: function() {
//         $('.customiseLoader').css("display","flex");
//       },
//       success: function (img, status, xhr) {
//         selectedObject.set({
//             scaleToWidth:xhr.getResponseHeader('x-img-width'),
//             scaleToHeight:xhr.getResponseHeader('x-img-height'),
//             scaleX: 1,
//             scaleY:1,
//             "text_font_size": selectedObject.text_font_size,
//             "text": selectedObject.text
//         })
//         selectedObject.setSrc(URL.createObjectURL(img));
//         // $('.customiseLoader').css("display","none");            
//         setTimeout(function(){
//             fitToObject(selectedObject);
//             // setObjectInside(selectedObject);
//             // canvas.renderAll(); 
            
//         }, 200)
//       },
//       error: function (jqXhr, textStatus, errorMessage) {
//         // console.log("Error => ",errorMessage);
//         $('.customiseLoader').css("display","none");
//       }
//     })
// }
    selectedObject.set("text_font_family", font)
     $('.selected_font_name').text(font);    
     $('.selected_font_name').css('font-family',font);
     setObjectInside(selectedObject);
     canvas.renderAll();

}


// text color js
function changeTextColor(color, name){
    var selectedObject = canvas.getActiveObject();
    $.ajax({
      url: API_URL+"/textGenerate.php?text="+selectedObject.text+"&effect="+selectedObject.text_effect+"&font_color="+color.replace("#","")+"&font_size="+selectedObject.text_font_size+"&fontName="+selectedObject.text_font_family+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width,
      xhrFields: {
        responseType: 'blob'
      },
      beforeSend: function() {
        $('.customiseLoader').css("display","flex");
      },
      success: function (img) {
        selectedObject.set({"text_color": color, "text_color_name": name});
        // $('.selected_color_name').text(name);
        selectedObject.setSrc(URL.createObjectURL(img));
                
        setTimeout(function(){
            setObjectInside(selectedObject);
            canvas.renderAll(); 
            saveState()  // call this function for save object in undo redo
            $('.customiseLoader').css("display","none");
        }, 200)
      },
      error: function (jqXhr, textStatus, errorMessage) {
        // console.log("Error => ",errorMessage);
        $('.customiseLoader').css("display","none");
      }
    })

    canvas.renderAll(); 
}

// text Rotation js
function changeRangeValue(val){
    var angleValue = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);

    if(angleValue>181){
        angleValue = 180;
    }else if(angleValue<-181){
        angleValue = -180;
    }
    // document.getElementById("rotatTextRangeSlide").value = angleValue;
     window.textRotationSlider.noUiSlider.set(angleValue);
    document.getElementById("rotatTextNumber").value = angleValue
    var selectedObject = canvas.getActiveObject();
    // selectedObject.set('angle', parseFloat(val));
    selectedObject.rotate(parseFloat(angleValue));
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
    var thickness_val =  window.clickPipsSlider.noUiSlider.get();
    var selectedObject = canvas.getActiveObject();

    // if(selectedObject.text_effect == 'curve'){
        if(selectedObject != undefined){
            $.ajax({
              url: API_URL+"/textGenerate.php?text="+selectedObject.text+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+parseFloat(selectedObject.text_font_size)+"&canvas_width="+parseFloat(CANVAS_WIDTH-minX).toFixed(2)+"&fontName="+selectedObject.text_font_family+"&outline_color="+color.replace("#","")+"&outline_width="+thickness_val,
              xhrFields: {
                responseType: 'blob'
              },
              beforeSend: function() {
                $('.customiseLoader').css("display","flex");
              },
              success: function (img, status, xhr) {
                // console.log("XHR header response Width=> ", xhr.getResponseHeader('x-img-width'));
                // console.log("XHR header response => Height", xhr.getResponseHeader('x-img-height'));
                 // $('.selected_outline_name').text(name);
                

                selectedObject.set({
                    scaleToWidth:xhr.getResponseHeader('x-img-width'),
                    scaleToHeight:xhr.getResponseHeader('x-img-height'),
                    scaleX: 1,
                    scaleY:1,
                    "outline_color":color,
                    "outline_width": thickness_val,
                    "outline_color_name": name
                });
                selectedObject.setSrc(URL.createObjectURL(img));
                        
                setTimeout(function(){
                    // fitToObject(selectedObject)
                    $('#textFontSize').val(parseFloat(xhr.getResponseHeader('x-font-size')).toFixed(1));
                    setObjectInside(selectedObject);
                    canvas.renderAll(); 
                    saveState()  // call this function for save object in undo redo
                    $('.selected_outline_color>.color_box').css('background-color', selectedObject.outline_color);
                $('.selected_outline_color>.color_box').attr("color-name",selectedObject.outline_color_name);
                $('.selected_outline_color>.color_name').text(selectedObject.outline_color_name);
                    $('.customiseLoader').css("display","none");
                }, 200)
              },
              error: function (jqXhr, textStatus, errorMessage) {
                // console.log("Error => ",errorMessage);
                $('.customiseLoader').css("display","none");
              }
            }) 
          }

//         }else{


//     $.ajax({
//       url: API_URL+"/textGenerate.php?text="+selectedObject.text+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+selectedObject.text_font_size+"&fontName="+selectedObject.text_font_family+"&outline_color="+color.replace("#","")+"&outline_width="+thickness_val,
//       xhrFields: {
//         responseType: 'blob'
//       },
//       beforeSend: function() {
//         $('.customiseLoader').css("display","flex");
//       },
//       success: function (img, status, xhr) {
//         $('.selected_outline_name').text(name);
//         selectedObject.set({
//             scaleToWidth:xhr.getResponseHeader('x-img-width'),
//             scaleToHeight:xhr.getResponseHeader('x-img-height'),
//             scaleX: 1,
//             scaleY:1,
//             "outline_color":color,
//             "outline_width": thickness_val,
//             "outline_color_name": name
//         })
//         selectedObject.setSrc(URL.createObjectURL(img));
//         // $('.customiseLoader').css("display","none");
              
//         setTimeout(function(){
//             fitToObject(selectedObject)
//             // setObjectInside(selectedObject);  
//             // canvas.renderAll(); 
//         }, 200)
//       },
//       error: function (jqXhr, textStatus, errorMessage) {
//         // console.log("Error => ",errorMessage);
//         $('.customiseLoader').css("display","none");
//       }
//     })      
// }

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
      url: API_URL+"/textGenerate.php?text="+selectedObject.text+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+selectedObject.text_font_size+"&fontName="+selectedObject.text_font_family+"&outline_color=00000000&outline_width="+1,
      xhrFields: {
        responseType: 'blob'
      },
      beforeSend: function() {
        $('.customiseLoader').css("display","flex");
      },
      success: function (img, status, xhr) {
        // $('.selected_outline_name').text("none");
      
        window.clickPipsSlider.noUiSlider.set(0);
        $(".color_box>input[name='text_outline_input'][data-color-name='none']").prop("checked", true);
        $('.text_outline_wrapper').css("display","none");
        $('.selected_outline_color>.color_box').css('background-color', '#00000000');
        $('.selected_outline_color>.color_box').attr("color-name",'none');
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
        // console.log("Error => ",errorMessage);
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
    // console.log('type => ', effect)
    var selectedObject = canvas.getActiveObject();
    var selected_shap = $('.selected_shape_name').text();
    // console.log('selected_shap => ', selected_shap)
    
    $.ajax({
      url: API_URL+"/textGenerate.php?text="+selectedObject.text+"&effect="+effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+selectedObject.text_font_size+"&canvas_width="+parseFloat(CANVAS_WIDTH-minX).toFixed(2)+"&fontName="+selectedObject.text_font_family+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width,
      xhrFields: {
        responseType: 'blob'
      },
      beforeSend: function() {
        $('.customiseLoader').css("display","flex");
      },
      success: function (img, status, xhr){
        if(effect == 'normal'){
            $('.selected_shape_name').text('None');
            $('.selected_shape_name').attr('shape-type','none');
        }else{
            $('.selected_shape_name').text(effect);
            $('.selected_shape_name').attr('shape-type',effect);
        }
        $('.txt_shape_container.'+effect+'_text').addClass('active_shape');
        
        selectedObject.setSrc(URL.createObjectURL(img));
               
        setTimeout(function(){

            selectedObject.set({
                "text_effect": effect,
                scaleToWidth:xhr.getResponseHeader('x-img-width'),
                scaleToHeight:xhr.getResponseHeader('x-img-height'),
                scaleX: 1,
                scaleY:1,
            });

            // fitToObject(selectedObject);
            setObjectInside(selectedObject); 
            canvas.renderAll(); 
            saveState()  // call this function for save object in undo redo
            $('.customiseLoader').css("display","none");
        }, 200)
      },
      error: function (jqXhr, textStatus, errorMessage) {
        // console.log("Error => ",errorMessage);
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
    // // console.log("MY DATA START--------");
    // // console.log(selectedObject.text)
    // // console.log(selectedObject.fontFamily)
    // // console.log(value)
    // // console.log(newData)
    // // console.log("MY DATA END--------");
    // return true;
    if(value < 5){
        value = 5; 
    }

    // if(selectedObject.text_effect == 'curve'){

            $.ajax({
              url: API_URL+"/textGenerate.php?text="+selectedObject.text+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+parseFloat(value)+"&canvas_width="+parseFloat(CANVAS_WIDTH-minX).toFixed(2)+"&fontName="+selectedObject.text_font_family+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width,
              xhrFields: {
                responseType: 'blob'
              },
              beforeSend: function() {
                $('.customiseLoader').css("display","flex");
              },
              success: function (img, status, xhr) {
                // console.log("XHR header response Width=> ", xhr.getResponseHeader('x-img-width'));
                // console.log("XHR header response => Height", xhr.getResponseHeader('x-img-height'));
                $('#textFontSize').val(parseFloat(xhr.getResponseHeader('x-font-size')).toFixed(1));
                selectedObject.set({
                    scaleToWidth:xhr.getResponseHeader('x-img-width'),
                    scaleToHeight:xhr.getResponseHeader('x-img-height'),
                    scaleX: 1,
                    scaleY:1,
                    "text_font_size": xhr.getResponseHeader('x-font-size')
                })
                selectedObject.setSrc(URL.createObjectURL(img));
                        
                setTimeout(function(){
                    // fitToObject(selectedObject)
                    $('#textFontSize').val(parseFloat(xhr.getResponseHeader('x-font-size')).toFixed(1));
                    setObjectInside(selectedObject);
                    canvas.renderAll(); 
                    saveState()  // call this function for save object in undo redo
                    $('.customiseLoader').css("display","none");
                }, 200)
              },
              error: function (jqXhr, textStatus, errorMessage) {
                // console.log("Error => ",errorMessage);
                $('.customiseLoader').css("display","none");
              }
            }) 

    //     }else{

    //     $.ajax({
    //       url: API_URL+"/textGenerate.php?text="+selectedObject.text+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+value+"&fontName="+selectedObject.text_font_family+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width,
    //       xhrFields: {
    //         responseType: 'blob'
    //       },
    //       beforeSend: function() {
    //         $('.customiseLoader').css("display","flex");
    //       },
    //       success: function (img, status, xhr) {
    //         $('#textFontSize').val(parseFloat(value).toFixed(1));
    //         selectedObject.set({
    //             scaleToWidth:xhr.getResponseHeader('x-img-width'),
    //             scaleToHeight:xhr.getResponseHeader('x-img-height'),
    //             scaleX: 1,
    //             scaleY:1,
    //             "text_font_size": value,
    //         })
    //         selectedObject.setSrc(URL.createObjectURL(img));
            
                    
    //         setTimeout(function(){
    //             fitToObject(selectedObject)
    //             // setObjectInside(selectedObject);
    //             // canvas.renderAll(); 
    //             // $('.customiseLoader').css("display","none");
    //         }, 200)
    //       },
    //       error: function (jqXhr, textStatus, errorMessage) {
    //         // console.log("Error => ",errorMessage);
    //         $('.customiseLoader').css("display","none");
    //       }
    //     })   
    // }
    
    

    setObjectInside(selectedObject);
    canvas.renderAll();
}

// text horizontal center
// function centerTextObject(){
//     var selectedObject = canvas.getActiveObject();
//     // selectedObject.centerV();
//     selectedObject.centerH();
// }




var globalPropsToSet = {}, activeSelectedObjs = [];
function Cut() {
    // clone what are you copying since you
    // may want copy and paste on different moment.
    // and you do not want the changes happened
    // later to reflect on the copy.
    Copy();
    setTimeout(function name(params) {
        Delete();
    },200)
}
function Delete() {
    // canvas.remove(canvas.getActiveObject())

    var selectedObjects = canvas.getActiveObjects();

    if (selectedObjects && selectedObjects.length > 0) {
      selectedObjects.forEach(function(object) {
          canvas.remove(object);
      });
    }
    canvas.discardActiveObject();
    canvas.renderAll();

}



/* COPY PASTE FUNCTION FOR SINGLE OBJECT START */

function Copy() {
  globalPropsToSet = {}, activeSelectedObjs = [];
  if(canvas.getActiveObjects().length > 0){
  var activeObjects = canvas.getActiveObjects();
  canvas.getActiveObject().clone(function(cloned) {
    var clonedNewProps = {}
    canvas.getActiveObjects().forEach(function (object) {
      clonedNewProps = {}
      var customProperties = Object.getOwnPropertyNames(object);
      var myCustomProperties = [];
      myCustomProperties = customProperties.filter(function(prop) {
        return !fabric.Object.prototype.hasOwnProperty(prop);
      });
      forDeletion = ["canvas","_element","_originalElement","_cacheCanvas","_cacheContext"];
      myCustomProperties = myCustomProperties.filter(item => !forDeletion.includes(item));
      myCustomProperties.push("scaleToHeight");
      myCustomProperties.push("scaleToWidth");
      for(var v=0;v<myCustomProperties.length;v++){
        clonedNewProps[myCustomProperties[v]] = object[myCustomProperties[v]];
      }
      var clonedObj = fabric.util.object.clone(object);

      activeSelectedObjs.push({"el":object, "props":clonedNewProps})
    });
    if(activeObjects.length==1){
      // console.log("ok")
      globalPropsToSet = clonedNewProps;
    }
    _clipboard = cloned;
  }); 
 }
}
document.addEventListener("keydown", function(e) {
    var keyCode = e.keyCode;
    if((event.ctrlKey || event.metaKey) && keyCode == 67 && canvas.getActiveObjects().length>0){
      Copy();
    }
    else if((event.ctrlKey || event.metaKey) && keyCode == 86){
      Paste();
    }
    else if((event.ctrlKey || event.metaKey) && keyCode == 88 && canvas.getActiveObjects().length>0){
      Cut();
    }
}, false);


function Paste() {
try{

  if(_clipboard){
    _clipboard.clone(function(clonedObj) {
      canvas.discardActiveObject();
      
      if (clonedObj.type === 'activeSelection') {
        // console.log("ok")
        clonedObj.canvas = canvas;
        clonedObj.forEachObject(function(obj, index) {
          // console.log("loop object")
          // console.log(obj)
          // console.log("our object")
          // console.log(activeSelectedObjs[index]["el"])
          // console.log(index)
          globalPropsToSet = activeSelectedObjs[index]["props"];
          globalPropsToSet["left"] = obj.left + 10
          globalPropsToSet["top"] = obj.top + 10
          globalPropsToSet["evented"] = true
          // console.log(globalPropsToSet)
          obj.set(globalPropsToSet);

          // console.log("ok")
          canvas.add(obj);
        });
        clonedObj.setCoords();
      } else {

         globalPropsToSet["left"] = clonedObj.left + 10
         globalPropsToSet["top"] = clonedObj.top + 10
          // globalPropsToSet["evented"] = true
          clonedObj.set(globalPropsToSet);
        canvas.add(clonedObj);
      }
      _clipboard.top += 10;
      _clipboard.left += 10;
      canvas.setActiveObject(clonedObj);
      setObjectInside(clonedObj);
      canvas.requestRenderAll();
      var mouseEvent = new MouseEvent('mousedown', {
        clientX: 100, // X coordinate of the mouse
        clientY: 100, // Y coordinate of the mouse
        button: 1, // 0 for the left mouse button, 1 for the middle mouse button, 2 for the right mouse button
      });
      canvas.upperCanvasEl.dispatchEvent(mouseEvent);
      canvas.upperCanvasEl.dispatchEvent(mouseEvent);
      canvas.upperCanvasEl.dispatchEvent(mouseEvent);
      canvas.upperCanvasEl.dispatchEvent(mouseEvent);
      canvas.upperCanvasEl.dispatchEvent(mouseEvent);
      canvas.upperCanvasEl.dispatchEvent(mouseEvent);
      var objects = canvas.getObjects();
      if (objects.length > 0) {
        canvas.setActiveObject(objects[objects.length-1]);
      }
    });
  }else{
    console.log(" => clipboard is not available!")
  }
}catch{
  
}

// for(var v=0;v<activeSelectedObjs.length;v++){
//   // canvas.discardActiveObject();
//   // cloned = activeSelectedObjs[v]["el"];

//   var clonedObj = fabric.util.object.clone(activeSelectedObjs[v]["el"]);




//   globalPropsToSet = activeSelectedObjs[v]["props"];
//   globalPropsToSet["left"] = clonedObj.left + 10
//       globalPropsToSet["top"] = clonedObj.top + 10
//       // globalPropsToSet["evented"] = true
//       clonedObj.set(globalPropsToSet);
//       // if (clonedObj.type === 'activeSelection') {
//       //   clonedObj.canvas = canvas;
//       //   clonedObj.forEachObject(function(obj) {
//       //     canvas.add(obj);
//       //   });
//       //   clonedObj.setCoords();
//       // } else {
//       console.log(clonedObj)
//         canvas.add(clonedObj);
//       // }
//         // canvas.setActiveObject(clonedObj);
//         // setObjectInside(clonedObj);

//         canvas.requestRenderAll();
//       }
//       canvas.requestRenderAll();
//       canvas.renderAll();
}
/* COPY PASTE FUNCTION FOR SINGLE OBJECT END */


//   var activeObjects = canvas.getActiveObjects(); // Use getActiveObjects() instead of getActiveObject()
//   var clonedObjects = []; // Array to store cloned objects

// function Copy() {

//   activeObjects.forEach(function (object) {
//     object.clone(function (cloned) {
//       var clonedNewProps = {};
//       var customProperties = Object.getOwnPropertyNames(object);
//       var myCustomProperties = customProperties.filter(function (prop) {
//         return !fabric.Object.prototype.hasOwnProperty(prop);
//       });
//       for (var v = 0; v < myCustomProperties.length; v++) {
//         clonedNewProps[myCustomProperties[v]] = object[myCustomProperties[v]];
//       }
//       var forDeletion = ["canvas", "_element", "_originalElement", "_cacheCanvas", "_cacheContext"];
//       myCustomProperties = myCustomProperties.filter(function (item) {
//         return !forDeletion.includes(item);
//       });
//       myCustomProperties.push("scaleToHeight");
//       myCustomProperties.push("scaleToWidth");

//       cloned.set(clonedNewProps); // Set custom properties for the cloned object
//       clonedObjects.push(cloned); // Add cloned object to the array
//     });
//   });

//   globalPropsToSet = clonedObjects; // Assign the array of cloned objects to globalPropsToSet
// }

// function Paste() {
//   if (globalPropsToSet.length > 0) { // Check if there are objects to paste
//     var clonedObjects = [];

//     globalPropsToSet.forEach(function (clonedObj) {
//       clonedObj.clone(function (cloned) {
//         cloned.set({
//           left: clonedObj.left + 10,
//           top: clonedObj.top + 10,
//           evented: true
//         });

//         clonedObjects.push(cloned); // Add cloned object to the array
//       });
//     });

//     canvas.discardActiveObject();
//     if (clonedObjects.length > 1) { // Check if there are multiple objects to paste
//       var group = new fabric.Group(clonedObjects); // Create a group with the cloned objects
//       canvas.add(group);
//       canvas.setActiveObject(group);
//       setObjectInside(group);
//       group.setCoords();
//     } else {
//       canvas.add(clonedObjects[0]); // Add the single cloned object
//       canvas.setActiveObject(clonedObjects[0]);
//       setObjectInside(clonedObjects[0]);
//     }

//     clonedObjects.forEach(function (obj) {
//       obj.top += 10;
//       obj.left += 10;
//     });

//     canvas.requestRenderAll();
//   } else {
//     console.log("Clipboard is not available!");
//   }
// }






function updateTshirtImage(imageURL){
    fabric.Image.fromURL(imageURL, function(img) {                   
        img.scaleToHeight(80);
        img.scaleToWidth(80); 
        img.set({
            "object_type":'art',
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

        // console.log(" before : width => ", img.width ," | height => ", img.height );
        var newWidth = (img.width * img.scaleX);
        var newHeight = (img.height * img.scaleY);
        $("#artWidth").val(parseFloat(newWidth).toFixed(2));
        $("#artHeight").val(parseFloat(newHeight).toFixed(2));
        // document.getElementById("rotatArtRangeSlide").value = 0;
        // window.artRotationSlider.noUiSlider.set(0);
        document.getElementById("rotatArtNumber").value = 0;
        img.set({
            // width: newWidth,
            // height: newHeight,
            // scaleX:1,
            // scaleY:1,
            scaleToWidth:newWidth,
            scaleToHeight:newHeight
        });
        // console.log("After Image width :", newWidth , " | height : ", newHeight);
        canvas.setActiveObject(img);
        canvas.renderAll();
        saveState()  // call this function for save object in undo redo
    });
}

function addArtDesign(path) {
    if(edit_art == true){
       // console.log("Update Art !")
       let selectedObject = canvas.getActiveObject();
        
       selectedObject.setSrc(path);

       $('#addArtTab').css("display","none");
       $('#editArtTab').css("display","block");
       setTimeout(function(){

        var newWidth = (selectedObject.width * selectedObject.scaleX);
        var newHeight = (selectedObject.height * selectedObject.scaleY);
        selectedObject.set({
            scaleToWidth:newWidth,
            scaleToHeight:newHeight
        });

        setObjectInside(selectedObject);
        canvas.setActiveObject(selectedObject);
        canvas.renderAll();
        saveState()  // call this function for save object in undo redo
        $("#artWidth").val(parseFloat(newWidth).toFixed(2));
        $("#artHeight").val(parseFloat(newHeight).toFixed(2));
       }, 200);
       edit_art = false;
       
    }else{
       updateTshirtImage(path);
       $('#addArtTab').css("display","none");
       $('#editArtTab').css("display","block");        
    }
}


// function for update image size when chnage input value
function _scaleToDimensions(object, height, width, absolute){ 
  var boundingRectFactorY = object.getBoundingRect(absolute, true).width / object.getScaledWidth();
  var boundingRectFactorX = object.getBoundingRect(absolute, true).height / object.getScaledHeight();
  object._set('scaleY', height / object.height / boundingRectFactorX);
  object._set('scaleX', width / object.width / boundingRectFactorY);
  object.setCoords();
  canvas.renderAll();
  return true;
}

function changeArtSize(value, dimension){
    // console.log("value is => ", value, " | value type => ", dimension);
    const activeObject = canvas.getActiveObject();
      if (activeObject) {
        // console.log("canvas width => ", CANVAS_WIDTH-minX)

        let newHeight, newWidth;
        if (dimension === "height") {
            if(value > (CANVAS_HEIGHT-minY)){
                value = CANVAS_HEIGHT-minY;
            }
          newHeight = parseFloat(value);
          newWidth = parseFloat(value) * activeObject.width / activeObject.height;
          if(newWidth > (CANVAS_WIDTH-minY)){
                newWidth = CANVAS_WIDTH-minY;
          }
        } else if (dimension === "width") {
            if(value > (CANVAS_WIDTH-minY)){
                value = CANVAS_WIDTH-minY;
            }
          newWidth = parseFloat(value);
          newHeight = parseFloat(value) * activeObject.height / activeObject.width;
          if(newHeight > (CANVAS_HEIGHT-minY)){
                newHeight = CANVAS_HEIGHT-minY;
            }
        } else {
          console.error("Invalid dimension specified. Please specify 'width' or 'height'.");
          return;
        }
         _scaleToDimensions(activeObject, newHeight, newWidth, 1);

        $("#artWidth").val(parseFloat(newWidth).toFixed(2));
        $("#artHeight").val(parseFloat(newHeight).toFixed(2));
        saveState()  // call this function for save object in undo redo
        
      }else{
        console.error("No active object found.");
      }
}


// object center js
function centerObject(){
    var selectedObject = canvas.getActiveObject();
    // console.log(selectedObject);
    // canvas.centerObject(selectedObject);
    if(selectedObject != undefined){
      selectedObject.centerH();
      canvas.renderAll();
      saveState()  // call this function for save object in undo redo
    }
}
// Art flip x js
function flipXArt(){
    var selectedObject = canvas.getActiveObject();
    // console.log("Flip Horizontal");
    selectedObject.toggle('flipX')
    // selectedObject.set('flipX', true);
    selectedObject.setCoords();
    canvas.renderAll();
    saveState()  // call this function for save object in undo redo
    // selectedObject.set('flipX', false);
    // canvas.renderAll();
}
// Art flip y js
function flipYArt(){
    var selectedObject = canvas.getActiveObject();
    // console.log("Flip Verticle");
    // selectedObject.set('flipY', true);
    selectedObject.toggle('flipY')
    selectedObject.setCoords();
    // selectedObject.set('flipY', false);
    canvas.renderAll();
    saveState()  // call this function for save object in undo redo
}


// Art Rotation js
function changeArtRangeValue(val){
    var angleValue = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);

    if(angleValue>181){
        angleValue = 180;
    }else if(angleValue<-181){
        angleValue = -180;
    }
    // document.getElementById("rotatArtRangeSlide").value = angleValue;
    window.artRotationSlider.noUiSlider.set(angleValue);
    document.getElementById("rotatArtNumber").value = angleValue
    var selectedObject = canvas.getActiveObject();
    selectedObject.rotate(parseFloat(angleValue));
    fitToObject(selectedObject);
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
    saveState()  // call this function for save object in undo redo
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

    // console.log("Image data => ", e);
    // console.log("data type : ", e.target.files[0]);

    var fd = new FormData();
    var files = e.target.files[0];
    if(files.size > 5000000){
        $("#uploadFile").val(null);  // set input file field value null
        $('.error_file_modal').css("display","none");
        $('#maxFileSizeError').css("display","block");
        $('#upload_error_modal').css("display","flex");
        return false;
    }

    fd.append('image',files);


    $.ajax({
          url: API_URL+"api/convert-file",
          type: 'post',
          data: fd,
          contentType: false,
          processData: false,
          header: { "Access-Control-Allow-Origin": "*" },
          // xhrFields: {
          //   responseType: 'blob'
          // },
          beforeSend: function() {
            $('.customiseLoader').css("display","flex");
          },
          success: function (response, status) {
            // console.log("Uploaded image successfull : ", response);

            if(response.status == true){
                fabric.Image.fromURL(response.data, function(img) {                   
                    img.scaleToHeight(80);
                    img.scaleToWidth(80); 
                    img.set({
                        "object_type":'image',
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

                    // console.log(" before : width => ", img.width ," | height => ", img.height );
                    var newWidth = (img.width * img.scaleX);
                    var newHeight = (img.height * img.scaleY);
                    $("#imageWidth").val(parseFloat(newWidth).toFixed(2));
                    $("#imageHeight").val(parseFloat(newHeight).toFixed(2));
                    // document.getElementById("rotatImageRangeSlide").value = 0;
                    window.imageRotationSlider.noUiSlider.set(0);
                    document.getElementById("rotatImageNumber").value = 0;
                    img.set({
                        // width: newWidth,
                        // height: newHeight,
                        // scaleX:1,
                        // scaleY:1,
                        scaleToWidth:newWidth,
                        scaleToHeight:newHeight
                    });
                    // console.log(" After Image width : ", newWidth , " | height : ", newHeight);
                    setObjectInside(img);
                    canvas.setActiveObject(img);
                    canvas.renderAll();
                    saveState()  // call this function for save object in undo redo
                    $('#addUploadTab').css("display","none");
                    $('#editUploadTab').css("display","block");
                    $("#uploadFile").val(null);  // set input file field value null
                    $('.customiseLoader').css("display","none");
                });
            }else{
                $("#uploadFile").val(null);  // set input file field value null
                $('.error_file_modal').css("display","none");
                $('#fileNotSupportError').css("display","block");
                $('#upload_error_modal').css("display","flex");
                $('.customiseLoader').css("display","none");
            }
          },
          error: function (jqXhr, textStatus, errorMessage) {
            // console.log("1. Error => ",jqXhr);
            // console.log("2. Error => ",textStatus);
            // console.log("3. Error => ",errorMessage);
            $("#uploadFile").val(null);  // set input file field value null
            $('.error_file_modal').css("display","none");
            $('#fileNotSupportError').css("display","block");
            $('#upload_error_modal').css("display","flex");
            $('.customiseLoader').css("display","none");
          }
        })   
}, false);

// Image Rotation js
function changeImageRangeValue(val){

    var angleValue = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);

    if(angleValue>181){
        angleValue = 180;
    }else if(angleValue<-181){
        angleValue = -180;
    }
    // document.getElementById("rotatImageRangeSlide").value = angleValue;
    window.imageRotationSlider.noUiSlider.set(angleValue);
    document.getElementById("rotatImageNumber").value = angleValue
    var selectedObject = canvas.getActiveObject();
    selectedObject.rotate(parseFloat(angleValue));
    fitToObject(selectedObject);
    canvas.renderAll();
}
function changeImageInputValue(val){
    document.getElementById("rotatImageNumber").value = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
    // showValue1(val);
    var selectedObject = canvas.getActiveObject();
    selectedObject.rotate(parseFloat(val));
    setObjectInside(selectedObject);
    canvas.renderAll();
    saveState()  // call this function for save object in undo redo
}

// change image size from input field
function changeImageSize(value, dimension){
    const activeObject = canvas.getActiveObject();
      if (activeObject) {   
        let newHeight, newWidth;
        if (dimension === "height") {
            if(value > (CANVAS_HEIGHT-minY)){
                value = CANVAS_HEIGHT-minY;
            }
          newHeight = parseFloat(value);
          newWidth = parseFloat(value) * activeObject.width / activeObject.height;
          if(newWidth > (CANVAS_WIDTH-minY)){
                newWidth = CANVAS_WIDTH-minY;
          }
        } else if (dimension === "width") {
            if(value > (CANVAS_WIDTH-minY)){
                value = CANVAS_WIDTH-minY;
            }
          newWidth = parseFloat(value);
          newHeight = parseFloat(value) * activeObject.height / activeObject.width;
          if(newHeight > (CANVAS_HEIGHT-minY)){
                newHeight = CANVAS_HEIGHT-minY;
            }
        } else {
          console.error("Invalid dimension specified. Please specify 'width' or 'height'.");
          return;
        }
         _scaleToDimensions(activeObject, newHeight, newWidth, 1);

        setObjectInside(activeObject);
        $("#imageWidth").val(parseFloat(newWidth).toFixed(2));
        $("#imageHeight").val(parseFloat(newHeight).toFixed(2));
        
      }else{
        console.error("No active object found.");
      }
}



// When the user selects a picture that has been added and press the DEL key
// The object will be removed !
document.addEventListener("keydown", function(e) {
    var keyCode = e.keyCode;
    // console.log("key code => ", keyCode);

    if(keyCode == 46){

      if(document.activeElement.id == 'editTextContent'){

      }else{
        // console.log("Removing selected element on Fabric.js on DELETE key !");
        // canvas.remove(canvas.getActiveObject());
        Delete();
        $('#editTextTab').css("display","none");
        $('#addTextTab').css("display","block");
      }
    }
}, false);





// After loading all content
document.addEventListener("DOMContentLoaded", function () {
    // console.log("Loaded all content!")
   resizeCanvas();
});

// function for clear all object from canvas
function startOver(){
    canvas.clear()
}

// function for close custom modal
function closeCustomModal(){
    $('.custom_modal').css("display","none");
}

var SCALE_FACTOR = 1.6;
var zoomMax = 23;
var canvasScale = 1;

// Zoom In
function zoomIn() {
  zoomOption = true;
    if(canvas.getZoom().toFixed(5) > zoomMax){
        // console.log("zoomIn: Error: cannot zoom-in anymore");
        return;
    }
    

    var zoomInWidth = canvas.getWidth() * SCALE_FACTOR;
    var zoomInHeight = canvas.getHeight() * SCALE_FACTOR;

    var width_outer_space = (zoomInWidth*canvas_padding)/100;
    var height_outer_space = (zoomInHeight*canvas_padding)/100;

    var bgWidth = zoomInWidth-width_outer_space;
    var bgHeight = zoomInHeight-height_outer_space;

    bgLeft = width_outer_space / 2;
    bgTop = height_outer_space / 2;

    minX = bgLeft;
    maxX = bgLeft+bgWidth;
    minY = bgTop;
    maxY = bgTop+bgHeight;
    CANVAS_WIDTH = maxX;
    CANVAS_HEIGHT = maxY;

    
    // canvas.setZoom(canvas.getZoom()*SCALE_FACTOR);
    canvas.setHeight(zoomInHeight);
    canvas.setWidth(zoomInWidth);
    canvas.backgroundImage.set({
      left: bgLeft,
      top: bgTop,
      width: bgWidth,
      height: bgHeight,
      zoomX:1,
      zoomY:1,
      cacheWidth: bgWidth,
      cacheHeight: bgHeight,
    })
    console.log("zoom in bg rect => ", canvas.backgroundImage);

    var objects = canvas.getObjects();
    for (var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;
        
        var tempScaleX = scaleX * SCALE_FACTOR;
        var tempScaleY = scaleY * SCALE_FACTOR;
        var tempLeft = left * SCALE_FACTOR;
        var tempTop = top * SCALE_FACTOR;
        
        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;


        // CANVAS_WIDTH = 800;
        // CANVAS_HEIGHT = 800;
        
        objects[i].setCoords();
    }

    canvas.renderAll();
}

// Zoom Out
function zoomOut() {
  zoomOption = false;
    if( canvas.getZoom().toFixed(5) < 1 ){
        console.log("zoomOut: Error: cannot zoom-out anymore");
        return;
    }

    // canvas.setZoom(canvas.getZoom()/SCALE_FACTOR);
    // canvas.setHeight(canvas.getHeight() / SCALE_FACTOR);
    // canvas.setWidth(canvas.getWidth() / SCALE_FACTOR);

    var zoomOutWidth = canvas.getWidth() / SCALE_FACTOR;
    var zoomOutHeight = canvas.getHeight() / SCALE_FACTOR;

    var width_outer_space = (zoomOutWidth*canvas_padding)/100;
    var height_outer_space = (zoomOutHeight*canvas_padding)/100;

    var bgWidth = zoomOutWidth-width_outer_space;
    var bgHeight = zoomOutHeight-height_outer_space;

    bgLeft = width_outer_space / 2;
    bgTop = height_outer_space / 2;

    minX = bgLeft;
    maxX = bgLeft+bgWidth;
    minY = bgTop;
    maxY = bgTop+bgHeight;
    CANVAS_WIDTH = maxX;
    CANVAS_HEIGHT = maxY;
    
    canvas.setHeight(zoomOutHeight);
    canvas.setWidth(zoomOutWidth);
    canvas.backgroundImage.set({
      left: bgLeft,
      top: bgTop,
      width: bgWidth,
      height: bgHeight,
      zoomX:1,
      zoomY:1,
      cacheWidth: bgWidth,
      cacheHeight: bgHeight,
    })

    console.log("zoom out bg rect => ", canvas.backgroundImage);
    var objects = canvas.getObjects();
    for (var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;
    
        var tempScaleX = scaleX * (1 / SCALE_FACTOR);
        var tempScaleY = scaleY * (1 / SCALE_FACTOR);
        var tempLeft = left * (1 / SCALE_FACTOR);
        var tempTop = top * (1 / SCALE_FACTOR);

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
    }
    canvas.renderAll();
}

// change zoom option status function
function changeZoomStatus(option){
    $('.zoom_icon').css("display","none");
    if(option == 'plus'){
        // $('img#customiserImage').css('object-fit','contain');
        $('img#customiserImage').css('transform','scale(1)');
        zoomOut();
        $('.zoom_plus_option').css("display","block");
    }else{
        // $('img#customiserImage').css('object-fit','cover');
      $('img#customiserImage').css('transform','scale(1.6)');
        zoomIn();
        $('.zoom_minus_option').css("display","block");
    }   
}
