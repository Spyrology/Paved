$(document).ready(function() {

	$('.expand').click(function() {
		$(this).closest('.expand').children('.fa').toggleClass("fa-caret-square-o-down fa-caret-square-o-up");
		$(this).closest('.wrapper').children('.details-container').slideToggle({duration: 400});
	});

	/*$('.wrapper').click(function() {
		$(this).children('.details-container').slideToggle({duration: 400});*/
		/*$('html, body').animate({
      scrollTop: $('.details-container').offset().top + $('window').height()
    }, 800);*/
	/*});*/

	$("#user_upload").click = function() {
		console.log("works");
    document.getElementById('hide_upload').click();
	};

});