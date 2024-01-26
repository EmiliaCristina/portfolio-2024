/**
@Author: Edinson Tique
@Name: QCSlider Pluggin
@Version: 1.4.3
@Year: 2018
@Contact: www.fb.com/QueCodigoPG
@Libraries: jQuery
**/
(function ($){
	jQuery.fn.QCslider = function(options_user) {
		// Variables Necesarias
		var $this = jQuery(this),
		setC,
		player,
		pb = {},
		SliderInterval,
		nextSlider = 1,
		options_default,
		currentSlider = 0;

		pb.el = $this;
		pb.items = {
			panel: pb.el.find('li')
		}
		
		lengthSlider = pb.items.panel.length;

		options_default = {
			start: 0,
			duration: 8000
		}

		console.log("QCSlider V1.4.3");
		settings = jQuery.extend(options_default, options_user);

		init();

		// Initialize
		function init() {
			console.log("QCSlider Load");
			var output = '',
			tag = document.createElement('script');

			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

			// Activamos nuestro slider
			SliderInit();

			for(var i = 0; i < lengthSlider; i++) {
				if (i == 0) {
					output += '<li class="active"></li>'; 
				} else {
					output += '<li></li>';
				}
			}

			// Controles del Slider
			$('#slider-controls').html(output).on('click', 'li', function (e){
				var $this = $(this);
				if (currentSlider !== $this.index()) {
					changePanel($this.index());
				};
			});
			$('#rht-control').on('click', function (e){
				changePanel(nextSlider);
			});
			$('#lft-control').on('click', function (e){
				changePanel(currentSlider - 1);
			});
		}

		function SliderInit() {
			var vel = pb.items.panel.eq(currentSlider);
			if(!vel.hasClass("video")){
				$('#barra').animate({
					width:"100%"
				}, 
				settings.duration,
				"linear",
				startSlider
				);
			}else{
				var vurl = vel.attr("data-video"),
					vidp = "player"+currentSlider,
					vmut = vel.attr("data-muted"),
					vtyp = vel.attr("data-type"),
					urla = 'https://www.youtube.com';

				if(vtyp === "youtube"){
					vel.html('<div class="include"><div id="'+vidp+'"></div></div>');
					if(vmut === "true"){ vmut=1 }else{ vmut=0 }
					player = new YT.Player(vidp, {
						videoId: vurl,
						playerVars: { 
							allowfullscreen: true,
							wmode: 'transparent',
							cc_load_policy: 0,
							iv_load_policy: 0,
							modestbranding: 0,
							theme: 'white',
							origin: urla,
							disablekb: 1,
							branding: 0,
							autohide: 0,
							showinfo: 0,
							autoplay: 1,
							controls: 0,
							mute: vmut,
							border: 0,
							html5: 1,
							rel : 0,
							fs : 0,
						},
						events: {
							'onReady': onPlayerReady,
							'onStateChange': onPlayerStateChange,
						}
					});
					var reproW = pb.items.panel.eq(currentSlider).width();
					var reproH = pb.items.panel.eq(currentSlider).height();
					player.setSize({"width": reproW, "height": reproH});
					function onPlayerStateChange(event) {
						let timeCurrent;
						//$('#barra').css("width", "100%");
						if(event.data === YT.PlayerState.PLAYING) { 
							timeCurrent = setInterval(getProgress,50);
						}
						if (event.data == YT.PlayerState.ENDED){
							clearInterval(timeCurrent);
							vel.html('<div class="include"><div id="'+vidp+'"></div></div>');
							changePanel(nextSlider);
						}
					}
					function getProgress(){
						var tAc = player.playerInfo.currentTime,
							tTo = player.playerInfo.duration,
							poc = tAc/tTo*100;
						$('#barra').width(poc+'%');
					}
					function onPlayerReady(event){
						if(vmut === "true"){
							event.target.mute();
							event.target.setVolume(0);
						}
						event.target.playVideo();
					}
				}else if(vtyp === "video"){
					if(vmut === "true"){
						vel.html('<div class="include"><video src="'+vurl+'" preload="auto" muted autoplay="true" poster="" id="'+vidp+'"></video></div>');
					}else{
						vel.html('<div class="include"><video src="'+vurl+'" preload="auto" autoplay="true" poster="" id="'+vidp+'"></video></div>');
					}
					var dursecs;
					$("#"+vidp).bind('timeupdate', function(){
						var tAc = $("#"+vidp)[0].currentTime,
							tTo = $("#"+vidp)[0].duration,
							poc = tAc/tTo*100;
						$('#barra').width(poc+'%');
					});
					$("#"+vidp).on('ended', function(){
						vel.html(' ');
						$("#"+vidp).unbind('timeupdate');
						changePanel(nextSlider);
					});
				}
			}
		}

		function startSlider() {
			$('#barra').css("width", 0);
			var panels = pb.items.panel,
			controls = $('#slider-controls li');

			if (nextSlider >= lengthSlider) {
				nextSlider = 0;
				currentSlider = lengthSlider-1;
			}

			// Efectos
			controls.removeClass('active').eq(nextSlider).addClass('active');
			panels.eq(currentSlider).fadeOut('slow');
			panels.eq(nextSlider).fadeIn('slow');

			// Actualizamos nuestros datos
			currentSlider = nextSlider;
			nextSlider += 1;
			SliderInit();
		}

		// Funcion para controles del slider
		function changePanel(id) {
			//clearInterval(SliderInterval);
			$('#barra').stop().css("width", 0);
			var panels = pb.items.panel,
			controls = $('#slider-controls li');

			if(pb.items.panel.eq(currentSlider).hasClass("video")){
				vidp = "player"+currentSlider,
				vtyp = pb.items.panel.eq(currentSlider).attr("data-type");
				if(vtyp === "youtube"){
					pb.items.panel.eq(currentSlider).html('<div class="include"><div id="'+vidp+'"></div></div>');
				}else if(vtyp === "video"){
					pb.items.panel.eq(currentSlider).html('<div class="include"></div>');
				}
			}

			// Comprobamos el ID
			if (id >= lengthSlider) {
				id = 0;
			} else if (id < 0) {
				id = lengthSlider-1;
			}

			// Efectos
			controls.removeClass('active').eq(id).addClass('active');
			panels.eq(currentSlider).fadeOut('slow');
			panels.eq(id).fadeIn('slow');

			// Actualizamos nuestros datos
			currentSlider = id;
			nextSlider = id+1;

			// Reactivamos el slider
			SliderInit();
		}

		function pausePanel(){
			$('#barra').stop().css("width", 0);
		}

		return pb;
	};
})(jQuery);
