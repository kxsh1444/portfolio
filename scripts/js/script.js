/*-----------------------------------------------------------------------------------

 	Script - custom frontend jQuery sfunctions
 
-----------------------------------------------------------------------------------*/
(function(){
'use strict';

// REORGANIZE ISOTOPE FUNCTION
function reorganizeIsotope() {
	jQuery('.masonry').each(function(){
		var $container = jQuery(this);
		var maxitemwidth = $container.data('maxitemwidth');
		if (!maxitemwidth) { maxitemwidth = 370; }
		var itemmargin = parseInt($container.children('div').css('marginRight')) + parseInt($container.children('div').css('marginLeft'), 10);
		var containerwidth = Math.ceil(($container.width() - itemmargin));
		var rows = Math.ceil(containerwidth/maxitemwidth);
		var marginperrow = (rows-1)*itemmargin;
		var newitemmargin = marginperrow / rows;
		var itemwidth = Math.floor((containerwidth/rows)-newitemmargin - 1);
		$container.children('div').css({ 'width': itemwidth+'px' });
		if ($container.children('div').hasClass('isotope-item')) { $container.isotope( 'reLayout' ); }
	});
}


// STICKY FOTTER to be finished later...
function stickyfooter() {
	var footerHeight = jQuery("footer").height();
	jQuery("#page-content").css({'minHeight': jQuery(window).height()+'px'});
	jQuery("footer").css({'position':'absolute','bottom':'0','left':'0'});
	jQuery("#page-content").append('<div id="footer-pseudo"></div>');
	jQuery("#footer-pseudo").css({'height': footerHeight+'px'});
}


// SMOOTH SHOW FUNCION FOR ELEMENTS THAT TAKE ACTION WHEN VISIBLE (animations & skills, etc)
function smoothShow() {

	/* -- A N I M A T I O N S -- */
	jQuery('.has-animation').each(function() {
		var thisItem = jQuery(this);
		if (jQuery(window).width() > 700) {
			var visible = thisItem.visible(true);
			var delay = thisItem.attr("data-delay");
			if (!delay) { delay = 0; }
			if (thisItem.hasClass( "animated" )) {} 
			else if (visible) {
				thisItem.delay(delay).queue(function(){thisItem.addClass('animated');});
			}
		} else {
			thisItem.addClass('animated');	
		}
	});
	
	/* -- S K I L L -- */
	jQuery('.skill').each(function() {
		var thisItem = jQuery(this);
		var visible = thisItem.visible(true);
		var percent = thisItem.find('.skill-bar .skill-active ').attr('data-perc');
		if (thisItem.hasClass( "anim" )) {} 
		else if (visible) {
			var randomval = Math.floor(Math.random() * (300 - 50 + 1)) + 50;
			thisItem.addClass("anim");
			thisItem.find('.skill-bar .skill-active ').animate({'width': percent+'%',}, 2000, 'easeInOutQuart', function(){
				jQuery(this).find('.tooltip').delay(randomval).animate({'opacity':1}, 500);	
			}).css('overflow', 'visible');
		}
	});
		
}


jQuery(window).load(function() {		
	

	
	/*---------------------------------------------- 
			HIDE PAGE LAODER AND SMOOTH SHOW
	------------------------------------------------*/
	jQuery("#page-loader .page-loader-inner").delay(500).fadeIn(10, function(){
		jQuery(this).fadeOut(500,function() {
			jQuery("#page-loader").fadeOut(500);
		});
	});
	/*---------------------------------------------- 
			HOVER OVER WORDS FOR EXAPNDED STUFF
	------------------------------------------------*/

                //On hover change words, learned about data- tag! yay!
                var specialWords = document.getElementsByClassName("hoverWord");
                for(let word of specialWords){
                    word.addEventListener('mouseenter', function(){
                        this.innerHTML = this.getAttribute('data-words').split("|")[1];
                        this.style.color = "#90D4C5";
                    });
                    word.addEventListener('mouseleave', function(){
                        this.innerHTML = this.getAttribute('data-words').split("|")[0];
                        this.style.color = "#737373";
                    });
                }
	/*---------------------------------------------- 
		PARALLAX TO BE IMPLEMENTED
	------------------------------------------------*/
	if(jQuery().parallax) { 
		jQuery('.parallax-section').parallax();
	}
	
	
	if( jQuery().isotope ) {
		
		/*---------------------------------------------- 
					  CALL ISOTOPPPEE   
		------------------------------------------------*/	
		jQuery('.masonry').each(function(){
			var $container = jQuery(this);
			
			$container.imagesLoaded( function(){
				$container.isotope({
					itemSelector : '.masonry-item',
					transformsEnabled: true			// Important for videos
				});	
			});
		});
		/*---------------------------------------------- 
					 ISOTOPE: FILTER
		------------------------------------------------*/
		jQuery('.masonry-filter').on("click", "li a", function() { 
			var thisItem = jQuery(this);
			var parentul = thisItem.parents('ul.filter').data('related-grid');
			thisItem.parents('ul.filter').find('li a').removeClass('active');
			thisItem.addClass('active');
			
			var selector = thisItem.attr('data-filter-value');
			jQuery('#'+parentul).isotope({ filter: selector }, function(){ });
			
			return false;
		});
		
		
		reorganizeIsotope();
			
		jQuery(window).resize(function() {
			reorganizeIsotope();
		});
	} /* END if isotope */
		

	/*---------------------------------------------- 
		OPEN NAV
	------------------------------------------------*/
	jQuery('header').on("click", ".open-nav", function() { 
		jQuery('header').toggleClass('nav-is-open'); 
		return false;
	});
	
	/*---------------------------------------------- 
				 S C R O L L   D O W N - lo key don't get why it don't work...probably has to do with my jquery version, but i have dependencies from other parts that need it...
	------------------------------------------------*/
	jQuery('#scrollArrow').on("click", function() { 
		jQuery('html,body').animate({ scrollTop: jQuery("#showcase").offset().top}, 1000, 'easeInOut');
		return false;						   
	});
	
	/*---------------------------------------------- 
				W O L F   P A R A L L A X grabbed from AVOC
	------------------------------------------------*/
	if(jQuery().wolf) { 
		
		jQuery('.wolf-grid').wolf();
		/*---------------------------------------------- 
					 W O L F : Filter
		------------------------------------------------*/
		jQuery('.wolf-filter').on("click", "li a", function() { 
			var thisItem = jQuery(this);

			var parentul = thisItem.parents('ul.wolf-filter').data('related-grid');
			thisItem.parents('ul.filter').find('li a').removeClass('active');
			thisItem.addClass('active');
			
			jQuery('html,body').animate({ scrollTop: jQuery("#"+parentul).offset().top-parseInt(jQuery("#header-filter").height(), 10)-100}, 500, 'easeInOutQuart');
			
			var selector = thisItem.attr('data-filter-value');
			jQuery('#'+parentul).wolf({ filter: selector, filtertype: 'hide' });
			
			return false;
		});
		
	}
	
	
	/*---------------------------------------------- 
				H E A D E R   O P T I O N 
				   (hide/show elements)
	------------------------------------------------*/
	jQuery(window).scroll(function() { 
		var scrollPos = jQuery( window ).scrollTop();
            $('.site-tagline').css({
                'opacity' : 1-(scrollPos/250),
            });
            if(scrollPos<200){
                $('.site-content').css({
                    "webkit-filter": "blur("+80/(0.1*scrollPos**1.2+1)+"px)",
                    "moz-filter":"blur("+80/(0.1*scrollPos**1.2+1)+"px)",
                    "ms-filter":"blur("+80/(0.1*scrollPos**1.2+1)+"px)",
                    "o-filter":"blur("+80/(0.1*scrollPos**1.2+1)+"px)",
                    "filter":"blur("+80/(0.1*scrollPos**1.2+1)+"px)"
                    }); 
                }else{$('.site-content').css({
                    "webkit-filter": "blur(0px)",
                    "moz-filter":"blur(0px)",
                    "ms-filter":"blur(0px)",
                    "o-filter":"blur(0px)",
                    "filter":"blur(0px)"
                }); 
            }
	});
		
	
	
	/*---------------------------------------------- 
			R E S P O N S I V E   N A V
	------------------------------------------------*/
	jQuery('#main-nav').on("click", "li > a", function() {
		var thisItem = jQuery(this); 
		if (thisItem.siblings('ul.submenu').length > 0 && thisItem.siblings('ul.submenu').css('display') === 'none') {
			thisItem.siblings('ul.submenu').slideDown(400);
			return false;	
		}
	});
	
	
	/*---------------------------------------------- 
			O P E N / C L O S E   Filter & Share
	------------------------------------------------*/
	jQuery('header').on("click", ".open-filter", function() { 
		jQuery('#header-filter').addClass('filter-is-open');
		jQuery('html,body').animate({ scrollTop: jQuery("#"+jQuery(this).data('related-grid')).offset().top-parseInt(jQuery("#header-filter").height(), 10)-100}, 1000, 'easeInOutQuart');
		return false;
	});
	jQuery('header').on("click", ".close-filter", function() {  jQuery('#header-filter').removeClass('filter-is-open'); return false; });
	
	/* share */
	jQuery('header').on("click", ".open-share", function() { jQuery('#header-share').addClass('share-is-open'); return false; });
	jQuery('header').on("click", ".close-share", function() {  jQuery('#header-share').removeClass('share-is-open'); return false; });
	
	
	
	/*---------------------------------------------- 
				 INLINE VIDEO
	------------------------------------------------*/
	jQuery('body').on("click", ".inline-video", function() { 
		var el = jQuery(this);
		var type = el.data('type');
		var video = el.data('videoid');
				
		if (type === 'youtube') { 
		var iframe='<iframe src="http://www.youtube.com/embed/'+video+'?autoplay=1" width="100%" height="100%" frameborder="0" allowfullscreen ></iframe>';
		} else if (type === 'vimeo') {
		var iframe='<iframe src="https://player.vimeo.com/video/'+video+'?autoplay=1" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>';
		}
		
		el.append('<div class="inline-iframe-container"></div>');
		el.find(".inline-iframe-container").html(iframe+'<div class="close-inline-video"></div>');
		
		setTimeout(function() {
			el.addClass('active');
		}, 1000);
		
		return false;
	});
	
	jQuery('body').on("click", ".close-inline-video", function() { 
		var thisItem = jQuery(this); 
		thisItem.parents( ".inline-video" ).removeClass('active');
		thisItem.parent( ".inline-iframe-container" ).remove();
		return false;
	});

	stickyfooter();	
		
});

jQuery(window).resize(function() { 
	stickyfooter(); 
});

jQuery( window ).scroll(function() {
	smoothShow();
});

})(jQuery);
