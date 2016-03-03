"use strict";
/**
 * General Custom JS Functions
 *
 * @author     Themovation <themovation@gmail.com>
 * @copyright  2014 Themovation INC.
 * @license    http://themeforest.net/licenses/regular
 * @version    1.1
 */

/*
 # Helper Functions
 # On Window Resize
 # On Window Load
 */

//======================================================================
// Helper Functions
//======================================================================


function UpdateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
}

//-----------------------------------------------------
// NAVIGATION - Adds support for Mobile Navigation
// Detect screen size, add / subtract data-toggle
// for mobile dropdown menu.
//-----------------------------------------------------	
function themo_support_mobile_navigation(){

    // If mobile navigation is active, add data attributes for mobile touch / toggle
    if (Modernizr.mq('(max-width: 767px)')) {
        //console.log('Adding data-toggle, data-target');
        jQuery("li.dropdown .dropdown-toggle").attr("data-toggle", "dropdown");
        jQuery("li.dropdown .dropdown-toggle").attr("data-target", "#");
    }

    // If mobile navigation is NOT active, remove data attributes for mobile touch / toggle
    if (Modernizr.mq('(min-width:768px)')) {
        //console.log('Removing data-toggle, data-target');
        jQuery("li.dropdown .dropdown-toggle").removeAttr("data-toggle", "dropdown");
        jQuery("li.dropdown .dropdown-toggle").removeAttr("data-target", "#");
    }

    /*
     Support for Old Browsers | OLD IE | Might need this after testing.
     var windowWidth = jQuery( window ).width();
     if(windowWidth > 767){
     console.log('Remove data-toggle');
     jQuery("li.dropdown .dropdown-toggle").removeAttr("data-toggle", "dropdown");
     jQuery("li.dropdown .dropdown-toggle").removeAttr("data-target", "#");
     }else {
     if(windowWidth < 767){
     console.log('Adding data-toggle');
     jQuery("li.dropdown .dropdown-toggle").attr("data-toggle", "dropdown");
     jQuery("li.dropdown .dropdown-toggle").attr("data-target", "#");
     }
     }*/
}



//-----------------------------------------------------
// ANIMATION - Adds support for CS3 Animations
// Check if element is visible after scrolling
//-----------------------------------------------------	
function themo_animate_scrolled_into_view(elem,animation,time_to_delay){

    // If elem does not exist, break.
    if(!jQuery(elem).length){
        return false;
    }

    // If an anmiated class has already beed added, then skip it.
    if (jQuery(elem).is('.slideUp, .slideDown, .slideLeft, .slideRight, .fadeIn')) {
        //console.log('skip');
    }else{

        var offset = 0; // Off set from bottom of screen
        var offset_large = jQuery(window).height() - 700; // Offset for tall images.
        //console.log('Window Height '+jQuery(window).height())

        var docViewTop = jQuery(window).scrollTop(); // top of window position
        //console.log('Window Top '+docViewTop)

        var docViewBottom = docViewTop + jQuery(window).height(); // bottom of window position
        //console.log('Window Bottom '+docViewBottom)

        var elemTop = jQuery(elem).offset().top; // Top of element position
        //console.log(elem.selector + ' Top '+elemTop)

        var elemBottom = elemTop + jQuery(elem).height(); // bottom of element position
        //console.log(elem.selector + ' Height '+jQuery(elem).height())
        //console.log(elem.selector + ' Bottom '+elemBottom)

        //console.log("----------------------------");

        /*
         Caveat:	We are working with a numbered positions so if X has highter numbered pos (100) than Y does(50), it actually has a lower phyisial position on the screen.
         If the top of the windows position is 100 is X has a position of 150, it means that X is lower on the page than the top of the window.

         1) IF the bottom of element is physically lower than the top of the Window.
         > e.g. Bottom elem = 100 and the top of window is 50, means bottom of elem has a lower physical position than the top of window
         > This could happen when the element bottom enters from the top of the window.

         2) IF the top of element is physically higher than the bottom of (the Window + offset).
         > e.g. Top elem = 100 and the bottom of window is 150, means top of elem is above the bottom of the window
         > This could happen when the element top enteres from the bottom of the window.

         #3 and #4 ensure that the entire element is inside the window so the animation won't kick in until the whole thing is visible and between the top and bottom of the window.

         3) IF the bottom of the element is above the bottom of the screen.
         > e.g. bottom of elem = 100 and bottom of window = 150, means bottom of elem is above the bottom of the window
         > This could happen when the element bottom enteres from the bottom of the window.

         4) IF the top of the element is lower than the top of the window.
         > e.g. top of elem = 100 and top of window = 50, means top of elem is lower than the top of the window
         > This could happen when the element top enteres from the top of the window.

         #5 & #6	For the edge case where the elem is taller than the window, so at one point the top is above the window and bottom is below.
         To resovle this we use offset, to prompt the elme to animate once we know its top or bottom is into the screen deep enough to be animated.

         5) IF top of elem is above (bottom of window - large offset)

         6) If bottom of elem is below (top of window + large offest) */


        if(((elemBottom >= docViewTop) && (elemTop <= docViewBottom-offset) && (elemBottom <= docViewBottom-offset) &&  (elemTop >= docViewTop)) ||
            ((elemTop <= docViewBottom-offset_large) && (elemBottom >= docViewTop+offset_large))){

            setTimeout(
                function()
                {
                    //console.log(elem.selector)
                    jQuery(elem).addClass(animation);
                }, time_to_delay);

        }
    }

};



//-----------------------------------------------------
// VERTICAL ALIGN TOUR Meta Copy - Adds support for
// vertical alignment by detecting height of tour boxes
// and setting container box height
//-----------------------------------------------------	

function themo_vertical_align_tour(){

    // Loop through all .float-block's
    jQuery( ".float-block" ).each(function() {

        //grab #parentID
        var parentID = jQuery( this ).closest("section").attr("id");
        //console.log("Parent ID is: "+parentID);

        jQuery("#"+parentID).css('height','auto');

        // Get height of #parentID .container
        var containerHeight = jQuery("#"+parentID+' .container').height();
        //console.log("Parent container height is: "+containerHeight);

        // Set #parentID height from .container
        jQuery("#"+parentID).height(containerHeight+'px');
        //console.log("Parent ID height is set at : "+containerHeight);

        //console.log("----------------------------");

    });
}

//-----------------------------------------------------
// VERTICAL ALIGN ROOMS Meta Copy - Adds support for
// vertical alignment by detecting height of room boxes
// and setting container box height
//-----------------------------------------------------

function themo_vertical_align_room_thumb(){

    // Loop through all .float-block's
    jQuery( ".rooms-item" ).each(function() {

        //grab #parentID
        var parentID = jQuery( this ).closest("div").attr("id");
        //console.log("Parent ID is: "+parentID);

        jQuery("#"+parentID).css('height','auto');

        // Get height of #parentID .container
        var containerHeight = jQuery("#"+parentID+' .room-wrap').height();
        //console.log("Parent container height is: "+containerHeight);

        // Set #parentID height from .container
        jQuery("#"+parentID).height(containerHeight+'px');
        //console.log("Parent ID height is set at : "+containerHeight);

        //console.log("----------------------------");

    });

    jQuery(".room-center").css('visibility','visible');
}


//-----------------------------------------------------
// Adjust Padding for Transparent Header
// Need to adjust padding if transparent header is enabled,
// since we'll be using position: absolute and that will cause
// padding issues with the first page header or slider.
//-----------------------------------------------------	

function themo_adjust_padding_transparent_header(elem){

    // Check if Transparency is enabled.
    if(jQuery('body').find('header.banner[data-transparent-header="true"]').length > 0) {

        // Get the height of the navigation header
        var headerHeight = parseInt(jQuery("header.banner").height());
        //console.log('DIGGITY DOG!');
        //console.log('Header Height '+headerHeight);

        // Adjust Padding for all sliders and page headers.

		
		
        //jQuery( "#main-flex-slider .themo_slider_0, section#themo_page_header_1" ).each(function() {
        jQuery( elem ).each(function() {
            // Get current padding
            var currentPadding = parseInt(jQuery(this).css("padding-top").replace(/[^-\d\.]/g, ''));
            //console.log('Current Padding '+currentPadding);

            // Calculate
            var newPadding = currentPadding+headerHeight;
            //console.log('New Padding '+newPadding);

            // Adjust and set new padding.
            jQuery(this).css({
                "padding-top":newPadding+"px"
            });

            //console.log("----------------------------");

        });

    };

}

//-----------------------------------------------------
// Detect if touch device via modernizr, return true
//-----------------------------------------------------	
function themo_is_touch_device(checkScreenSize){

    if (typeof checkScreenSize === "undefined" || checkScreenSize === null) {
        checkScreenSize = true;
    }

    var deviceAgent = navigator.userAgent.toLowerCase();

    var isTouch = Modernizr.touch ||
        (deviceAgent.match(/(iphone|ipod|ipad)/) ||
        deviceAgent.match(/(android)/)  ||
        deviceAgent.match(/iphone/i) ||
        deviceAgent.match(/ipad/i) ||
        deviceAgent.match(/ipod/i) ||
        deviceAgent.match(/blackberry/i));

    if(checkScreenSize){
        var isMobileSize = Modernizr.mq('(max-width:767px)');
    }else{
        var isMobileSize = false;
    }

    if(isTouch || isMobileSize ){
        return true;
    }

    return false;
}

//-----------------------------------------------------
// Initiate PARALLAX
//-----------------------------------------------------
function themo_start_parallax(isTouch){

    var $body = jQuery(".parallax-bg").parents(".preloader");

    //-----------------------------------------------------
    // Select all parallax elemnts and start stellar script
    // Don't start stellar if viewer is a touch device
    // Use imagesLoaded to detect when images are loaded, until
    // then use a preloader gif
    //-----------------------------------------------------
    var posts = document.querySelectorAll('.parallax-bg');
    imagesLoaded( posts, function() { // Detect when images have been loaded (preloader)
        // Do not use if a touch device!
        if(!isTouch){
            themo_startStellar();
        }
        $body.removeClass('loading').addClass('loaded'); // once images are loaded, remove preloader animation
    });
}


//-----------------------------------------------------
// Disable Transparent Header for Mobile
//-----------------------------------------------------
function themo_no_transparent_header_for_mobile(isTouch){

    if (jQuery(".navbar[data-transparent-header]").length) {
        if(isTouch){
            jQuery('.navbar').attr("data-transparent-header", "false");
        }
        else{
            jQuery('.navbar').attr("data-transparent-header", "true");
        }
    }
}

//-----------------------------------------------------
// Initiate Steller (PARALLAX library)
//-----------------------------------------------------
function themo_startStellar(){
    jQuery.stellar({
        horizontalScrolling: false,
        //verticalOffset: 145
    });
}

//-----------------------------------------------------
// Initiate Masonry
//-----------------------------------------------------	
function themo_start_masonry(){
    // If masonry elements exist, start using script.
    if (jQuery('.mas-blog').length > 0) {  // it exists
        var container = document.querySelector('.mas-blog');
        var msnry = new Masonry( container, {
            // options
            columnWidth: '.mas-blog-post',
            itemSelector: '.mas-blog-post'
        });
    }
}

//-----------------------------------------------------
// Active Lightbox
//-----------------------------------------------------	
function themo_active_lightbox(){
    // delegate calls to data-toggle="lightbox"
    jQuery(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
        event.preventDefault();
        return jQuery(this).ekkoLightbox({
            always_show_close: true,
            gallery_parent_selector: '.gallery',
            right_arrow_class: '.flex-next',
            left_arrow_class: '.flex-prev'
        });
    });
}

//-----------------------------------------------------
// Adjust Pricing Table Height
//-----------------------------------------------------

function themo_adjust_pricing_table_height(){

    var $tallestCol;

    // For each pricing-table element
    jQuery('.pricing-table').each(function(){
        $tallestCol = 0;

        // Find the plan name
        jQuery(this).find('> div .pricing-title').each(function(){
            (jQuery(this).height() > $tallestCol) ? $tallestCol = jQuery(this).height() : $tallestCol = $tallestCol;
        });

        // Safety net increase pricing tables height couldn't be determined
        if($tallestCol == 0) $tallestCol = 'auto';

        // set even height
        jQuery(this).find('> div .pricing-title').css('height',$tallestCol);

        // FEATURES UL
        jQuery(this).find('> div .features').each(function(){
            (jQuery(this).height() > $tallestCol) ? $tallestCol = jQuery(this).height() : $tallestCol = $tallestCol;
        });

        // Safety net incase pricing tables height couldn't be determined
        if($tallestCol == 0) $tallestCol = 'auto';

        // Set even height
        jQuery(this).find('> div .features').css('height',$tallestCol);

        // END FEATURES UL

    });
}

//-----------------------------------------------------
// Initiate Thumbnail Slider (flexslider)
//-----------------------------------------------------

function themo_start_thumb_slider(id) {
    jQuery(id).flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: true,
        slideshow: false,
        itemWidth: 255,
        itemMargin: 40,
        maxItems: 4,
        prevText: '',
        nextText: '',
        start: function(){
            jQuery('.thumb-flex-slider .slides img').show();

        }
        //controlsContainer: '.flex-container'
        //useCSS: false
    });
}

//-----------------------------------------------------
// Initiate Slider (flexslider)
//-----------------------------------------------------
function themo_start_flex_slider(flex_selector,themo_flex_animation, themo_flex_easing,
                                 themo_flex_animationloop, themo_flex_smoothheight, themo_flex_slideshowspeed, themo_flex_animationspeed,
                                 themo_flex_randomize, themo_flex_pauseonhover, themo_flex_touch, themo_flex_directionnav,themo_flex_controlNav){
    // SETUP FLEXSLIDER OPTIONS
    // Remove ajax_loader.gif from Formidable Plugin
    jQuery("img.frm_ajax_loading").remove();
    jQuery(flex_selector).flexslider({
        animation: themo_flex_animation,
        smoothHeight: themo_flex_smoothheight,
        easing: themo_flex_easing,
        animationLoop: themo_flex_animationloop,
        slideshowSpeed: themo_flex_slideshowspeed,
        animationSpeed: themo_flex_animationspeed,
        randomize: themo_flex_randomize,
        pauseOnHover: themo_flex_pauseonhover,
        touch: themo_flex_touch,
        directionNav: themo_flex_directionnav,
        controlNav: themo_flex_controlNav,
        //directionNav: false,
        prevText: '',
        nextText: '',
        start: function (slider) {
            //slider.removeClass( "flexpreloader");
            jQuery('body').addClass('loaded');
        },
        after: function (slider) {

        },
        before: function () {

        }
    });
}

//-----------------------------------------------------
// Scroll Up
//-----------------------------------------------------
function themo_start_scrollup() {

    jQuery.scrollUp({
        animationSpeed: 200,
        animation: 'fade',
        scrollSpeed: 500,
        scrollImg: { active: true, type: 'background', src: '../../images/top.png' }
    });
};



function themo_disable_animation_for_mobile() {

    //console.log('Disable touch for mobile');
    // Detect and set isTouch for touch screens
    var isTouchAnimation = themo_is_touch_device(false);

    if(isTouchAnimation){
        jQuery(".hide-animation").removeClass("hide-animation");
        //jQuery.each.removeClass("hide-animation");
    }
};


function themo_init_one_page_scroll(){

    /* When page loads, set first link to active. */
    if(jQuery('nav ul.navbar-nav .th-anchor').hasClass( "active" )){
        jQuery('nav ul.navbar-nav .th-anchor').removeClass('active');
        jQuery('nav ul.navbar-nav .th-anchor-top').addClass('active');
    }


    /* Cache some variables */
    var slide = jQuery('section').parent('div') ;
    var mywindow = jQuery(window);
    var htmlbody = jQuery('html,body');
    var isTouch = themo_is_touch_device(false);

    /* Smooth Scroll */
    jQuery(document)
        .on('click', 'a[href*="#"]', function() {

            /* If click originates from Accordion Toggle, exit. */
            var isAccordion = jQuery( this ).hasClass( "accordion-toggle" );

            var isTab = jQuery( this ).attr('data-toggle');

            if (isAccordion || isTab) {
                //console.log('abort, exit completely out of click handler');
                return;
            }

            if ( this.hash && this.pathname === location.pathname && this.host === location.host) {
                var slashedHash = '#/' + this.hash.slice(1);
                if ( this.hash ) {
                    if ( slashedHash === location.hash ) {

                        // There are a few offsets that need to be calculated
                        var smoothScroll_offset = 0;
                        var navbar_collapse_offset = 0;
                        if (jQuery("header").hasClass("headhesive--clone")) {
                            smoothScroll_offset = jQuery(".headhesive--clone").height() ;
                            if(jQuery("header nav.navbar-collapse").hasClass("in")){
                                navbar_collapse_offset = jQuery("header nav.navbar-collapse.in").height() ;
                                smoothScroll_offset =  smoothScroll_offset - navbar_collapse_offset;
                            }

                        }

                        jQuery.smoothScroll({offset: -smoothScroll_offset, scrollTarget: this.hash,
                            beforeScroll: function() { // Close Mobile Menu
                                var bsNav = jQuery('header .navbar-collapse');

                                if (bsNav.hasClass("collapse in")) {
                                    bsNav.removeClass("in");
                                    //mainNav.removeClass("open");
                                }
                            },
                            afterScroll: function() {  // Update Active Links, but not for mobile / touch
                                if(!isTouch){
                                    var links = jQuery('nav ul.navbar-nav').find('li.th-anchor a');

                                    jQuery(links).each(function() {
                                        var hashtag = jQuery(this).attr('href').split('#')[1];
                                        if(hashtag === this.hash){
                                            jQuery(this).parent('li').addClass('active');
                                        }else{
                                            jQuery(this).parent('li').removeClass('active');
                                        }
                                    });
                                }
                            }

                        });
                    } else {
                        jQuery.bbq.pushState(slashedHash);
                    }
                    return false;
                }
            }
        })
        .ready(function() {
            jQuery(window).bind('hashchange', function(event) {
                var tgt = location.hash.replace(/^#\/?/,'');

                if ( document.getElementById(tgt) ) {

                    // There are a few offsets that need to be calculated
                    var smoothScroll_offset = 0;
                    var navbar_collapse_offset = 0;
                    if (jQuery("header").hasClass("headhesive--clone")) {
                        smoothScroll_offset = jQuery(".headhesive--clone").height() ;
                        if(jQuery("header nav.navbar-collapse").hasClass("in")){
                            navbar_collapse_offset = jQuery("header nav.navbar-collapse.in").height() ;
                            smoothScroll_offset =  smoothScroll_offset - navbar_collapse_offset;
                        }
                    }



                    jQuery.smoothScroll({offset: -smoothScroll_offset, scrollTarget: '#' + tgt,
                        beforeScroll: function() { // Close Mobile Menu
                            var bsNav = jQuery('header .navbar-collapse');

                            if (bsNav.hasClass("collapse in")) {
                                bsNav.removeClass("in");
                                //mainNav.removeClass("open");
                            }
                        },
                        afterScroll: function() {  // Update Active Links, but not for mobile / touch
                            if(!isTouch){
                                var links = jQuery('nav ul.navbar-nav').find('li.th-anchor a');

                                jQuery(links).each(function() {
                                    var hashtag = jQuery(this).attr('href').split('#')[1];
                                    if(hashtag === tgt){
                                        jQuery(this).parent('li').addClass('active');
                                    }else{
                                        jQuery(this).parent('li').removeClass('active');
                                    }
                                });
                            }
                        }

                    });
                }
            });
            jQuery(window).trigger('hashchange');
        });


    if(!isTouch){
        //Setup waypoints plugin
        slide.waypoint(function (direction) {

            var links = jQuery('nav ul.navbar-nav').find('li.th-anchor a');
            //cache the variable of the data-slide attribute associated with each slide
            var dataslide = jQuery(this).attr('id');
            if(typeof dataslide != 'undefined'){

                jQuery(links).each(function() {
                    var hashtag = jQuery(this).attr('href').split('#')[1];
                    if(hashtag === dataslide){
                        //console.log('Add Class to '+ hashtag);
                        jQuery(this).parent('li').addClass('active');
                    }else{
                        //console.log('Remove Class from '+ hashtag);
                        jQuery(this).parent('li').removeClass('active');
                    }
                });
            }
        }, {
            offset: function() {
                if (jQuery("header").hasClass("headhesive--clone")) {
                    return jQuery(".headhesive--clone").height() ;
                }else{
                    return 0;
                }
            }

        });
    }

    //waypoints doesnt detect the first slide when user scrolls back up to the top so we add this little bit of code, that removes the class
    //from navigation link slide 2 and adds it to navigation link slide 1. 
    if(!isTouch){
        mywindow.scroll(function () {
            if (mywindow.scrollTop() == 0) {
                if(jQuery('nav ul.navbar-nav .th-anchor').hasClass('active')){
                    jQuery('nav ul.navbar-nav .th-anchor').removeClass('active');
                    jQuery('nav ul.navbar-nav .th-anchor-top').addClass('active');
                }
            }
        });
    }

};

function themo_init_isotope() {
    // filter items on click handler
    jQuery('.rooms-filters').on( 'click', 'a', function(e) {

        e.preventDefault();

        // Get Data-filter value
        var filterValue = jQuery(this).attr('data-filter');

        // Get Parent Class
        if (filterValue == '*') {
            console.log('NOTHING')
            var parent_class = jQuery(this).closest('section').attr("id");
        } else {
            var parent_class = jQuery(filterValue).closest('section').attr("id");
        }

        // Remove .current class from all a links inside .rooms-filters
        jQuery('#'+parent_class+' .rooms-filters a').removeClass( "current" );

        // Add .current class to current filter link.
        jQuery(this).addClass( "current" );

        //console.log(filterValue);
        //console.log(parent_class);

        // Get the container element to initialize isotope.
        var $container = jQuery('#'+parent_class+' .rooms-row');
        // init
        $container.isotope({
            // options
            itemSelector: '.rooms-item',
            layoutMode: 'fitRows',
        });

        $container.isotope({ filter: filterValue });

    });
}

var nice = false;

/**
 * Protect window.console method calls, e.g. console is not defined on IE
 * unless dev tools are open, and IE doesn't define console.debug
 */
(function() {
    if (!window.console) {
        window.console = {};
    }
    // union of Chrome, FF, IE, and Safari console methods
    var m = [
        "log", "info", "warn", "error", "debug", "trace", "dir", "group",
        "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
        "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
    ];
    // define undefined methods as noops to prevent errors
    for (var i = 0; i < m.length; i++) {
        if (!window.console[m[i]]) {
            window.console[m[i]] = function() {};
        }
    }
})();

//======================================================================
// Executes when HTML-Document is loaded and DOM is ready
//======================================================================
jQuery(document).ready(function($) {
    "use strict";

    // If flex slider loading then wait a max of 5 seconds.
    // else check if images are loaded
    if (jQuery("#main-flex-slider")[0]){
        // Do nothing / flex will figure it out.
        //console.log('Let Flex Take Care of It');
        setTimeout(function(){
            console.log('Took too long, timeout and clear preloader');
            jQuery('body').addClass('loaded');
        }, 10000);
    }else{
        jQuery('body').addClass('loaded');
    }

    // Add support for mobile navigation
    themo_support_mobile_navigation($);


    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        console.log('Smooth Scroll Off (Safari).');
    }else{
        try
        {
            // Initialise with options
            nice = jQuery("html").niceScroll({
                zindex:20000,
                scrollspeed:60,
                mousescrollstep:60,
                cursorborderradius: '10px', // Scroll cursor radius
                cursorborder: '1px solid rgba(255, 255, 255, 0.4)',
                cursorcolor: 'rgba(0, 0, 0, 0.6)',     // Scroll cursor color
                //autohidemode: 'true',     // Do not hide scrollbar when mouse out
                cursorwidth: '10px',       // Scroll cursor width

            });
        }
        catch (err) {
            console.log('Smooth Scroll Off.');
        }
    }

    // WP Booking System - move label to placeholder.

    /*jQuery(".wpbs-form form :input").each(function(index, elem) {
     var eId = jQuery(elem).attr("id");
     var label = null;
     if (eId && (label = jQuery(elem).parents("form").find("label[for="+eId+"]")).length == 1) {
     jQuery(elem).attr("placeholder", $(label).html());
     //jQuery(label).remove();
     }
     });*/


});


// WP Booking system show
jQuery( ".wpbs-container" ).show('fast','swing');

// WP Booking system Error message.
jQuery( document ).ajaxComplete(function() {
    var $error_msg_div = jQuery(".wpbs-form-item").filter(function() { return !(jQuery(this).find('*').is(':input')); })
    jQuery($error_msg_div.addClass('wpbs-form-error-msg'));

});

//======================================================================
// On Window Load - executes when complete page is fully loaded, including all frames, objects and images
//======================================================================
jQuery(window).load(function($) {
    "use strict";

    // Disable animation for mobile.
    themo_disable_animation_for_mobile();

    // Vertically Align Tour Copy
    themo_vertical_align_tour();

    // Vertically Align Room Thumb
    themo_vertical_align_room_thumb();

    // Adjust padding for transparent header
    themo_adjust_padding_transparent_header('section#themo_page_header_1');

    // Preloader for background images.
    var $header_preloader = jQuery(".full-header-img").parents(".preloader");

    //-----------------------------------------------------
    // Select all full header img classes and wait until images are loaded
    // before updating loading class to loaded
    //-----------------------------------------------------
    var full_header_imgs = document.querySelectorAll('.full-header-img');
    imagesLoaded( full_header_imgs, function() { // Detect when images have been loaded (preloader)
        $header_preloader.removeClass('loading').addClass('loaded'); // once images are loaded, remove preloader animation
    });

    // Detect and set isTouch for touch screens
    var isTouch = themo_is_touch_device();

    // Initiate Parallax Script
    themo_start_parallax(isTouch);

    // Disable Transparent Header for Mobile / touch
    themo_no_transparent_header_for_mobile(isTouch);

    // Initiate Masonry Script
    themo_start_masonry();

    // Initiate Lightbox
    themo_active_lightbox();

    // Adjust Pricing Table Height
    themo_adjust_pricing_table_height();

    // Start Scroll Up
    themo_start_scrollup();


    // Headhesive
    //var header = new Headhesive('.navbar-static-top');

    // Set options
    if(!isTouch){
        var options = {
            // Scroll offset. Accepts Number or "String" (for class/ID)
            offset: 125, // OR — offset: '.classToActivateAt',

            classes: {
                clone:   'headhesive--clone',
                stick:   'headhesive--stick',
                unstick: 'headhesive--unstick'
            }
        };

        try
        {
            // Initialise with options
            var banner = new Headhesive('.banner', options);
            jQuery('body').addClass('headhesive');
        }
        catch (err) {
            console.log('Sticky Header Off.');
        }
    }else{
        console.log('Sticky Header Off.');
    }


    // setup one page scrolling
    themo_init_one_page_scroll();

    // Headhesive destroy
    // banner.destroy();

    // start isotope
    themo_init_isotope();

});

//======================================================================
// On Window Resize
//======================================================================
jQuery(window).resize(function($){
    "use strict";
    // Detect and set isTouch for touch screens
    var isTouch = themo_is_touch_device();


    // Add support for mobile navigation
    themo_support_mobile_navigation();

    // Vertically Align Tour Copy
    themo_vertical_align_tour();

    // Vertically Align Room Thumb
    themo_vertical_align_room_thumb();

    // Disable Transparent Header for Mobile / touch
    themo_no_transparent_header_for_mobile(isTouch);
});


/*
 * Hook ajaxcomplete for WP Booking System.
 * Hijack success message and tag along our buy button.
 *
 * */
jQuery( document ).ajaxComplete(function( event, xhr, settings ) {

    // Check if success message is active / exists, if not exit.
    if (jQuery('.wpbs-woo-payment-request-mgs').length){
        //console.log(settings.data);
        //console.log(xhr.responseText);

        //if( xhr.responseText.toString.call(settings.data) == '[object String]' ) {
        if (xhr.responseText.indexOf("wpbs_clear_selection") >= 0) {

            // pull date from, date to value from query string.
            var getQueryString = function ( field, url ) {
                var href = url ? url : window.location.href;
                var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
                var string = reg.exec(href);
                return string ? string[1] : null;
            };

            var date_now = getQueryString('wpbs-form-start-date',settings.data); // returns 'start date'
            var date_future = getQueryString('wpbs-form-end-date',settings.data); // returns 'end date'

            // If date_future is less than the date now, swap them because the user has selected cal dates in reverse :(
            if(date_future < date_now){
                var date_future = getQueryString('wpbs-form-start-date',settings.data); // returns 'start date'
                var date_now = getQueryString('wpbs-form-end-date',settings.data); // returns 'end date'
            }

            var wpbs_id = getQueryString('wpbs-form-calendar-ID',settings.data); // returns 'cal id'

            // make new date objects.
            date_now = new Date(date_now*1000);
            date_future = new Date(date_future*1000);

            // days inbetween.
            var seconds = Math.floor((date_future - (date_now))/1000);
            var minutes = Math.floor(seconds/60);
            var hours = Math.floor(minutes/60);
            var days = Math.floor(hours/24);

            if (days > 0) {
                var daystobook = days;
            }else{
                var daystobook = 1;
            }
            // Find a way to stuff the quantity into the button.

            //console.log(daystobook);
            //console.log(wpbs_id);


            // Update the quantity
            jQuery(".wpbs-ID-"+wpbs_id+" .add_to_cart_button").attr("href", UpdateQueryString("quantity", daystobook, jQuery(".wpbs-ID-"+wpbs_id+" .add_to_cart_button").attr("href")));

            // Up the quantity
            jQuery(".wpbs-ID-"+wpbs_id+" .add_to_cart_button").attr( "data-quantity", daystobook );
            // show button
            jQuery(".wpbs-calendar-"+wpbs_id+" .wpbs-form-form").append(jQuery(".wpbs-woo-pay-req-ID-"+wpbs_id).html());

        }
        // }

        /*
         // Check if setting.data is a string.
         if( Object.prototype.toString.call(settings.data) == '[object String]' ) {
         // check if settings.data contains wpbs form id key.
         if (settings.data.indexOf("wpbs-form-id") >= 0) {
         // If the rsponse does not contain the wpbs-form-id attribute
         // print out success message.
         if (xhr.responseText.indexOf("wpbs_clear_selection") >= 0) {
         jQuery(".wpbs-form-form").append(jQuery(".wpbs-woo-payment-request").html());
         }

         }
         }*/
    }

});