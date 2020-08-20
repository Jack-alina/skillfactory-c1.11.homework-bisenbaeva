const timer = document.querySelector('.countdown');
const minutesNode = document.querySelector('.minutes');
const secondsNode = document.querySelector('.seconds');
const message = document.querySelector('.message');

const plus = document.querySelector('.j-btn-plus');
const minus = document.querySelector('.j-btn-minus');
const start = document.querySelector('.j-btn-start');
const pause = document.querySelector('.j-btn-pause');
const reset = document.querySelector('.j-btn-reset');

const instruction = document.querySelector('.j-instruction')

let time = 0;
let nIntervId = null;

const numberConverter = (value) => {
	if(value < 10) {
		return `0${value}`;
	}
	return `${value}`;
}

const changeTimerTime = () => {
	const minutes = Math.floor(time / 60);
	const seconds = time - minutes * 60;

	minutesNode.value = numberConverter(minutes);
	secondsNode.value = numberConverter(seconds);
}

/* будем дизаблить кнопки в зависимости от ситуации: 
- если таймер дошел до конца, активна только reset; 
- если время максимальное (59:59 по условию), plus не активен;
- если время минимальное (00:00), minus не активен */ 
const disable_button = () => {
  time = Number(minutesNode.value * 60) + Number(secondsNode.value) 
  if (timer.style.display == 'none') {
    plus.disabled = true;
    minus.disabled = true;
    start.disabled = true;
    pause.disabled = true;
  }
  else if (time == 0) {
    minus.disabled = true;
    plus.disabled = false;
    start.disabled = false;
    pause.disabled = false;    
  }
  else if (time > 0 && time < (59 * 60 + 59) ) {
    plus.disabled = false;
    minus.disabled = false;
    start.disabled = false;
    pause.disabled = false;
  }
  else {
    plus.disabled = true;    
  } 
}
disable_button()

// метод для приостановки таймера, будем пихать его потом в обработчики событий клика для всех кнопок
const pausedTimer = () => {
	if (nIntervId) {
		clearInterval(nIntervId);
		nIntervId = null;
	}
}

/* в этом методе реализуем:
- переход фокуса с инпута для минут на инпут для секунд по нажатию Enter, реализуем с помощью focus() и blur() 
- выскакивание алерта в случае, если пользователь ввел недопустимые значения в инпут (по условию не может быт больше 59)*/
minutesNode.addEventListener('keydown', () => {
  if (event.code == 'Enter' && (minutesNode.value >= 0 && minutesNode.value <= 59)) {
    disable_button();
    minutesNode.blur();
    secondsNode.focus();
    minutesNode.value = numberConverter(minutesNode.value);
  }
  else if (event.code == 'Enter') {
    alert ('Введите число от 0 до 59')
    minutesNode.value = '';
  }
});

/*Аналогичный метод для инпута для секунд
отличается только тем, что после нажатия на Enter фокус не переходит на инпут для минут, а просто пропадает*/
secondsNode.addEventListener('keydown', () => {
  if (event.code == 'Enter' && (secondsNode.value >= 0 && secondsNode.value <= 59)) {
    disable_button();
    secondsNode.blur();
    secondsNode.value = numberConverter(secondsNode.value);
  }
  else if (event.code == 'Enter') {
    alert ('Введите число от 0 до 59')
    secondsNode.value = '';
  }
})

// при клике на plus к времени добавляется 1 секунда, таймер ставится на паузу
plus.addEventListener('click', () => {
  pausedTimer()
  time = time + 1;
  changeTimerTime();
  disable_button();
});

// при клике на minus из времени вычитается 1 секунда, таймер ставится на паузу
minus.addEventListener('click', () => {
  pausedTimer()
  time = time - 1;
  changeTimerTime();
  disable_button();
});

/* в этом методе обработчике:
- при клике на start запускается таймер
- по истечени времени выводится соответсвующее сообщение и дизаблятся все кнопки кроме reset (используем disable_button)*/
start.addEventListener('click', () => {
  time = Number(minutesNode.value * 60) + Number(secondsNode.value);
  if (!nIntervId && time > 0) {
    nIntervId = setInterval(() => {
      if (time > 0) {
        time = time - 1;
        changeTimerTime();			
      }
      else {
        clearInterval(nIntervId);
        nIntervId = null;
        timer.style.display = 'none';
        message.innerHTML = '<p>I am done...</p>'
        disable_button();
        instruction.innerHTML = '';
      }
    }, 1000);		
  }	  
});

// при клике на pause таймер приостанавливается
pause.addEventListener('click', () => {
	pausedTimer();
});

/* в этом обработчике реализуем:
- при клике на reset  по истечении времени делаем таймер снова видимым, убираем сообщение
- при клике на reset до истечения времени ставим таймер на паузу и затираем значения импутов, что дает понять, что нужно начинать сначала*/
reset.addEventListener('click', () => {
  if (timer.style.display == 'none') {
    timer.style.display = 'block';
    message.innerHTML = '';
    instruction.innerHTML = 'Введите время или воспользуйтесь кнопками plus и minus';
    disable_button();
  }
  pausedTimer();
  minutesNode.value = '';
  secondsNode.value = '';
  disable_button();
});