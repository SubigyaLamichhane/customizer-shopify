
const STORE_API_URL = 'https://staging.whattocookai.com/';
const STORE_URL = 'offline_prakash-test-1.myshopify.com';
var active_font_family = ''
var edit_art = false;

function ChooseSettingtab(tab, name){
	$('.ct_content_tab').removeClass("active_tab");
	$('.settings_title_wrapper>ul>li').removeClass("active");
	if(tab != ''){
	 $('li.'+tab+'_tab').addClass("active");
	}
	$('#'+name).addClass("active_tab");
	$('.art_design_wrapper>.parent ul').removeClass("active_art_tab");
	$('.top_layer').css("display","block");
	$('.child_layer').css("display","none");

	// For art section
	edit_art = false;
    $('.art_header .back_btn').removeClass("edit_art");
    $('.art_header .close_content_tab').removeClass("edit_art");
    $('.art_header .back_btn').css("display","none");
    $('.art_header .back_btn').attr("current-option","");
	$('.art_header .back_btn').attr("level",0);
	$('.art_header h4').text("Artwork Categories");
	$('ul.parent li').show();
	showFont(null,'allFonts','All');

	canvas.discardActiveObject();
    canvas.renderAll();
}
$('body').on('click', '.close_content_tab.edit_art', function(){
	edit_art = false;
	console.log("function called!")
	$('#editArtTab').css("display","block");
	$('#addArtTab').css("display","none");
	$('.art_header .back_btn').removeClass("edit_art");
    $('.art_header .close_content_tab').removeClass("edit_art");
    $('.art_header .back_btn').css("display","none");

    $('.art_header .back_btn').attr("current-option","");
	$('.art_header .back_btn').attr("level",0);
	$('.art_header h4').text("Artwork Categories");

})
$('.close_content_tab').click(function(){
	$('.ct_content_tab').removeClass("active_tab");
	$('.settings_title_wrapper>ul>li').removeClass("active");
	$('#defaultSettings').addClass("active_tab");
	$('.top_layer').css("display","block");
	$('.child_layer').css("display","none");
	$('.art_design_wrapper>.parent ul').removeClass("active_art_tab");
	$('ul.parent li').show();
	showFont(null,'allFonts','All');
});

// greek translate letters
const convertLang = (str) => {
    // const map = {
    //      a:'α',b:'β',d:'δ',e:'ε',
    //     i:'ι',k:'κ',n:'η',o:'θ',
    //     p:'ρ',r:'π',t:'τ',u:'μ',
    //     char:'υ',w:'ω',x:'χ',y:'γ'
    // };

//     return str.replace(/./g, char => {

//         if (map[char.toLowerCase()]){
//         return char === char.toUpperCase() ? map[char.toLowerCase()] :
// map[char];
//         };
//         return char.toLowerCase();

//         });

    const map = {
         A:'A',B:'B',C:'Χ',D:'Δ',E:'E',F:'Φ',G:'Γ',H:'H',I:'I',K:'K',L:'Λ',M:'M',N:'N',O:'O',P:'Π',Q:'Θ',R:'Ρ',S:'Σ',T:'T',U:'Υ',W:'Ω',X:'Ξ',Y:'Ψ',Z:'Ζ'
    };

    return str.replace(/./g, char => {
        if (map[char.toUpperCase()]){
          return char === char.toLowerCase() ? map[char.toUpperCase()] : map[char];
        };
        return char.toUpperCase();
    });
}

// conver to greek end

// convert to english
const convertEngLang = (str) => {
    const map = {
         A:'A',B:'B',Χ:'C',Δ:'D',E:'E',Φ:'F',Γ:'G',H:'H',I:'I',K:'K',Λ:'L',M:'M',N:'N',O:'O',Π:'P',Θ:'Q',Ρ:'R',Σ:'S',T:'T',Υ:'U',Ω:'W',Ξ:'X',Ψ:'Y',Ζ:'Z'
    };

    return str.replace(/./g, char => {
        if (map[char.toUpperCase()]){
        	return char === char.toLowerCase() ? map[char.toUpperCase()] : map[char];
        };
        return char.toUpperCase();
       });
};
// end convert to english


$(document).on("keyup", "#textContent", function(){
	if($("#enable_greek_font").prop('checked')){
		var text_val = $("#textContent").val();
		$("#textContent").val(convertLang(text_val));
	}
})

function greekFontCheck(){
	if($("#enable_greek_font").prop("checked")){
		$('.enable_gkl_wrapper').css("display","block");
		var text_val = $("#textContent").val();
		$("#textContent").val(convertLang(text_val));
	}else{
		var text_val = $("#textContent").val();
		$('.enable_gkl_wrapper').css("display","none");
		$("#textContent").val(convertEngLang(text_val));
	}
}

function addGreekLetter(letter){
	var text_val = $("#textContent").val();
	var new_text = text_val+letter;
	$("#textContent").val(new_text);
}

$(document).on("click", ".open_child_options",async function (){
// $(".open_child_options").click(async function (){
	console.log("click worked!")
	$(this).parent().siblings("li").hide();
	var catId = $(this).attr('data-id');
	await subArtCategory(catId)

	var child_tab = $(this).next();
	var child_level = $(child_tab).attr("level");
	if(child_tab.length == 1){
	   var heading_text = $(this).text();
		$('.art_header h4').text(heading_text);
		heading_text = heading_text.replace(/[^a-zA-Z0-9 ]/g, "");
    console.log('heading text => ', heading_text);
		heading_text = heading_text.trim().toLowerCase().replaceAll(" ", "_");
    heading_text = heading_text.replace("__", "_");
		$('.art_header .back_btn').css("display","block");
		$('.art_header .back_btn').attr("current-option",heading_text);
		$('.art_header .back_btn').attr("level",child_level);
		$(child_tab).addClass("active_art_tab");
		$(this).parent().parent().css("overflow","hidden");
	}
})

$(".art_header .back_btn").click(function() {
	if($(this).hasClass('edit_art') && $(this).attr('level') == 0){
		edit_art = false;
		$('#editArtTab').css("display","block");
    	$('#addArtTab').css("display","none");
    	$('.art_header .back_btn').removeClass("edit_art");
	    $('.art_header .close_content_tab').removeClass("edit_art");
	    $('.art_header .back_btn').css("display","none");
	}else{
		var current_attr = $(this).attr("current-option");
		var get_level = $(this).attr("level");
		var pre_menu_text = $('.'+current_attr+"_child").attr("parent_menu");
		var current_level = get_level-1;

		$('.'+current_attr+"_child").parent().siblings("li").show();
		
		if(current_level < 1){
			$('.'+current_attr+'_child').removeClass("active_art_tab");
			$('.art_header .back_btn').css("display","none");
			$('.art_header h4').text("Artwork Categories");
			$('.art_header .back_btn').attr("current-option", "");
			$('.art_header .back_btn').attr("level", 0);
			$('ul.parent').css("overflow","auto");
		}else{
			$('.'+current_attr+'_child').removeClass("active_art_tab");
			$('.art_header h4').text(pre_menu_text);
	    	console.log('heading text => ', pre_menu_text);
			pre_menu_text = pre_menu_text.replace(/[^a-zA-Z0-9 ]/g, "");
			pre_menu_text = pre_menu_text.trim().toLowerCase().replaceAll(" ", "_");
	    	pre_menu_text = pre_menu_text.replace("__", "_");
			$('.art_header .back_btn').attr("current-option", pre_menu_text);
			$(this).attr("level", current_level);
			$('.'+pre_menu_text+'_child').css("overflow","auto");
		}
	}
});

function openEditArt(){
	$('#editArtTab').css("display","none");
    $('#addArtTab').css("display","block");
    edit_art = true;
    $('.art_header .back_btn').addClass("edit_art");
    $('.art_header .close_content_tab').addClass("edit_art");
    $('.art_header .back_btn').css("display","block");
}


setTimeout(function(){
  $.measureText = function(html, fontOptions) { 
  	// console.log(fontOptions)
    fontOptions = $.extend({
      fontSize: '1em',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontFamily: 'Abel',
      lineHeight : 0.8,
      letterSpacing: 0
    }, fontOptions);
    var $el = $('<div>', { 
      html: html,
      css: {
        position: 'absolute',
        left: -1000,
        top: -1000,
        display: 'none'
      }
    }).appendTo('body');
    $(fontOptions).each(function(index, option) {
      $el.css(option, fontOptions[option]);
    });
    var h = $el.outerHeight(), w = $el.outerWidth();
    $el.remove();
    return { height: h, width: w };
  };
},3500); 




// fonts js
// var fonts_name = 'ABeeZee|Abel|Aclonica|Acme|Actor|Adamina|Akronim|Aladin|Alata|Alatsi|Aldrich|Alef|Alegreya|Aleo|Alice|Alike|Allan|Allerta|Allura|Almarai|Almendra|Amarante|Amaranth|Amethysta|Amiko|Amiri|Amita|Anaheim|Andada|Andika|Angkor|Antic|Anton|Antonio|Arapey|Arbutus|Archivo|Arimo|Arizonia|Armata|Arsenal|Artifika|Arvo|Arya|Asap|Asar|Asset|Assistant|Astloch|Asul|Athiti|Atma|Aubrey|Audiowide|Average|B612|Bahiana|Bahianita|Ballet|Balthazar|Bangers|Barlow|Barriecito|Barrio|Basic|Baskervville|Battambang|Baumans|Bayon|Belgrano|Bellefair|Belleza|Bellota|BenchNine|Benne|Bentham|Bevan|Bilbo|BioRhyme|Biryani|Bitter|Blinker|Bokor|Bonbon|Boogaloo|Brawler|Buda|Buenard|Bungee|Butcherman|Cabin|Cagliostro|Cairo|Caladea|Calistoga|Calligraffitti|Cambay|Cambo|Candal|Cantarell|Capriola|Cardo|Carme|Castoro|Catamaran|Caudex|Caveat|Changa|Chango|Charm|Charmonman|Chathura|Chenla|Chewy|Chicle|Chilanka|Chivo|Chonburi|Cinzel|Coda|Codystar|Coiny|Combo|Comfortaa|Commissioner|Condiment|Content|Convergence|Cookie|Copse|Corben|Cormorant|Courgette|Cousine|Coustard|Creepster|Crushed|Cuprum|Cutive|Damion|Dangrek|Dekko|Delius|Devonshire|Dhurjati|Diplomata|Dokdo|Domine|Dorsa|Dosis|DotGothic16|Dynalight|Eater|Economica|Eczar|Electrolize|Elsie|Engagement|Englebert|Enriqueta|Epilogue|Esteban|Ewert|Exo|Fahkwang|Farro|Farsan|Fascinate|Fasthand|Faustina|Federant|Federo|Felipa|Fenix|Flamenco|Flavors|Fondamento|Forum|Fraunces|Freehand|Fresca|Frijole|Fruktur|Gabriela|Gaegu|Gafata|Galada|Galdeano|Galindo|Gayathri|Gelasio|Geo|Geostar|Gidugu|Girassol|Glegoo|Goldman|Gorditas|Gotu|Graduate|Grandstander|Grenze|Griffy|Gruppo|Gudea|Gugi|Gupter|Gurajada|Habibi|Halant|Hanalei|Handlee|Hanuman|Harmattan|Heebo|Hind|Homenaje|Iceberg|Iceland|Imbue|Imprima|Inconsolata|Inder|Inika|Inter|Italiana|Italianno|Itim|Jaldi|Jomhuria|Jomolhari|Jost|Jua|Judson|Julee|Junge|Jura|K2D|Kadwa|Kalam|Kameron|Kanit|Kantumruy|Karantina|Karla|Karma|Katibeh|Kavivanar|Kavoon|Kenia|Khand|Khmer|Khula|Knewave|KoHo|Kodchasan|Kosugi|Koulen|Kranky|Kreon|Kristi|Krub|Kufam|Kurale|Lacquer|Laila|Lalezar|Lancelot|Langar|Lateef|Lato|Ledger|Lekton|Lemon|Lemonada|Lexend|Limelight|Literata|Livvic|Lobster|Lora|Lusitana|Lustria|Macondo|Mada|Magra|Maitree|Mako|Mali|Mallanna|Mandali|Manjari|Manrope|Mansalva|Manuale|Marcellus|Margarine|Marmelad|Martel|Marvel|Mate|McLaren|Meddon|MedievalSharp|Megrim|Merienda|Merriweather|Metal|Metamorphous|Metrophobic|Michroma|Milonga|Miltonian|Mina|Miniver|Mirza|Mitr|Modak|Mogra|Molengo|Molle|Monda|Monofett|Monoton|Montaga|Montez|Montserrat|Moul|Moulpali|Mukta|Mulish|MuseoModerno|NTR|Neucha|Neuton|Newsreader|Niconne|Niramit|Nobile|Nokora|Norican|Nosifer|Notable|Numans|Nunito|Offside|Oi|Oldenburg|Oranienbaum|Orbitron|Oregano|Orienta|Oswald|Overlock|Overpass|Ovo|Oxanium|Oxygen|Pacifico|Padauk|Palanquin|Pangolin|Paprika|Parisienne|Pattaya|Pavanam|Peddana|Peralta|Petrona|Philosopher|Piazzolla|Piedra|Plaster|Play|Playball|Podkova|Poly|Pompiere|Poppins|Prata|Preahvihear|Pridi|Prociono|Prompt|Puritan|Quando|Quantico|Quattrocento|Questrial|Quicksand|Quintessential|Qwigley|Radley|Rajdhani|Rakkas|Raleway|Ramabhadra|Ramaraja|Rambla|Ranchers|Rancho|Ranga|Rasa|Rationale|Recursive|Redressed|Revalia|Ribeye|Righteous|Risque|Roboto|Rochester|Rokkitt|Romanesco|Rosario|Rosarivo|Rowdies|Rubik|Ruda|Rufina|Ruluko|Ruthie|Rye|Sacramento|Sahitya|Sail|Saira|Salsa|Sanchez|Sancreek|Sansita|Sarabun|Sarala|Sarina|Sarpanch|Satisfy|Scada|Scheherazade|Schoolbell|Sen|Sevillana|Shanti|Share|Shojumaru|Shrikhand|Siemreap|Signika|Simonetta|Sintony|Skranji|Slackey|Smokum|Smythe|Sniglet|Snippet|Sofia|Solway|Sora|Spartan|Spectral|Spinnaker|Spirax|Sriracha|Srisakdi|Staatliches|Stalemate|Stick|Stoke|Strait|Stylish|Sumana|Sunflower|Sunshiney|Sura|Suranna|Suravaram|Suwannaphum|Syncopate|Syne|Tajawal|Tangerine|Taprom|Tauri|Taviraj|Teko|Telex|Texturina|Thasadith|Tienne|Tillana|Timmana|Tinos|Tomorrow|Trirong|Trispace|Trocchi|Trochut|Truculenta|Trykker|Ubuntu|Ultra|UnifrakturCook|UnifrakturMaguntia|Unkempt|Unlock|Unna|VT323|Varela|Varta|Vibes|Vibur|Vidaloka|Viga|Voces|Volkhov|Vollkorn|Voltaire|Wallpoet|Warnes|Wellfleet|Yantramanav|Yellowtail|Yesteryear|Yrsa|Zeyada|'

// const font_array = fonts_name.split("|");
// var font_html = ``;
// for(var i = 0; font_array.length-1 > i; i++){
//   font_html += `<li onClick="changeTextFont('`+font_array[i]+`')"><span class="active_text" style="font-family:`+font_array[i]+`">Test</span><small style="font-family:Abel">`+font_array[i]+`</small></li>`;
// }
// setTimeout(function(){
//    $('ul#allFonts').html(font_html);
//    $('ul#allFonts').show();
// }, 500);

function openFontsTab(){
	$('.all_font_list_wrapper').css("display","block");
}
$('.close_font_tab').click(function(){
	$('.all_font_list_wrapper').css("display","none");
});
$('.back_font_btn').click(function(){
	$('.all_font_list_wrapper').css("display","none");
})


// Text color js
function openTextColorTab(){
	$('.text_color_wrapper').css("display","block");
}
$('.close_color_tab').click(function(){
	$('.text_color_wrapper').css("display","none");
});
$('.back_color_btn').click(function(){
	$('.text_color_wrapper').css("display","none");
});

$(document).on('hover','.color_box>input[name="text_color_input"]', function(){
	var color_code = $(this).attr('data-color-code');
	var color_name = $(this).attr('data-color-name');
	$('.selected_color>.color_box').css('background-color',color_code);
	$('.selected_color>.color_name').text(color_name);
})
$(document).on('mouseenter','.color_box>input[name="text_color_input"]', function(){
	var color_code = $(this).attr('data-color-code');
	var color_name = $(this).attr('data-color-name');
	$('.selected_color>.color_box').css('background-color',color_code);
	$('.selected_color>.color_name').text(color_name);
});
$(document).on('mouseleave','.color_box>input[name="text_color_input"]', function(){
	var selected_color = $(".color_box>input[name='text_color_input']:checked").attr('data-color-code');
    var selected_name = $(".color_box>input[name='text_color_input']:checked").attr('data-color-name');
    $('.selected_color>.color_box').css('background-color',selected_color);
	$('.selected_color>.color_name').text(selected_name);
});


// text outline js
function openTextOutlineTab() {
	$('.text_outline_wrapper').css("display","block");
}
$('.close_outline_tab').click(function(){
	$('.text_outline_wrapper').css("display","none");
});
$('.back_outline_btn').click(function(){
	$('.text_outline_wrapper').css("display","none");
});

$(document).on('hover','.color_box>input[name="text_outline_input"]', function(){
	var color_code = $(this).attr('data-color-code');
	var color_name = $(this).attr('data-color-name');
	$('.selected_outline_color>.color_box').css('background-color',color_code);
	$('.selected_outline_color>.color_name').text(color_name);
})
$(document).on('mouseenter','.color_box>input[name="text_outline_input"]', function(){
	var color_code = $(this).attr('data-color-code');
	var color_name = $(this).attr('data-color-name');
	$('.selected_outline_color>.color_box').css('background-color',color_code);
	$('.selected_outline_color>.color_name').text(color_name);
})
$(document).on('mouseleave','.color_box>input[name="text_outline_input"]', function(){
	var selected_color = $(".color_box>input[name='text_outline_input']:checked").attr('data-color-code');
    var selected_name = $(".color_box>input[name='text_outline_input']:checked").attr('data-color-name');
    $('.selected_outline_color>.color_box').css('background-color',selected_color);
	$('.selected_outline_color>.color_name').text(selected_name);
})

// $('.color_box>input[name="text_outline_input"]').hover(function() {
// 	var color_code = $(this).attr('data-color-code');
// 	var color_name = $(this).attr('data-color-name');
// 	$('.selected_outline_color>.color_box').css('background-color',color_code);
// 	$('.selected_outline_color>.color_name').text(color_name);
// });
// $(".color_box>input[name='text_outline_input']").mouseenter(function() {
//     var color_code = $(this).attr('data-color-code');
// 	var color_name = $(this).attr('data-color-name');
// 	$('.selected_outline_color>.color_box').css('background-color',color_code);
// 	$('.selected_outline_color>.color_name').text(color_name);
// }).mouseleave(function() {
//     var selected_color = $(".color_box>input[name='text_outline_input']:checked").attr('data-color-code');
//     var selected_name = $(".color_box>input[name='text_outline_input']:checked").attr('data-color-name');
//     $('.selected_outline_color>.color_box').css('background-color',selected_color);
// 	$('.selected_outline_color>.color_name').text(selected_name);
// });


// Text shape js

function openTextShapeTab(){
	$('.text_shape_wrapper').css("display","block");
}
$('.close_shape_tab').click(function(){
	$('.text_shape_wrapper').css("display","none");
});
$('.back_shape_btn').click(function(){
	$('.text_shape_wrapper').css("display","none");
});



// Change Art color js
function openArtColorTab() {
	$('.art_colors_wrapper').css("display","block");
}
$('.close_art_color_tab').click(function(){
	$('.art_colors_wrapper').css("display","none");
});
$('.back_art_color_btn').click(function(){
	$('.art_colors_wrapper').css("display","none");
});
$('.color_box>input[name="art_color_input"]').hover(function() {
	var color_code = $(this).attr('data-color-code');
	var color_name = $(this).attr('data-color-name');
	$('.selected_art_color>.color_box').css('background-color',color_code);
	$('.selected_art_color>.color_name').text(color_name);
});
$(".color_box>input[name='art_color_input']").mouseenter(function() {
    var color_code = $(this).attr('data-color-code');
	var color_name = $(this).attr('data-color-name');
	$('.selected_art_color>.color_box').css('background-color',color_code);
	$('.selected_art_color>.color_name').text(color_name);
}).mouseleave(function() {
    var selected_color = $(".color_box>input[name='art_color_input']:checked").attr('data-color-code');
    var selected_name = $(".color_box>input[name='art_color_input']:checked").attr('data-color-name');
    $('.selected_art_color>.color_box').css('background-color',selected_color);
	$('.selected_art_color>.color_name').text(selected_name);
});


// Change Image color js
function openImageColorTab() {
	$('.image_color_wrapper').css("display","block");
}
$('.close_image_color_tab').click(function(){
	$('.image_color_wrapper').css("display","none");
});
$('.back_image_color_btn').click(function(){
	$('.image_color_wrapper').css("display","none");
});
$('.color_box>input[name="image_color_input"]').hover(function() {
	var color_code = $(this).attr('data-color-code');
	var color_name = $(this).attr('data-color-name');
	$('.selected_image_color>.color_box').css('background-color',color_code);
	$('.selected_image_color>.color_name').text(color_name);
});
$(".color_box>input[name='image_color_input']").mouseenter(function() {
    var color_code = $(this).attr('data-color-code');
	var color_name = $(this).attr('data-color-name');
	$('.selected_image_color>.color_box').css('background-color',color_code);
	$('.selected_image_color>.color_name').text(color_name);
}).mouseleave(function() {
    var selected_color = $(".color_box>input[name='image_color_input']:checked").attr('data-color-code');
    var selected_name = $(".color_box>input[name='image_color_input']:checked").attr('data-color-name');
    $('.selected_image_color>.color_box').css('background-color',selected_color);
	$('.selected_image_color>.color_name').text(selected_name);
});


// change product variant 
function changeProductVariant(val){
	var front_thumb_img = $('.product_variant[data-variant="'+val+'"][data-style="front"]').attr('data-src');
	var back_thumb_img = $('.product_variant[data-variant="'+val+'"][data-style="back"]').attr('data-src');
	var right_thumb_img = $('.product_variant[data-variant="'+val+'"][data-style="right"]').attr('data-src');
	var left_thumb_img = $('.product_variant[data-variant="'+val+'"][data-style="left"]').attr('data-src');

	$('input[name="canvas_view_type"][view_type="front"]').length;

	if($('input[name="canvas_view_type"][view_type="front"]').length > 0){
		$('input[name="canvas_view_type"][view_type="front"]+.canvas_type_box img').attr('src', front_thumb_img);
	}
	if($('input[name="canvas_view_type"][view_type="back"]').length > 0){
		$('input[name="canvas_view_type"][view_type="back"]+.canvas_type_box img').attr('src', back_thumb_img);
	}
	if($('input[name="canvas_view_type"][view_type="right"]').length > 0){
		$('input[name="canvas_view_type"][view_type="right"]+.canvas_type_box img').attr('src', right_thumb_img);
	}
	if($('input[name="canvas_view_type"][view_type="left"]').length > 0){
		$('input[name="canvas_view_type"][view_type="left"]+.canvas_type_box img').attr('src', left_thumb_img);
	}


	// console.log(" front length : ", $('input[name="canvas_view_type"][view_type="front"]').length);

	// console.log(" Side length : ", $('input[name="canvas_view_type"][view_type="side"]').length);

	
	// $('input[name="canvas_view_type"]+.canvas_type_box img').attr('src', back_thumb_img);
	// $('input[name="canvas_view_type"]+.canvas_type_box img').attr('src', right_thumb_img);
	// $('input[name="canvas_view_type"]+.canvas_type_box img').attr('src', left_thumb_img);

	var canvas_view_type = $('.canvas_view_input[name="canvas_view_type"]:checked').attr('view_type')
	var selected_variant_img = $('.product_variant[data-variant="'+val+'"][data-style="'+canvas_view_type+'"]').attr('data-src');
	$('#customiserImage').attr('src', selected_variant_img);
}





document.addEventListener("DOMContentLoaded", function () {

	// Text Rotation slider
	window.textRotationSlider = document.getElementById('rotatTextRangeSlide');
      noUiSlider.create(window.textRotationSlider, {
        range: {
          min: -180,
          max: 180
        },
        start: [0],
        step: 1,
      });
      window.textRotationSlider.noUiSlider.on('change', function (values, handle) {
	    changeInputValue(parseInt(values[0]))
	  });

	// text Outline thickness slider
      window.clickPipsSlider = document.getElementById('textOutlineSlideThickness');
      noUiSlider.create(window.clickPipsSlider, {
        range: {
          min: 0,
          max: 10
        },
        start: [2],
        step: 2,
        pips: {mode: 'steps'}
      });
      var pips = window.clickPipsSlider.querySelectorAll('.noUi-value');
      function clickOnPipOutline() {
        var value = Number(this.getAttribute('data-value'));
        window.clickPipsSlider.noUiSlider.set(value);
        $("#textOutlineThickness").val(value);
        changeTextOutlineThick();
      }
      for (var i = 0; i < pips.length; i++) {
        pips[i].style.cursor = 'pointer';
        pips[i].addEventListener('click', clickOnPipOutline);
      }
      window.clickPipsSlider.noUiSlider.on('change', function (values, handle) {
	    $("#textOutlineThickness").val(parseInt(values[0]));
	    var selected_color = $(".color_box>input[name='text_outline_input']:checked").attr('data-color-code');
	    changeTextOutlineThick();
	  });


    // text shape slider
    //   window.shapeSettingSlider = document.getElementById('shapeSettingsSlider');
    //   noUiSlider.create(window.shapeSettingSlider, {
    //     range: {
    //       min: 0,
    //       max: 10
    //     },
    //     start: [2],
    //     step: 2,
    //     pips: {mode: 'steps'}
    //   });
    //   var pips = window.shapeSettingSlider.querySelectorAll('.noUi-value');
    //   function clickOnPipShape() {
    //     var value = Number(this.getAttribute('data-value'));
    //     window.shapeSettingSlider.noUiSlider.set(value);
    //   }
    //   for (var i = 0; i < pips.length; i++) {
    //     pips[i].style.cursor = 'pointer';
    //     pips[i].addEventListener('click', clickOnPipShape);
    //   }
    //   window.shapeSettingSlider.noUiSlider.on('change', function (values, handle) {
    //   	// add code when change the val
	//   });


	  // Art Rotation slider
	window.artRotationSlider = document.getElementById('rotatArtRangeSlide');
      noUiSlider.create(window.artRotationSlider, {
        range: {
          min: -180,
          max: 180
        },
        start: [0],
        step: 1,
      });
      window.artRotationSlider.noUiSlider.on('change', function (values, handle) {
	    changeArtInputValue(parseInt(values[0]))
	  });

	  // Image Rotation slider
	window.imageRotationSlider = document.getElementById('rotatImageRangeSlide');
      noUiSlider.create(window.imageRotationSlider, {
        range: {
          min: -180,
          max: 180
        },
        start: [0],
        step: 1,
      });
     
      window.imageRotationSlider.noUiSlider.on('change', function (values, handle) {
	    changeImageInputValue(parseInt(values[0]))
	  });
});


let current_height = 0
let text_boxheight = 0

// function when we change txt val in input
$('#textContent').on('input', function() {

	console.log(this.scrollHeight)
        if(current_height !== this.scrollHeight){
          current_height = this.scrollHeight        
          text_boxheight = text_boxheight + 20
          // $(this).height(this.scrollHeight);
          $(this).height(text_boxheight);
        }
      
        var textareaValue = $('#textContent').val();
        var lineBreakCount = 0;
    
        var index = textareaValue.indexOf('\n');
        while (index !== -1) {
          lineBreakCount++;
          index = textareaValue.indexOf('\n', index + 1);
        }
        $(this).height(20 * (lineBreakCount+1));
        console.log("Line break count: " + lineBreakCount);
});
// This focus will work when added text and need to blank input field. then it will work
$('#textContent').on('focus', function() {

	console.log(this.scrollHeight)
        if(current_height !== this.scrollHeight){
          current_height = this.scrollHeight        
          text_boxheight = text_boxheight + 20
          // $(this).height(this.scrollHeight);
          $(this).height(text_boxheight);
        }
      
        var textareaValue = $('#textContent').val();
        var lineBreakCount = 0;
    
        var index = textareaValue.indexOf('\n');
        while (index !== -1) {
          lineBreakCount++;
          index = textareaValue.indexOf('\n', index + 1);
        }
        $(this).height(20 * (lineBreakCount+1));
        console.log("Line break count: " + lineBreakCount);
    
});

// This focus will work when added text and need to blank input field. then it will work
$(document).on('focus','#editTextContent', function() {
	console.log(this.scrollHeight)
        if(current_height !== this.scrollHeight){
          current_height = this.scrollHeight        
          text_boxheight = text_boxheight + 20
          // $(this).height(this.scrollHeight);
          $(this).height(text_boxheight);
        }
      
        var textareaValue = $('#editTextContent').val();
        var lineBreakCount = 0;
    
        var index = textareaValue.indexOf('\n');
        while (index !== -1) {
          lineBreakCount++;
          index = textareaValue.indexOf('\n', index + 1);
        }
        $(this).height(20 * (lineBreakCount+1));
        console.log("Line break count: " + lineBreakCount);
});
// function when we change txt val in input
$(document).on('input','#editTextContent', function() {
	console.log(this.scrollHeight)
        if(current_height !== this.scrollHeight){
          current_height = this.scrollHeight        
          text_boxheight = text_boxheight + 20
          // $(this).height(this.scrollHeight);
          $(this).height(text_boxheight);
        }
      
        var textareaValue = $('#editTextContent').val();
        var lineBreakCount = 0;
    
        var index = textareaValue.indexOf('\n');
        while (index !== -1) {
          lineBreakCount++;
          index = textareaValue.indexOf('\n', index + 1);
        }
        $(this).height(20 * (lineBreakCount+1));
        console.log("Line break count: " + lineBreakCount);
});

// text font size increased functionality
$('#textFontSize').on('input', function() {
    var value = parseFloat($(this).val());
    // Round the value to the nearest tenth
    value = Math.round(value * 10) / 10;
    $(this).val(value);
  });



// Call color API for text

function getTextColor(){
	$.ajax({
        url: STORE_API_URL+'api/front-end/get-text-font-colors?shop_url='+STORE_URL,
        beforeSend: function() {
           $('.customiseLoader').css("display","flex");
        },
        success: function (response, status, xhr) {
        if(response.status == true){
        	var color_data = response.data;
        	var textColorHtml = `<div class="color_box" style="background-color: #000">
						<input type="radio" name="text_color_input" class="text_color_input" data-color-code='#000' data-color-name='Black' onclick="changeTextColor('#000000','Black')" checked />
						<span class="check_icon"><i class="fa fa-check"></i></span>
						<span class="box_outline"></span>
					</div>`;
        	for(var i = 0; i < color_data.length; i++){
        		if(color_data[i].color_name == 'Black'){
					// we skip this color because it is already taken by-default
				}else{
					var check_icon_color = "#fff";
					if(color_data[i].name.toLowerCase() == 'white'){
						check_icon_color = "#000";
					}
					textColorHtml += ` <div class="color_box" style="background-color: ${color_data[i].color};">
						<input type="radio" name="text_color_input" class="text_color_input" data-color-code='${color_data[i].color}' data-color-name='${color_data[i].name}' onclick="changeTextColor('${color_data[i].color}','${color_data[i].name}')" />
						<span class="check_icon" style="color:`+check_icon_color+`"><i class="fa fa-check"></i></span>
						<span class="box_outline"></span>
					</div>`;	
				}        		 
        	}
        	$('.text_body_color .all_colors_list').html(textColorHtml);
        
        }
       $('.customiseLoader').css("display","none");
      },
      error: function (jqXhr, textStatus, errorMessage) {
        console.log("Error => ",errorMessage);
        $('.customiseLoader').css("display","none");
      }
    })
}

getTextColor();

// Call text outline color API

function getTextOutlineColor(){
	$.ajax({
        url: STORE_API_URL+'api/front-end/get-text-outline-colors?shop_url='+STORE_URL,
        beforeSend: function() {
           $('.customiseLoader').css("display","flex");
        },
        success: function (response, status, xhr) {
        if(response.status == true){
        	var color_data = response.data;
        	var textOutlineColorHtml = `<div class="color_box" style="background-color: transparent;border:1px solid #cacaca">
					<span class="color_none_icon">X</span>
					<input type="radio" name="text_outline_input" class="text_color_input" data-color-code="#00000000" data-color-name="none" onclick="changeTxtOutlineColor('#00000000', 'none')" checked />
					<span class="check_icon"><i class="fa fa-check"></i></span>
					<span class="box_outline"></span>
				</div>`;
        	for(var i = 0; i < color_data.length; i++){
				var check_icon_color = "#fff";
				if(color_data[i].name.toLowerCase() == 'white'){
					check_icon_color = "#000";
				}
				textOutlineColorHtml += `<div class="color_box" style="background-color: ${color_data[i].color};">
					<input type="radio" name="text_outline_input" class="text_color_input" data-color-code="${color_data[i].color}" data-color-name="${color_data[i].name}" onclick="changeTxtOutlineColor('${color_data[i].color}','${color_data[i].name}')" />
					<span class="check_icon"><i class="fa fa-check"></i></span>
					<span class="box_outline"></span>
				</div>`;	
				     		 
        	}
        	$('.outline_color_container  .all_outline_colors_list').html(textOutlineColorHtml);
        
        }
       $('.customiseLoader').css("display","none");
      },
      error: function (jqXhr, textStatus, errorMessage) {
        console.log("Error => ",errorMessage);
        $('.customiseLoader').css("display","none");
      }
    })
}

getTextOutlineColor();


// call all font family api
function getAllFontAPI(){
	$.ajax({
        url: STORE_API_URL+'api/front-end/get-all-fonts?shop_url='+STORE_URL,
        beforeSend: function() {
           $('.customiseLoader').css("display","flex");
        },
        success: function (response, status, xhr) {
        if(response.status == true){
        	all_font = response.data;
        	console.log("font family data => ", all_font);
        	if(all_font.length > 0){
        		var all_font_list = ``;
        		var css_font_face = ``;
        		
        		for(var i = 0; i < all_font.length; i++){
        			all_font_list += `<li onclick="changeTextFont('`+all_font[i].name+`','`+all_font[i].image+`')"><span class="active_text" style="font-family:`+all_font[i].name+`">Test</span><small style="font-family:Abel">`+all_font[i].name+`</small></li>`;
        			css_font_face += `@font-face {font-family: '`+all_font[i].name+`'; src: url('`+all_font[i].image+`');}`
        			if(i==0){
        				active_font_family = all_font[i].name;
        				$('#defaultFont').attr('font-name',all_font[i].name);
        				$('#defaultFont').attr('font-url',all_font[i].image);
        			}
        		}

        		$('ul#allFonts').html(all_font_list);
        		var newStyle = document.createElement('style');
				newStyle.appendChild(document.createTextNode(css_font_face));
				document.head.appendChild(newStyle);
				$('ul#allFonts').show();

        	}else{
        		console.log("Empty font Category!")
        	}
        	
        
        }
       $('.customiseLoader').css("display","none");
      },
      error: function (jqXhr, textStatus, errorMessage) {
        console.log("Error => ",errorMessage);
        $('.customiseLoader').css("display","none");
      }
    })
} 

getAllFontAPI();

var colors = ["rgb(153, 72, 155)", "rgb(56, 81, 163)", "rgb(92, 179, 170)", "rgb(240, 81, 35)", "rgb(54, 153, 99)"];

function getRandomColor() {
	var getRandomColor = colors[Math.floor(Math.random() * colors.length)];
	return getRandomColor;
} 

// Call font category API

function getFontCategoryAPI(){
	$.ajax({
        url: STORE_API_URL+'api/front-end/get-text-font-list?shop_url='+STORE_URL,
        beforeSend: function() {
           $('.customiseLoader').css("display","flex");
        },
        success: function (response, status, xhr) {
        if(response.status == true){
        	var font_cat_data = response.data;
        	if(font_cat_data.length > 0){
        		var font_cat_option = ``;
        		var font_cat_list = ``;
        		
        		let last_bg_color = '';
        		let color_count = 1;
        		for(var i = 0; i < font_cat_data.length; i++){
        			
        			let bg_color = colors[color_count];
        			color_count++;
        			if(color_count > colors.length){
        				color_count = 0;
        			}
        			var cat_id_name = font_cat_data[i].name.toLowerCase();
        			cat_id_name = cat_id_name.trim();
        			cat_id_name = cat_id_name.replaceAll(" ", "");
        			cat_id_name = cat_id_name+"Fonts";
        			font_cat_option += `<li onclick="showFont('`+font_cat_data[i].id+`','`+cat_id_name+`','`+font_cat_data[i].name+`')" category_id="`+font_cat_data[i].id+`" category_element_id="`+cat_id_name+`" style="background-color:`+bg_color+`">`+font_cat_data[i].name+`</li>`;
        			font_cat_list += `<ul id="`+cat_id_name+`" class="font_list"></ul>`;
        			last_bg_color = bg_color;
        		}

        		$('#fontCategory').append(font_cat_option);
        		$('.fontCategoryList').append(font_cat_list);


        	}else{
        		console.log("Empty font Category!")
        	}
        	console.log("category data data => ", font_cat_data);
        
        }
       $('.customiseLoader').css("display","none");
      },
      error: function (jqXhr, textStatus, errorMessage) {
        console.log("Error => ",errorMessage);
        $('.customiseLoader').css("display","none");
      }
    })
}

getFontCategoryAPI();

// open fonts category lists
function showFont(cat_id, ele_id, name){
	if(ele_id == 'fontCategory'){
		$('.font_cat_link').hide();
	}else{
		$('.font_cat_link').show();
	}

	$('.font_list').hide();
	$('.font_header>h4').text(name);
	console.log("elemrnt id => ", ele_id);
	if( ($('#'+ele_id+'>li').length == 0) && (ele_id != 'fontCategory')){
		$.ajax({
	        url: STORE_API_URL+'api/front-end/get-text-sub-font-list/'+cat_id+'?shop_url='+STORE_URL,
	        beforeSend: function() {
	           $('.customiseLoader').css("display","flex");
	        },
	        success: function (response, status, xhr) {
	        if(response.status == true){
	        	var font_data = response.data;
	        	if(font_data.length > 0){
	        		var font_option = ``;

	        		let font_text = truncateString(canvas.getActiveObject().text, 10);
        			
	        		for(var i = 0; i < font_data.length; i++){
	        			var cat_id_name = font_data[i].name.toLowerCase();
	        			cat_id_name = cat_id_name.trim();
	        			cat_id_name = cat_id_name.replaceAll(" ", "");
	        			cat_id_name = cat_id_name+"Fonts";
	        			font_option += `<li onclick="changeTextFont('`+font_data[i].name+`','`+font_data[i].image+`')"><span class="active_text" style="font-family:`+font_data[i].name+`">`+font_text+`</span><small style="font-family:Abel">`+font_data[i].name+`</small></li>`;
	        		}

	        		$('#'+ele_id).append(font_option);

	        	}else{
	        		console.log("Empty font Category!")
	        	}	        
	        }
	       $('.customiseLoader').css("display","none");
	       $('#'+ele_id).show();
	      },
	      error: function (jqXhr, textStatus, errorMessage) {
	        console.log("Error => ",errorMessage);
	        $('.customiseLoader').css("display","none");
	      }
	    })
	}else{
		$('#'+ele_id).show();
	}
	
	
	
}

// call search font API when hit enter button
$("#serachFont").keypress(function(e) {
    if(e.which == 13){
    	var search_val = $(this).val();
    	$(this).val('');
    	$('.font_header>h4').text(search_val);
    	$('.font_list').hide();
        $.ajax({
	        url: STORE_API_URL+'api/front-end/get-all-fonts?shop_url='+STORE_URL+'&name='+search_val,
	        beforeSend: function() {
	           $('.customiseLoader').css("display","flex");
	        },
	        success: function (response, status, xhr) {
	        if(response.status == true){
	        	var font_data = response.data;
	        	if(font_data.length > 0){
	        		var font_option = ``;

	        		let font_text = truncateString(canvas.getActiveObject().text, 10);
        			
	        		for(var i = 0; i < font_data.length; i++){
	        			
	        			font_option += `<li onclick="changeTextFont('`+font_data[i].name+`','`+font_data[i].image+`')"><span class="active_text" style="font-family:`+font_data[i].name+`">`+font_text+`</span><small style="font-family:Abel">`+font_data[i].name+`</small></li>`;
	        		}

	        		$('#searchFonts').html(font_option);

	        	}else{
	        		console.log("Empty font Category!");
	        		$('#searchFonts').html(`<li>No match found!</li>`);
	        	}	        
	        }
	       $('.customiseLoader').css("display","none");
	       $('#searchFonts').show();
	       $('.font_cat_link').show();
	      },
	      error: function (jqXhr, textStatus, errorMessage) {
	        console.log("Error => ",errorMessage);
	        $('.customiseLoader').css("display","none");
	      }
	    })
    }
});

// Art category API

function mainArtCategory(){
	$.ajax({
        url: STORE_API_URL+'api/front-end/get-art-category-list?shop_url='+STORE_URL,
        beforeSend: function() {
           $('.customiseLoader').css("display","flex");
        },
        success: function (response, status, xhr) {
        if(response.status == true){
        	
        	var data = response.data;
        	if(data.length > 0){
        		var art_category_html = '';
        		for(var i = 0; i < data.length; i++){
        			var randomColor = getRandomColor();
        			let parent_class_name = data[i].name.replace(/[^a-zA-Z0-9 ]/g, "");
		    		parent_class_name = parent_class_name.trim().toLowerCase().replaceAll(" ", "_");
		    		parent_class_name = parent_class_name.replace("__", "_");
        		    art_category_html += '<li><div class="open_child_options title_image" data-id="'+data[i].id+'" style="background-color: '+data[i].background_color+'"><img loading="lazy" src="'+data[i].background_image+'" /><span>'+data[i].name+'</span></div><ul class="child_1 art_category_option '+parent_class_name+'_child" level="1" parent_menu="Artwork Categories"></ul></li>';
        		} 

        		$('.art_design_wrapper>ul.parent').html(art_category_html);

        		console.log("Art Categories html => ", art_category_html);
        	}else{
        		console.log("Empty Art Category!")
        	}
        }
       $('.customiseLoader').css("display","none");
      },
      error: function (jqXhr, textStatus, errorMessage) {
        console.log("Error => ",errorMessage);
        $('.customiseLoader').css("display","none");
      }
    })
}

mainArtCategory();


function subArtCategory(id){
	var id_array = id.split("/");
	console.log("Id is => ", id_array);
	if(id_array.length == 3){
		$.ajax({
	        url: STORE_API_URL+'api/front-end/get-art-sub-category-sub-list/'+id+'?shop_url='+STORE_URL,
	        beforeSend: function() {
	           $('.customiseLoader').css("display","flex");
	        },
	        success: function (response, status, xhr) {
	        if(response.status == true){
	        	console.log("=> ", response.data);
	        	
	        	var data = response.data;

	        	console.log(data[0].sub_category)
	        	if(data[0].sub_category != undefined){
		        	if(data[0].sub_category.length > 0){
		        		sub_data = data[0].sub_category;

		        		if(sub_data[0].sub_category_list != undefined){
		        			if(sub_data[0].sub_category_list.length > 0){
				        		sub_cat_data = sub_data[0].sub_category_list;

				        		let parent_class_name = sub_cat_data[0].name.replace(/[^a-zA-Z0-9 ]/g, "");
							    parent_class_name = parent_class_name.trim().toLowerCase().replaceAll(" ", "_");
							    parent_class_name = parent_class_name.replace("__", "_");
							    console.log("class name => ", parent_class_name);

				        		if(sub_cat_data[0].sub_category_sub_list != undefined){
				        			if(sub_cat_data[0].sub_category_sub_list.length > 0){
				        				
				        				var sub_cat_art = sub_cat_data[0].sub_category_sub_list;
				        				var art_category_html = '';
						        		for(var i = 0; i < sub_cat_art.length; i++){
						        		    
						        		    art_category_html += `<li onclick="addArtDesign('`+sub_cat_art[i].image+`')"><span><img loading="lazy" src="`+sub_cat_art[i].image+`" /></span></li>`;
						        		} 

						        		$('.art_design_wrapper>ul.parent ul.'+parent_class_name+'_child').html(art_category_html);
						        		console.log("Art Categories html => ", art_category_html);

				        			}else{
						        		console.log("Empty Art Category!")
						        	}
			        			}
				        	}
		        		}
		        	}else{
		        		console.log("Empty Art Category!")
		        	}
		        }
	        }
	       $('.customiseLoader').css("display","none");
	      },
	      error: function (jqXhr, textStatus, errorMessage) {
	        console.log("Error => ",errorMessage);
	        $('.customiseLoader').css("display","none");
	      }
	    })
	}else if(id_array.length == 2){
		$.ajax({
	        url: STORE_API_URL+'api/front-end/get-art-sub-category/'+id+'?shop_url='+STORE_URL,
	        beforeSend: function() {
	           $('.customiseLoader').css("display","flex");
	        },
	        success: function (response, status, xhr) {
	        if(response.status == true){
	        	console.log("=> ", response.data);
	        	
	        	var data = response.data;

	        	console.log(data[0].sub_category)
	        	if(data[0].sub_category != undefined){
		        	if(data[0].sub_category.length > 0){
		        		sub_data = data[0].sub_category;


		        		let parent_class_name = sub_data[0].name.replace(/[^a-zA-Z0-9 ]/g, "");
					    parent_class_name = parent_class_name.trim().toLowerCase().replaceAll(" ", "_");
					    parent_class_name = parent_class_name.replace("__", "_");
					    console.log("class name => ", parent_class_name);
		        		if(sub_data[0].sub_category_list != undefined){
		        			if(sub_data[0].sub_category_list.length > 0){

				        		sub_cat_data = sub_data[0].sub_category_list;

					        		var art_category_html = '';
					        		for(var i = 0; i < sub_cat_data.length; i++){
					        		    

					        		    var cat_class = "art_category_option";
					        		    if(sub_cat_data[i].child_list == 'art_image'){
					        		    	cat_class = "art_img_option";
					        		    }

					        		    if(sub_cat_data[i].image == null){
					        		    let art_class_name = sub_cat_data[i].name.replace(/[^a-zA-Z0-9 ]/g, "");
					        		    art_class_name = art_class_name.trim().toLowerCase().replaceAll(" ", "_");
					        		    art_class_name = art_class_name.replace("__", "_");
					        		    
				        		    	var data_id = data[0].id+"/"+sub_data[0].id+"/"+sub_cat_data[i].id;
					        		    art_category_html += '<li><div class="open_child_options art_sub_title" data-id='+data_id+'>'+sub_cat_data[i].name+'</div><ul class="child_3 '+cat_class+' '+art_class_name+'_child" level="3" parent_menu="'+sub_data[0].name+'"></ul></li>';
					        			}else{
					        		    art_category_html += `<li onclick="addArtDesign('`+sub_cat_data[i].image+`')"><span><img loading="lazy" src="`+sub_cat_data[i].image+`" /></span></li>`;
					        			}
					        		} 

					        		$('.art_design_wrapper>ul.parent ul.'+parent_class_name+'_child').html(art_category_html);
					        		console.log("Art Categories html => ", art_category_html);
				        		
				        	}else{
				        		console.log("Empty Art Category!")
				        	}
		        		}
			        		
		        		
		        	}else{
		        		console.log("Empty Art Category!")
		        	}
		        }
	        }
	       $('.customiseLoader').css("display","none");
	      },
	      error: function (jqXhr, textStatus, errorMessage) {
	        console.log("Error => ",errorMessage);
	        $('.customiseLoader').css("display","none");
	      }
	    })
	}else{
		$.ajax({
	        url: STORE_API_URL+'api/front-end/get-art-category/'+id+'?shop_url='+STORE_URL,
	        beforeSend: function() {
	           $('.customiseLoader').css("display","flex");
	        },
	        success: function (response, status, xhr) {
	        if(response.status == true){
	        	console.log("=> ", response.data);
	        	
	        	var data = response.data;

	        	let parent_class_name = data[0].name.replace(/[^a-zA-Z0-9 ]/g, "");
			    parent_class_name = parent_class_name.trim().toLowerCase().replaceAll(" ", "_");
			    parent_class_name = parent_class_name.replace("__", "_");
			    console.log("class name => ", parent_class_name);

	        	console.log(data[0].sub_category)
	        	if(data[0].sub_category != undefined){
		        	if(data[0].sub_category.length > 0){
		        		sub_data = data[0].sub_category;
		        		
			        		var art_category_html = '';
			        		for(var i = 0; i < sub_data.length; i++){
			        		    let art_class_name = sub_data[i].name.replace(/[^a-zA-Z0-9 ]/g, "");
			        		    art_class_name = art_class_name.trim().toLowerCase().replaceAll(" ", "_");
			        		    art_class_name = art_class_name.replace("__", "_");

			        		    var cat_class = "art_category_option";
			        		    if(sub_data[i].child_list == 'art_image'){
			        		    	cat_class = "art_img_option";
			        		    }
			        		    
			        		    var data_id = data[0].id+"/"+sub_data[i].id;
			        		    art_category_html += '<li><div class="open_child_options art_sub_title" data-id='+data_id+'>'+sub_data[i].name+'</div><ul class="child_2 '+cat_class+' '+art_class_name+'_child" level="2" parent_menu="'+data[0].name+'"></ul></li>';
			        		} 

			        		$('.art_design_wrapper>ul.parent ul.'+parent_class_name+'_child').html(art_category_html);
			        		console.log("Art Categories html => ", art_category_html);
		        		
		        	}else{
		        		console.log("Empty Art Category!")
		        	}
		        }
	        }
	       $('.customiseLoader').css("display","none");
	      },
	      error: function (jqXhr, textStatus, errorMessage) {
	        console.log("Error => ",errorMessage);
	        $('.customiseLoader').css("display","none");
	      }
	    })
	}
	
}


