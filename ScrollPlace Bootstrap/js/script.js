$(document).ready(function(){
			$('#main').addClass('animate');
			$(window).scroll(function(){
				var y = $(this).scrollTop();

				if(y >= 200){
					$('#laptop').addClass('animate');
					$('#mobile').addClass('animate');
				}

				if(y < 200){
					$('#laptop').removeClass('animate');
					$('#mobile').removeClass('animate');
				}
			});
		});
