/* --------------------- Unicef-PMS Released 2022.08.31 --------------------- */
/* ------------------------ Published by 4m Creative ------------------------ */

const url = window.location.href;
const { search } = window.location;
const searchParams = new URLSearchParams(search);

const indexNumber = searchParams.get('indexNumber');
const receiveId = searchParams.get('receiveId');

if (!indexNumber) {
    alert("올바르지 않은 접속입니다.");
    window.history.back();
}

(async () => {
    try {
        // local dev
        const response = await fetch(`/unicef/api/bo/contents/card/detail/${indexNumber}?indexNumber=${indexNumber}&receiveId=${receiveId}`);
        const data = await response.json();
        const cardNews = data.data;
        const swipeType = cardNews.swipeType;

        let div = "";
        for (const [index, card] of cardNews.cardContent.entries()) {
            div += `
            <div class="swiper-slide">
                <div class="s_img_wrap">
                    <img class="slide-img" src="${card.imageUrl}" alt="">
                    <div class="info">
                        <div class="paging-num"><span id="paging-current-num">${index + 1}</span>/<span id="paging-total-num">${cardNews.cardContent.length}</span></div>
                    </div>
                    <div class="logo"></div>
                </div>
                <div class="con-wrap scroll">
                    <div class="txt-box scroll">
                        <div class="scroll_wrap">
                            <p>${card.content}</p>
                            <div class="btn_wrap">
                                ${(card.button1Text && card.button1Link) ? `<a href=${card.button1Link} class="solid-btn mobile" target="_blank">${card.button1Text}</a>` : '<div></div>'}
                                ${(card.button2Text && card.button2Link) ? `<a href=${card.button2Link} class="solid-btn mobile" target="_blank">${card.button2Text}</a>` : '<div></div>'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
        }
        document.getElementById("swiper-wrapper").innerHTML = div;

        if (cardNews?.cardContent.length > 1) {
            if (swipeType === "H") {
                document.getElementById("swipeType").classList.add("horizontal")
            } else {
                document.getElementById("swipeType").classList.add("vertical")
            }
        }

        document.getElementById("paging-total-num").innerText = cardNews.cardContent.length;

        if(cardNews.hidePagingNum == "Y") {//Y 硫�  �④�
            $(".paging-num").hide()
        }

    } catch (error) {
        console.error(error)
        alert("올바르지 않은 접속입니다.");
        window.history.back();
    }

    $(".swiper-slide, .swiper-slide-duplicate").addClass('goNext goPrev');
    document.body.style.overscrollBehaviorY = 'none';

    // 스크롤 제거한 대신 하단에 잔상으로 길이 확인
    $(".swiper-slide, .swiper-slide-duplicate").on('resize scroll', function () {
        var scrollTop = $(this).scrollTop();
        var innerHeight = $(this).innerHeight();
        var scrollHeight = $(this).prop('scrollHeight');

        if (scrollTop + innerHeight + 60 > scrollHeight) {
          $(this).addClass('goNext')
        } else if (scrollTop < 60) {
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
    $(document).ready(function () {
        if (!$("body").hasClass('vertical') && !$("body").hasClass('horizontal')){
            $('.swipe-box').removeClass('on');
            $('.icon-hand').removeClass('on');
            $('.swipe-box').hide();
            return;
        }
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
            on: {
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

                // console.log('가로 스와이퍼 시작값' + startPoint);
                // console.log('세로 스와이퍼 시작값' + vStartPoint);
            });
            
            
            eachSlide.addEventListener("touchend", (e) => {
                endPoint = e.changedTouches[0].pageX; // 터치가 끝나는 위치 저장
                vEndPoint = e.changedTouches[0].pageY;
                detectTouch = 80;

                // console.log('가로 스와이퍼 엔드값' + endPoint);
                // console.log('세로 스와이퍼 엔드값' + vEndPoint);
            
                // 아래쪽으로 스와이프 된 경우 (prev move)
                if (vStartPoint < vEndPoint - detectTouch && startPoint < endPoint + 150 && startPoint + 150 > endPoint && eachSlide.classList.contains('goPrev') === true) {
                    swiper.slidePrev();
                    
                // 위쪽으로 스와이프 된 경우 (next move)
                } else if (vStartPoint > vEndPoint + detectTouch && startPoint > endPoint - 150 && startPoint - 150 < endPoint && eachSlide.classList.contains('goNext') === true) {
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
            on: {
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
                if (startPoint < endPoint - detectTouch && vStartPoint < vEndPoint + 150 && vStartPoint + 150 > vEndPoint ) {
                    swiper.slidePrev();
                // 왼쪽으로 스와이프 된 경우 (next move)
                } else if (startPoint > endPoint + detectTouch && vStartPoint > vEndPoint - 150 && vStartPoint - 150 < vEndPoint) {
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
    //         (slide.scrollHeight > slide.offsetHeight) && //allow only when slide is scrollable
    //         (
    //             (touchesDiff < 0 && startScroll === 0) || //start from top edge to scroll bottom
    //             (touchesDiff > 0 && startScroll === (slide.scrollHeight - slide.offsetHeight)) || //start from bottom edge to scroll top
    //             (startScroll > 0 && startScroll < (slide.scrollHeight - slide.offsetHeight)) //start from the middle
    //         );
    //     if (onlyScrolling) {
    //         e.stopPropagation();
    //     }
    // }, true);

    swiper.on('transitionEnd', function () {
        // document.getElementById("paging-current-num").innerText = swiper.realIndex
    });

})()