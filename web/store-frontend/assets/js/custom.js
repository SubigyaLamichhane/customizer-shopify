function ChooseSettingtab(tab, name){
	$('.ct_content_tab').removeClass("active_tab");
	$('.settings_title_wrapper>ul>li').removeClass("active");
	$('li.'+tab+'_tab').addClass("active");
	$('#'+name).addClass("active_tab");
}
$('.close_content_tab').click(function(){
	$('.ct_content_tab').removeClass("active_tab");
	$('.settings_title_wrapper>ul>li').removeClass("active");
	$('#defaultSettings').addClass("active_tab");
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
        return char === char.toLowerCase() ? map[char.toUpperCase()] :
map[char];
        };
        return char.toUpperCase();

        });
};

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
		heading_text = heading_text.replace(/[^a-zA-Z ]/g, "");
		heading_text = heading_text.trim().toLowerCase().replaceAll(" ", "_");
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
		pre_menu_text = pre_menu_text.replace(/[^a-zA-Z ]/g, "");
		pre_menu_text = pre_menu_text.trim().toLowerCase().replaceAll(" ", "_");
		$('.art_header .back_btn').attr("current-option", pre_menu_text);
		$(this).attr("level", current_level);
	}
});


 setTimeout(function(){
  $.measureText = function(html, fontOptions) { 
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

