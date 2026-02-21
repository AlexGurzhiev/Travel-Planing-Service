// scripts/validation.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('feedbackForm');
    if (!form) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Сбрасываем предыдущие ошибки
        clearErrors();

        let isValid = true;

        // 1. Проверка имени (не пустое, минимум 2 слова)
        const nameInput = document.getElementById('name');
        const nameValue = nameInput.value.trim();

        if (nameValue === '') {
            showError(nameInput, 'Введите ваше имя');
            isValid = false;
        } else if (nameValue.split(' ').filter(word => word.length > 0).length < 2) {
            showError(nameInput, 'Введите имя и фамилию');
            isValid = false;
        }

        // 2. Проверка email (не пустой, содержит @ и .)
        const emailInput = document.getElementById('email');
        const emailValue = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailValue === '') {
            showError(emailInput, 'Введите email');
            isValid = false;
        } else if (!emailPattern.test(emailValue)) {
            showError(emailInput, 'Введите корректный email (пример: name@domain.com)');
            isValid = false;
        }

        // 3. Проверка темы (выбрана)
        const topicSelect = document.getElementById('topic');
        if (!topicSelect.value) {
            showError(topicSelect, 'Выберите тему сообщения');
            isValid = false;
        }

        // 4. Проверка сообщения (не пустое, минимум 10 символов)
        const messageInput = document.getElementById('message');
        const messageValue = messageInput.value.trim();

        if (messageValue === '') {
            showError(messageInput, 'Введите сообщение');
            isValid = false;
        } else if (messageValue.length < 10) {
            showError(messageInput, 'Сообщение должно содержать минимум 10 символов');
            isValid = false;
        }

        // 5. Проверка согласия
        const agreementCheck = document.getElementById('agreement');
        if (!agreementCheck.checked) {
            showError(agreementCheck, 'Необходимо согласие на обработку данных');
            isValid = false;
        }

        // Если всё корректно — создаём событие с данными
        if (isValid) {
            const formData = {
                name: nameValue,
                email: emailValue,
                topic: topicSelect.options[topicSelect.selectedIndex].text,
                message: messageValue,
                date: new Date().toLocaleString()
            };

            const event = new CustomEvent('formValid', { detail: formData });
            document.dispatchEvent(event);

            // Очищаем форму
            form.reset();
        }
    });

    // Функция показа ошибки (адаптирована под Tailwind)
    function showError(input, message) {
        // Добавляем красную рамку
        input.classList.add('border-red-500', 'border-2');

        // Создаем сообщение об ошибке
        const errorDiv = document.createElement('p');
        errorDiv.className = 'text-red-500 text-sm mt-1 error-message';
        errorDiv.textContent = message;

        // Вставляем после родительского div
        const parent = input.closest('.field') || input.parentElement;
        parent.appendChild(errorDiv);
    }

    // Функция очистки ошибок
    function clearErrors() {
        // Убираем красные рамки
        document.querySelectorAll('.border-red-500').forEach(el => {
            el.classList.remove('border-red-500', 'border-2');
        });

        // Удаляем сообщения об ошибках
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    }

    // Очищаем ошибку при вводе
    document.querySelectorAll('#feedbackForm input, #feedbackForm select, #feedbackForm textarea').forEach(input => {
        input.addEventListener('input', function () {
            this.classList.remove('border-red-500', 'border-2');
            const parent = this.closest('.field') || this.parentElement;
            const errorMsg = parent.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        });
    });
});