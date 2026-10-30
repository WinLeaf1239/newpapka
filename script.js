const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = ''; 
let shouldResetDisplay = false;

// Функция обработки ввода (общая для мыши и клавиатуры)
function handleInput(key) {
    // Кнопка сброса (О или Clear)
    if (key === 'c' || key === 'c' || key === 'Escape') {
        currentInput = '';
        display.innerText = '0';
        return;
    }

    // Кнопка "Равно"
    if (key === '=' || key === 'Enter') {
        calculate();
        return;
    }

    // Удаление последнего символа (Backspace)
    if (key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
        display.innerText = currentInput || '0';
        return;
    }

    // Проверка на операторы
    const operators = ['+', '-', '*', '/'];
    if (operators.includes(key)) {
        if (currentInput === '' && key === '-') {
            currentInput += key;
            display.innerText = currentInput;
            return;
        }
        
        // Предотвращаем ввод двух операторов подряд
        if (operators.includes(currentInput.slice(-1))) {
            currentInput = currentInput.slice(0, -1) + key;
            display.innerText = currentInput.replace('/', '÷').replace('*', 'x');
            return;
        }
    }

    // Точка для дробей
    if (key === '.') {
        const parts = currentInput.split(/[\+\-\*\/]/);
        const currentPart = parts[parts.length - 1];
        if (currentPart.includes('.')) return; // Если в текущем числе уже есть точка — игнорируем
    }

    // Обычный ввод цифр
    if (shouldResetDisplay && !operators.includes(key)) {
        currentInput = '';
        shouldResetDisplay = false;
    }

    if (currentInput === '0' && key !== '.') {
        currentInput = key;
    } else {
        currentInput += key;
    }

    // Красивое отображение знаков умножения и деления на экране
    display.innerText = currentInput.replace(/\//g, '÷').replace(/\*/g, 'x') || '0';
}

// Вычисление результата
function calculate() {
    if (!currentInput) return;
    try {
        // Безопасное вычисление строки выражения
        let result = Function(`"use strict"; return (${currentInput})`)();
        
        // Округляем длинные дроби, чтобы не ломать экран
        if (result.toString().includes('.')) {
            result = Math.round(result * 1000000) / 1000000;
        }
        
        display.innerText = result;
        currentInput = result.toString();
        shouldResetDisplay = true;
    } catch (error) {
        display.innerText = 'Ошибка';
        currentInput = '';
    }
}

// 1. ОБРАБОТКА КЛИКОВ МЫШКИ
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const key = button.getAttribute('data-key');
        handleInput(key);
    });
});

// 2. ОБРАБОТКА НАЖАТИЙ КЛАВИАТУРЫ
document.addEventListener('keydown', (event) => {
    let key = event.key;

    // Маппинг клавиш клавиатуры под data-key кнопок
    if (key === 'Enter') key = '=';
    if (key === 'Escape' || key === 'Delete') key = 'c';
    
    // Ищем кнопку на экране для анимации нажатия
    const button = document.querySelector(`.btn[data-key="${key.toLowerCase()}"]`);
    
    // Если такая кнопка есть в калькуляторе — нажимаем её
    if (button) {
        event.preventDefault(); // отключаем скролл от пробела или стрелочек
        button.classList.add('active'); // визуальный эффект нажатия
        handleInput(key.toLowerCase());
        
        // Убираем эффект нажатия через 100мс
        setTimeout(() => button.classList.remove('active'), 100);
    }
});