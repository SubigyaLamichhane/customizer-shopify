

let canvasObj = {};

function ChooseSettingtab(tab, name){
	$('.ct_content_tab').removeClass("active_tab");
	$('.settings_title_wrapper>ul>li').removeClass("active");
	$('li.'+tab+'_tab').addClass("active");
	$('#'+name).addClass("active_tab");
	$('.art_design_wrapper>.parent ul').removeClass("active_art_tab");
	$('.top_layer').css("display","block");
	$('.child_layer').css("display","none");
}
$('.close_content_tab').click(function(){
	$('.ct_content_tab').removeClass("active_tab");
	$('.settings_title_wrapper>ul>li').removeClass("active");
	$('#defaultSettings').addClass("active_tab");
	$('.top_layer').css("display","block");
	$('.child_layer').css("display","none");
	$('.art_design_wrapper>.parent ul').removeClass("active_art_tab");
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

$(".open_child_options").click(function (){
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
	}
})

$(".art_header .back_btn").click(function() {
	var current_attr = $(this).attr("current-option");
	var get_level = $(this).attr("level");
	var pre_menu_text = $('.'+current_attr+"_child").attr("parent_menu");
	var current_level = get_level-1;
	
	if(current_level < 1){
		$('.'+current_attr+'_child').removeClass("active_art_tab");
		$('.art_header .back_btn').css("display","none");
		$('.art_header h4').text("Artwork Categories");
		$('.art_header .back_btn').attr("current-option", "");
		$('.art_header .back_btn').attr("level", 0);
	}else{
		$('.'+current_attr+'_child').removeClass("active_art_tab");
		$('.art_header h4').text(pre_menu_text);
    console.log('heading text => ', pre_menu_text);
		pre_menu_text = pre_menu_text.replace(/[^a-zA-Z0-9 ]/g, "");
		pre_menu_text = pre_menu_text.trim().toLowerCase().replaceAll(" ", "_");
    pre_menu_text = pre_menu_text.replace("__", "_");
		$('.art_header .back_btn').attr("current-option", pre_menu_text);
		$(this).attr("level", current_level);
	}
});


setTimeout(function(){
  $.measureText = function(html, fontOptions) { 
  	// console.log(fontOptions)
    fontOptions = $.extend({
      fontSize: '1em',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontFamily: 'arial'
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
var fonts_name = 'ABeeZee|Abel|Aclonica|Acme|Actor|Adamina|Akronim|Aladin|Alata|Alatsi|Aldrich|Alef|Alegreya|Aleo|Alice|Alike|Allan|Allerta|Allura|Almarai|Almendra|Amarante|Amaranth|Amethysta|Amiko|Amiri|Amita|Anaheim|Andada|Andika|Angkor|Antic|Anton|Antonio|Arapey|Arbutus|Archivo|Arimo|Arizonia|Armata|Arsenal|Artifika|Arvo|Arya|Asap|Asar|Asset|Assistant|Astloch|Asul|Athiti|Atma|Aubrey|Audiowide|Average|B612|Bahiana|Bahianita|Ballet|Balthazar|Bangers|Barlow|Barriecito|Barrio|Basic|Baskervville|Battambang|Baumans|Bayon|Belgrano|Bellefair|Belleza|Bellota|BenchNine|Benne|Bentham|Bevan|Bilbo|BioRhyme|Biryani|Bitter|Blinker|Bokor|Bonbon|Boogaloo|Brawler|Buda|Buenard|Bungee|Butcherman|Cabin|Cagliostro|Cairo|Caladea|Calistoga|Calligraffitti|Cambay|Cambo|Candal|Cantarell|Capriola|Cardo|Carme|Castoro|Catamaran|Caudex|Caveat|Changa|Chango|Charm|Charmonman|Chathura|Chenla|Chewy|Chicle|Chilanka|Chivo|Chonburi|Cinzel|Coda|Codystar|Coiny|Combo|Comfortaa|Commissioner|Condiment|Content|Convergence|Cookie|Copse|Corben|Cormorant|Courgette|Cousine|Coustard|Creepster|Crushed|Cuprum|Cutive|Damion|Dangrek|Dekko|Delius|Devonshire|Dhurjati|Diplomata|Dokdo|Domine|Dorsa|Dosis|DotGothic16|Dynalight|Eater|Economica|Eczar|Electrolize|Elsie|Engagement|Englebert|Enriqueta|Epilogue|Esteban|Ewert|Exo|Fahkwang|Farro|Farsan|Fascinate|Fasthand|Faustina|Federant|Federo|Felipa|Fenix|Flamenco|Flavors|Fondamento|Forum|Fraunces|Freehand|Fresca|Frijole|Fruktur|Gabriela|Gaegu|Gafata|Galada|Galdeano|Galindo|Gayathri|Gelasio|Geo|Geostar|Gidugu|Girassol|Glegoo|Goldman|Gorditas|Gotu|Graduate|Grandstander|Grenze|Griffy|Gruppo|Gudea|Gugi|Gupter|Gurajada|Habibi|Halant|Hanalei|Handlee|Hanuman|Harmattan|Heebo|Hind|Homenaje|Iceberg|Iceland|Imbue|Imprima|Inconsolata|Inder|Inika|Inter|Italiana|Italianno|Itim|Jaldi|Jomhuria|Jomolhari|Jost|Jua|Judson|Julee|Junge|Jura|K2D|Kadwa|Kalam|Kameron|Kanit|Kantumruy|Karantina|Karla|Karma|Katibeh|Kavivanar|Kavoon|Kenia|Khand|Khmer|Khula|Knewave|KoHo|Kodchasan|Kosugi|Koulen|Kranky|Kreon|Kristi|Krub|Kufam|Kurale|Lacquer|Laila|Lalezar|Lancelot|Langar|Lateef|Lato|Ledger|Lekton|Lemon|Lemonada|Lexend|Limelight|Literata|Livvic|Lobster|Lora|Lusitana|Lustria|Macondo|Mada|Magra|Maitree|Mako|Mali|Mallanna|Mandali|Manjari|Manrope|Mansalva|Manuale|Marcellus|Margarine|Marmelad|Martel|Marvel|Mate|McLaren|Meddon|MedievalSharp|Megrim|Merienda|Merriweather|Metal|Metamorphous|Metrophobic|Michroma|Milonga|Miltonian|Mina|Miniver|Mirza|Mitr|Modak|Mogra|Molengo|Molle|Monda|Monofett|Monoton|Montaga|Montez|Montserrat|Moul|Moulpali|Mukta|Mulish|MuseoModerno|NTR|Neucha|Neuton|Newsreader|Niconne|Niramit|Nobile|Nokora|Norican|Nosifer|Notable|Numans|Nunito|Offside|Oi|Oldenburg|Oranienbaum|Orbitron|Oregano|Orienta|Oswald|Overlock|Overpass|Ovo|Oxanium|Oxygen|Pacifico|Padauk|Palanquin|Pangolin|Paprika|Parisienne|Pattaya|Pavanam|Peddana|Peralta|Petrona|Philosopher|Piazzolla|Piedra|Plaster|Play|Playball|Podkova|Poly|Pompiere|Poppins|Prata|Preahvihear|Pridi|Prociono|Prompt|Puritan|Quando|Quantico|Quattrocento|Questrial|Quicksand|Quintessential|Qwigley|Radley|Rajdhani|Rakkas|Raleway|Ramabhadra|Ramaraja|Rambla|Ranchers|Rancho|Ranga|Rasa|Rationale|Recursive|Redressed|Revalia|Ribeye|Righteous|Risque|Roboto|Rochester|Rokkitt|Romanesco|Rosario|Rosarivo|Rowdies|Rubik|Ruda|Rufina|Ruluko|Ruthie|Rye|Sacramento|Sahitya|Sail|Saira|Salsa|Sanchez|Sancreek|Sansita|Sarabun|Sarala|Sarina|Sarpanch|Satisfy|Scada|Scheherazade|Schoolbell|Sen|Sevillana|Shanti|Share|Shojumaru|Shrikhand|Siemreap|Signika|Simonetta|Sintony|Skranji|Slackey|Smokum|Smythe|Sniglet|Snippet|Sofia|Solway|Sora|Spartan|Spectral|Spinnaker|Spirax|Sriracha|Srisakdi|Staatliches|Stalemate|Stick|Stoke|Strait|Stylish|Sumana|Sunflower|Sunshiney|Sura|Suranna|Suravaram|Suwannaphum|Syncopate|Syne|Tajawal|Tangerine|Taprom|Tauri|Taviraj|Teko|Telex|Texturina|Thasadith|Tienne|Tillana|Timmana|Tinos|Tomorrow|Trirong|Trispace|Trocchi|Trochut|Truculenta|Trykker|Ubuntu|Ultra|UnifrakturCook|UnifrakturMaguntia|Unkempt|Unlock|Unna|VT323|Varela|Varta|Vibes|Vibur|Vidaloka|Viga|Voces|Volkhov|Vollkorn|Voltaire|Wallpoet|Warnes|Wellfleet|Yantramanav|Yellowtail|Yesteryear|Yrsa|Zeyada|'

const font_array = fonts_name.split("|");
var font_html = ``;
for(var i = 0; font_array.length-1 > i; i++){
  font_html += `<li onClick="changeTextFont('`+font_array[i]+`')"><span class="active_text" style="font-family:`+font_array[i]+`">Test</span><small style="font-family:arial">`+font_array[i]+`</small></li>`;
}
setTimeout(function(){
   $('ul#allFonts').html(font_html);
}, 500);

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
$('.color_box>input[name="text_color_input"]').hover(function() {
	var color_code = $(this).attr('data-color-code');
	var color_name = $(this).attr('data-color-name');
	$('.selected_color>.color_box').css('background-color',color_code);
	$('.selected_color>.color_name').text(color_name);
});
$(".color_box>input[name='text_color_input']").mouseenter(function() {
    var color_code = $(this).attr('data-color-code');
	var color_name = $(this).attr('data-color-name');
	$('.selected_color>.color_box').css('background-color',color_code);
	$('.selected_color>.color_name').text(color_name);
}).mouseleave(function() {
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
$('.color_box>input[name="text_outline_input"]').hover(function() {
	var color_code = $(this).attr('data-color-code');
	var color_name = $(this).attr('data-color-name');
	$('.selected_outline_color>.color_box').css('background-color',color_code);
	$('.selected_outline_color>.color_name').text(color_name);
});
$(".color_box>input[name='text_outline_input']").mouseenter(function() {
    var color_code = $(this).attr('data-color-code');
	var color_name = $(this).attr('data-color-name');
	$('.selected_outline_color>.color_box').css('background-color',color_code);
	$('.selected_outline_color>.color_name').text(color_name);
}).mouseleave(function() {
    var selected_color = $(".color_box>input[name='text_outline_input']:checked").attr('data-color-code');
    var selected_name = $(".color_box>input[name='text_outline_input']:checked").attr('data-color-name');
    $('.selected_outline_color>.color_box').css('background-color',selected_color);
	$('.selected_outline_color>.color_name').text(selected_name);
});


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





