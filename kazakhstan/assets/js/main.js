jQuery(document).ready(function ($) {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $(".header-sticky").addClass("sticky");
        } else {
            $(".header-sticky").removeClass("sticky");
        }

    });
    $(document).ready(function () {
        $(document).on("click", ".mobile_nav_icon-close", function () {
            $(".navbarResponsive2").removeClass("navbaropen");
        });
        $(document).on("click", ".mobile_nav_icon", function () {
            $(".navbarResponsive2").addClass("navbaropen");
        });
    });

    $(document).ready(function () {
        $(document).on("click", ".mobile_nav", function () {
            $(".navbardropdown").addClass("navopen");
        });
        $(document).on("click", ".navopen", function () {
            $(".navbardropdown").removeClass("navopen");
        });
       
    });
});

wow = new WOW({
    boxClass: "wow", // default
    animateClass: "animated", // default
    offset: 50, // default
    mobile: true, // default
    live: true, // default
});
wow.init();


 $('.home_sec3 .owl-carousel').owlCarousel({
    loop:true,
    margin:26,
    nav:true,
    dots:false,
    autoplay: 3000, // time for slides changes
    smartSpeed: 1000,
    autoplayTimeout:3500,
    autoplayHoverPause:true,
    responsive:{
        0:{
            items:1.2,
            margin:14,
        },
       700:{
            items:5
        },
    }
})



// $(document).ready(function(){
//     $("#exampleModal").modal('show');
// }, 100);

setTimeout(function() {
    $('#exampleModal').modal('show');
}, 1500);