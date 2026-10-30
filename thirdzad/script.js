const form = document.getElementById('feedbackForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const successMessage = document.getElementById('successMessage');

// Регулярное выражение для базовой проверки корректности email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form.addEventListener('submit', function (event) {
    // Отменяем стандартную отправку формы (перезагрузку)
    event.preventDefault();

    // Сбрасываем предыдущие ошибки перед новой проверкой
    resetErrors();

    let isValid = true;

    // 1. Проверка имени (не должно быть пустым)
    if (nameInput.value.trim() === '') {
        showError(nameInput, nameError, 'Имя не должно быть пустым.');
        isValid = false;
    }

    // 2. Проверка email (должен соответствовать регулярному выражению)
    if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, emailError, 'Email должен быть корректным (например, user@example.com).');
        isValid = false;
    }

    // 3. Проверка сообщения (не менее 10 символов)
    if (messageInput.value.trim().length < 10) {
        showError(messageInput, messageError, 'Сообщение должно содержать хотя бы 10 символов.');
        isValid = false;
    }

    // Если все поля прошли валидацию успешно
    if (isValid) {
        // Показываем сообщение об успехе
        successMessage.classList.remove('hidden');
        
        // Очищаем поля формы
        form.reset();

        // Скрываем сообщение об успехе через 5 секунд
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
    }
});

// Функция для вывода ошибки конкретному полю
function showError(inputElement, errorElement, errorMessage) {
    inputElement.classList.add('invalid');
    errorElement.innerText = errorMessage;
}

// Функция сброса стилей и текстов ошибок
function resetErrors() {
    const inputs = [nameInput, emailInput, messageInput];
    const errors = [nameError, emailError, messageError];

    inputs.forEach(input => input.classList.remove('invalid'));
    errors.forEach(error => error.innerText = '');
    successMessage.classList.add('hidden');
}
