"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
// key Storage
const keyStorage = "TodoList";
const itemsLeft = document.getElementById("items-left");

// ngày giờ hiện tại
const Today = {
  day: new Date().getDate(), // 1->31
  month: new Date().getMonth(), // 0  -> 11
  year: new Date().getFullYear(),
  hours: new Date().getHours(), // 0-> 23
  minutes: new Date().getMinutes(), // 0-> 59
  getMinutesTime() {
    setInterval(() => {
      this.minutes = new Date().getMinutes();
    }, 6000);
  },
};
// gọi hàm getMinutesTime để cập nhật phút của thời gian hiện tại
Today.getMinutesTime();

// debounce
const debounce = (func, delay) => {
  let TimeOut;
  return function (...args) {
    TimeOut && clearTimeout(TimeOut);
    TimeOut = setTimeout(() => {
      func(...args);
      TimeOut = null;
    }, delay);
  };
};

const app = {
  Todos: [],
  isSuccsess: false,
  isClickDate: false,
  isClickPriority: false,
  isDateTime: true,
  indexTaskEdit: undefined,

  // set up local storage
  config: JSON.parse(localStorage.getItem(keyStorage)) || [],

  setConfig() {
    localStorage.setItem(keyStorage, JSON.stringify(this.Todos));
  },

  loadConfig() {
    if (localStorage.getItem("theme")) {
      document.body.classList.toggle(`${localStorage.getItem("theme")}`);
      $(".btn--theme i").classList.replace("fa-sun-bright", "fa-moon");
    }

    this.Todos = this.config;
    this.renderListItemTodos();
  },

  CheckDataTask: () => {
    const survey = [
      $("#jobname").value,
      $(".sBtn-text").value,
      $("#hours").value,
      $("#minutes").value,
      $("#selector-time").value,
      $("#date").value,
    ];
    return survey.every((element) => element !== "");
  },

  days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],

  objDate: {
    day: undefined,
    month: undefined,
    year: undefined,
    hours: undefined,
    minutes: undefined,
    type: "AM",
  },

  resetDataFormAdd() {
    $(".sBtn-text").innerText = "Select your option";
    this.objDate.day =
      this.objDate.month =
      this.objDate.year =
      this.objDate.hours =
      this.objDate.minutes =
        undefined;
    this.objDate.type = "AM";
    $(".day.inactive") && $(".day.inactive").classList.remove("inactive");
    $(".day.active") && $(".day.active").classList.remove("active");
    $$(".day")[Today.day - 1].classList.add("curr-date");
    $(".month-item.active") &&
      $(".month-item.active").classList.remove("active");
    $$(".month-item")[Today.month].classList.add("active");
    $(".month-picker").innerText = this.months[Today.month];

    $(".hour.active") && $(".hour.active").classList.remove("active");
    $(".minutes.active") && $(".minutes.active").classList.remove("active");
    $(".type-h.active") && $(".type-h.active").classList.remove("active");
    $$(".hour")[
      Today.hours > 12 ? Today.hours - 12 : Today.hours === 0 ? 11 : Today.hours
    ].classList.add("active");
    $$(".minutes")[Today.minutes - 1].classList.add("active");
    $$(".type-h")[Today.hours > 12 ? 1 : 0].classList.add("active");
  },

  // handle select option
  handleSelectOptions() {
    const optionMenu = $(".select-menu");
    const selectBtn = $(".select-btn");
    const options = $$(".option");
    const SBtn_text = $(".sBtn-text");

    selectBtn.addEventListener("click", () => {
      optionMenu.classList.toggle("active");
      this.cancelError($(".select-btn"));
      if (SBtn_text.value === "Select your option") {
        this.isClickPriority = true;
      }
    });

    options.forEach((option) => {
      option.addEventListener("click", (e) => {
        SBtn_text.value = e.target.innerText;
        SBtn_text.style.color = "var(--clr-gb-1)";
        optionMenu.classList.toggle("active");
        this.isClickPriority = false;
      });
    });
  },

  renderCalendar() {
    const calendar = $(".calendar");
    let htmls = `
                <div class="calendar-header">
                  <span class="month-picker" id="month-picker">xxxx</span>
                  <div class="year-picker">
                    <span class="year-change" id="prev-year">
                      <i class="fa-solid fa-chevron-left"></i>
                    </span>
                    <span id="year">xxxx</span>
                    <span class="year-change" id="prev-year">
                      <i class="fa-solid fa-chevron-right"></i>
                    </span>
                  </div>
                </div>

                <div class="calendar-body">
                  <div class="weekdays">
                    ${this.days.map((day) => `<div>${day}</div>`).join("")}
                  </div>
                  <div class="days"></div>

                  <div class="month-list">
                  ${this.months
                    .map(
                      (month, index) =>
                        `<div class ="month-item"><div class ="month" data-month="${index}">${month}</div></div>`
                    )
                    .join("")}
                  </div>
                </div>

                
                `;

    calendar.innerHTML = htmls;
  },

  renderContainerCalendar() {
    const CalendarHeader = $(".calendar-header");
    const calendarBody = $(".calendar-body");
    const HMonth =
      (this.objDate.month >= 0 && this.objDate.month) || Today.month;
    const Hyear = this.objDate.year || Today.year;

    CalendarHeader.querySelector(".month-picker").innerText =
      this.months[HMonth];

    CalendarHeader.querySelector("#year").innerText = Hyear;

    const numberDaysOfMonth = new Date(Hyear, HMonth + 1, 0).getDate();
    const IndexFistDayMonth = new Date(Hyear, HMonth, 1).getDay(); // 0 -> 6 ( 0: sun, sat: 6)

    let htmls = "";
    let Pos = undefined;
    for (let i = 0; i < numberDaysOfMonth + IndexFistDayMonth; i++) {
      let temp = i + 1 - IndexFistDayMonth;
      htmls +=
        i < IndexFistDayMonth
          ? `<div></div>`
          : `<div data-day="${temp}" class="day">${temp}</div>`;

      temp === Today.day && (Pos = temp);
    }

    calendarBody.querySelector(".days").innerHTML = htmls;
    if (Pos === Today.day && HMonth === Today.month && Hyear === Today.year) {
      $$(".day")[Pos - 1].classList.add("curr-date");
    }
    this.handleEventDays();
  },

  // click choose an expiration date for the to-do
  handleEventDays() {
    const days = $$(".day");
    const currDay = $(".curr-date");

    days.forEach((element, index) => {
      element.onclick = (e) => {
        this.objDate.day = +element.getAttribute("data-day");
        this.objDate.month === undefined && (this.objDate.month = Today.month);
        this.objDate.year === undefined && (this.objDate.year = Today.year);
        this.objDate.hours === undefined &&
          (this.objDate.hours =
            Today.hours === 0 ? Today.hours + 12 : Today.hours);

        this.objDate.minutes === undefined &&
          (this.objDate.minutes =
            Today.minutes + 1 === 60 ? 0 : Today.minutes + 1);

        this.objDate.hours =
          this.objDate.type === "PM"
            ? this.objDate.hours < 12 && this.objDate.hours > 0
              ? this.objDate.hours + 12
              : this.objDate.hours
            : this.objDate.hours;

        let date1 = new Date(
          this.objDate.year,
          this.objDate.month, // 0->11
          this.objDate.day, // 1->31
          this.objDate.hours, // 0->23
          this.objDate.minutes || 0 // 0-> 59
        );

        let date2 = new Date(
          Today.year,
          Today.month,
          Today.day,
          Today.hours,
          Today.minutes
        );

        const changeElementClassActive = () => {
          this.objDate.day = index + 1;
          $(".day.active") && $(".day.active").classList.remove("active");
          if (!element.matches(".curr-date")) {
            element.classList.add("active");
            currDay && currDay.classList.add("inactive");
          } else {
            element.classList.remove("inactive");
          }
          this.changeValueInputDueDate();
        };

        if (date1.getTime() > date2.getTime()) {
          changeElementClassActive();
          this.cancelError($(".due-date__container"));
          this.cancelError($(".box-timeInput"));
        } else if (date1.getTime() === date2.getTime()) {
          if (
            this.objDate.day === Today.day &&
            this.objDate.hours === Today.hours
          ) {
            changeElementClassActive();
            this.setError(
              $(".box-timeInput"),
              "Choose a different time from the current time."
            );
            this.cancelError($(".due-date__container"));
          } else {
            if (this.objDate.day === Today.day) {
              this.setError(
                $(".box-timeInput"),
                "Choose a different time from the current time."
              );
            }
          }
        } else {
          if (
            this.objDate.day < Today.day ||
            this.objDate.month < Today.month ||
            this.objDate.year < Today.year
          ) {
            this.setError(
              $(".due-date__container"),
              "Cannot choose a date less than the current date.."
            );
            this.cancelError($(".box-timeInput"));
          } else {
            this.setError(
              $(".box-timeInput"),
              "Choose a different time from the current time."
            );
            this.cancelError($(".due-date__container"));
          }
        }
      };
    });
  },

  compareObjDate() {
    let hoursReal =
      this.objDate.type === "PM"
        ? this.objDate.hours < 12 && this.objDate.hours > 0
          ? this.objDate.hours + 12
          : this.objDate.hours
        : this.objDate.hours;

    let date1 = new Date(
      this.objDate.year,
      this.objDate.month,
      this.objDate.day,
      hoursReal,
      this.objDate.minutes
    );

    let date2 = new Date(
      Today.year,
      Today.month,
      Today.day,
      Today.hours,
      Today.minutes
    );

    if (date1.getTime() > date2.getTime()) {
      this.isSuccsess = true;
    }

    if (date1.getTime() === date2.getTime()) {
      if (this.objDate.day === Today.day) {
        this.setError(
          $(".box-timeInput"),
          "Choose a different time from the current time."
        );
        this.cancelError($(".due-date__container"));

        $("#hours").value = "";
        this.objDate.hours = undefined;
      } else {
        this.setError(
          $(".due-date__container"),
          "Choose date other than the current date."
        );
        $(".Duedate").value = null;
        this.objDate.day = undefined;
      }
    } else if (date1.getTime() < date2.getTime()) {
      if (
        this.objDate.day < Today.day ||
        this.objDate.month < Today.month ||
        this.objDate.year < Today.year
      ) {
        this.setError(
          $(".due-date__container"),
          "Choose date other than the current date."
        );
        this.cancelError($(".box-timeInput"));
        $("#hours").value =
          $("#minutes").value =
          $("#selector-time").value =
            "";
        this.objDate.hours = this.objDate.minutes = undefined;
        this.objDate.type = "--";

        $(".Duedate").value = null;
        this.objDate.day < Today.day && (this.objDate.day = undefined);
        this.objDate.month < Today.month && (this.objDate.month = undefined);
        this.objDate.year < Today.year && (this.objDate.year = undefined);
      } else {
        this.setError(
          $(".box-timeInput"),
          "Choose a different time from the current time."
        );
        this.cancelError($(".due-date__container"));
        $("#hours").value =
          $("#minutes").value =
          $("#selector-time").value =
            "";
        this.objDate.hours = this.objDate.minutes = undefined;
        this.objDate.type = "--";
      }
    }
  },

  changeValueInputDueDate() {
    const str = `${this.objDate.year || Today.year}-${
      this.objDate.month >= 0 ? this.objDate.month : Today.month
    }-${this.objDate.day || Today.day}`;

    let parts = str.split("-");
    parts[1] = parseInt(parts[1]);
    if (parts[1] < 10 && parts[1] >= 0) {
      parts[1] = ++parts[1] >= 10 ? String(parts[1]) : "0" + parts[1];
    } else {
      parts[1] = String(++parts[1]);
    }

    parseInt(parts[2]) < 10 && (parts[2] = "0" + parts[2]);

    parts = [parts[0], parts[1], parts[2]].join("-");

    const InputDueDate = $(".Duedate");
    let hoursreal =
      this.objDate.type === "PM" ? this.objDate.hours + 12 : this.objDate.hours;

    let date1 = new Date(
      this.objDate.year,
      this.objDate.month,
      this.objDate.day,
      hoursreal,
      this.objDate.minutes || 0
    );

    let date2 = new Date(
      Today.year,
      Today.month,
      Today.day,
      Today.hours,
      Today.minutes
    );

    if (date1.getTime() >= date2.getTime()) {
      InputDueDate.value = parts;
      this.isClickDate = false;
      this.changeFormatTypeTime();
      $(".curr-date") && $(".curr-date").classList.add("inactive");
      $$(".day")[this.objDate.day - 1].classList.add("active");
    } else {
      InputDueDate.value = null;
      $(".curr-date") && $(".curr-date").classList.remove("inactive");
      // add
      this.isClickDate = true;
    }
  },

  handleCalendarHeader() {
    const _this = this;
    const Calendar = $(".calendar");
    const calendarDays = $(".calendar-days");
    const monthPicker = $(".month-picker");
    const monthWrap = $(".month-list");
    const monthList = $$(".month-item");
    const YearPicker = $("#year");
    const IconChangeYear = $$(".year-change");
    const InputDueDate = $(".Duedate");
    const IconCalendar = $(".calendar--icon");

    monthList[Today.month].classList.add("active");
    this.objDate.month && monthList[this.objDate.month].classList.add("active");
    monthPicker.onclick = () => {
      monthWrap.classList.toggle("show");
      monthList.forEach((month, index) => {
        month.onclick = () => {
          _this.objDate.month = index;
          $(".month-item.active").classList.remove("active");
          month.classList.add("active");
          _this.renderContainerCalendar();
          monthWrap.classList.toggle("show");
          this.changeValueInputDueDate();
        };
      });
    };

    IconCalendar.onclick = () => {
      this.cancelError($(".due-date__container"));
      Calendar.classList.toggle("show");
      monthWrap.classList.remove("show");
    };

    IconChangeYear.forEach((Icon, index) => {
      Icon.onclick = () => {
        let currYearPicker = Number(YearPicker.innerText);
        _this.objDate.year = index === 0 ? --currYearPicker : ++currYearPicker;
        _this.renderContainerCalendar();
        this.changeValueInputDueDate();
      };
    });

    const EventInputOnchange = (e) => {
      const ValueInput = e.target.value;
      _this.forMatTypeDate(ValueInput);
      _this.changeValueInputDueDate();
    };

    const dbHandle = debounce(EventInputOnchange, 1000);
    InputDueDate.onchange = dbHandle;

    InputDueDate.onclick = () => {
      this.cancelError($(".due-date__container"));
      InputDueDate.onchange = dbHandle;
      if (!InputDueDate.value) {
        this.isClickDate = true;
      }
    };
  },

  forMatTypeDate(str) {
    // const regex = /^\d{4}-\d{2}-\d{2}$/;
    const regex = /^(197\d|[2-9]\d{3})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (regex.test(str)) {
      let parts = str.split("-");
      this.objDate.day = +parts[2];
      this.objDate.month = parts[1] - 1;
      this.objDate.year = +parts[0];
      this.renderContainerCalendar();
    } else {
      $(".Duedate").value = null;
    }
  },

  // handle events for the time input
  renderCardTime() {
    const TimeContainer = $(".time-container");
    let htmls = "";
    htmls += `
        <div class="item-time time-hours">
          ${Array(12)
            .fill()
            .map(
              (_, i) =>
                `<div class="hour" data-hours="${i}">${
                  i + 1 < 10 ? "0" + (i + 1) : i + 1
                }</div>`
            )
            .join("")}
        </div>
        <div class="item-time time-minutes">
        ${Array(60)
          .fill()
          .map(
            (_, i) =>
              `<div class="minutes" data-minutes="${
                i + 1 === 60 ? 0 : i + 1
              }">${
                i + 1 < 10 ? "0" + (i + 1) : i + 1 < 60 ? i + 1 : "00"
              }</div>`
          )
          .join("")}
        </div>

        <div class="item-time time-type">
          <div class="type-h" data-typeTime ="AM">AM</div>
          <div class="type-h" data-typeTime ="PM">PM</div>
        </div>
        `;

    TimeContainer.innerHTML = htmls;
  },

  // change card time by value input time: add active class
  addActiveClassCrardTime() {
    const HHours = $$(".item-time .hour");
    const MMinutes = $$(".item-time .minutes");
    const TimeTypes = $$(".time-type .type-h");

    $(".hour.active") && $(".hour.active").classList.remove("active");
    $(".minutes.active") && $(".minutes.active").classList.remove("active");
    $(".type-h.active") && $(".type-h.active").classList.remove("active");

    this.objDate.hours &&
      HHours[this.objDate.hours - 1].classList.add("active");
    this.objDate.minutes === 0 &&
      MMinutes[MMinutes.length - 1].classList.add("active");
    this.objDate.minutes &&
      MMinutes[this.objDate.minutes - 1].classList.add("active");

    let indexType = this.objDate.type === "AM" ? 0 : 1;

    /(am|pm)/i.test($("#selector-time").value) &&
      TimeTypes[indexType].classList.add("active");
  },

  // conver time to type 12h
  changeFormatTypeTime() {
    const InputHours = $("#hours");
    const InputMinutes = $("#minutes");
    const InputTypeTime = $("#selector-time");

    this.objDate.hours === undefined &&
      (this.objDate.hours = Today.hours === 0 ? Today.hours + 12 : Today.hours);

    this.objDate.minutes === undefined &&
      (this.objDate.minutes = Today.minutes + 1 === 60 ? 0 : Today.minutes);

    if (this.objDate.hours > 12) {
      this.objDate.hours = this.objDate.hours - 12;
      this.objDate.type = "PM";
    }
    this.objDate.hours === 0 && (this.objDate.hours = 12);

    // set value input
    InputHours.value =
      this.objDate.hours < 10 ? "0" + this.objDate.hours : this.objDate.hours;

    InputMinutes.value =
      this.objDate.minutes < 10
        ? "0" + this.objDate.minutes
        : this.objDate.minutes;

    InputTypeTime.value = this.objDate.type;
    this.addActiveClassCrardTime();
  },

  handleEventTime() {
    const _this = this;
    const iconClock = $(".icon--clock");
    const TimeContainer = $(".time-container");

    const InputHours = $("#hours");
    const InputMinutes = $("#minutes");
    const InputTypeTime = $("#selector-time");

    const HHours = $$(".item-time .hour");
    const MMinutes = $$(".item-time .minutes");
    const TimeTypes = $$(".time-type .type-h");

    const resetValueInput = (e) => {
      this.cancelError($(".box-timeInput"));
      e.target.value = "";
    };
    InputHours.addEventListener("click", resetValueInput);
    InputMinutes.addEventListener("click", resetValueInput);
    InputTypeTime.addEventListener("click", resetValueInput);

    const EventInputTimeOnchange = (e) => {
      const ClassNameTag = e.target.className;
      if (ClassNameTag === "hours") {
        if (e.target.value >= 1 && e.target.value <= 24) {
          this.objDate.hours = +e.target.value;
        } else e.target.value = "";
      }

      if (ClassNameTag === "minutes") {
        if (e.target.value == 0) {
          this.objDate.minutes = 0;
        } else if (e.target.value >= 1 && e.target.value <= 59) {
          this.objDate.minutes = +e.target.value;
        } else {
          e.target.value = "";
        }
      }

      if (ClassNameTag === "selector-time") {
        if (
          e.target.value.toUpperCase() === "AM" ||
          e.target.value.toUpperCase() === "PM"
        ) {
          this.objDate.type = e.target.value.toUpperCase();
        } else {
          e.target.value = "";
        }
      }

      e.target.value != "" && this.changeFormatTypeTime();
    };

    InputHours.onchange = debounce(EventInputTimeOnchange, 100);
    InputMinutes.onchange = debounce(EventInputTimeOnchange, 100);
    InputTypeTime.onchange = debounce(EventInputTimeOnchange, 100);

    HHours.forEach((hours) => {
      hours.onclick = () => {
        this.objDate.hours = +hours.getAttribute("data-hours") + 1;
        this.changeFormatTypeTime();
      };
    });
    MMinutes.forEach((minutes) => {
      minutes.onclick = () => {
        this.objDate.minutes = +minutes.getAttribute("data-minutes");
        this.changeFormatTypeTime();
      };
    });
    TimeTypes.forEach((type) => {
      type.onclick = () => {
        this.objDate.type = type.getAttribute("data-typeTime");
        this.changeFormatTypeTime();
      };
    });

    iconClock.onclick = () => {
      TimeContainer.classList.toggle("show");
    };
  },

  // validate form add todo
  validateInputs() {
    const ValueNameTodo = $("#jobname");
    const ValuePriorityTodo = $(".sBtn-text");
    const ValueDateTodo = $("#date");
    const ValueHoursTodo = $("#hours");
    const ValueMinutesTodo = $("#minutes");
    const ValueTypeHoursTodo = $("#selector-time");

    if (ValueNameTodo.value === "") {
      this.setError($(".txt-container"), "You have not entered a task name");
    } else {
      this.cancelError($(".txt-container"));
    }
    if (ValuePriorityTodo.value === "Select your option") {
      this.setError(
        $(".select-btn"),
        "You have not selected your work priority"
      );
    } else {
      this.cancelError($(".select-btn"));
    }

    if (
      ValueHoursTodo.value === "" ||
      ValueMinutesTodo.value === "" ||
      ValueTypeHoursTodo === ""
    ) {
      this.setError($(".box-timeInput"), "You have not choose the time");
    } else {
      this.cancelError($(".box-timeInput"));
    }

    if (!ValueDateTodo.value) {
      this.setError(
        $(".due-date__container"),
        "You haven't entered the task's due date."
      );
    } else {
      this.cancelError($(".due-date__container"));
    }
  },

  cancelError(selector) {
    let BoxItem = selector.parentElement;
    while (!BoxItem.matches(".box-item")) {
      BoxItem = BoxItem.parentElement;
    }

    const errosDisplay = BoxItem.querySelector(".text-error");
    errosDisplay.innerText = "";
    selector.classList.remove("error");
  },

  setError(selector, messeage) {
    let BoxItem = selector.parentElement;
    while (!BoxItem.matches(".box-item")) {
      BoxItem = BoxItem.parentElement;
    }

    const errosDisplay = BoxItem.querySelector(".text-error");
    errosDisplay.innerText = messeage;
    selector.classList.add("error");
  },

  handleEventventWindow() {
    window.onclick = (e) => {
      if (
        !e.target.closest(
          ".icon--clock, .hours, .minutes, .selector-time, .time-container"
        ) &&
        $(".time-container.show")
      ) {
        $(".time-container").classList.remove("show");
      }
      if (
        !e.target.closest(".calendar, .calendar--icon, input[type='date']") &&
        $(".calendar.show")
      ) {
        $(".calendar").classList.remove("show");
      }

      if (
        !e.target.closest(".select-btn, .options") &&
        $(".select-menu.active")
      ) {
        $(".select-menu").classList.remove("active");
      }

      $$(".setting--menu").forEach((element, index) => {
        if (
          !e.target.closest(`${element.className} , .item--setting`) &&
          element.matches(".show")
        ) {
          element.classList.remove("show");
        }
      });

      $$(".info__task").forEach((element, index) => {
        if (
          !e.target.closest(".info__task , .item--title") &&
          element.matches(".show")
        ) {
          element.classList.remove("show");
        }
      });
    };
  },

  // obj todo
  ObjTodo() {
    const objTask = {
      TName: $("#jobname").value.trim(),
      Tdesc: $(".details").value.trim(),
      Tpriority: $(".sBtn-text").value,
      hours: $("#hours").value,
      minutes: $("#minutes").value,
      typeHours: $("#selector-time").value,
      date: $("#date").value,
      isCompleted: false,
    };
    return objTask;
  },

  // add task to todo list
  addTasktoList() {
    const objTask = this.ObjTodo();
    this.Todos.push(objTask);
    this.setConfig();
    const TodosList = $(".todos");
    if (TodosList.childElementCount === 0) {
      TodosList.appendChild(this.renderItemTodos(objTask));
    } else {
      const lastLiElement = TodosList.lastElementChild;
      lastLiElement.after(this.renderItemTodos(objTask));
    }
    this.handleEventTasksItem();
    // ....
    this.handleFilterTask();
    this.handleCardStats();

    itemsLeft.textContent = $$(".todos .card:not(.checked)").length;

    console.log(this.Todos);
  },

  handleEvntsButtonForm() {
    let arrElements = [
      $(".txt-container"),
      $(".select-btn"),
      $(".box-timeInput"),
      $(".due-date__container"),
    ];

    const btnSubmit = $(".btn-submits");
    const btnUpdate = $(".btn-update");

    btnSubmit.onclick = (e) => {
      this.validateInputs();
      this.compareObjDate();
      if (this.isSuccsess && this.CheckDataTask()) {
        this.addTasktoList();
        $(".btn-exit").click();
      }
      $(".calendar").classList.remove("show");
      $(".time-container").classList.remove("show");
      window.onclick = (e) => {
        if (!e.target.closest(".select-btn, .options")) {
          if (this.isClickPriority) {
            this.setError(
              $(".select-btn"),
              "You have not selected your work priority"
            );
          }
        }

        if (
          !e.target.closest(".calendar, .calendar--icon, input[type='date']")
        ) {
          this.isClickDate &&
            this.setError(
              $(".due-date__container"),
              "You entered the wrong date format."
            );
        }
        this.handleEventventWindow();
      };
    };

    btnUpdate.onclick = () => {
      this.validateInputs();
      this.compareObjDate();
      if (this.isSuccsess && this.CheckDataTask()) {
        const obj = this.ObjTodo();
        this.Todos.splice(this.indexTaskEdit, 1, obj);
        const tagLi = $$(".todos-item")[this.indexTaskEdit];
        tagLi.innerHTML = this.contentItemTodo(obj);
        this.handleEventTasksItem();
        $(".btn-exit").click();
      }
      $(".calendar").classList.remove("show");
      $(".time-container").classList.remove("show");
      window.onclick = (e) => {
        if (!e.target.closest(".select-btn, .options")) {
          if (this.isClickPriority) {
            this.setError(
              $(".select-btn"),
              "You have not selected your work priority"
            );
          }
        }

        if (
          !e.target.closest(".calendar, .calendar--icon, input[type='date']")
        ) {
          this.isClickDate &&
            this.setError(
              $(".due-date__container"),
              "You entered the wrong date format."
            );
        }
        this.handleEventventWindow();
      };
    };

    $(".btn-cancle").onclick = () => {
      this.resetDataFormAdd();
      this.handleEventDays();
      this.changeFormatTypeTime();
      arrElements.forEach((element) => this.cancelError(element));
    };

    $(".btn-exit").onclick = (e) => {
      $(".btn-cancle").click();
      this.hideFormAddTask();
    };
  },

  showFormAddTask() {
    const btnAdd = $(".btn--add");
    const InputCreate = $(".text");

    function showform() {
      $(".info__task.show") && $(".info__task.show").classList.remove("show");
      $("#form-add").classList.add("show");
      $(".btn-submits").style.display = "block";
      $(".btn-update").classList.remove("show");
    }

    btnAdd.onclick = showform;
    InputCreate.onclick = showform;
  },

  hideFormAddTask() {
    $("#form-add").classList.remove("show");
  },

  renderListItemTodos() {
    const _this = this;
    const Todos = $(".todos");
    Todos.childElementCount && (Todos.innerHTML = "");
    _this.Todos.map((todo, index) => {
      Todos.appendChild(_this.renderItemTodos(todo));
      if (todo.isCompleted) {
        $$(".todos-item")[index].classList.add("checked");
        $$(".todos-item")[index].querySelector(".cb-input").checked = true;
      }
    }).join("");
    itemsLeft.textContent = $$(".todos .card:not(.checked)").length;
    this.handleEventTasksItem();
    this.handleFilterTask();
  },

  contentItemTodo(obj) {
    return `
    <div class="cb-container">
      <input class="cb-input" type="checkbox" />
        <span class="check"><i class="fa-solid fa-check"></i></span>
    </div>
    <div class="item--title">
      <p class="text">${obj.TName}</p>
    </div>

    <div class="box--item info__task">
      <!-- task info -->
      <div class="info__task-body">
        ${this.SetValueInfoTask(obj)}
      </div>
    </div>
    <div class="box-container"></div>
    <div class="item--setting">
      <i class="fa-solid fa-ellipsis-vertical"></i>
      <ul class="setting--menu">
        <li class="edit">
          <i class="fa-light fa-pen"></i>
          <span>Edit</span>
        </li>
        <li class="delete">
         <i class="fa-light fa-trash-can"></i>
          <span>Delete</span>
        </li>
      </ul>
    </div>
    `;
    return htmls;
  },

  renderItemTodos(obj) {
    const todoItem = document.createElement("li");
    todoItem.classList.add("card", "todos-item");
    todoItem.setAttribute("draggable", true);
    todoItem.innerHTML = this.contentItemTodo(obj);
    return todoItem;
  },

  // FORM EDIT JS by index
  SetValueInfoTask(obj) {
    return `
        <div class="task--name"><h3>${obj.TName}</h3></div>
        <div class="task--detail">${obj.Tdesc}</div>
        <div class="task--priority">${obj.Tpriority}</div>
        <div class="task-date">${obj.hours}:${obj.minutes} ${
      obj.typeHours
    }  ${obj.date.split("-").reverse().join("/")}</div>
      `;
  },

  handleFormEdit(obj) {
    const parts = obj.date.split("-");
    this.objDate.year = +parts[0];
    this.objDate.month = +parts[1] - 1;
    this.objDate.day = +parts[2];
    this.objDate.hours = +obj.hours;
    this.objDate.minutes = +obj.minutes;
    this.objDate.type = obj.typeHours;
    $("#jobname").value = obj.TName;
    $(".details").value = obj.Tdesc;
    $(".sBtn-text").value = obj.Tpriority;
    $("#hours").value = obj.hours;
    $("#minutes").value = obj.minutes;
    $("#selector-time").value = obj.typeHours;
    $("#date").value = obj.date;
    this.addActiveClassCrardTime();
    $(".curr-date") && $(".curr-date").classList.add("inactive");
    $$(".day")[this.objDate.day - 1].classList.add("active");
  },

  stateTodo(index, completed) {
    this.Todos[index].isCompleted = completed;
    this.setConfig();
    itemsLeft.textContent = $$(".todos .card:not(.checked)").length;
  },

  handleEventTasksItem() {
    const _this = this;
    const TodosContainer = $(".todos");
    const TodoItems = $$(".todos-item");
    const ItemSettings = $$(".item--setting");
    const ItemCbInput = $$(".cb-input");

    TodoItems.forEach((element) => {
      element.addEventListener("dragstart", function () {
        this.classList.add("dragging");
      });
      element.addEventListener("dragend", function () {
        this.classList.remove("dragging");
      });

      const item = element.querySelector(".item--title");
      item.onclick = () => {
        if ($(".info__task.show")) {
          const infoTaskActive = $(".info__task.show");
          const parentTaskActive = infoTaskActive.parentElement;
          element !== parentTaskActive &&
            infoTaskActive.classList.remove("show");
        }

        element.querySelector(".info__task").classList.toggle("show");
      };
    });

    TodosContainer.addEventListener("dragover", function (e) {
      e.preventDefault();
      if (
        !e.target.classList.contains("dragging") &&
        e.target.classList.contains("card")
      ) {
        const draggingItem = $(".dragging");
        const todoItems = Array.from($$(".todos-item")); // update items in list todo
        const currPos = todoItems.indexOf(draggingItem);
        const newPos = todoItems.indexOf(e.target);
        console.log(currPos, newPos);

        if (currPos > newPos) {
          this.insertBefore(draggingItem, e.target);
        } else {
          this.insertBefore(draggingItem, e.target.nextSibling);
        }
        const removed = _this.Todos.splice(currPos, 1);
        _this.Todos.splice(newPos, 0, removed[0]);
        _this.setConfig();
      }
    });

    ItemSettings.forEach((element, index) => {
      element.onclick = (e) => {
        if (!e.target.closest(".setting--menu")) {
          const menuSettingElm = element.querySelector(".setting--menu");
          menuSettingElm.classList.add("show");
          const btnEdit = menuSettingElm.querySelector(".edit");
          const btnDelete = menuSettingElm.querySelector(".delete");
          btnEdit.onclick = () => {
            this.indexTaskEdit = index;
            menuSettingElm.classList.remove("show");
            $(".form-add").classList.add("show");
            $(".btn-submits").style.display = "none";
            $(".btn-update").classList.add("show");
            this.handleFormEdit(this.Todos[index]);
            if (this.Todos[index].isCompleted) {
              TodoItems[index].classList.add("checked");
              TodoItems[index].querySelector(".cb-input").checked = true;
            }
          };

          btnDelete.onclick = () => {
            TodoItems[index].classList.add("fall");
            menuSettingElm.classList.remove("show");
            TodoItems[index].addEventListener("animationend", () => {
              setTimeout(() => {
                TodoItems[index].remove();
                itemsLeft.textContent = $$(".todos .card:not(.checked)").length;
              }, 100);
            });
            this.Todos.splice(index, 1);
            this.setConfig();
          };
        }
      };
    });

    ItemCbInput.forEach((element, index) => {
      element.onclick = (e) => {
        TodoItems[index].classList.toggle("checked");
        this.stateTodo(index, e.target.checked);
      };
    });
  },

  // handel card stat
  handleCardStats() {
    const filterCard = $(".filter");
    const btnClearComplete = $("#clear-completed");
    const todos = $(".todos");
    const TodoItems = Array.from($$(".todos-item"));
    filterCard.onclick = (e) => {
      if (e.target.id) {
        $(".filter button.active") &&
          $(".filter button.active").classList.remove("active");
        $(`#${e.target.id}`).classList.add("active");
        todos.className = `todos ${e.target.id}`;
      }
    };

    btnClearComplete.onclick = () => {
      TodoItems.forEach((item, index) => {
        if (item.matches(".checked")) {
          item.classList.add("fall");
          this.Todos.splice(TodoItems.indexOf(item), 1);
          this.setConfig();
          item.addEventListener("animationend", () => {
            setTimeout(() => {
              item.remove();
            }, 100);
          });
        }
      });
    };
  },

  handleFilterTask() {
    const TaskMenu = $(".task__menu");
    const TaskItem = $$(".task__menu--titles li");
    const SortLists = $(".sort_list");
    const InputSearch = $(".ip_search");
    const ItemSort = $$(".sort_list li");

    TaskItem.forEach((element) => {
      element.onclick = () => {
        $(".task__menu--titles li.active") &&
          $(".task__menu--titles li.active").classList.remove("active");
        element.classList.toggle("active");
        TaskMenu.classList.add("active");
        if (element.matches(".sort.active")) {
          InputSearch.classList.remove("active");
          SortLists.classList.add("active");
        } else {
          InputSearch.classList.add("active");
          SortLists.classList.remove("active");
        }
      };
    });

    ItemSort.forEach((item, index) => {
      item.onclick = () => {
        $(".sort_list li.active") &&
          $(".sort_list li.active").classList.remove("active");
        item.classList.add("active");
        this.handleSortTask(index);
        this.handleCardStats();
      };
    });

    InputSearch.oninput = (e) => {
      const searchKeyword = e.target.value.toLowerCase();
      const filteredTasks = this.Todos.filter((task) =>
        task.TName.toLowerCase().includes(searchKeyword)
      );

      this.renderTodoListInputSearch(filteredTasks);
    };
  },

  renderTodoListInputSearch(tasks) {
    const Todos = $(".todos");
    Todos.childElementCount && (Todos.innerHTML = "");

    tasks
      .map((task, index) => {
        Todos.appendChild(this.renderItemTodos(task));
        if (task.isCompleted) {
          $$(".todos-item")[index].classList.add("checked");
          $$(".todos-item")[index].querySelector(".cb-input").checked = true;
        }
      })
      .join("");
    itemsLeft.textContent = $$(".todos .card:not(.checked)").length;
    this.handleEventTasksItem();
    this.handleFilterTask();
  },

  handleSortTask(key) {
    switch (key) {
      case 0: // time
        this.Todos.sort((a, b) => {
          let datea = [...a.date.split("-"), a.hours, a.minutes];
          let dateb = [...b.date.split("-"), b.hours, b.minutes];

          let objDatea = new Date(...datea);
          let objDateb = new Date(...dateb);
          return objDatea.getTime() - objDateb.getTime();
        });

        break;
      case 1: // a->z
        this.Todos.sort((a, b) => {
          return a.TName.toLowerCase().localeCompare(b.TName.toLowerCase());
        });

        break;
      case 2: // z->a
        this.Todos.sort((a, b) => {
          return a.TName.toLowerCase().localeCompare(b.TName.toLowerCase());
        });
        this.Todos.reverse();

        break;
      case 3: //Priority
        const priorityMap = {
          high: 1,
          medium: 2,
          low: 3,
        };
        this.Todos.sort((a, b) => {
          return (
            priorityMap[a.Tpriority.toLowerCase()] -
            priorityMap[b.Tpriority.toLowerCase()]
          );
        });

        break;
    }

    this.setConfig();
    this.renderListItemTodos();
  },

  startMethodTodo() {
    this.renderCardTime();
    this.handleEventTime();

    this.renderCalendar();
    this.renderContainerCalendar();
    this.handleCalendarHeader();
    this.handleEvntsButtonForm();
    this.handleEventventWindow();
  },

  handleThemes() {
    const btnTheme = $(".btn--theme");
    const iconTheme = btnTheme.querySelector("i");
    btnTheme.onclick = () => {
      iconTheme.classList.toggle("fa-moon");
      iconTheme.classList.toggle("fa-sun-bright");
      if (iconTheme.matches(".fa-sun-bright")) {
        localStorage.setItem("theme", "");
        document.body.classList.remove("light");
      } else {
        document.body.classList.add("light");
        localStorage.setItem("theme", "light");
      }
    };
  },

  innit() {
    this.loadConfig();
    console.log(this.Todos);
    this.handleSelectOptions();

    $("#form-add").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("input").addEventListener("keydown", (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
      }
    });

    $("#jobname").onclick = () => {
      this.cancelError($(".txt-container"));
    };

    this.showFormAddTask();
    this.startMethodTodo();
    this.handleCardStats();
    this.handleThemes();
  },
};

app.innit();
