$(document).ready(function () {
    const POMODORO_TIME = 25 * 60;
    const SHORT_BREAK_TIME = 5 * 60;
    const LONG_BREAK_TIME = 15 * 60;
    const MAX_POMODOROS = 4;

    const timer = $("#timer");
    const startButton = $("#start-button");
    const pomodoroButton = $("#pomodoro-button");
    const shortBreakButton = $("#short_break-button");
    const longBreakButton = $("#long_break-button");
    const pomodoroBg = $("#p-container");
    const resetButton = $("#reset-button");
    const skipButton = $("#skip-button");
    const completedPomoDisplay = $("#completed-pomo");

    let currentTime = POMODORO_TIME;
    let timerInterval;
    let isRunning = false;
    let completedPomodoro = parseInt(localStorage.getItem('completedPomodoro')) || 0;

    // notifications
    const pomodoroSound = new Audio('assets/pomo.wav');
    const shortBreakSound = new Audio('assets/break.wav');
    const longBreakSound = new Audio('assets/break.wav');

    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            startButton.text("Pause");
            timerInterval = setInterval(updateTimer, 1000);
            updateButtonVisibility();
            setBeforeUnloadListener();
            resetCompletedPomodoro();
        }
    }

    function pauseTimer() {
        if (isRunning) {
            isRunning = false;
            startButton.text("Start");
            clearInterval(timerInterval);
            resetButton.addClass("hidden");
            window.onbeforeunload = null;
        }
    }

    function resetTimer() {
        pauseTimer();
        updateTimerDisplay();
    }

    function updateTimer() {
        currentTime--;
        if (currentTime < 0) {
            pauseTimer();
            showTimeUpAlert();
            if (pomodoroButton.hasClass("bg-gray-300")) {
                completedPomodoro++;
                localStorage.setItem('completedPomodoro', completedPomodoro);
                updateCompletedPomo();
                pomodoroSound.play(); // Play Pomodoro completion sound
                if (completedPomodoro === MAX_POMODOROS) {
                    setActiveButton(longBreakButton);
                    setBackgroundColor("bg-[#2980B9]");
                    currentTime = LONG_BREAK_TIME;
                } else {
                    setActiveButton(shortBreakButton);
                    setBackgroundColor("bg-[#16A085]");
                    currentTime = SHORT_BREAK_TIME;
                }
            } else if (shortBreakButton.hasClass("bg-gray-300")) {
                shortBreakSound.play(); // Play short break completion sound
                setActiveButton(pomodoroButton);
                setBackgroundColor("bg-[#b33939]");
                currentTime = POMODORO_TIME;
            } else if (longBreakButton.hasClass("bg-gray-300")) {
                longBreakSound.play(); // Play long break completion sound
                setActiveButton(pomodoroButton);
                setBackgroundColor("bg-[#b33939]");
                currentTime = POMODORO_TIME;
                completedPomodoro = 0;
                localStorage.setItem('completedPomodoro', completedPomodoro);
                updateCompletedPomo();
            }
            updateTimerDisplay();
        } else {
            updateTimerDisplay();
        }
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        timer.text(`${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`);
    }

    function updateCompletedPomo() {
        completedPomoDisplay.text(`${completedPomodoro} / ${MAX_POMODOROS}`);
    }

    function setActiveButton(button) {
        pomodoroButton.removeClass("bg-gray-300");
        shortBreakButton.removeClass("bg-gray-300");
        longBreakButton.removeClass("bg-gray-300");
        button.addClass("bg-gray-300");
    }

    function setBackgroundColor(color) {
        pomodoroBg.removeClass("bg-[#b33939] bg-[#16A085] bg-[#2980B9]").addClass(color);
    }

    function setCurrentTime(time) {
        currentTime = time;
        resetTimer();
    }

    function updateButtonVisibility() {
        resetButton.toggleClass("hidden", !pomodoroButton.hasClass("bg-gray-300"));
        skipButton.toggleClass("hidden", pomodoroButton.hasClass("bg-gray-300"));
    }

    function setBeforeUnloadListener() {
        window.onbeforeunload = function () {
            return "Timer is running. Are you sure you want to leave?";
        };
    }

    function resetCompletedPomodoro() {
        if (completedPomodoro >= MAX_POMODOROS) {
            completedPomodoro = 0;
            localStorage.setItem('completedPomodoro', completedPomodoro);
            updateCompletedPomo();
        }
    }

    function showTimeUpAlert() {
        swal({
            title: "Time's up!",
            icon: "success",
            button: "Continue",
        });
    }

    function handleTimerCompletion() {
        if (pomodoroButton.hasClass("bg-gray-300")) {
            completedPomodoro++;
            localStorage.setItem('completedPomodoro', completedPomodoro);
            updateCompletedPomo();
            if (completedPomodoro === MAX_POMODOROS) {
                setActiveButton(longBreakButton);
                setBackgroundColor("bg-[#2980B9]");
                currentTime = LONG_BREAK_TIME;
            } else {
                setActiveButton(shortBreakButton);
                setBackgroundColor("bg-[#16A085]");
                currentTime = SHORT_BREAK_TIME;
            }
        } else {
            setActiveButton(pomodoroButton);
            setBackgroundColor("bg-[#b33939]");
            currentTime = POMODORO_TIME;
            if (longBreakButton.hasClass("bg-gray-300")) {
                completedPomodoro = 0;
                localStorage.setItem('completedPomodoro', completedPomodoro);
                updateCompletedPomo();
            }
        }
    }

    pomodoroButton.click(function () {
        setBackgroundColor("bg-[#b33939]");
        setActiveButton(pomodoroButton);
        setCurrentTime(POMODORO_TIME);
        skipButton.addClass("hidden");
    });

    shortBreakButton.click(function () {
        setBackgroundColor("bg-[#16A085]");
        setActiveButton(shortBreakButton);
        setCurrentTime(SHORT_BREAK_TIME);
        skipButton.removeClass("hidden");
    });

    longBreakButton.click(function () {
        setBackgroundColor("bg-[#2980B9]");
        setActiveButton(longBreakButton);
        setCurrentTime(LONG_BREAK_TIME);
        skipButton.removeClass("hidden");
    });

    startButton.click(function () {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });

    resetButton.click(function () {
        setCurrentTime(POMODORO_TIME);
    });

    skipButton.click(function () {
        setBackgroundColor("bg-[#b33939]");
        setActiveButton(pomodoroButton);
        setCurrentTime(POMODORO_TIME);
        skipButton.addClass("hidden");
    });

    updateCompletedPomo();
});
