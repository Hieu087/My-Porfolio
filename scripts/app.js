$(document).ready(function(){
    //------------------ACTIVE ICON & PANEL------------------
    $('.icon').click(
        function(){
            $('.icon ').removeClass('active');
            $('.panel').removeClass('appear');
            $(this).toggleClass('active');

            if($(this).attr('id') == 'home-icon'){
                $('#home').addClass('appear');
            }
            if($(this).attr('id') == 'projects-icon'){
                $('#projects').addClass('appear');
            }
            if($(this).attr('id') == 'contact-icon'){
                $('#contact').addClass('appear');
            }
        }
    )
})