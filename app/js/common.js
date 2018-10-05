(function() {
    var tinderContainer = document.querySelector('.cards');
    var allCards = document.querySelectorAll('.cards__item');
    var nope = document.querySelector('.cards__dislike');
    var love = document.querySelector('.cards__like');

    var viewersInitial = 35087;
    var viewersFinaly = 237;

    var clientWidth = document.body.clientWidth;

    var likes = []
    var dislikes = [];

    function loader() {
        setTimeout(function() {
            $('.stack__loader').fadeOut(200, function() {
                initCards();
                counter();
            })
        }, 1) //7200
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

        if (update) {
            counter.update(update)
        } else {
            counter.start()
        }
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

        if (currentIndex == 0) congrat(), counter(viewersFinaly);

        tinderContainer.classList.add('loaded');
    }

    Array.prototype.forEach.call(allCards, function(el) {
        var hammertime = new Hammer(el);

        hammertime.on('pan', function(event) {
            el.classList.add('moving');

            if (event.deltaX === 0) return;
            if (event.center.x === 0 && event.center.y === 0) return;

            tinderContainer.classList.toggle('like', event.deltaX > 0);
            tinderContainer.classList.toggle('dislike', event.deltaX < 0);

            var xMulti = event.deltaX * 0.03;
            var yMulti = event.deltaY / 80;
            var rotate = xMulti * yMulti;

            event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
        });

        hammertime.on('panend', function(event) {
            el.classList.remove('moving');
            tinderContainer.classList.remove('like');
            tinderContainer.classList.remove('dislike');

            var move = 330;
            var keep = Math.abs(event.deltaX) < 180 && Math.abs(event.velocityX) < 0.5;

            event.target.classList.toggle('removed', !keep);

            if (keep) {
                event.target.style.transform = '';
            } else {
                var endX = move;
                if (clientWidth <= 991) endX = 991;
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

            if (clientWidth <= 991) move = 991

            if (love) {
                card.style.transform = 'translate(' + move + 'px, 0)';
            } else {
                card.style.transform = 'translate(-' + move + 'px, 0)';
            }

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


    function congrat() {
        $('.stack__wrapper').fadeOut(function() {
            $('.stack__congrat').fadeIn()
        })
    }

    function clearRemovedStack(array, lastId) {
        array.forEach(function(item) {
            if (item < lastId) {
                document.getElementById(item).classList.add('hide')
            }
        });
    }

})();