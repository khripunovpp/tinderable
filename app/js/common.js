(function() {
    var tinderContainer = document.querySelector('.cards');
    var allCards = document.querySelectorAll('.cards__item');
    var nope = document.querySelector('.cards__dislike');
    var love = document.querySelector('.cards__like');

    loader()

    function initCards() {
        var newCards = document.querySelectorAll('.cards__item:not(.removed)');
        var currentIndex = 0;

        newCards.forEach(function(card, index) {
            card.style.zIndex = allCards.length - index;
            card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(' + 20 * index + 'px)';
            currentIndex = index + 1;
        });

        if (currentIndex == 0) congrat()

        tinderContainer.classList.add('loaded');
    }

    allCards.forEach(function(el) {
        var hammertime = new Hammer(el);

        hammertime.on('pan', function(event) {
            el.classList.add('moving');

            console.log(event)

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

            var moveOutWidth = document.body.clientWidth;
            var keep = Math.abs(event.deltaX) < 180 && Math.abs(event.velocityX) < 0.5;

            event.target.classList.toggle('removed', !keep);

            if (keep) {
                event.target.style.transform = '';
            } else {
                var endX = 330;
                var toX = event.deltaX > 0 ? endX : -endX;
                event.target.style.transform = 'translate(' + toX + 'px, 0)';
                event.target.style.opacity = .6;
                initCards();
            }
        });
    });

    function createButtonListener(love) {
        return function(event) {
            var cards = document.querySelectorAll('.cards__item:not(.removed)');
            var moveOutWidth = document.body.clientWidth * 1.5;

            if (!cards.length) return false;

            var card = cards[0];

            card.classList.add('removed');

            if (love) {
                card.style.transform = 'translate(330px, 0)';
            } else {
                card.style.transform = 'translate(-330px, 0)';
            }

            card.style.opacity = .6;

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

    function loader() {
        setTimeout(function() {
            $('.stack__loader').fadeOut(200, function() {
                initCards();
            })
        }, 1) //7200
    }
})();