# TheMixLink
![TheMixLink Logo](https://raw.githubusercontent.com/themixteam/TheMixLink/master/github_images/logo_small.png "Просто тут для красоты")  
Простой сократитель ссылок. https://l.justartur.ru

# Зависимости
- `ejs ^2.6.2`
- `express ^4.17.1`
- `mongodb ^3.3.0-beta2`
- `serve-favicon ^2.5.0`

# Установка
Чтобы запустить TheMixLink на своем сервере Вам необходимо скачать содержимое данного репозитория или склонировать его командой `git clone https://github.com/themixteam/TheMixLink.git`. После этого просто введи команду `npm install` чтобы установить все зависимости и запустите TheMixLink командой `node .`. Готово!

# Конфигурация
Чтобы изменить порт нужно изменить параметр `port` в файле `config.json`. Стандартный порт - 8081. Чтобы изменить название БД (MongoDB) нужно изменить параметр `database` в файле `config.json`.

# API
Чтобы использовать API TheMixLink необходимо зайти на адрес `ваш-сервер.ком/api?url=ссылка`. В ответ Вы получите ответ `{"link":"сокращенная ссылка"}`. Вот такой простой API!

# Скриншоты
![Главная страница TheMixLink](https://raw.githubusercontent.com/themixteam/TheMixLink/master/github_images/main.png "Главная страница")
![Главная страница TheMixLink с диалогом](https://raw.githubusercontent.com/themixteam/TheMixLink/master/github_images/main_link.png "Главная страница с диалогом")
![Страница TheMixLink с пояснением работы API](https://raw.githubusercontent.com/themixteam/TheMixLink/master/github_images/api.png "Страница с пояснением работы API")
![Страница TheMixLink об сократителе](https://raw.githubusercontent.com/themixteam/TheMixLink/master/github_images/about.png "Страница об сократителе")
