
var API_URL = 'http://staging.whattocookai.com:8080';
var zoomOptionStatus = false;
var zoomScale = 1.5;
var fontScale = 22.25;

var checkZoomModify = false;

if(zoomOptionStatus == true){
  fontScale = fontScale*zoomScale;
}

var canvasLeft, canvasTop, CANVAS_WIDTH, CANVAS_HEIGHT;
var canvas;

async function loadCanvas(){
  const response = await fetch(STORE_API_URL+'api/front-end/get-product/6917052530828?shop_url='+STORE_URL);
  let apiData = await response.json();
  if(apiData.status == true){
        let product_data = apiData.data;
        console.log("product data => ", product_data[0].product_map);
        let product_map = product_data[0].product_map;
        console.log("product map length => ", product_map.length);
        if(product_map.length > 0){
          for(var a=0;a<product_map.length;a++){
            var look_name_handle = product_map[a].look_name.toLowerCase();
            look_name_handle = look_name_handle.replaceAll(" ", "_");

            const canvas_name = look_name_handle+"_canvas";
            const canvas_width = look_name_handle+"_canvas_width";
            const canvas_height = look_name_handle+"_canvas_height";
            const canvas_left = look_name_handle+"_canvas_left";
            const canvas_top = look_name_handle+"_canvas_top";
            product_map[a].crop = JSON.parse(product_map[a].crop);
            let image_width = product_map[a].crop.image_width;
            let image_height = product_map[a].crop.image_height;
            let temp_width = product_map[a].crop.width;
            let temp_height = product_map[a].crop.height;
            let temp_left = product_map[a].crop.x;
            let temp_top = product_map[a].crop.y;

            // width_percentage = (temp_width*100)/image_width;
            // height_percentage = (temp_height*100)/image_height;
            // left_percentage = (temp_left*100)/image_width;
            // top_percentage = (temp_top*100)/image_height;

            window[canvas_width] = temp_width;
            window[canvas_height] = temp_height;
            window[canvas_left] = temp_left;
            window[canvas_top] = temp_top;

            // create canvas div 
            let canvas_html = `<div class="canvas-container custom_canvas" id="`+look_name_handle+`CanvasWrap">
                                        <canvas id="`+look_name_handle+`-canvas" width="`+image_width+`" height="`+image_height+`"></canvas>
                                    </div>`;
            // append canvas div to html page
            $("#drawingArea").append(canvas_html);

            // create canvas view type option
            let canvas_view_html = `<div class="view_style `+look_name_handle+`_option">
                                    <input type="radio" name="canvas_view_type" view_type="`+look_name_handle+`" onchange="changeCanvasType('`+look_name_handle+`')" class="canvas_view_input" />
                                    <div class="canvas_type_box">
                                        <img loading="lazy" src="`+product_map[a].image+`" />
                                        <span>`+product_map[a].look_name+`</span>
                                    </div>
                                </div>`;
            // append view type option in wrapper                   
            $(".canvas_view_options").append(canvas_view_html);


            window[canvas_name] = new fabric.Canvas(look_name_handle+'-canvas', {
                fireRightClick: true,
                stopContextMenu: true,
                controlsAboveOverlay: true,
            });

            if(a == 0){
              $("#customiserImage").attr('src', product_map[a].image);
              $('.canvas_view_input[view_type="'+look_name_handle+'"]').prop("checked",true);
              $("#"+look_name_handle+"CanvasWrap").show();
              canvas = window[canvas_name];

              canvasLeft = temp_left;
              canvasTop = temp_top;
              CANVAS_WIDTH = temp_width;
              CANVAS_HEIGHT = temp_height;

            }

            let customiser_width = $("#customiserImage").width();
            let customiser_height = $("#customiserImage").height();
            window[canvas_name].set({width:customiser_width,height:customiser_height})

            // const rectWidth = width_percentage*customiser_width/100;
            // const rectHeight = height_percentage*image_height/100;
            // const rectLeft = left_percentage*customiser_width/100;
            // const rectTop = top_percentage*customiser_height/100;

            console.log(look_name_handle+'-canvas  => width : ', temp_width, ' | height : ', temp_height ,' | Left : ', temp_left, ' | top : ', temp_top)

            let rect = new fabric.Rect({
                  left: temp_left,
                  top: temp_top,
                  width: temp_width,
                  height: temp_height,
                  fill: 'transparent',
                  stroke: '#cacaca',
                  strokeWidth: 1,
                  zoomX:0,
                  zoomY:0,
                  evented:false
              })

            // rect.scaleToWidth(rectWidth);
            // rect.scaleToHeight(rectHeight);


            window[canvas_name].setBackgroundImage(rect);

            window[canvas_name].renderAll();

            // console.log("Percent width => ", width_percentage);
            // console.log("Percent Height => ", height_percentage);
            // console.log("Percent left => ", left_percentage);
            // console.log("Percent top => ", top_percentage);
            // console.log("customiser_width => ", customiser_width);
            // console.log("customiser_height => ", customiser_height);

          }

          fireEvents();
        }

    }
}
loadCanvas();

// $.get(STORE_API_URL+'api/front-end/get-product/6917052530828?shop_url='+STORE_URL,
//    function (response, textStatus, jqXHR) {
//    if(response.status == true){
//         let product_data = response.data;
//         console.log("product data => ", product_data);
//     }

// });

// $.ajax({
//       url: STORE_API_URL+'api/front-end/get-product/6917052530828?shop_url='+STORE_URL,
//       beforeSend: function() {
//          $('.customiseLoader').css("display","flex");
//       },
//       success: function (response, status, xhr){
//       if(response.status == true){
//         let product_data = response.data;
//         console.log("product data => ", product_data);
//       }
//      $('.customiseLoader').css("display","none");
//     },
//     error: function (jqXhr, textStatus, errorMessage){
//       console.log("Error => ",errorMessage);
//       $('.customiseLoader').css("display","none");
//     }
//   })

console.log("after product data");




// var product_map =[{"id":33,"session_id":"offline_prakash-test-1.myshopify.com","product_id":1,"look_name":"Front","image":"http://staging.whattocookai.com/api/uploads/public/uploads/1686893654240-tshirt-white.png","crop":"{\"x\": 132.800048828125, \"y\": 125.40000438690186, \"unit\": \"px\", \"width\": 235.99993896484375, \"height\": 295.19998931884766, \"image_width\": 500, \"image_height\": 586}","created_at":"2023-06-16T05:34:15.000Z","updated_at":"2023-06-16T05:34:15.000Z"},{"id":38,"session_id":"offline_prakash-test-1.myshopify.com","product_id":1,"look_name":"Back","image":"http://staging.whattocookai.com/api/uploads/public/uploads/1687160027786-tshirt-white-back.png","crop":"{\"x\": 144.800048828125, \"y\": 111.00003051757812, \"unit\": \"px\", \"width\": 219.99993896484375, \"height\": 368.8000030517578, \"image_width\": 500, \"image_height\": 586}","created_at":"2023-06-19T07:33:49.000Z","updated_at":"2023-06-19T07:33:49.000Z"},{"id":39,"session_id":"offline_prakash-test-1.myshopify.com","product_id":1,"look_name":"Left","image":"http://staging.whattocookai.com/api/uploads/public/uploads/1687160073536-tshirt-white-left-sleeve.png","crop":"{\"x\": 218.400146484375, \"y\": 135.00001525878906, \"unit\": \"px\", \"width\": 108.79986572265624, \"height\": 183.19998168945312, \"image_width\": 500, \"image_height\": 478}","created_at":"2023-06-19T07:34:34.000Z","updated_at":"2023-06-19T07:34:34.000Z"}]



// canvasLeft = frontbgRect.left;
// maxX = frontbgRect.left+frontbgRect.width;
// canvasTop = frontbgRect.top;
// maxY = frontbgRect.top+frontbgRect.height;
// CANVAS_WIDTH = maxX;
// CANVAS_HEIGHT = maxY;

window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
    var imgWidth = $('#customiserImage').width();
    var imgHeight = $('#customiserImage').height();
    let canvas_view_type = $('.canvas_view_input[name="canvas_view_type"]:checked').attr('view_type');
    
    var canvasWidth = imgWidth;
    var canvasHeight = imgHeight;
    
    // var width_outer_space = (canvasWidth*canvas_padding)/100;
    // var height_outer_space = (canvasHeight*canvas_padding)/100;

    // var bgWidth = canvasWidth-width_outer_space;
    // var bgHeight = canvasHeight-height_outer_space;

    // bgLeft = width_outer_space / 2;
    // bgTop = height_outer_space / 2;

    // canvasLeft = bgLeft;
    // maxX = bgLeft+bgWidth;
    // canvasTop = bgTop;
    // maxY = bgTop+bgHeight;

    // if(canvas_view_type == 'left' || canvas_view_type == 'right'){
    //    CANVAS_WIDTH = 145;
    //   CANVAS_HEIGHT = 183;
    // }else{
    //   CANVAS_WIDTH = 266;
    //   CANVAS_HEIGHT = 366;
    // }

    // canvas.setHeight(canvasHeight);
    // canvas.setWidth(canvasWidth);
    // canvas.backgroundImage.set({
    //     width:CANVAS_WIDTH,
    //     height:CANVAS_HEIGHT,
    //     left:bgLeft,
    //     top:bgTop
    // });
    // setAllObjects();
    // canvas.renderAll();
}


// Change canvas type like :- [front, back, right, left]
function changeCanvasType(type) {


    console.log("View type => ", type);
    console.log("type data => ", window[type+"_canvas"]);

    var variant_val = $('.prd_color_box input[name="product_color"]:checked').attr('data-variant-name');
    var selected_variant_img = $('.product_variant[data-variant="'+variant_val+'"][data-style="'+type+'"]').attr('data-src');
    console.log("variant_val img => ", selected_variant_img)
    if(selected_variant_img == undefined){
      let img_url = $('.'+type+'_option img').attr('src');
      $('#customiserImage').attr('src', img_url);
    }else{
      $('#customiserImage').attr('src', selected_variant_img);  
    }

    
    $('.custom_canvas').css('display','none');
    // $('.drawing-area').css({"top":"45%","left":"50%"});
    let temp_zoom_status = zoomOptionStatus;
    if(zoomOptionStatus == true){
      zoomOut();
    }


    canvas = window[type+"_canvas"];
    canvasLeft = window[type+"_canvas_left"];
    canvasTop = window[type+"_canvas_top"];
    CANVAS_WIDTH = window[type+"_canvas_width"];
    CANVAS_HEIGHT = window[type+"_canvas_height"];
    $('#'+type+'CanvasWrap').css('display','block');

    fireEvents();
    resizeCanvas();

    // if(type == 'back'){
    //     $('#backCanvasWrap').css('display','block');
    //     canvasLeft = backbgRect.left;
    //     maxX = backbgRect.left+backbgRect.width;
    //     canvasTop = backbgRect.top;
    //     maxY = backbgRect.top+backbgRect.height;
    //     CANVAS_WIDTH = maxX;
    //     CANVAS_HEIGHT = maxY;
    //     canvas = back_canvas;
    //     fireEvents();
    //     resizeCanvas();
    // }else if(type == 'right'){
    //     $('#rightCanvasWrap').css('display','block');
    //     canvasLeft = rightbgRect.left;
    //     maxX = rightbgRect.left+rightbgRect.width;
    //     canvasTop = rightbgRect.top;
    //     maxY = rightbgRect.top+rightbgRect.height;
    //     CANVAS_WIDTH = maxX;
    //     CANVAS_HEIGHT = maxY;
    //     canvas = right_canvas;
    //     fireEvents(); 
    //     resizeCanvas();
    // }else if(type =='left'){
    //     $('#leftCanvasWrap').css('display','block');
    //     canvasLeft = leftbgRect.left;
    //     maxX = leftbgRect.left+leftbgRect.width;
    //     canvasTop = leftbgRect.top;
    //     maxY = leftbgRect.top+leftbgRect.height;
    //     CANVAS_WIDTH = maxX;
    //     CANVAS_HEIGHT = maxY;
    //     canvas = left_canvas;
    //     fireEvents();
    //     resizeCanvas();
    // }else{
    //     $('#frontCanvasWrap').css('display','block');
    //     canvasLeft = frontbgRect.left;
    //     maxX = frontbgRect.left+frontbgRect.width;
    //     canvasTop = frontbgRect.top;
    //     maxY = frontbgRect.top+frontbgRect.height;
    //     CANVAS_WIDTH = maxX;
    //     CANVAS_HEIGHT = maxY;
    //     canvas = front_canvas;
    //     fireEvents();
    //     resizeCanvas();
    // }
    ChooseSettingtab('', 'defaultSettings');
    canvas.discardActiveObject();
    if(temp_zoom_status == true){
      zoomIn();
    }
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

      saveStack.push(state);
      state = playStack.pop();
      var on = $(buttonsOn);
      var off = $(buttonsOff);
      // turn both buttons off for the moment to prevent rapid clicking
      on.prop('disabled', true);
      off.prop('disabled', true);
      canvas.clear();
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
    }
    // undo and redo buttons
    $('#undo').click(function() {
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
    if(objArr[a].getBoundingRect().top < canvasTop || objArr[a].getBoundingRect().left < canvasLeft){
        objArr[a].top = Math.max(objArr[a].top, objArr[a].top-objArr[a].getBoundingRect().top+canvasTop);
        objArr[a].left = Math.max(objArr[a].left, objArr[a].left-objArr[a].getBoundingRect().left+canvasLeft);
        if(objArr[a].top < canvasTop){
            objArr[a].top = canvasTop;
        }
        if(objArr[a].left < canvasLeft){
            objArr[a].left = canvasLeft;
        }
    }
    if(objArr[a].getBoundingRect().top+objArr[a].getBoundingRect().height  > CANVAS_HEIGHT || objArr[a].getBoundingRect().left+objArr[a].getBoundingRect().width  > CANVAS_WIDTH){
        objArr[a].top = Math.min(objArr[a].top, CANVAS_HEIGHT-objArr[a].getBoundingRect().height+objArr[a].top-objArr[a].getBoundingRect().top);
        objArr[a].left = Math.min(objArr[a].left, CANVAS_WIDTH-objArr[a].getBoundingRect().width+objArr[a].left-objArr[a].getBoundingRect().left);
    }
  }
}


// function for text resize when object width is greater than canvas
function fitToObject(event) {
   var obj = event;
    if(obj.object_type == 'text'){
        var canvas_space_width = 0;
        if(parseFloat(obj.scaleToWidth) > parseFloat(CANVAS_WIDTH)){
            var font_size = obj.text_font_size;
            var text_val = obj.text;
            var font_family = obj.text_font_family;
            let newFontVal = calFontSize(null, parseFloat(value));
            $.ajax({
              url: API_URL+"/textGenerate.php?text="+encodeURIComponent(obj.text)+"&effect="+obj.text_effect+"&font_color="+obj.text_color.replace("#","")+"&font_size="+newFontVal+"&font_width="+parseFloat(obj.scaleToWidth).toFixed(2)+","+parseFloat(newWidth).toFixed(2)+"&font_height="+parseFloat(obj.scaleToHeight).toFixed(2)+","+parseFloat(newHeight).toFixed(2)+"&canvas_width="+parseFloat(CANVAS_WIDTH).toFixed(2)+"&canvas_height="+parseFloat(CANVAS_HEIGHT).toFixed(2)+"&fontName="+obj.text_font_family+"&outline_color="+obj.outline_color.replace("#","")+"&outline_width="+obj.outline_width+"&rotate_angle="+selectedObject.rotate_angle,
              xhrFields: {
                responseType: 'blob'
              },
              beforeSend: function() {
                $('.customiseLoader').css("display","flex");
              },
              success: function (img, status, xhr) {
                let txt_font_size = calFontSize(xhr.getResponseHeader('x-font-size'), null);
                $('#textFontSize').val(txt_font_size);
                obj.set({
                    scaleToWidth:xhr.getResponseHeader('x-img-width'),
                    scaleToHeight:xhr.getResponseHeader('x-img-height'),
                    scaleX: 1,
                    scaleY:1,
                    "text_font_size": txt_font_size,
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
}

// function for object can not go outside of canvas mark
function setObjectInside(e) {
    var obj = e;
    if(obj.height > CANVAS_HEIGHT || obj.width > CANVAS_WIDTH){
        return;
    }       
    obj.setCoords(); 
    if(obj.getBoundingRect().top < canvasTop || obj.getBoundingRect().left < canvasLeft){
        obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top+canvasTop);
        obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left+canvasLeft);
        if(obj.top < canvasTop){
            obj.top = canvasTop;
        }
        if(obj.left < canvasLeft){
            obj.left = canvasLeft;
        }
    }
    if(obj.getBoundingRect().top+obj.getBoundingRect().height > CANVAS_HEIGHT+canvasTop || obj.getBoundingRect().left+obj.getBoundingRect().width > CANVAS_WIDTH+canvasLeft){
        obj.top = Math.min(obj.top, (CANVAS_HEIGHT+canvasTop)-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, (CANVAS_WIDTH+canvasLeft)-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
    }
}
// ------------ Resize canvas function --------


function objectMouseDown(obj_target){
    // checking when you click on canvas then object was selected on not.
  if(obj_target) {
    if (obj_target.object_type == 'text') {
        let tempData = $.measureText(obj_target.text, {fontFamily:obj_target.text_font_family, fontSize:parseFloat(obj_target.text_font_size)});
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

        // default settings value when added new text
        $('.selected_font_name').text(active_font_family);
        $('.selected_font_name').css('font-family',active_font_family);
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
        window.textRotationSlider.noUiSlider.set(obj_target.rotate_angle);
        $('#rotatTextNumber').val(obj_target.rotate_angle);
        $('#textFontSize').val(parseFloat(obj_target.text_font_size).toFixed(1));

        var font_text = truncateString(obj_target.text, 10);
        $('ul#allFonts>li>span.active_text').text(font_text);
    }else{
        $('#editTextTab').css("display","none");
        $('#addTextTab').css("display","block");
    }

    if (obj_target.object_type == 'art') {
        var imgSize = calImageSize(parseFloat(obj_target.scaleToWidth).toFixed(2),parseFloat(obj_target.scaleToHeight).toFixed(2), 'px')
        $("#artWidth").val(imgSize.width);
        $("#artHeight").val(imgSize.height);
        window.artRotationSlider.noUiSlider.set(obj_target.rotate_angle);
        document.getElementById("rotatArtNumber").value = obj_target.rotate_angle;
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
        var imgSize = calImageSize(parseFloat(obj_target.scaleToWidth).toFixed(2),parseFloat(obj_target.scaleToHeight).toFixed(2), 'px')
        $("#imageWidth").val(imgSize.width);
        $("#imageHeight").val(imgSize.height);

        window.imageRotationSlider.noUiSlider.set(obj_target.rotate_angle);
        document.getElementById("rotatImageNumber").value = obj_target.rotate_angle;
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
            fitToObject(obj);
            return;
        }
    }
// console.log(obj.getBoundingRect())
    obj.setCoords();   
    if(obj.getBoundingRect().top < canvasTop || obj.getBoundingRect().left < canvasLeft){
        obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top+canvasTop);
        obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left+canvasLeft);
        if(obj.top < canvasTop){
            obj.top = canvasTop;
        }
        if(obj.left < canvasLeft){
            obj.left = canvasLeft;
        }
    }
    if(obj.getBoundingRect().top+obj.getBoundingRect().height > CANVAS_HEIGHT+canvasTop || obj.getBoundingRect().left+obj.getBoundingRect().width > CANVAS_WIDTH+canvasLeft){
        obj.top = Math.min(obj.top, (CANVAS_HEIGHT+canvasTop)-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, (CANVAS_WIDTH+canvasLeft)-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
    }

});

var left1 = canvasLeft;
var top1 = canvasTop;
var scale1x = 0 ;    
var scale1y = 0 ;    
var width1 = 0 ;    
var height1 = 0 ;

// function work on object scaling

canvas.on('object:scaling', function(e) {
  scaling(e);
});
let scalingProperties = {
  'left': 0,
  'top': 0,
  'scaleX': 0,
  'scaleY': 0
}

function scaling(e) {
  let shape = e.target;
  shape.lockScalingFlip = true;
  // shape.lockScalingY = true;
  let maxWidth = CANVAS_WIDTH+canvasLeft;
  let maxHeight = CANVAS_HEIGHT+canvasTop;

  //left border
  if(shape.left < 0) {
    shape.left = scalingProperties.left;
    shape.scaleX = scalingProperties.scaleX
  } else {
    scalingProperties.left = shape.left;
    scalingProperties.scaleX = shape.scaleX;
  }

  //right border
  if((scalingProperties.scaleX * shape.width) + shape.left >= maxWidth) {
    shape.lockScalingY = true;
    shape.scaleX = (maxWidth - scalingProperties.left) / shape.width;
  } else {
    scalingProperties.scaleX = shape.scaleX;
  }

  //top border
  if(shape.top < 0) {
    shape.top = scalingProperties.top;
    shape.scaleY = scalingProperties.scaleY;
  } else {
    scalingProperties.top = shape.top;
    scalingProperties.scaleY = shape.scaleY;
  }

  //bottom border
  if((scalingProperties.scaleY * shape.height) + shape.top >= maxHeight) {
    shape.lockScalingX = true;
    shape.scaleY = (maxHeight - scalingProperties.top) / shape.height;
  } else {
    scalingProperties.scaleY = shape.scaleY;
  }
}



canvas.on('object:modified', function(event) {
  event.target.lockScalingY = false;
  event.target.lockScalingX = false;
  event.target.lockScalingFlip = false;
    if (event.target.object_type == 'text') {
      event.target.lockScalingFlip = true;
        var newWidth = (event.target.width * event.target.scaleX);
        var newHeight = (event.target.height * event.target.scaleY);
        let newFontVal = calFontSize(null, parseFloat(event.target.text_font_size));
            if(parseFloat(event.target.scaleToWidth) !== parseFloat(newWidth) && checkZoomModify == false){
            $.ajax({
              url: API_URL+"/textGenerate.php?text="+encodeURIComponent(event.target.text)+"&effect="+event.target.text_effect+"&font_color="+event.target.text_color.replace("#","")+"&font_size="+newFontVal+"&font_width="+parseFloat(event.target.scaleToWidth).toFixed(2)+","+parseFloat(newWidth).toFixed(2)+"&font_height="+parseFloat(event.target.scaleToHeight).toFixed(2)+","+parseFloat(newHeight).toFixed(2)+"&canvas_width="+parseFloat(CANVAS_WIDTH).toFixed(2)+"&canvas_height="+parseFloat(CANVAS_HEIGHT).toFixed(2)+"&fontName="+event.target.text_font_family+"&outline_color="+event.target.outline_color.replace("#","")+"&outline_width="+event.target.outline_width+"&rotate_angle="+event.target.rotate_angle,
              xhrFields: {
                responseType: 'blob'
              },
              beforeSend: function() {
                $('.customiseLoader').css("display","flex");
              },
              success: function (img, status, xhr) {
                let txt_font_size = calFontSize(xhr.getResponseHeader('x-font-size'), null);
                $('#textFontSize').val(txt_font_size);
                event.target.set({
                        scaleToWidth:xhr.getResponseHeader('x-img-width'),
                        scaleToHeight:xhr.getResponseHeader('x-img-height'),
                        scaleX: 1,
                        scaleY:1,
                        "text_font_size": txt_font_size
                    })
                event.target.setSrc(URL.createObjectURL(img));
                setTimeout(function(){
                    setObjectInside(event.target);
                    canvas.renderAll(); 
                    saveState()  // call this function for save object in undo redo
                    $('.customiseLoader').css("display","none");
                }, 200)
              },
              error: function (jqXhr, textStatus, errorMessage) {
                $('.customiseLoader').css("display","none");
              }
            }) 
         }else{
            checkZoomModify = false;
            saveState()  // call this function for save object in undo redo
         }
    }else if (event.target.object_type == 'art') {
        var newWidth = (event.target.width * event.target.scaleX);
        var newHeight = (event.target.height * event.target.scaleY);
        console.log(parseFloat(newWidth))
        if(newWidth>(CANVAS_WIDTH) || newHeight > (CANVAS_HEIGHT)){
          if(newWidth>(CANVAS_WIDTH)){
              newWidth = CANVAS_WIDTH;
              newWidth = parseFloat(newWidth);
              newHeight = newWidth * event.target.height / event.target.width;
              if(newHeight > (CANVAS_HEIGHT)){
                    newHeight = CANVAS_HEIGHT;
              }
          }
          if(newHeight > (CANVAS_HEIGHT)){
              newHeight = CANVAS_HEIGHT;
              newHeight = parseFloat(newHeight);
              newWidth = newHeight * event.target.width / event.target.height;
              if(newWidth > (CANVAS_WIDTH)){
                    newWidth = CANVAS_WIDTH;
              }
          }
          _scaleToDimensions(event.target, newHeight, newWidth, 1);
        }

        var imgSize = calImageSize(parseFloat(newWidth).toFixed(2),parseFloat(newHeight).toFixed(2), 'px')
        $("#artWidth").val(imgSize.width);
        $("#artHeight").val(imgSize.height);
        window.artRotationSlider.noUiSlider.set(event.target.rotate_angle);
        document.getElementById("rotatArtNumber").value = event.target.rotate_angle;
        event.target.set({
            scaleToWidth:newWidth,
            scaleToHeight:newHeight
        })
        saveState()  // call this function for save object in undo redo
    }else if(event.target.object_type == 'image'){
        var newWidth = (event.target.width * event.target.scaleX);
        var newHeight = (event.target.height * event.target.scaleY);
        if(newWidth>(CANVAS_WIDTH) || newHeight > (CANVAS_HEIGHT)){
          if(newWidth>(CANVAS_WIDTH)){
              newWidth = CANVAS_WIDTH;
              newWidth = parseFloat(newWidth);
              newHeight = newWidth * event.target.height / event.target.width;
              if(newHeight > (CANVAS_HEIGHT)){
                    newHeight = CANVAS_HEIGHT;
              }
          }
          if(newHeight > (CANVAS_HEIGHT)){
              newHeight = CANVAS_HEIGHT;
              newHeight = parseFloat(newHeight);
              newWidth = newHeight * event.target.width / event.target.height;
              if(newWidth > (CANVAS_WIDTH)){
                    newWidth = CANVAS_WIDTH;
              }
          }
          _scaleToDimensions(event.target, newHeight, newWidth, 1);
        }
        var imgSize = calImageSize(parseFloat(newWidth).toFixed(2),parseFloat(newHeight).toFixed(2), 'px')
        $("#imageWidth").val(imgSize.width);
        $("#imageHeight").val(imgSize.height);
        window.imageRotationSlider.noUiSlider.set(event.target.rotate_angle);
        document.getElementById("rotatImageNumber").value = event.target.rotate_angle;
        event.target.set({
            scaleToWidth:newWidth,
            scaleToHeight:newHeight
        })
        saveState()  // call this function for save object in undo redo
    }
    canvas.backgroundImage.set({
      strokeWidth:0
    });    
});
} // fireEvents fucntion end


// truncate fucntion for font family section text
const truncateString = (string = '', maxLength = 50) => 
  string.length > maxLength 
    ? `${string.substring(0, maxLength)}…`
    : string


// add text function
$("#addTextContent").click(function(){
    var text_val = $("#textContent").val();
    var encodedValue = encodeURIComponent(text_val);
    text_val = text_val.replace(/\n/g, "\n");
    if(text_val != ""){
        var font_size = 1.4;
        var newFontVal = calFontSize(null, parseFloat(font_size));
        let font_url = $("#defaultFont").attr('font-url');
        let font_name = $("#defaultFont").attr('font-name');
        var tempData = $.measureText(text_val, {fontFamily:font_name, fontSize:newFontVal});
        var textWidth = tempData.width;
        var textHeight = tempData.height;

        if(tempData.width > (CANVAS_WIDTH-5)){
            var text_width = tempData.width;
            var text_height = tempData.height;
            while (text_width > (CANVAS_WIDTH-5)) {
              newFontVal = newFontVal-1;
              var updateData = $.measureText(text_val, {fontFamily: font_name, fontSize:newFontVal});
              text_width = updateData.width;
              text_height = updateData.height;
            }
            textWidth = text_width;
            textHeight = text_height;
        }
        

        $.ajax({
          url: API_URL+"/textGenerate.php?text="+encodedValue+"&effect=normal&font_color=000000&font_size="+newFontVal+"&canvas_width="+parseFloat(CANVAS_WIDTH).toFixed(2)+"&canvas_height="+parseFloat(CANVAS_HEIGHT).toFixed(2)+"&fontName="+font_url+"&outline_color=00000000&outline_width=2&rotate_angle=0",
          xhrFields: {
            responseType: 'blob'
          },
          beforeSend: function() {
            $('.customiseLoader').css("display","flex");
          },
          success: function (img, status, xhr) {
            let txt_font_size = calFontSize(xhr.getResponseHeader('x-font-size'), null);
            $('#textFontSize').val(txt_font_size);
              $('#activeElement>img').attr('src', window.URL.createObjectURL(img));
                fabric.Image.fromURL(window.URL.createObjectURL(img), function(img) {
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
                        "text_font_size": txt_font_size,
                        "text_font_family": font_url,
                        "outline_color": "#00000000",
                        "outline_color_name": "None",
                        "outline_width": "1",
                        "rotate_angle":0,
                        left:canvasLeft,
                        top:canvasTop,
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
                        scaleToHeight:newHeight,
                        left:canvasLeft,
                        top:canvasTop,
                    });   
                    setTimeout(async function(){
                        setObjectInside(img);
                        canvas.setActiveObject(img);
                        canvas.renderAll(); 
                        saveState();  // call this function for save object in undo redo
                        $('.customiseLoader').css("display","none");
                    }, 200)
                });
              },
              error: function (jqXhr, textStatus, errorMessage) {
                $('.customiseLoader').css("display","none");
              }

        }) 

        // default settings value when added new text
        active_font_family = font_name;
        $('.selected_font_name').text(font_name);
        $('.selected_font_name').css('font-family', font_name);
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
        window.textRotationSlider.noUiSlider.set(0);
        $('#rotatTextNumber').val(0);

        $("#textContent").val("");
        $('#textContent').focus();
        $('#addTextTab').css("display","none");
        $('#editTextContent').val(text_val);
        $('#editTextTab').css("display","block");
        $('#editTextContent').focus();
        
        var font_text = truncateString(text_val, 10);
        $('ul#allFonts>li>span.active_text').text(font_text);
  }
})


$("#editTextContent").change(function(){
    let text_val = $(this).val();
    var encodedValue = encodeURIComponent(text_val);
    let selectedObject = canvas.getActiveObject(); 
    var canvas_space_width = 0;

      if(text_val == ''){
          text_val = 'No Text';               
      }
      let newFontVal = calFontSize(null, parseFloat(selectedObject.text_font_size));

        $.ajax({
          url: API_URL+"/textGenerate.php?text="+encodedValue+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+newFontVal+"&canvas_width="+parseFloat(CANVAS_WIDTH).toFixed(2)+"&canvas_height="+parseFloat(CANVAS_HEIGHT).toFixed(2)+"&fontName="+selectedObject.text_font_family+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width+"&rotate_angle="+selectedObject.rotate_angle,
          xhrFields: {
            responseType: 'blob'
          },
          beforeSend: function() {
            $('.customiseLoader').css("display","flex");
          },
          success: function (img, status, xhr) {
            let txt_font_size = calFontSize(xhr.getResponseHeader('x-font-size'), null);
            $('#textFontSize').val(txt_font_size);
            selectedObject.set({
                scaleToWidth:xhr.getResponseHeader('x-img-width'),
                scaleToHeight:xhr.getResponseHeader('x-img-height'),
                scaleX: 1,
                scaleY:1,
                "text_font_size": txt_font_size,
                "text": text_val
            })
            selectedObject.setSrc(URL.createObjectURL(img));
                    
            setTimeout(function(){
                setObjectInside(selectedObject);
                canvas.renderAll(); 
                saveState()  // call this function for save object in undo redo
                $('.customiseLoader').css("display","none");
                var font_text = truncateString(text_val, 10);
                 $('ul#allFonts>li>span.active_text').text(font_text);
            }, 200)
          },
          error: function (jqXhr, textStatus, errorMessage) {
            $('.customiseLoader').css("display","none");
          }
        }) 
    // setObjectInside(selectedObject);
    // canvas.renderAll(); 
    
})

// text font family js
const changeTextFont = async(name, font) => {
    var selectedObject = canvas.getActiveObject();
    let newFontVal = calFontSize(null, parseFloat(selectedObject.text_font_size));
        $.ajax({
          url: API_URL+"/textGenerate.php?text="+encodeURIComponent(selectedObject.text)+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+newFontVal+"&canvas_width="+parseFloat(CANVAS_WIDTH).toFixed(2)+"&canvas_height="+parseFloat(CANVAS_HEIGHT).toFixed(2)+"&fontName="+font+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width+"&rotate_angle="+selectedObject.rotate_angle,
          xhrFields: {
            responseType: 'blob'
          },
          beforeSend: function(){
            $('.customiseLoader').css("display","flex");
          },
          success: function (img, status, xhr){
            let txt_font_size = calFontSize(xhr.getResponseHeader('x-font-size'), null);
            $('#textFontSize').val(txt_font_size);
            selectedObject.set({
                scaleToWidth:xhr.getResponseHeader('x-img-width'),
                scaleToHeight:xhr.getResponseHeader('x-img-height'),
                scaleX: 1,
                scaleY:1,
                "text_font_size": txt_font_size,
                "text_font_family": font
            })
            selectedObject.setSrc(URL.createObjectURL(img));
                    
            setTimeout(function(){
                active_font_family = name;
                $('.selected_font_name').text(name);
                $('.selected_font_name').css('font-family',name);
                setObjectInside(selectedObject);
                canvas.renderAll(); 
                saveState()  // call this function for save object in undo redo
                $('.customiseLoader').css("display","none");
            }, 200)
          },
          error: function (jqXhr, textStatus, errorMessage) {
            $('.customiseLoader').css("display","none");
          }
        }) 
    
     canvas.renderAll();
}

// text color js
function changeTextColor(color, name){
    var selectedObject = canvas.getActiveObject();
    let newFontVal = calFontSize(null, parseFloat(selectedObject.text_font_size));
    $.ajax({
      url: API_URL+"/textGenerate.php?text="+encodeURIComponent(selectedObject.text)+"&effect="+selectedObject.text_effect+"&font_color="+color.replace("#","")+"&font_size="+newFontVal+"&canvas_width="+parseFloat(CANVAS_WIDTH).toFixed(2)+"&canvas_height="+parseFloat(CANVAS_HEIGHT).toFixed(2)+"&fontName="+selectedObject.text_font_family+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width+"&rotate_angle="+selectedObject.rotate_angle,
      xhrFields: {
        responseType: 'blob'
      },
      beforeSend: function() {
        $('.customiseLoader').css("display","flex");
      },
      success: function (img, status, xhr) {
        selectedObject.set({"text_color": color, "text_color_name": name});
        selectedObject.setSrc(URL.createObjectURL(img));   
        $('.selected_color>.color_box').css('background-color',color);
        $('.selected_color>.color_box').attr("color-name",name);
        $('.selected_color>.color_name').text(name);
        setTimeout(function(){
            setObjectInside(selectedObject);
            canvas.renderAll(); 
            saveState()  // call this function for save object in undo redo
            $('.customiseLoader').css("display","none");
        }, 200)
      },
      error: function (jqXhr, textStatus, errorMessage) {
        $('.customiseLoader').css("display","none");
      }
    })
    canvas.renderAll(); 
}

// text Rotation js
async function changeRangeValue(val){
    var angleValue = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
    if(angleValue>181){
        angleValue = 180;
    }else if(angleValue<-181){
        angleValue = -180;
    }
    var selectedObject = canvas.getActiveObject();
    let newFontVal = calFontSize(null, parseFloat(selectedObject.text_font_size));
    $.ajax({
      url: API_URL+"/textGenerate.php?text="+encodeURIComponent(selectedObject.text)+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+newFontVal+"&canvas_width="+parseFloat(CANVAS_WIDTH).toFixed(2)+"&canvas_height="+parseFloat(CANVAS_HEIGHT).toFixed(2)+"&fontName="+selectedObject.text_font_family+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width+"&rotate_angle="+angleValue,
      xhrFields: {
        responseType: 'blob'
      },
      beforeSend: function() {
        $('.customiseLoader').css("display","flex");
      },
      success: function (img, status, xhr) {
        selectedObject.setSrc(URL.createObjectURL(img));
        window.textRotationSlider.noUiSlider.set(angleValue);
        document.getElementById("rotatTextNumber").value = angleValue;
        selectedObject.set({
            scaleToWidth:xhr.getResponseHeader('x-img-width'),
            scaleToHeight:xhr.getResponseHeader('x-img-height'),
            scaleX: 1,
            scaleY:1,
            "rotate_angle":angleValue
        });
        setTimeout(function(){
            setObjectInside(selectedObject);
            canvas.renderAll(); 
            saveState()  // call this function for save object in undo redo
            $('.customiseLoader').css("display","none");
        }, 200)
      },
      error: function (jqXhr, textStatus, errorMessage) {
        $('.customiseLoader').css("display","none");
      }
    })
}
async function changeInputValue(val){
    var angleValue = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
    if(angleValue>181){
        angleValue = 180;
    }else if(angleValue<-181){
        angleValue = -180;
    }
    var selectedObject = canvas.getActiveObject();
    let newFontVal = calFontSize(null, parseFloat(selectedObject.text_font_size));
    $.ajax({
      url: API_URL+"/textGenerate.php?text="+encodeURIComponent(selectedObject.text)+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+newFontVal+"&canvas_width="+parseFloat(CANVAS_WIDTH).toFixed(2)+"&canvas_height="+parseFloat(CANVAS_HEIGHT).toFixed(2)+"&fontName="+selectedObject.text_font_family+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width+"&rotate_angle="+angleValue,
      xhrFields: {
        responseType: 'blob'
      },
      beforeSend: function() {
        $('.customiseLoader').css("display","flex");
      },
      success: function (img, status, xhr) {
        selectedObject.setSrc(URL.createObjectURL(img));
        window.textRotationSlider.noUiSlider.set(angleValue);
        document.getElementById("rotatTextNumber").value = angleValue;
        selectedObject.set({
            scaleToWidth:xhr.getResponseHeader('x-img-width'),
            scaleToHeight:xhr.getResponseHeader('x-img-height'),
            scaleX: 1,
            scaleY:1,
            "rotate_angle":angleValue
        });    
        setTimeout(function(){
            setObjectInside(selectedObject);
            canvas.renderAll(); 
            saveState()  // call this function for save object in undo redo
            $('.customiseLoader').css("display","none");
        }, 200)
      },
      error: function (jqXhr, textStatus, errorMessage) {
        $('.customiseLoader').css("display","none");
      }
    })
}

// text outline js
function changeTxtOutlineColor(color, name){
    var thickness_val =  window.clickPipsSlider.noUiSlider.get();
    var selectedObject = canvas.getActiveObject();
    let newFontVal = calFontSize(null, parseFloat(selectedObject.text_font_size));
    if(selectedObject != undefined){
        $.ajax({
          url: API_URL+"/textGenerate.php?text="+encodeURIComponent(selectedObject.text)+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+newFontVal+"&canvas_width="+parseFloat(CANVAS_WIDTH).toFixed(2)+"&canvas_height="+parseFloat(CANVAS_HEIGHT).toFixed(2)+"&fontName="+selectedObject.text_font_family+"&outline_color="+color.replace("#","")+"&outline_width="+thickness_val+"&rotate_angle="+selectedObject.rotate_angle,
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
                "outline_color":color,
                "outline_width": thickness_val,
                "outline_color_name": name
            });
            selectedObject.setSrc(URL.createObjectURL(img));      
            setTimeout(function(){
                let txt_font_size = calFontSize(xhr.getResponseHeader('x-font-size'), null);
                $('#textFontSize').val(txt_font_size);
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
            $('.customiseLoader').css("display","none");
          }
        }) 
    } 
}
function changeTextOutlineThick(){
    var selected_color = $(".color_box>input[name='text_outline_input']:checked").attr('data-color-code');
    var selected_name = $(".color_box>input[name='text_outline_input']:checked").attr('data-color-name');
    changeTxtOutlineColor(selected_color, selected_name);
}
function removeTxtOutline(){
    var selectedObject = canvas.getActiveObject();
    let newFontVal = calFontSize(null, parseFloat(selectedObject.text_font_size));
    $.ajax({
      url: API_URL+"/textGenerate.php?text="+encodeURIComponent(selectedObject.text)+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+newFontVal+"&canvas_width="+parseFloat(CANVAS_WIDTH).toFixed(2)+"&canvas_height="+parseFloat(CANVAS_HEIGHT).toFixed(2)+"&fontName="+selectedObject.text_font_family+"&outline_color=00000000&outline_width="+1+"&rotate_angle="+selectedObject.rotate_angle,
      xhrFields: {
        responseType: 'blob'
      },
      beforeSend: function() {
        $('.customiseLoader').css("display","flex");
      },
      success: function (img, status, xhr) {
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
        setTimeout(function(){
            fitToObject(selectedObject)
        }, 200)
      },
      error: function (jqXhr, textStatus, errorMessage) {
        $('.customiseLoader').css("display","none");
      }
    })    
}
// end text outline js

// text transform effect section js
function changeTextEffect(effect){
    $('.txt_shape_container').removeClass('active_shape');
    var selectedObject = canvas.getActiveObject();
    var selected_shap = $('.selected_shape_name').text();
    let newFontVal = calFontSize(null, parseFloat(selectedObject.text_font_size));
    $.ajax({
      url: API_URL+"/textGenerate.php?text="+encodeURIComponent(selectedObject.text)+"&effect="+effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+newFontVal+"&canvas_width="+parseFloat(CANVAS_WIDTH).toFixed(2)+"&canvas_height="+parseFloat(CANVAS_HEIGHT).toFixed(2)+"&fontName="+selectedObject.text_font_family+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width+"&rotate_angle="+selectedObject.rotate_angle,
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
            setObjectInside(selectedObject); 
            canvas.renderAll(); 
            saveState()  // call this function for save object in undo redo
            $('.customiseLoader').css("display","none");
        }, 200)
      },
      error: function (jqXhr, textStatus, errorMessage) {
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
    if(value < .5){
        value = .5; 
    }
    let newFontVal = calFontSize(null, parseFloat(value));
      $.ajax({
        url: API_URL+"/textGenerate.php?text="+encodeURIComponent(selectedObject.text)+"&effect="+selectedObject.text_effect+"&font_color="+selectedObject.text_color.replace("#","")+"&font_size="+newFontVal+"&canvas_width="+parseFloat(CANVAS_WIDTH).toFixed(2)+"&canvas_height="+parseFloat(CANVAS_HEIGHT).toFixed(2)+"&fontName="+selectedObject.text_font_family+"&outline_color="+selectedObject.outline_color.replace("#","")+"&outline_width="+selectedObject.outline_width+"&rotate_angle="+selectedObject.rotate_angle,
        xhrFields: {
          responseType: 'blob'
        },
        beforeSend: function() {
          $('.customiseLoader').css("display","flex");
        },
        success: function (img, status, xhr) {
          let txt_font_size = calFontSize(xhr.getResponseHeader('x-font-size'), null);
          $('#textFontSize').val(txt_font_size);
          selectedObject.set({
              scaleToWidth:xhr.getResponseHeader('x-img-width'),
              scaleToHeight:xhr.getResponseHeader('x-img-height'),
              scaleX: 1,
              scaleY:1,
              "text_font_size": txt_font_size
          })
          selectedObject.setSrc(URL.createObjectURL(img));    
          setTimeout(function(){
              $('#textFontSize').val(txt_font_size);
              setObjectInside(selectedObject);
              canvas.renderAll(); 
              saveState()  // call this function for save object in undo redo
              $('.customiseLoader').css("display","none");
          }, 200)
        },
        error: function (jqXhr, textStatus, errorMessage) {
          $('.customiseLoader').css("display","none");
        }
      }) 
    setObjectInside(selectedObject);
    canvas.renderAll();
}

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
          clonedObj.canvas = canvas;
          clonedObj.forEachObject(function(obj, index) {
            globalPropsToSet = activeSelectedObjs[index]["props"];
            globalPropsToSet["left"] = obj.left + 10
            globalPropsToSet["top"] = obj.top + 10
            globalPropsToSet["evented"] = true
            obj.set(globalPropsToSet);
            canvas.add(obj);
          });
          clonedObj.setCoords();
        } else {
           globalPropsToSet["left"] = clonedObj.left + 10
           globalPropsToSet["top"] = clonedObj.top + 10
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

}
/* COPY PASTE FUNCTION FOR SINGLE OBJECT END */

function updateTshirtImage(imageURL){
    let img_size = 80;
    if(zoomOptionStatus == true){
      img_size = img_size*zoomScale;
    }
    fabric.Image.fromURL(imageURL, function(img) {                   
        img.scaleToHeight(img_size);
        img.scaleToWidth(img_size); 
        img.set({
            "object_type":'art',
            left:canvasLeft,
            top:canvasTop,
            "imgSrc": imageURL,
            "rotate_angle":0
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
        var newWidth = (img.width * img.scaleX);
        var newHeight = (img.height * img.scaleY);
        document.getElementById("rotatArtNumber").value = 0;
        img.set({
            scaleToWidth:newWidth,
            scaleToHeight:newHeight
        });
        var imgSize = calImageSize(parseFloat(newWidth).toFixed(2),parseFloat(newHeight).toFixed(2), 'px')
        $("#artWidth").val(imgSize.width);
        $("#artHeight").val(imgSize.height);
        canvas.setActiveObject(img);
        canvas.renderAll();
        saveState()  // call this function for save object in undo redo
    });
}

function addArtDesign(path) {
    if(edit_art == true){
       let selectedObject = canvas.getActiveObject();
       selectedObject.setSrc(path);
       $('#addArtTab').css("display","none");
       $('#editArtTab').css("display","block");
       setTimeout(function(){
        var newWidth = (selectedObject.width * selectedObject.scaleX);
        var newHeight = (selectedObject.height * selectedObject.scaleY);
        selectedObject.set({
            scaleToWidth:newWidth,
            scaleToHeight:newHeight,
            "imgSrc": path,
            "rotate_angle": 0
        });
        setObjectInside(selectedObject);
        canvas.setActiveObject(selectedObject);
        canvas.renderAll();
        saveState()  // call this function for save object in undo redo
        var imgSize = calImageSize(parseFloat(newWidth).toFixed(2),parseFloat(newHeight).toFixed(2), 'px')
        $("#artWidth").val(imgSize.width);
        $("#artHeight").val(imgSize.height);
       }, 200);
       edit_art = false;
    }else{
       updateTshirtImage(path);
       $('#addArtTab').css("display","none");
       $('#editArtTab').css("display","block");        
    }
    window.artRotationSlider.noUiSlider.set(0);
    document.getElementById("rotatArtNumber").value = 0;
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
    const activeObject = canvas.getActiveObject();
      if (activeObject) {
        let newHeight, newWidth;
        if (dimension === "height") {
          var sizeVal = calImageSize(0,parseFloat(value),'inch');
          value = sizeVal.height;
            if(value > (CANVAS_HEIGHT)){
                value = CANVAS_HEIGHT;
            }
          newHeight = parseFloat(value);
          newWidth = parseFloat(value) * activeObject.width / activeObject.height;
          if(newWidth > (CANVAS_WIDTH)){
                newWidth = CANVAS_WIDTH;
          }
        } else if (dimension === "width") {
            var sizeVal = calImageSize(parseFloat(value),0,'inch');
            value = sizeVal.width;
            if(value > (CANVAS_WIDTH)){
                value = CANVAS_WIDTH;
            }
          newWidth = parseFloat(value);
          newHeight = parseFloat(value) * activeObject.height / activeObject.width;
          if(newHeight > (CANVAS_HEIGHT)){
                newHeight = CANVAS_HEIGHT;
            }
        } else {
          console.error("Invalid dimension specified. Please specify 'width' or 'height'.");
          return;
        }
         _scaleToDimensions(activeObject, newHeight, newWidth, 1);
        var imgSize = calImageSize(parseFloat(newWidth).toFixed(2),parseFloat(newHeight).toFixed(2), 'px')
        $("#artWidth").val(imgSize.width);
        $("#artHeight").val(imgSize.height);
        saveState()  // call this function for save object in undo redo
      }else{
        console.error("No active object found.");
      }
}

// object center js
function centerObject(){
    var selectedObject = canvas.getActiveObject();
    if(selectedObject != undefined){
      selectedObject.centerH();
      canvas.renderAll();
      saveState()  // call this function for save object in undo redo
    }
}
// Art flip x js
function flipXArt(){
    var selectedObject = canvas.getActiveObject();
    selectedObject.toggle('flipX')
    selectedObject.setCoords();
    canvas.renderAll();
    saveState()  // call this function for save object in undo redo
}
// Art flip y js
function flipYArt(){
    var selectedObject = canvas.getActiveObject();
    selectedObject.toggle('flipY')
    selectedObject.setCoords();
    canvas.renderAll();
    saveState()  // call this function for save object in undo redo
}

function imgRotateAPI(selectedObject, src, type, angle){
  if(src != '' && angle != undefined){
    var newWidth = parseFloat(selectedObject.width).toFixed(2)*selectedObject.scaleX;
    var newHeight = parseFloat(selectedObject.height).toFixed(2)*selectedObject.scaleY;
    $.ajax({
        url: API_URL+"/rotateImage.php?type="+type+"&name="+src+"&rotate_angle="+angle+"&w="+newWidth+"&h="+newHeight+"&canvas_width="+parseFloat(CANVAS_WIDTH).toFixed(2)+"&canvas_height="+parseFloat(CANVAS_HEIGHT).toFixed(2)+"&x="+selectedObject.scaleX+"&y="+selectedObject.scaleY,
        xhrFields: {
          responseType: 'blob'
        },
        beforeSend: function() {
          $('.customiseLoader').css("display","flex");
        },
        success: function (img, status, xhr) {
          var xhrNewWidth = parseFloat(xhr.getResponseHeader('x-img-width')).toFixed(2);
          var xhrNewHeight = parseFloat(xhr.getResponseHeader('x-img-height')).toFixed(2);
          selectedObject.setSrc(URL.createObjectURL(img));
          selectedObject.set({
              "updatedImg": URL.createObjectURL(img),
              "rotate_angle": angle
          })
          setTimeout(function(){
            setObjectInside(selectedObject);
            canvas.renderAll();
            canvas.fire('object:modified', { target: selectedObject });
            setObjectInside(selectedObject);
            canvas.renderAll();
            saveState();  // call this function for save object in undo redo
            $('.customiseLoader').css("display","none");
          }, 200)          
        },
        error: function (jqXhr, textStatus, errorMessage) {
          $('.customiseLoader').css("display","none");
        }
      }) 
  }
}


// Art Rotation js
function changeArtRangeValue(val){
    var angleValue = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
    if(angleValue>181){
        angleValue = 180;
    }else if(angleValue<-181){
        angleValue = -180;
    }
    var selectedObject = canvas.getActiveObject();
    imgRotateAPI(selectedObject, selectedObject.imgSrc , 'art', parseFloat(angleValue));
    fitToObject(selectedObject);
    canvas.renderAll();
}
function changeArtInputValue(val){
    var angleValue = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
    if(angleValue>181){
        angleValue = 180;
    }else if(angleValue<-181){
        angleValue = -180;
    }
    var selectedObject = canvas.getActiveObject();
    imgRotateAPI(selectedObject, selectedObject.imgSrc , 'art', parseFloat(angleValue));
    canvas.renderAll();
    saveState()  // call this function for save object in undo redo
}

// When the user clicks on upload a custom picture
document.getElementById('uploadFile').addEventListener("change", function(e){
    var fd = new FormData();
    var files = e.target.files[0];
    if(files.size > 10000000){
        $("#uploadFile").val(null);  // set input file field value null
        $('.error_file_modal').css("display","none");
        $('#maxFileSizeError').css("display","block");
        $('#upload_error_modal').css("display","flex");
        return false;
    }
    fd.append('image',files);
    $.ajax({
          url:"https://staging.whattocookai.com/api/convert-file",
          type: 'post',
          data: fd,
          contentType: false,
          processData: false,
          header: { "Access-Control-Allow-Origin": "*" },
          beforeSend: function() {
            $('.customiseLoader').css("display","flex");
          },
          success: function (response, status) {
            if(response.status == true){
                fabric.Image.fromURL(response.data, function(img) {                   
                    img.scaleToHeight(80);
                    img.scaleToWidth(80); 
                    img.set({
                        "object_type":'image',
                        left:canvasLeft,
                        top:canvasTop,
                        "imgSrc":response.data
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
                    canvas.add(img);
                    var newWidth = (img.width * img.scaleX);
                    var newHeight = (img.height * img.scaleY);
                    window.imageRotationSlider.noUiSlider.set(0);
                    document.getElementById("rotatImageNumber").value = 0;
                    img.set({
                        scaleToWidth:newWidth,
                        scaleToHeight:newHeight
                    });
                    var imgSize = calImageSize(parseFloat(newWidth).toFixed(2),parseFloat(newHeight).toFixed(2), 'px')
                    $("#imageWidth").val(imgSize.width);
                    $("#imageHeight").val(imgSize.height);
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
            $("#uploadFile").val(null);  // set input file field value null
            $('.error_file_modal').css("display","none");
            $('#fileNotSupportError').css("display","block");
            $('#upload_error_modal').css("display","flex");
            $('.customiseLoader').css("display","none");
          }
        })  
        window.artRotationSlider.noUiSlider.set(0);
    document.getElementById("rotatArtNumber").value = 0; 
}, false);

// Image Rotation js
function changeImageRangeValue(val){
    var angleValue = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
    if(angleValue>181){
        angleValue = 180;
    }else if(angleValue<-181){
        angleValue = -180;
    }
    var selectedObject = canvas.getActiveObject();
    imgRotateAPI(selectedObject, selectedObject.imgSrc , 'upload', parseFloat(angleValue));
    fitToObject(selectedObject);
    canvas.renderAll();
}
function changeImageInputValue(val){
    var angleValue = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
    if(angleValue>181){
        angleValue = 180;
    }else if(angleValue<-181){
        angleValue = -180;
    }
    var selectedObject = canvas.getActiveObject();
    imgRotateAPI(selectedObject, selectedObject.imgSrc , 'upload', parseFloat(angleValue));
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
            var sizeVal = calImageSize(0,parseFloat(value),'inch');
            value = sizeVal.height;
            if(value > (CANVAS_HEIGHT)){
                value = CANVAS_HEIGHT;
            }
          newHeight = parseFloat(value);
          newWidth = parseFloat(value) * activeObject.width / activeObject.height;
          if(newWidth > (CANVAS_WIDTH)){
                newWidth = CANVAS_WIDTH;
          }
        } else if (dimension === "width") {
            var sizeVal = calImageSize(parseFloat(value),0,'inch');
            value = sizeVal.width;
            if(value > (CANVAS_WIDTH)){
                value = CANVAS_WIDTH;
            }
          newWidth = parseFloat(value);
          newHeight = parseFloat(value) * activeObject.height / activeObject.width;
          if(newHeight > (CANVAS_HEIGHT)){
                newHeight = CANVAS_HEIGHT;
            }
        } else {
          console.error("Invalid dimension specified. Please specify 'width' or 'height'.");
          return;
        }
         _scaleToDimensions(activeObject, newHeight, newWidth, 1);
        setObjectInside(activeObject);
        var imgSize = calImageSize(parseFloat(newWidth).toFixed(2),parseFloat(newHeight).toFixed(2), 'px')
        $("#imageWidth").val(imgSize.width);
        $("#imageHeight").val(imgSize.height);
      }else{
        console.error("No active object found.");
      }
}


// When the user selects a picture that has been added and press the DEL key
// The object will be removed !
document.addEventListener("keydown", function(e) {
    var keyCode = e.keyCode;
    if(keyCode == 46){
      if(document.activeElement.id == 'editTextContent' || document.activeElement.id == 'rotatTextNumber'|| document.activeElement.id == 'textFontSize'){
      }else{
        Delete();
        $('#editTextTab').css("display","none");
        $('#addTextTab').css("display","block");
      }
    }
}, false);

// After loading all content
document.addEventListener("DOMContentLoaded", function () {
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

var SCALE_FACTOR = zoomScale;
var zoomMax = 23;
var canvasScale = 1;

// Zoom In
function zoomIn() {
    // zoomOptionStatus = true;
    $('.canvas_view_input[name="canvas_view_type"]:checked').attr("zoom","true");
    // fontScale = fontScale*zoomScale;
    // if(canvas.getZoom().toFixed(5) > zoomMax){
    //     return;
    // }

    let width = $('.customiserImage_wrap').width()*1.5;
    let height = $('.customiserImage_wrap').height()*1.5;
    $('.customiserImage_wrap').css({"width":width,"height":height})

    var zoomInWidth = canvas.getWidth() * SCALE_FACTOR;
    var zoomInHeight = canvas.getHeight() * SCALE_FACTOR;

    // var width_outer_space = (zoomInWidth*canvas_padding)/100;
    // var height_outer_space = (zoomInHeight*canvas_padding)/100;

    // var bgWidth = zoomInWidth-width_outer_space;
    // var bgHeight = zoomInHeight-height_outer_space;

    // bgLeft = width_outer_space / 2;
    // bgTop = height_outer_space / 2;
    // canvasLeft = bgLeft;
    // maxX = bgLeft+bgWidth;
    // canvasTop = bgTop;
    // maxY = bgTop+bgHeight;
    // CANVAS_WIDTH = maxX;
    // CANVAS_HEIGHT = maxY;
    
    // canvas.setHeight(width);
    // canvas.setWidth(height);
    // canvas.backgroundImage.set({
    //   left: bgLeft,
    //   top: bgTop,
    //   width: bgWidth,
    //   height: bgHeight,
    //   zoomX:1,
    //   zoomY:1,
    //   cacheWidth: bgWidth,
    //   cacheHeight: bgHeight,
    // })

    // var objects = canvas.getObjects();
    // for (var i in objects) {
    //     var scaleX = objects[i].scaleX;
    //     var scaleY = objects[i].scaleY;
    //     var left = objects[i].left;
    //     var top = objects[i].top;
        
    //     var tempScaleX = scaleX * SCALE_FACTOR;
    //     var tempScaleY = scaleY * SCALE_FACTOR;
    //     var tempLeft = left * SCALE_FACTOR;
    //     var tempTop = top * SCALE_FACTOR;
        
    //     objects[i].scaleX = tempScaleX;
    //     objects[i].scaleY = tempScaleY;
    //     objects[i].left = tempLeft;
    //     objects[i].top = tempTop;
    //     checkZoomModify = true;
    //     canvas.fire('object:modified', { target: objects[i] });
    //     objects[i].setCoords();
    // }
    
    canvas.renderAll();
}

// Zoom Out
function zoomOut() {
    // zoomOptionStatus = false;
    $('.canvas_view_input[name="canvas_view_type"]:checked').attr("zoom","false");
    // fontScale = fontScale/zoomScale;
    // if( canvas.getZoom().toFixed(5) < 1 ){
    //     return;
    // }

    let width = $('.customiserImage_wrap').width()/1.5;
    let height = $('.customiserImage_wrap').height()/1.5;
    $('.customiserImage_wrap').css({"width":width,"height":height})

    var zoomOutWidth = canvas.getWidth() / SCALE_FACTOR;
    var zoomOutHeight = canvas.getHeight() / SCALE_FACTOR;

    // var width_outer_space = (zoomOutWidth*canvas_padding)/100;
    // var height_outer_space = (zoomOutHeight*canvas_padding)/100;

    // var bgWidth = zoomOutWidth-width_outer_space;
    // var bgHeight = zoomOutHeight-height_outer_space;

    // bgLeft = width_outer_space / 2;
    // bgTop = height_outer_space / 2;

    // canvasLeft = bgLeft;
    // maxX = bgLeft+bgWidth;
    // canvasTop = bgTop;
    // maxY = bgTop+bgHeight;
    // CANVAS_WIDTH = maxX;
    // CANVAS_HEIGHT = maxY;
    
    // canvas.setHeight(zoomOutHeight);
    // canvas.setWidth(zoomOutWidth);
    // canvas.backgroundImage.set({
    //   left: bgLeft,
    //   top: bgTop,
    //   width: bgWidth,
    //   height: bgHeight,
    //   zoomX:1,
    //   zoomY:1,
    //   cacheWidth: bgWidth,
    //   cacheHeight: bgHeight,
    // })

    // var objects = canvas.getObjects();
    // for (var i in objects) {
    //     var scaleX = objects[i].scaleX;
    //     var scaleY = objects[i].scaleY;
    //     var left = objects[i].left;
    //     var top = objects[i].top;
    
    //     var tempScaleX = scaleX * (1 / SCALE_FACTOR);
    //     var tempScaleY = scaleY * (1 / SCALE_FACTOR);
    //     var tempLeft = left * (1 / SCALE_FACTOR);
    //     var tempTop = top * (1 / SCALE_FACTOR);

    //     objects[i].scaleX = tempScaleX;
    //     objects[i].scaleY = tempScaleY;
    //     objects[i].left = tempLeft;
    //     objects[i].top = tempTop;
    //     checkZoomModify = true;
    //     canvas.fire('object:modified', { target: objects[i] });
    //     objects[i].setCoords();
    // }

    canvas.renderAll();
}

// change zoom option status function
function changeZoomStatus(option){
    $('.zoom_icon').css("display","none");
    if(option == 'plus'){
        // $('img#customiserImage').css('transform','scale(1)');
        zoomOut();
        $('.zoom_plus_option').css("display","block");
    }else{
      // $('img#customiserImage').css('transform','scale('+zoomScale+')');
        zoomIn();
        $('.zoom_minus_option').css("display","block");
    }   
}

// get font size from this function
function calFontSize(px_font, font_val){
  if(font_val == null){
    var newFontSize= px_font/fontScale;
  }else{
    var newFontSize= font_val*fontScale;
  }
  return newFontSize.toFixed(1);
}

function calImageSize(width,height,type){
  // type of width and height
  if(type=='inch'){
    var new_width = width * fontScale;
    var new_height = height * fontScale;
    new_width = parseFloat(new_width).toFixed(2);
    new_height = parseFloat(new_height).toFixed(2);
  }else{
    var new_width = width / fontScale;
    var new_height = height / fontScale;
    new_width = parseFloat(new_width).toFixed(1);
    new_height = parseFloat(new_height).toFixed(1);
  } 

  return {"width":new_width,"height":new_height};
}


