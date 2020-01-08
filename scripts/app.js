$(document).ready(function(){
    //------------------ACTIVE ICON------------------
    $('.icon').click(
        function(){
            $('.icon').removeClass('active');
            $(this).toggleClass('active');
        }
    )
})