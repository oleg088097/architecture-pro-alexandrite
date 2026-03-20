# Выбор и настройка мониторинга в системе

## Мотивация
Добавление мониторинга в систему позволит:
 - Получить безнес-инсайты для определения паттернов использовании системы потребителями и приоритетов в развитии бизнеса через контроль количества запросов к API и нагрузки со стороны других подавцов ювелирных изделий
 - Уменьшить затраты на инфрастуктуру путём планировать и оптимизировать утилизацию ресурсов для
 - Увеличить степень удовлетворения клиентов используя автоматическое масштабирование системы при увеличении нагрузки
 - Уменьшить time to market и количество багов в системе с помощью упрощения поиска горячих точек 
 - Избежать будущую деградацию качества обслуживания клиентов, имея возможность спрогнозировать проблему до того, как она начнут влиять на пользователей

## Выбор подхода к мониторингу
- USE для MES API, 3D File Storage, Базы данных 
  - Для данных компонентов важна производительность, у них есть пределы доступных ресурсов и можно заменять их аллокацию
- RED для MES API, CRM API, Shop API, потенциального API-шлюза для API рассчётов
  - Данные компоненты являются "интерфейсами" для пользоваталей и требуется замерять отзывчивость интерфейсов
- RED для Message Queue
  - Для данного компонента не имеют смысла Utilization, Saturation из USE и требуется замерять "отзывчивость" сервиса на запросы
 
## Метрики для отслеживания

Для текущей инфрастуктуры не требуеются ярлыки, т.к. всех систем по 1 инстансу. При горизонтальном масштабировании системы потребуется добавить ярылки для определения отдельных инстансов. 
- Необходимо для контроля утилизации сервисов (U)
  - CPU % for MES API
  - Memory Utilisation for MES API 
  - Memory Utilisation for shop db instance 
  - Memory Utilisation for MES db instance 
  - Number of connections for shop db instance 
  - Number of connections for MES db instance 
  - Size of S3 storage 
  - Size of shop db instance 
  - Size of MES db instance
- Необходимо для контроля насыщенности сервисов (S)
  - Number of message in flight in RabbitMQ
- Необходимо для контроля доли ошибок в запросах (E)
  - Number of dead-letter-exchange letters in RabbitMQ

- Необходимо для контроля частоты запросов к интерфейсам (R)
  - Number of requests (RPS) per user for internet shop API 
  - Number of requests (RPS) per user for CRM API 
  - Number of requests (RPS) per user for MES API
- Необходимо для контроля доли ошибок в запросах (E)
  - Number of HTTP 500 for CRM API 
  - Number of HTTP 500 for MES API 
  - Number of HTTP 500 for shop API
- Необходимо для контроля длительности запросов (D)
  - Response time (latency) for shop API 
  - Response time (latency) for CRM API 
  - Response time (latency) for MES API

## План действий
1. Развернуть Prometheus
2. Развернуть Grafana
3. Настроить сбор метрик утилизации ресурсов для приложений (CPU, Memory, Connection Pool, Disk)
4. Настроить сбор метрик API в приложениях (RPS, Response time, Errors)
5. Настроить сбор метрик очередей (in-flight, dead-letter)
6. Создать дейшборды для сервисов по подходам USE и RED