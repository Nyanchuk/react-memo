# ПЕРВАЯ ДОМАШКА
# Предварительный тайминг работы - 16 часов;
# Фактически затраченное время - 10 часов;

1. Изучение и запуск приложения - 1 час

2. Редактирование интерфейса - 3 часа
    + Интерфейс страницы "Сложности"
    + Интерфейс игры
    + Интерфейс модального окна
    + Добавление кнопки возврата на страницу выдора сложности
    + Внедрение логики работы кнопки возврата
    + Редактирование предупреждений от линтера

3. Чек-бокс на странице выбора уровня - 6 часов 
    + Визуальная часть чек-бокса
    + Установка Redux / устранение предупреждений от линтера
    + Связать логику включения с отображением числа попыток (Если вкл - попыток 3, а если выкл - попытка 1)
    + Связать логику работы чек-бокса с количеством фактических допущенных ошибок в игре (>3 - игра окончена)
    + Визуал ошибок совпадает с фактическим числом ошибок
    + Реализован счетчик на игровом экране, если включен упрощенный режим
    + Внедрить обновление счетчика после того как игрок кликнул по кнопке играть с начала
    + Редактирование предупреждений от линтера

4. Блок баловства
    + Добавить описание режима на странице выбора уровней
    + Оформить визуализацию
    + Предупредить ошибки от линтера


# ВТОРАЯ ДОМАШКА
# Предварительный тайминг работы - 12 часов;
# Фактически затраченное время - ... часов;

1. Кастдев и оценка времени работы - 1 час

# Условие отображения лидерборда
1. На странице выбора сложности доступна кнопка "Наши победители", при клике на нее: отображение лидерборда
2. После того, как игрок побеждает на 3м уровне сложности

2. Редактирование интерфейса - 4 часа
    + Организовать логику перехода к мок-странице "Лидерборд" на странице "Сложности" (Для стимулирования игроков учавствовать в рейтинге и иметь представление о результатах победителей) по пути "/leaderboard"
    + Интерфейс компонента "загрузки страницы"
    + Интерфейс страницы "Лидерборд"
    + Редактирование предупреждений от линтера

3. Отображение Лидерборда при ПЕРВОМ условии !!!
    + Реализовать получение API-запроса на получение списков лидеров
    + Редактирование предупреждений от линтера

4. Отображение Лидерборда при ВТОРОМ условии !!!
    + Добавить кнопку "Начать игру"
    + Видоизменить модальное окно при условии победы перед отправкой АПИ-запроса на добавление лидера в список при удачном завершении игры
    + Реализовать получение API-запроса на добавление лидера в список при удачном завершении игры
    + Реализовать логику перехода на страницу лидерборда и получение API-запроса на получение списков лидеров
    + Редактироваль отображение лидерборда так чтобы максимальное число лидеров было 10 чел
    + Редактировать логику заполнения ИМЕНИ: если имя не заполнено -> автозаполнение "Пользователь"
    + Редактировать логику кнопки "Посмотреть лидерборд" так, чтобы пользователь мог нажать на нее 1 раз
    + Редактирование предупреждений от линтера




------------------------- ЧЕК-ЛИСТ ПРОВЕРКИ -------------------------

# Первая домашка
+ Приложение запускается без ошибок в консоли.
+ Код соответствует принятым правилам в команде (нет ошибок линтера, соблюдена файловая структура).
+ По умолчанию "сложный" режим
+ Реализован счетчик на игровом экране, если включен упрощенный режим.
+ Игра останавливается только в том случае, если пользователь допустил три ошибки.
+ Объяснен выбор формата отображения счетчика ошибок.
+ Уточнено исходное техническое задание, оно соответствует новой версии приложения.
+ Добавлена оценка времени работы в README-файл.
# Вторая домашка
+ Добавлена новая страница в приложение, она доступна по пути 
/leaderboard
+ Внешний вид страницы полностью соответствует макету.
+ Приложение работает без ошибок в консоли.
+ Решение соответствует техническому заданию к реализации фичи.
+ Уточнено исходное техническое задание, оно соответствует новой версии приложения.
+ Добавлена оценка времени работы в README-файл.




------------------------- РУКОВОДСТВО ПО ЗАПУСКУ -------------------------

# MVP Карточная игра "Мемо"

В этом репозитории реализован MVP карточкой игры "Мемо" по [тех.заданию](./docs/mvp-spec.md)

Проект задеплоен на gh pages:
https://skypro-web-developer.github.io/react-memo/

## Разработка

Проект реализован на основе шаблона [Create React App](https://github.com/facebook/create-react-app).

### Как разрабатывать

- Установите зависимости командой `npm install`
- Запустите dev сервер `npm start`
- Откройте адрес в браузере

### Стек и инструменты

Для стилей в коде используются css modules.

Настроены eslint и prettier. Корректность кода проверяется автоматически перед каждым коммитом с помощью lefthook (аналог husky). Закомитить код, который не проходит проверку eslint не получится.

### Доступные команды

#### `npm start`

Запускает приложение в режиме разработки.

Откройте [http://localhost:3000](http://localhost:3000) чтобы посмотреть его в браузере.

#### `npm run build`

Собирает оптимизированный и минифицированный продакшен билд приложения в папку `build`.
После сборке, приложение готово к деплою.

#### `npm run deploy`

Деплоит приложение в github pages. По сути, запускает сборку и коммитит билд в ветку gh-pages.

(!) github pages должен быть включен в настройках репозитория и настроен на ветку gh-pages

#### `npm run lint`

Запускает eslint проверку кода, эта же команда запускается перед каждым коммитом.
Если не получается закоммитить, попробуйте запустить эту команду и исправить все ошибки и предупреждения.
