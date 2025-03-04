ymaps.ready(init);

var places = [
    { name: "Красная площадь", coords: [55.753895, 37.620732] },
    { name: "Храм Василия Блаженного", coords: [55.752555, 37.623023] },
    { name: "Парк Зарядье", coords: [55.751403, 37.628826] },
    { name: "ВДНХ, фонтан «Дружба народов»", coords: [55.829577, 37.630968] },
    { name: "Останкинская телебашня", coords: [55.819645, 37.611627] },
    { name: "Дворцовая площадь", coords: [59.938644, 30.315785] },
    { name: "Исаакиевский собор", coords: [59.934192, 30.306004] },
    { name: "Петергоф, Большой каскад", coords: [59.883738, 29.907562] },
    { name: "Кунсткамера", coords: [59.941029, 30.302732] },
    { name: "Крейсер «Аврора»", coords: [59.955278, 30.338056] },
    { name: "Суздальский кремль", coords: [56.427166, 40.444435] },
    { name: "Церковь Покрова на Нерли", coords: [56.196389, 40.561667] },
    { name: "Ростовский кремль", coords: [57.184598, 39.414938] },
    { name: "Успенский собор, Владимир", coords: [56.127222, 40.408611] },
    { name: "Троице-Сергиева лавра", coords: [56.310223, 38.130004] },
    { name: "Куршская коса, Танцующий лес", coords: [55.200111, 20.859672] },
    { name: "Ленские столбы, Якутия", coords: [61.104240, 127.330030] },
    { name: "Красноярские столбы, заповедник", coords: [55.895278, 92.798056] },
    { name: "Приэльбрусье, станция «Мир»", coords: [43.349286, 42.437923] },
    { name: "Озеро Байкал, Листвянка", coords: [51.851003, 104.869627] },
    { name: "Ласточкино гнездо", coords: [44.430833, 34.128333] },
    { name: "Воронцовский дворец, Алупка", coords: [44.419853, 34.055722] },
    { name: "Херсонес Таврический", coords: [44.610556, 33.491389] },
    { name: "Казанский кремль", coords: [55.796539, 49.105227] },
    { name: "Мечеть Кул-Шариф", coords: [55.797195, 49.105359] },
    { name: "Нижегородский кремль", coords: [56.328674, 44.002059] },
    { name: "Свияжск, Успенский монастырь", coords: [55.771344, 48.657702] },
    { name: "Кунгурская пещера (вход)", coords: [57.435280, 57.005756] },
    { name: "Музей «Гранд Макет Россия», СПб", coords: [59.928742, 30.318257] },
    { name: "Новосибирский театр оперы и балета", coords: [55.030278, 82.920278] },
    { name: "Владивосток, Золотой мост", coords: [43.113056, 131.899444] },
    { name: "Хабаровск, утёс Амурский", coords: [48.744444, 135.071111] },
    { name: "Мамаев курган, Родина-мать", coords: [48.742275, 44.537115] },
    { name: "Музей-диорама «Курская дуга»", coords: [51.711659, 36.185265] },
    { name: "Памятник «Алеша», Мурманск", coords: [68.993611, 33.075833] },
    { name: "Крепость Орешек, Шлиссельбург", coords: [59.953056, 31.038611] },
    { name: "Дербентская крепость Нарын-Кала", coords: [42.054033, 48.274931] },
    { name: "Дивеевский монастырь", coords: [55.040278, 43.241944] },
    { name: "Спасо-Преображенский монастырь, Ярославль", coords: [57.626389, 39.893611] },
    { name: "Москва-Сити, башня Федерация", coords: [55.749444, 37.536389] },
    { name: "Лахта-центр, Санкт-Петербург", coords: [59.986667, 30.175556] },
    { name: "Музей космонавтики, Калуга", coords: [54.516944, 36.233611] },
    { name: "Тульский кремль", coords: [54.195556, 37.621389] },
    { name: "Архангельские Гостиные дворы", coords: [64.540833, 40.515833] }
];

let totalScore = 0;
var randomPlace;
var playerMarker;
var correctMarker;
var map;
var player;
var availablePlaces = [...places];

function randomPanorama() {
    if (availablePlaces.length === 0) {
        alert("Игра окончена! Ваш итоговый счет: " + totalScore);
        return null;
    }
    var randomIndex = Math.floor(Math.random() * availablePlaces.length);
    var place = availablePlaces[randomIndex];
    availablePlaces.splice(randomIndex, 1);
    return place;
}

function init() {
    map = new ymaps.Map("map", {
        center: [55.75, 37.62],
        zoom: 6
    });

    map.events.add('click', function (e) {
        var coords = e.get('coords');
        if (playerMarker) {
            playerMarker.geometry.setCoordinates(coords);
        } else {
            playerMarker = new ymaps.Placemark(coords, { balloonContent: 'Ваш выбор' });
            map.geoObjects.add(playerMarker);
        }
    });

    startNewRound();
}

function startNewRound() {
    randomPlace = randomPanorama();
    if (player) player.destroy();

    ymaps.panorama.locate(randomPlace.coords).done(
        function (panoramas) {
            if (panoramas.length > 0) {
                player = new ymaps.panorama.Player('panorama', panoramas[0], { direction: [256, 16] });
            }
        },
        function (error) { alert(error.message); }
    );

    if (playerMarker) {
        map.geoObjects.remove(playerMarker);
        playerMarker = null;
    }
    if (correctMarker) {
        map.geoObjects.remove(correctMarker);
        correctMarker = null;
    }

    document.getElementById('guessButton').textContent = 'Проверить';
    document.getElementById('guessButton').onclick = handleButtonClick;
}

function handleButtonClick() {
    const button = document.getElementById('guessButton');
    if (button.textContent === 'Проверить') {
        checkGuess();
    } else {
        startNewRound();
    }
}

function checkGuess() {
    if (!playerMarker) {
        alert("Сначала сделайте выбор на карте!");
        return;
    }

    var playerCoords = playerMarker.geometry.getCoordinates();
    correctMarker = new ymaps.Placemark(randomPlace.coords, { balloonContent: 'Правильное место' }, { preset: 'islands#greenIcon' });
    map.geoObjects.add(correctMarker);

    var distance = ymaps.coordSystem.geo.getDistance(playerCoords, randomPlace.coords);
    var score = Math.max(0, Math.floor(5000 - (5000 * distance / 2000000)));
    totalScore += score;
    document.getElementById('score').textContent = totalScore;
    document.getElementById('distance').textContent = Math.round(distance / 1000);

    document.getElementById('guessButton').textContent = 'Следующий раунд';
    document.getElementById('guessButton').onclick = handleButtonClick;
}
