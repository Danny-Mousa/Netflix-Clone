$(document).ready( function(){

  $(window).on("scroll", function(){
    if( $(this).scrollTop() > 50 ){
      $(".navbar").addClass("bg-black-transparent");
    }else {
      $(".navbar").removeClass("bg-black-transparent");
    }
  });

  $('.listing1 .movies').owlCarousel({
      loop:true,
      margin:10,
      nav:true,
      responsiveClass:true,
      responsive:{
          0:{
              items:1
          },
          600:{
              items:3
          },
          900:{
              items:3
          },
          1000:{
              items:5
          }
      },
      dots:false,
      stagePadding: 25
      //autoplay:true,
      //autoplayTimeout:1700,
      //autoplaySpeed:1700,
      //autoplayHoverPause:true,
  })
  $('.listing2 .movies').owlCarousel({
      loop:true,
      margin:15,
      nav:true,
      responsiveClass:true,
      responsive:{
          0:{
              items:1
          },
          600:{
              items:3
          },
          900:{
              items:3
          },
          1000:{
              items:5
          }
      },
      dots:false,
      stagePadding: 25
      //autoplay:true,
      //autoplayTimeout:1700,
      //autoplaySpeed:1700,
      //autoplayHoverPause:true,
  })
});
