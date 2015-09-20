$(document).ready(function() {

	$('.expand').click(function() {
		$(this).closest('.expand').children('.fa').toggleClass("fa-caret-square-o-down fa-caret-square-o-up");
		$(this).closest('.wrapper').children('.details-container').slideToggle({duration: 400});
	});

	/*$(".upload").click(function() {
    $("#file").click();
	});

	$('#file').change(function() {
    $('#submit_upload').submit();
	});
*/
});