// scripts/script.js - Полная версия

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let currentFaqOpen = null;

// ========== МОБИЛЬНОЕ МЕНЮ ==========

/**
 * Переключение мобильного меню
 */
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
        menu.classList.toggle('mobile-menu-open');
        
        // Анимация иконки бургера
        const burgerIcon = document.querySelector('#mobile-menu-button i');
        if (burgerIcon) {
            if (menu.classList.contains('hidden')) {
                burgerIcon.className = 'fas fa-bars text-2xl';
            } else {
                burgerIcon.className = 'fas fa-times text-2xl';
            }
        }
    }
}

/**
 * Закрытие мобильного меню при клике на ссылку
 */
function initMobileMenu() {
    const menuLinks = document.querySelectorAll('#mobile-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            const menu = document.getElementById('mobile-menu');
            if (menu && !menu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        });
    });
}

// ========== ФОРМЫ ==========

/**
 * Валидация email
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Обработка отправки формы обратной связи
 */
function handleFormSubmit(formId, successMessage) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        let isValid = true;
        const requiredFields = this.querySelectorAll('[required]');
        
        // Сбрасываем ошибки
        this.querySelectorAll('.error-message').forEach(el => el.remove());
        requiredFields.forEach(field => {
            field.classList.remove('border-red-500', 'border-green-500');
        });

        // Проверка обязательных полей
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('border-red-500');
                showFieldError(field, 'Это поле обязательно для заполнения');
                isValid = false;
            }
        });

        // Валидация email
        const emailField = this.querySelector('input[type="email"]');
        if (emailField && emailField.value.trim() && !isValidEmail(emailField.value)) {
            emailField.classList.add('border-red-500');
            showFieldError(emailField, 'Введите корректный email');
            isValid = false;
        }

        if (!isValid) {
            showNotification('Пожалуйста, заполните все обязательные поля корректно', 'error');
            return;
        }

        // Симуляция отправки на сервер
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Отправка...';
        submitButton.disabled = true;

        setTimeout(() => {
            showNotification(successMessage || 'Спасибо! Ваше сообщение отправлено.', 'success');
            form.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 1500);
    });
}

/**
 * Показать ошибку поля
 */
function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

/**
 * Показать уведомление
 */
function showNotification(message, type = 'success') {
    // Удаляем старые уведомления
    document.querySelectorAll('.custom-notification').forEach(el => el.remove());

    const notification = document.createElement('div');
    notification.className = `custom-notification fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-3"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Анимация появления
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ========== FAQ СИСТЕМА ==========

/**
 * Переключение FAQ вопросов
 */
function toggleFaq(faqId) {
    const answer = document.getElementById(faqId);
    const question = answer.previousElementSibling;
    const icon = question.querySelector('i');

    if (!answer || !question) return;

    // Закрываем предыдущий открытый FAQ
    if (currentFaqOpen && currentFaqOpen !== answer) {
        const prevQuestion = currentFaqOpen.previousElementSibling;
        const prevIcon = prevQuestion.querySelector('i');
        
        currentFaqOpen.classList.add('hidden');
        prevQuestion.classList.remove('active');
        if (prevIcon) {
            prevIcon.classList.remove('rotate-180');
        }
    }

    // Переключаем текущий FAQ
    answer.classList.toggle('hidden');
    question.classList.toggle('active');
    
    if (icon) {
        icon.classList.toggle('rotate-180');
    }

    // Обновляем текущий открытый FAQ
    if (answer.classList.contains('hidden')) {
        currentFaqOpen = null;
    } else {
        currentFaqOpen = answer;
    }

    // Прокрутка к открытому вопросу
    if (!answer.classList.contains('hidden')) {
        question.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Поиск по FAQ
 */
function initFaqSearch() {
    const searchInput = document.getElementById('faqSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        const faqItems = document.querySelectorAll('.faq-item');
        let foundCount = 0;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const questionText = question.textContent.toLowerCase();
            const answerText = answer ? answer.textContent.toLowerCase() : '';

            if (searchTerm === '' || questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
                item.style.display = 'block';
                foundCount++;
                
                // Подсветка найденного текста
                if (searchTerm !== '' && answer) {
                    highlightText(answer, searchTerm);
                }
            } else {
                item.style.display = 'none';
            }
        });

        // Показать сообщение если ничего не найдено
        const noResults = document.getElementById('no-faq-results');
        if (foundCount === 0 && searchTerm !== '') {
            if (!noResults) {
                const noResultsDiv = document.createElement('div');
                noResultsDiv.id = 'no-faq-results';
                noResultsDiv.className = 'text-center py-8 text-gray-500';
                noResultsDiv.innerHTML = `
                    <i class="fas fa-search text-4xl mb-4"></i>
                    <p class="text-lg">Не найдено вопросов по запросу "${searchTerm}"</p>
                    <p class="text-sm mt-2">Попробуйте другие ключевые слова</p>
                `;
                
                const faqContainer = document.querySelector('.faq-container') || document.querySelector('#faq');
                if (faqContainer) {
                    faqContainer.appendChild(noResultsDiv);
                }
            }
        } else if (noResults) {
            noResults.remove();
        }
    });
}

/**
 * Подсветка текста в результатах поиска
 */
function highlightText(element, searchTerm) {
    const text = element.textContent;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const highlighted = text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    element.innerHTML = highlighted;
}

/**
 * Открыть первый FAQ вопрос по умолчанию
 */
function openFirstFaq() {
    const firstFaqQuestion = document.querySelector('.faq-question');
    if (firstFaqQuestion) {
        const firstFaqId = firstFaqQuestion.getAttribute('onclick')?.match(/'([^']+)'/)?.[1] || 
                          firstFaqQuestion.getAttribute('data-target');
        if (firstFaqId) {
            toggleFaq(firstFaqId);
        }
    }
}

// ========== СТРАНИЦА 404 ==========

/**
 * Поиск по сайту на странице 404
 */
function init404Search() {
    const searchInput = document.getElementById('siteSearch');
    if (!searchInput) return;

    const pages = [
        { name: 'Главная', url: 'index.html', keywords: ['главная', 'home', 'старт', 'index', 'начало'] },
        { name: 'FAQ', url: 'faq.html', keywords: ['faq', 'вопросы', 'помощь', 'часто', 'ответы', 'справка'] },
        { name: 'Контакты', url: 'contacts.html', keywords: ['контакты', 'support', 'поддержка', 'написать', 'связаться', 'помощь'] },
        { name: 'Направления', url: 'index.html#destinations', keywords: ['направления', 'страны', 'путешествия', 'города', 'туры', 'маршруты'] }
    ];

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const query = this.value.toLowerCase().trim();
            
            if (!query) {
                showNotification('Введите поисковый запрос', 'error');
                return;
            }

            for (const page of pages) {
                if (page.keywords.some(keyword => query.includes(keyword))) {
                    window.location.href = page.url;
                    return;
                }
            }

            showNotification('Страница не найдена. Попробуйте: "главная", "faq", "контакты", "направления"', 'error');
        }
    });
}

/**
 * Анимации для страницы 404
 */
function init404Animations() {
    const floatingElements = document.querySelectorAll('.floating');
    floatingElements.forEach(el => {
        el.style.animation = 'float 6s ease-in-out infinite';
    });

    const pulseElements = document.querySelectorAll('.pulse');
    pulseElements.forEach(el => {
        el.style.animation = 'pulse 2s infinite';
    });
}

// ========== НАВИГАЦИЯ ==========

/**
 * Подсветка активной ссылки в навигации
 */
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Убираем все активные классы
        link.classList.remove('text-blue-600', 'font-bold', 'border-b-2', 'border-blue-600');
        link.classList.add('text-gray-700', 'hover:text-blue-600');

        // Проверяем, является ли ссылка активной
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage.includes('index.html') && linkHref === 'index.html')) {
            link.classList.remove('text-gray-700', 'hover:text-blue-600');
            link.classList.add('text-blue-600', 'font-bold', 'border-b-2', 'border-blue-600');
        }
    });
}

/**
 * Плавная прокрутка к якорям
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Если это просто #, не обрабатываем
            if (href === '#') return;
            
            // Если это якорь на этой же странице
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ========== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ==========

/**
 * Инициализация карты (заглушка для реальной интеграции)
 */
function initMap() {
    const mapContainers = document.querySelectorAll('.map-container');
    mapContainers.forEach(container => {
        if (container.innerHTML.includes('Здесь будет карта') || 
            container.innerHTML.includes('Карта подключения')) {
            
            const mapButton = document.createElement('button');
            mapButton.className = 'mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition';
            mapButton.innerHTML = '<i class="fas fa-map-marked-alt mr-2"></i>Подключить карту';
            mapButton.addEventListener('click', () => {
                showNotification('Для подключения реальной карты используйте Яндекс.Карты или Google Maps API', 'info');
            });
            
            container.appendChild(mapButton);
        }
    });
}

/**
 * Инициализация обратного отсчета для акций
 */
function initCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7); // Акция на 7 дней

    function updateCountdown() {
        const now = new Date();
        const difference = targetDate - now;

        if (difference <= 0) {
            countdownElement.innerHTML = 'Акция завершена';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `
            <div class="flex gap-2 justify-center">
                <div class="text-center">
                    <div class="text-2xl font-bold">${days}</div>
                    <div class="text-xs">дней</div>
                </div>
                <div class="text-2xl">:</div>
                <div class="text-center">
                    <div class="text-2xl font-bold">${hours}</div>
                    <div class="text-xs">часов</div>
                </div>
                <div class="text-2xl">:</div>
                <div class="text-center">
                    <div class="text-2xl font-bold">${minutes}</div>
                    <div class="text-xs">минут</div>
                </div>
                <div class="text-2xl">:</div>
                <div class="text-center">
                    <div class="text-2xl font-bold">${seconds}</div>
                    <div class="text-xs">секунд</div>
                </div>
            </div>
        `;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/**
 * Инициализация кнопок "В избранное"
 */
function initFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) { // Не в избранном
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('text-red-500');
                showNotification('Добавлено в избранное', 'success');
            } else { // Уже в избранном
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('text-red-500');
                showNotification('Удалено из избранного', 'info');
            }
        });
    });
}

// ========== ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ ==========

/**
 * Инициализация всех функций
 */
function init() {
    console.log('🚀 TravelMaster scripts initialized');

    // 1. Навигация и меню
    initMobileMenu();
    highlightActiveNav();
    initSmoothScroll();

    // 2. Формы
    handleFormSubmit('feedbackForm', 'Спасибо! Ваш отзыв отправлен.');
    handleFormSubmit('contactForm', 'Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');

    // 3. FAQ функционал
    if (document.getElementById('faqSearch')) {
        initFaqSearch();
        openFirstFaq();
    }

    // 4. Страница 404
    if (document.getElementById('siteSearch')) {
        init404Search();
        init404Animations();
    }

    // 5. Карты
    if (document.querySelector('.map-container')) {
        initMap();
    }

    // 6. Дополнительные функции
    initCountdown();
    initFavoriteButtons();

    // 7. Инициализация кнопки мобильного меню
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }

    // 8. Инициализация всех кнопок FAQ на странице
    document.querySelectorAll('.faq-question').forEach(button => {
        const onclickValue = button.getAttribute('onclick');
        if (onclickValue && onclickValue.includes('toggleFaq')) {
            const faqId = onclickValue.match(/['"]([^'"]+)['"]/)?.[1];
            if (faqId) {
                button.removeAttribute('onclick');
                button.addEventListener('click', () => toggleFaq(faqId));
            }
        }
    });

    // 9. Добавляем обработчик для кнопки поиска в хедере
    const searchButton = document.querySelector('button[type="submit"]');
    if (searchButton && !searchButton.closest('form')) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            const searchInput = document.querySelector('input[placeholder*="Куда хотите"]');
            if (searchInput && searchInput.value.trim()) {
                showNotification(`Ищем: ${searchInput.value}`, 'info');
            }
        });
    }
}

// ========== СЛУЖЕБНЫЕ ФУНКЦИИ ==========

/**
 * Копирование текста в буфер обмена
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Скопировано в буфер обмена', 'success');
    }).catch(err => {
        console.error('Ошибка копирования: ', err);
    });
}

/**
 * Форматирование даты
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Проверка на мобильное устройство
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ========== ЭКСПОРТ ФУНКЦИЙ ДЛЯ ГЛОБАЛЬНОГО ИСПОЛЬЗОВАНИЯ ==========

window.toggleFaq = toggleFaq;
window.toggleMobileMenu = toggleMobileMenu;
window.showNotification = showNotification;
window.copyToClipboard = copyToClipboard;

// ========== ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ==========

// Запуск когда DOM полностью загружен
document.addEventListener('DOMContentLoaded', init);

// Запуск когда все ресурсы загружены
window.addEventListener('load', () => {
    console.log('✅ Все ресурсы загружены');
});

// Обработчик для динамически добавляемых элементов
document.addEventListener('click', function(e) {
    // Обработка кнопок "Показать больше"
    if (e.target.matches('.show-more-btn') || e.target.closest('.show-more-btn')) {
        const targetId = e.target.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.classList.toggle('hidden');
            e.target.textContent = targetElement.classList.contains('hidden') ? 
                'Показать больше' : 'Показать меньше';
        }
    }
});

// ========== ОБРАБОТЧИК ОШИБОК ==========

window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.error);
    // Можно отправить ошибку на сервер для анализа
});

// Готово!
console.log('✨ Скрипты TravelMaster успешно загружены');

// ========== МОБИЛЬНОЕ МЕНЮ И БУРГЕР ==========

/**
 * Проверка мобильного устройства
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 768;
}

/**
 * Инициализация бургер-меню
 */
function initBurgerMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!menuButton || !mobileMenu) return;

    // Скрываем меню на десктопе
    if (!isMobileDevice() && window.innerWidth >= 1024) {
        mobileMenu.classList.add('hidden');
        return;
    }

    // Обработчик клика по бургеру
    menuButton.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', function (e) {
        if (!mobileMenu.contains(e.target) && !menuButton.contains(e.target)) {
            if (!mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        }
    });

    // Закрытие меню при клике на ссылку внутри него
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        });
    });

    // Обработчик изменения размера окна
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth >= 1024) {
                // На десктопе скрываем меню
                mobileMenu.classList.add('hidden');
                const burgerIcon = menuButton.querySelector('i');
                if (burgerIcon) {
                    burgerIcon.className = 'fas fa-bars text-2xl';
                }
            }
        }, 250);
    });
}

/**
 * Улучшенное переключение мобильного меню
 */
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const menuButton = document.getElementById('mobile-menu-button');

    if (!menu || !menuButton) return;

    // Только для мобильных устройств
    if (!isMobileDevice() && window.innerWidth >= 1024) {
        menu.classList.add('hidden');
        return;
    }

    const isHidden = menu.classList.contains('hidden');
    const burgerIcon = menuButton.querySelector('i');

    if (isHidden) {
        // Открываем меню
        menu.classList.remove('hidden');
        menu.style.maxHeight = menu.scrollHeight + 'px';

        // Меняем иконку
        if (burgerIcon) {
            burgerIcon.className = 'fas fa-times text-2xl';
        }

        // Блокируем скролл страницы
        document.body.style.overflow = 'hidden';

        // Анимация появления
        setTimeout(() => {
            menu.style.opacity = '1';
            menu.style.transform = 'translateY(0)';
        }, 10);

        // Добавляем оверлей
        createMenuOverlay();

    } else {
        // Закрываем меню
        menu.style.maxHeight = '0';
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(-10px)';

        // Меняем иконку
        if (burgerIcon) {
            burgerIcon.className = 'fas fa-bars text-2xl';
        }

        // Разблокируем скролл
        document.body.style.overflow = '';

        // Удаляем меню после анимации
        setTimeout(() => {
            menu.classList.add('hidden');
            menu.style.maxHeight = '';
            menu.style.opacity = '';
            menu.style.transform = '';
        }, 300);

        // Удаляем оверлей
        removeMenuOverlay();
    }
}

/**
 * Создание оверлея для мобильного меню
 */
function createMenuOverlay() {
    // Удаляем старый оверлей если есть
    removeMenuOverlay();

    const overlay = document.createElement('div');
    overlay.id = 'mobile-menu-overlay';
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden';
    overlay.style.backdropFilter = 'blur(2px)';

    // Клик по оверлею закрывает меню
    overlay.addEventListener('click', function () {
        toggleMobileMenu();
    });

    document.body.appendChild(overlay);

    // Анимация появления
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
}

/**
 * Удаление оверлея мобильного меню
 */
function removeMenuOverlay() {
    const overlay = document.getElementById('mobile-menu-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
}

/**
 * Инициализация мобильных жестов
 */
function initMobileGestures() {
    if (!isMobileDevice()) return;

    let startX = 0;
    let startY = 0;
    let startTime = 0;

    document.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();

        const diffX = endX - startX;
        const diffY = endY - startY;
        const diffTime = endTime - startTime;

        // Свайп вправо для открытия меню (только от левого края)
        if (startX < 50 && diffX > 100 && Math.abs(diffY) < 50 && diffTime < 300) {
            const menu = document.getElementById('mobile-menu');
            if (menu && menu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        }

        // Свайп влево для закрытия меню
        if (diffX < -100 && Math.abs(diffY) < 50 && diffTime < 300) {
            const menu = document.getElementById('mobile-menu');
            if (menu && !menu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        }
    }, { passive: true });
}

// ========== ДОПОЛНИТЕЛЬНЫЕ МОБИЛЬНЫЕ ФУНКЦИИ ==========

/**
 * Оптимизация для мобильных устройств
 */
function optimizeForMobile() {
    if (!isMobileDevice()) return;

    // Отключаем ховер-эффекты на тач-устройствах
    document.querySelectorAll('.hover\\:scale-105, .hover\\:shadow-lg, .hover\\:bg-').forEach(el => {
        el.classList.remove('hover:scale-105', 'hover:shadow-lg');
    });

    // Улучшаем тапы
    document.querySelectorAll('button, a').forEach(el => {
        el.classList.add('tap-highlight-none', 'no-text-select');
    });

    // Предотвращаем зум при фокусе на input
    document.querySelectorAll('input, textarea, select').forEach(el => {
        el.addEventListener('focus', function () {
            if (isMobileDevice()) {
                setTimeout(() => {
                    this.blur();
                    this.focus();
                }, 10);
            }
        });
    });
}

/**
 * Исправление высоты на мобильных (vh issue)
 */
function fixMobileViewportHeight() {
    if (!isMobileDevice()) return;

    // Устанавливаем реальную высоту окна
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    // Используем CSS переменную
    const style = document.createElement('style');
    style.textContent = `
        .min-h-screen {
            min-height: calc(var(--vh, 1vh) * 100) !important;
        }
        
        .h-screen {
            height: calc(var(--vh, 1vh) * 100) !important;
        }
    `;
    document.head.appendChild(style);
}

// ========== ОБНОВЛЕННАЯ ФУНКЦИЯ INIT() ==========

function init() {
    console.log('🚀 TravelMaster scripts initialized');

    // Мобильная оптимизация
    if (isMobileDevice()) {
        optimizeForMobile();
        fixMobileViewportHeight();
        initMobileGestures();
    }

    // 1. Навигация и меню
    initBurgerMenu(); // Замените старый initMobileMenu на этот
    highlightActiveNav();
    initSmoothScroll();

    // 2. Формы
    handleFormSubmit('feedbackForm', 'Спасибо! Ваш отзыв отправлен.');
    handleFormSubmit('contactForm', 'Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');

    // 3. FAQ функционал
    if (document.getElementById('faqSearch')) {
        initFaqSearch();
        openFirstFaq();
    }

    // 4. Страница 404
    if (document.getElementById('siteSearch')) {
        init404Search();
        init404Animations();
    }

    // 5. Карты
    if (document.querySelector('.map-container')) {
        initMap();
    }

    // 6. Дополнительные функции
    initCountdown();
    initFavoriteButtons();

    // 7. Инициализация всех кнопок FAQ
    document.querySelectorAll('.faq-question').forEach(button => {
        const onclickValue = button.getAttribute('onclick');
        if (onclickValue && onclickValue.includes('toggleFaq')) {
            const faqId = onclickValue.match(/['"]([^'"]+)['"]/)?.[1];
            if (faqId) {
                button.removeAttribute('onclick');
                button.addEventListener('click', () => toggleFaq(faqId));
            }
        }
    });

    // 8. Ленивая загрузка изображений для мобильных
    if ('loading' in HTMLImageElement.prototype && isMobileDevice()) {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Экспортируем новые функции
window.isMobileDevice = isMobileDevice;
window.initBurgerMenu = initBurgerMenu;