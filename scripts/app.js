$(document).ready(function(){
    //------------------ACTIVE ICON & PANEL------------------
    $('.icon').click(
        function(){
            $('.icon').removeClass('active');
            $(this).toggleClass('active');

            if($(this).attr('id') == 'home-icon'){
                $('.panel').removeClass('appear');
                $('#home').addClass('appear');
            }
            if($(this).attr('id') == 'projects-icon'){
                $('.panel').removeClass('appear');
                $('#projects').addClass('appear');
            }
            if($(this).attr('id') == 'contact-icon'){
                $('.panel').removeClass('appear');
                $('#contact').addClass('appear');
            }
        }
    )
})