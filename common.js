
/* --------------------- Unisef-PMS Released 2022.08.31 --------------------- */
/* ------------------------ Published by 4m Creative ------------------------ */

$(".swiper-slide, .swiper-slide-duplicate").addClass('goNext goPrev')

// 스크롤 제거한 대신 하단에 잔상으로 길이 확인
$(".swiper-slide, .swiper-slide-duplicate").on('resize scroll', function(){
    var scrollTop = $(this).scrollTop();
    var innerHeight = $(this).innerHeight();
    var scrollHeight = $(this).prop('scrollHeight');

    if (scrollTop + innerHeight === scrollHeight) {
        $(this).addClass('goNext')
    } else if (scrollTop === 0) {
        $(this).addClass('goPrev')
    } else {
        $(this).removeClass('goNext goPrev')
    }

    if (scrollTop + innerHeight + 20 >= scrollHeight) {
        $('.gradient').addClass('off');
    } else {
        $('.gradient').removeClass('off');
    }
})

// 인트로 팝업 트리거
$(document).ready(function(){

    $('.swipe-box').addClass('on');

    if ($('.swipe-box').hasClass('on')) {
        setTimeout(() => {
            $('.icon-hand').addClass('on');
        }, 0)
        setTimeout(() => {
            $('.swipe-box').removeClass('on');
            $('.icon-hand').removeClass('on');
        }, 2000)
        setTimeout(() => {
            $('.swipe-box').hide();
        }, 2500)
    }

    $('.swipe-box').on('click', () => {
        $('.swipe-box').removeClass('on');
        setTimeout(() => {
            $('.swipe-box').hide();
        }, 500)
    })
})

// body 태그 클래스에 vertical이 주어질 경우, 세로 스와이프/ 인트로 팝업 조정
let options = {},
    detectSlide = document.querySelectorAll('.swiper-slide');

// 드래그(스와이프) 이벤트를 위한 변수 초기화
let startPoint = 0,
    endPoint = 0;

let vStartPoint = 0,
    vEndPoint = 0,
    detectTouch = 80;

if ($("body").hasClass('vertical')) {
    $('.popup_vertical').show();
    options = {
        direction: 'vertical',
        loop: true,
        allowTouchMove: false,
        touchRatio: 0,//드래그 금지
        noSwiping:true,
        resistance : false,
        spaceBetween: 0,
        on : {  
            slideChangeTransitionEnd: () => {
                $('.gradient').removeClass('off');
            },
        },
    }
    
    // 터치 스와이프 스크롤 우선 적용 후 슬라이드 넘김
    var startScroll, touchStart, touchCurrent;
    detectSlide.forEach( (eachSlide)=> {
        eachSlide.addEventListener("touchstart", (e) => {
            startPoint = e.touches[0].pageX; // 터치가 시작되는 위치 저장
            vStartPoint = e.touches[0].pageY;
        });
        
        eachSlide.addEventListener("touchend", (e) => {
            endPoint = e.changedTouches[0].pageX; // 터치가 끝나는 위치 저장
            vEndPoint = e.changedTouches[0].pageY;
            detectTouch = 40;
        
            // 아래쪽으로 스와이프 된 경우 (prev move)
            if (vStartPoint < vEndPoint - detectTouch && startPoint < endPoint + 40 && startPoint + 40 > endPoint && eachSlide.classList.contains('goPrev') === true) {
                swiper.slidePrev();
                
            // 위쪽으로 스와이프 된 경우 (next move)
            } else if (vStartPoint > vEndPoint + detectTouch && startPoint > endPoint - 40 && startPoint - 40 < endPoint && eachSlide.classList.contains('goNext') === true) {
                swiper.slideNext();
            }
        });
    });

} else {
    $('.popup_horizontal').show();
    options = {
        direction: 'horizontal',
        loop: true,
        allowTouchMove: false,
        touchRatio: 0,//드래그 금지
        noSwiping:true,
        resistance : false,
        spaceBetween: 0,
        on : {  
            slideChangeTransitionEnd: () => {
                $('.gradient').removeClass('off');
            },
        },
    }

    detectSlide.forEach( (eachSlide)=> {
        eachSlide.addEventListener("touchstart", (e) => {
            startPoint = e.touches[0].pageX; // 터치가 시작되는 위치 저장
            vStartPoint = e.touches[0].pageY;
        });
        
        eachSlide.addEventListener("touchend", (e) => {
            endPoint = e.changedTouches[0].pageX; // 터치가 끝나는 위치 저장
            vEndPoint = e.changedTouches[0].pageY;
        
            // 오른쪽으로 스와이프 된 경우 (prev move)
            if (startPoint < endPoint - detectTouch && vStartPoint < vEndPoint + 40 && vStartPoint + 40 > vEndPoint ) {
                swiper.slidePrev();
            // 왼쪽으로 스와이프 된 경우 (next move)
            } else if (startPoint > endPoint + detectTouch && vStartPoint > vEndPoint - 40 && vStartPoint - 40 < vEndPoint) {
                swiper.slideNext();
            }
        });
    })
}
var swiper = new Swiper('.mySwiper', options);



// 터치 스와이프 스크롤 우선 적용 후 슬라이드 넘김 ( 모바일 기기 사용 시 버그로 인해 적용 중단 - 2023.03.31 )
// var startScroll, touchStart, touchCurrent;

// swiper.slides.on('touchstart', function (e) {
//     startScroll = this.scrollTop;
//     touchStart = e.targetTouches[0].pageY;
// }, true);

// swiper.slides.on('touchmove', function (e) {
//     touchCurrent = e.targetTouches[0].pageY;
//     var touchesDiff = touchCurrent - touchStart;
//     var slide = this;
//     var onlyScrolling = 
//             ( slide.scrollHeight > slide.offsetHeight ) && //allow only when slide is scrollable
//             (
//                 ( touchesDiff < 0 && startScroll === 0 ) || //start from top edge to scroll bottom
//                 ( touchesDiff > 0 && startScroll === ( slide.scrollHeight - slide.offsetHeight ) ) || //start from bottom edge to scroll top
//                 ( startScroll > 0 && startScroll < ( slide.scrollHeight - slide.offsetHeight ) ) //start from the middle
//             );
//     if (onlyScrolling) {
//         e.stopPropagation();
//     }
// }, true);