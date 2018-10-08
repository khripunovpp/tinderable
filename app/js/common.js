(function() {
    var cardsStackContainer = document.querySelector('.stack');
    var allCards = document.querySelectorAll('.cards__item');
    var nope = document.querySelector('.cards__dislike');
    var love = document.querySelector('.cards__like');

    var viewersInitial = 35087;
    var viewersFinaly = 232;

    var clientWidth = document.body.clientWidth;
    var mobileBreakpoint = 991;

    var likes = []
    var dislikes = [];

    window.addEventListener('resize', function() {
        clientWidth = document.body.clientWidth;
        if (clientWidth >= mobileBreakpoint) initCards();
    })

    function loader() {
        $('.stack__loader').addClass('init') /*чтобы гифка добавилась только после загрузки срипта*/
        setTimeout(function() {
            $('.stack__loader').fadeOut(200, function() {
                clientWidth >= mobileBreakpoint ? initCards() : counter();
            })
        }, 1) //7200

        $('.title__btn').on('click', function(event) {
            event.preventDefault();
            initCards();
        });
    }

    loader()

    function counter(update) {
        var options = {
            useEasing: false,
            useGrouping: true,
            separator: '.',
            decimal: '.',
        };

        var counter = new CountUp('counter', 0, viewersInitial, 0, 1, options);

        update ? counter.update(update) : counter.start()
    }

    function initCards() {
        var newCards = document.querySelectorAll('.cards__item:not(.removed)');
        var currentIndex = 0;

        Array.prototype.forEach.call(newCards, function(card, index) {
            card.style.zIndex = allCards.length - index;
            card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(' + 20 * index + 'px)';

            currentIndex = index + 1;
            if (!card.id) card.id = (currentIndex);
        });

        counter(viewersInitial * (currentIndex / 15));

        if (currentIndex == 0) congrat(viewersFinaly), counter(viewersFinaly);

        cardsStackContainer.classList.add('loaded');
    }

    Array.prototype.forEach.call(allCards, function(el) {
        var hammertime = new Hammer(el);

        hammertime.on('pan', function(event) {
            el.classList.add('moving');

            if (event.deltaX === 0) return;
            if (event.center.x === 0 && event.center.y === 0) return;

            cardsStackContainer.classList.toggle('like', event.deltaX > 0);
            cardsStackContainer.classList.toggle('dislike', event.deltaX < 0);

            var xMulti = event.deltaX * 0.03;
            var yMulti = event.deltaY / 80;
            var rotate = xMulti * yMulti;

            event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
        });

        hammertime.on('panend', function(event) {
            el.classList.remove('moving');
            cardsStackContainer.classList.remove('like');
            cardsStackContainer.classList.remove('dislike');

            var move = 330;
            var keep = Math.abs(event.deltaX) < 180 && Math.abs(event.velocityX) < 0.5;

            event.target.classList.toggle('removed', !keep);

            if (keep) {
                event.target.style.transform = '';
            } else {
                var endX = move;
                if (clientWidth <= mobileBreakpoint) endX = mobileBreakpoint;
                var toX = event.deltaX > 0 ? endX : -endX;
                event.target.style.transform = 'translate(' + toX + 'px, 0)';
                event.target.style.opacity = .6;

                if (event.deltaX > 0) {
                    likes.push(event.target.id);
                    clearRemovedStack(likes, event.target.id)
                } else {
                    dislikes.push(event.target.id)
                    clearRemovedStack(dislikes, event.target.id)
                }
                initCards();
            }
        });
    });

    function createButtonListener(love) {
        return function(event) {
            var cards = document.querySelectorAll('.cards__item:not(.removed)');
            var moveOutWidth = clientWidth * 1.5;
            var move = 330;

            if (!cards.length) return false;

            var card = cards[0];

            card.classList.add('removed');

            if (clientWidth <= mobileBreakpoint) move = mobileBreakpoint

            love ?
                card.style.transform = 'translate(' + move + 'px, 0)' :
                card.style.transform = 'translate(-' + move + 'px, 0)';

            card.style.opacity = .6;

            if (love) {
                likes.push(card.id);
                clearRemovedStack(likes, card.id)
            } else {
                dislikes.push(card.id)
                clearRemovedStack(dislikes, card.id)
            }

            initCards();

            event.preventDefault();
        };
    }

    var nopeListener = createButtonListener(false);
    var loveListener = createButtonListener(true);

    nope.addEventListener('click', nopeListener);
    love.addEventListener('click', loveListener);


    function congrat(views) {
        setTimeout(function() {
            $('.stack__wrapper, .stack__title').fadeOut(500, function() {
                $('.congratulation__lead b').text(views);
                timer($('.timer'));
                $('.stack__congratulation').fadeIn(1000);
            })
        }, 1000)
    }

    function clearRemovedStack(array, lastId) {
        array.forEach(function(item) {
            if (item < lastId) {
                document.getElementById(item).classList.add('hide')
            }
        });
    }

    var countdown = function(elem) {

        var timerTime = 5000;
        var minutes = 15;

        var counter = $('.counter__num');

        var value = counter.text();

        var date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));

        if ($.cookie('counter') == undefined) {
            $.cookie('counter', (value), {
                expires: date
            });
        }

        num = $.cookie('counter');

        if ($.cookie('counter') == null) {
            num = value;
        }

        counter.text(num);

        if (num < 8) {
            counter.text(7);
        }

        var count = counter.text();
        var setTimer = setInterval(function() {

            if (num > 7) {
                var rand = random(0, 1);
                num = num - rand;
                counter.text(num);

            }
            $.cookie('counter', (num), {
                expires: date
            });
            if (num < 8) {
                clearInterval(setTimer);
                $.cookie('counter', (7), {
                    expires: date
                });
            }

        }, timerTime);
    }

    var timer = function(timer) {
        var _currentDate = new Date();
        var count = 5;
        var _toDate = new Date(_currentDate.getFullYear(),
            _currentDate.getMonth(),
            _currentDate.getDate(),
            _currentDate.getHours(),
            _currentDate.getMinutes() + count,
            1);

        timer.countdown(_toDate, function(e) {
            var $this = $(this);
            var min = $this.find('.timer__num--min');
            var sec = $this.find('.timer__num--sec');
            min.text('' + e.strftime('%M'));
            sec.text('' + e.strftime('%S'));
        });
    }



})();