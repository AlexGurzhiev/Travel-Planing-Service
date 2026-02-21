// scripts/consoleLogger.js
document.addEventListener('DOMContentLoaded', function () {
    // Слушаем событие formValid от validation.js
    document.addEventListener('formValid', function (event) {
        const data = event.detail;

        // Очищаем консоль для наглядности
        console.clear();

        // Выводим заголовок
        console.log('%c📋 Данные отправленной формы', 'font-size: 16px; font-weight: bold; color: #3b82f6;');
        console.log('='.repeat(50));

        // Выводим данные построчно
        console.log('👤 %cИмя:', 'font-weight: bold', data.name);
        console.log('📧 %cEmail:', 'font-weight: bold', data.email);
        console.log('📌 %cТема:', 'font-weight: bold', data.topic);
        console.log('💬 %cСообщение:', 'font-weight: bold', data.message);
        console.log('🕐 %cДата:', 'font-weight: bold', data.date);

        console.log('='.repeat(50));
        console.log('%c✅ Форма успешно валидирована и отправлена!', 'color: #10b981; font-weight: bold;');

        // Дополнительно: вывод в таблице для наглядности
        console.table({
            'Имя': data.name,
            'Email': data.email,
            'Тема': data.topic,
            'Сообщение': data.message.substring(0, 30) + '...',
            'Дата': data.date
        });
    });
});