jQuery(document).ready(function($) {
    /* Variables */
    var imgContainer = jQuery(document).find('.imgContainer').outerHeight(true),
        textContainer = jQuery(document).find('.textContainer').outerHeight(true),
        videoSlider = jQuery('#videoSlider');

    /* Logics */
    if (textContainer > imgContainer) {
        jQuery('.textContainer').css('height', jQuery(document).find('.pageContent').height()).mCustomScrollbar();
    } else {
        jQuery('.textContainer').mCustomScrollbar('destroy').removeAttr('style');
    }

    jQuery('.form-control').on('change', function() {
        if (jQuery(this).val() != '') {
            jQuery(this).parents('.form-group').addClass('inputFilled');
        } else {
            jQuery(this).parents('.form-group').removeClass('inputFilled');
        }
    });

    jQuery(document).on('click', '.jp-play', function() {
        if (jQuery(this).hasClass('playing')) {
            jQuery(this).removeClass('playing');
            jQuery(this).find('.fa').removeClass('fa-pause').addClass('fa-play');
            jQuery(this).parents('.jp-video').find('.jp-jplayer').jPlayer('pause');
        } else {
            jQuery(this).addClass('playing');
            jQuery(this).find('.fa').removeClass('fa-play').addClass('fa-pause');
            jQuery(this).parents('.jp-video').find('.jp-jplayer').jPlayer('pauseOthers', 0);
            jQuery(this).parents('.jp-video').find('.jp-jplayer').jPlayer('play');
        }
    });
    jQuery(document).on('click', '.jp-next', function(event) {
        videoSlider.trigger('next.owl.carousel');
    });
    jQuery(document).on('click', '.jp-previous', function(event) {
        videoSlider.trigger('prev.owl.carousel');
    });

    function timeFun(sec) {
        var h = Math.floor(sec / 3600);
        sec -= h * 3600;
        var m = Math.floor(sec / 60);
        sec -= m * 60;
        return (h < 1 ? '' : (h < 10 ? '0' + h : h) + ':') + (m < 10 ? '0' + m : m) + ':' + (sec < 10 ? '0' + sec : sec);
    }

    function playMedia() {
        jQuery('.owl-item.active .jp-jplayer').bind(jQuery.jPlayer.event.timeupdate, function(event) {
            var currentTime = timeFun((event.jPlayer.status.currentTime).toFixed(0)) == 0 ? '' : timeFun((event.jPlayer.status.currentTime).toFixed(0)),
                duration = timeFun((event.jPlayer.status.duration).toFixed(0)) == 0 ? '' : timeFun((event.jPlayer.status.duration).toFixed(0));
            jQuery(this).parents('.jp-type-playlist').find('.jp-play-bar').css('width', (event.jPlayer.status.currentPercentAbsolute).toFixed(0));
            jQuery(this).parents('.jp-type-playlist').find('.jp-current-time').html(currentTime);
            jQuery(this).parents('.jp-type-playlist').find('.jp-duration').html(duration);
        });

        jQuery(document).find('.jp-play').removeClass('playing');
        jQuery(document).find('.jp-play .fa').removeClass('fa-pause').addClass('fa-play');
        jQuery('.owl-item.active .jp-video').find('.jp-play').addClass('playing');
        jQuery('.owl-item.active .jp-video').find('.jp-play .fa').removeClass('fa-play').addClass('fa-pause');
        jQuery('.owl-item.active .jp-video').find('.jp-jplayer').jPlayer('pauseOthers', 0);
        jQuery('.owl-item.active .jp-video').find('.jp-jplayer').jPlayer('play');
    }

    /* Plug-in Functions */
    document.documentElement.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, false);

    /** Custom Scroll jQuery **/
    var mCustomScrollbarFunction = function() {
        jQuery('body').mCustomScrollbar({
            callbacks: {
                whileScrolling: function() {
                    var bodyScroll = (this.mcs.top) * -1,
                        headerPos = jQuery('header').outerHeight();
                    if (innerPage) {
                        var headerHeight = jQuery('header').outerHeight();
                        jQuery('body').addClass('innerPage');
                        if (bodyScroll < 5) {
                            jQuery('body').removeClass('fixedHeader');
                            jQuery('.pageContainer.innerPage').css('padding-top', 0);
                        } else {
                            jQuery('body').addClass('fixedHeader');
                            jQuery('.pageContainer.innerPage').css('padding-top', headerHeight);
                        }
                    } else {
                        if (bodyScroll < headerPos) {
                            jQuery('body').removeClass('fixedHeader');
                        } else {
                            jQuery('body').addClass('fixedHeader');
                        }
                    }
                }
            },
            mouseWheelPixels: 200,
        });
    };

    jQuery('.modal').on('show.bs.modal', function(e) {
        jQuery('.modal').mCustomScrollbar({
            scrollbarPosition: 'string'
        });
        jQuery('body').mCustomScrollbar('disable');
    });
    jQuery('.modal').on('hidden.bs.modal', function(e) {
        jQuery('body').mCustomScrollbar('update');
    });

    jQuery(window).on('load resize', function() {
        var winWidth = jQuery(window).width();
        if (winWidth <= 1199) {
            jQuery('body').mCustomScrollbar('destroy');
            jQuery('.textContainer').mCustomScrollbar('destroy').removeAttr('style');

            jQuery(window).on('scroll', function() {
                var bodyScroll = jQuery(window).scrollTop(),
                    headerPos = jQuery('header').outerHeight();
                if (bodyScroll < headerPos) {
                    jQuery('body').removeClass('fixedHeader');
                } else {
                    jQuery('body').addClass('fixedHeader');
                }
            })
        } else {
            jQuery('body').removeClass('fixedHeader');
            mCustomScrollbarFunction();
        }
    });

    var innerPage = jQuery('.pageContainer').hasClass('innerPage');
    mCustomScrollbarFunction();
    /** Custom Scroll jQuery **/

    videoSlider.owlCarousel({
        autoplay: false,
        autoplayTimeout: 1000,
        autoplayHoverPause: false,
        autoWidth: false,
        onInitialized: cbInitialized,
        onChanged: cbDragged,
        dots: false,
        items: 1,
        loop: true,
        nav: false,
    });

    function cbInitialized(events) {
        jQuery(document).find('.owl-item').not('.clone').find('.jp-video').each(function(index, el) {
            var attrs = [],
                title = jQuery(this).data('title'),
                m4v = jQuery(this).data('m4v'),
                ogv = jQuery(this).data('ogv'),
                webmv = jQuery(this).data('webmv'),
                poster = jQuery(this).data('poster');
            attrs.push({ title: title, m4v: m4v, ogv: ogv, webmv: webmv, poster: poster });
            if (attrs[0].title != '' && (attrs[0].m4v != '' || attrs[0].ogv != '' || attrs[0].webmv != '')) {
                jQuery(this).find('.jp-jplayer').jPlayer({
                    ended: function() {
                        jQuery(document).find('.owl-item.active .jp-previous').trigger('click');
                    },
                    ready: function(e) {
                        jQuery(this).jPlayer('setMedia', attrs[0]).jPlayer('pauseOthers', 0);
                    },
                    cssSelectorAncestor: jQuery(this).find('.jp-jplayer').attr('id'),
                    cssSelector: {
                        seekBar: '.jp-seek-bar',
                        playBar: '.jp-play-bar',
                        currentTime: '.jp-current-time',
                        duration: '.jp-duration',
                    },
                    globalVolume: true,
                    preload: 'metadata',
                    smoothPlayBar: true,
                    supplied: 'webmv, ogv, m4v',
                    swfPath: './swf',
                    useStateClassSkin: true,
                });
            } else {
                console.log('false');
            }
        });
        if (events.currentTarget.attributes['data-autoplay'].value === 'ture') {
            setTimeout(function() {
                playMedia()
            }, 500);
        };
    };

    function cbDragged(events) {
        if (events.currentTarget.attributes['data-autoplay'].value === 'ture') {
            setTimeout(function() {
                playMedia()
            }, 500);
        };
    }
});