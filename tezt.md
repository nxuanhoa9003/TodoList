23-6-2023 chọn ngày bé hơn -> null
chọn ngày mà < 6-2023 -> null

chọn năm < 2023= -> null (ok)

(\_this.objDate.currDay <= index &&
\_this.objDate.curMonth === obj.Month) ||
\_this.objDate.curYear < obj.Year ||
(\_this.objDate.curMonth < obj.Month &&
\_this.objDate.curYear === obj.Year)

chọn tháng: + trùng năm mà chọn tháng nhỏ hơn tháng hiện tại thì null +

html

                <div class="calendar-header">
                  <span class="month-picker" id="month-picker">February</span>
                  <div class="year-picker">
                    <span class="year-change" id="prev-year">
                      <i class="fa-solid fa-chevron-left"></i>
                    </span>
                    <span id="year">2021</span>
                    <span class="year-change" id="prev-year">
                      <i class="fa-solid fa-chevron-right"></i>
                    </span>
                  </div>
                </div>

                <div class="calendar-body">
                  <div class="calendar-week-day">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                  </div>
                  <div class="calendar-days">
                    <div class="day">1</div>
                    <div class="day">2</div>
                    <div class="day">3</div>
                    <div class="day">4</div>
                    <div class="day">5</div>
                    <div class="day">6</div>
                    <div class="day">7</div>
                    <div class="day">8</div>
                    <div class="day">9</div>
                    <div class="day">10</div>
                    <div class="day">11</div>
                    <div class="day">12</div>
                    <div class="day">13</div>
                    <div class="day">14</div>
                    <div class="day">15</div>
                  </div>
                </div>
                <div class="month-list">
                  <div><div data-month="0">January</div></div>
                  <div><div data-month="1">February</div></div>
                  <div><div data-month="2">March</div></div>
                  <div><div data-month="3">April</div></div>
                  <div><div data-month="4">May</div></div>
                  <div><div data-month="5">June</div></div>
                  <div><div data-month="6">July</div></div>
                  <div><div data-month="7">August</div></div>
                  <div><div data-month="8">September</div></div>
                  <div><div data-month="9">October</div></div>
                  <div><div data-month="10">November</div></div>
                  <div><div data-month="11">December</div></div>
                </div>

css

- custom calendar \*/

.box-date {
position: relative;
inset: 0;
}

.calendar {
width: 30rem;
height: auto;
background-color: var(--clr-card-bg);
border-radius: 10px;
padding: 0.8rem;
position: relative;
overflow: hidden;
border: 1px solid var(--clr-gb-2);
/_ display: none; _/
margin-top: 1rem;
}

.calendar.show {
display: block;
}

.calendar-header {
display: flex;
justify-content: space-between;
align-items: center;
font-size: calc(var(--base-font) \* 1.3);
font-weight: var(--fw-bold);
color: var(--clr-white);
}

.calendar-header, .calendar-body {
padding: 1rem;
}

.calendar-week-day {
height: 4rem;
display: grid;
grid-template-columns: repeat(7, 1fr);
font-weight: 600;
color: var(--clr-white);
}

.calendar-week-day div {
display: grid;
place-items: center;
color: var(--clr-white);

}

.calendar-days {
display: grid;
grid-template-columns: repeat(7, auto);
color: var(--clr-white);

}

.calendar-days div {
display: flex;
justify-content: center;
align-items: center;
padding: 1rem;
position: relative;
cursor: pointer;
animation: to-top 1s forwards;
}

.calendar-days div.day:hover {
background-color: var(--clr-blue);
border-radius: 50%;
}

.month-list {
position: absolute;
width: 100%;
height: 100%;
top: 0;
left: 0;
background-color: var(--clr-card-bg);
padding: 1rem;
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 0.2rem;
transform: scale(1.5);
pointer-events: none;
z-index: 50;
visibility: hidden;
}

.month-list.show {
transform: scale(1);
visibility: visible;
pointer-events: visible;
transition: all 0.2s ease-in-out;
}

.month-list > div {
display: grid;
place-items: center;
}

.month-list > div > div {
width: 100%;
padding: 5px 10px;
border-radius: 10px;
text-align: center;
cursor: pointer;
color: var(--clr-white);
}

.month-list > div > div:hover {
background-color: var(--clr-gb-2);
color: var(--clr-gb-6);
}

.calendar-days div.curr-date, .calendar-days div.active {
background-color: var(--clr-gb-2);
color: var(--clr-gb-6);
border-radius: 50%;
}

.calendar-days div.curr-date.inactive {
background-color: var(--clr-card-bg);
color: var(--clr-blue);

}

.month-picker {
padding: 0.5rem 1rem;
border-radius: 10px;
cursor: pointer;
}

.month-picker:hover, .year-change:hover {
background-color: var(--clr-gb-4);
}

.year-picker {
display: flex;
align-items: center;
}

.year-change {
height: 3rem;
width: 3rem;
border-radius: 50%;
display: grid;
place-items: center;
margin: 0 10px;
cursor: pointer;
}
.year-picker .year {
font-size: 1.6rem;
}

.year-change i {
font-size: 1.4rem;
}

@keyframes to-top {
0% {
transform: translateY(100%);
opacity: 0;
}
100% {
transform: translateY(0);
opacity: 1;
}
}

responsive
.calendar {
width: 100%;
}
.calendar-days div {
padding: 0;
aspect-ratio: 1/1;
}
.calendar-header, .calendar-body {
padding: 0.5rem;
}

.calendar-header {
font-size: calc(var(--base-font) \* 1.2);
}
.month-list > div > div {
font-size: 1.4rem;
}

check dk ngày tháng năm để chọn ngày
// if (
// Today.year < this.objDate.year ||
// (Today.year === this.objDate.year &&
// Today.month < this.objDate.month) ||
// (Today.year === this.objDate.year &&
// Today.month === this.objDate.month &&
// Today.day <= index + 1)
// ) {
// this.objDate.day = index + 1;
// this.changeValueInputDueDate();
// } else {
// $(".Duedate").value = null;
// }

<!-- 1 tạo và xử lý phần time
2 tạo 1 nút title Create ở cuối form
3 xem lại form validate f8 để check Priority, Due time, Due date
4 sau khi xong form thì khi nhập vào ô input 'create a new todo...' thì form mới hiện khi value = '' thì ấn nó đi
 -->

 <!-- 1 obj todo bao gồm name, desc, priority, duetime, duedate -> lưu các obj này trong mảng -->

<!-- ban đầu chưa cho hiện form add, khi nào ấn vào icon + hoặc ô input create... thì hiện ô input, lúc đó thẻ div có class box-title sẽ them class là change-form, thẻ form có class form-add thì thêm class show -->

mỗi item todo sẽ hiện tên của task đó
mỗi task sẽ có 2 form, 1 form edit giống form add thay create = update
1 form để xem thông tin của task đó

vấn đề:

- chưa có ngày thì vẫn cho nhập thời gian
- nếu có ngày mà thời gian trùng với thời gian hiện tại thì báo lỗi ở time
- khi click vào input của ô time thì tắt thông báo error của time, khi gõ xong thì đối chiếu xem thỏa mãn hay nếu chưa vẫn báo erro

các thẻ li của thẻ ul

        <li class="card todos-item" draggable="true">
            <div class="cb-container">
              <input class="cb-input" type="checkbox" /><span
                class="check"
              ></span>
            </div>
            <div class="item--title">
              <p class="text">123</p>
            </div>

            <div class="box--item info__task">
              <!-- task info -->
              <div class="info__task-body">
                <div class="task--name"><h3>task 1</h3></div>
                <div class="task--detail">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </div>
                <div class="task--priority">hight</div>
                <div class="task-date">giờ:phút thứ ngày/tháng/năm</div>
              </div>
            </div>

            <div class="box-container">
              <!-- start form edit -->
              <form
                action=""
                id="form-edit"
                class="form form-edit card"
                novalidate
              >
                <div class="box-item">
                  <div class="Title">Task name</div>
                  <div class="txt-container status">
                    <input
                      id="jobname"
                      type="text"
                      class="txt-input jobname"
                      value=""
                      spellcheck="false"
                      autocomplete="off"
                    />
                  </div>
                  <div class="text-error"></div>
                </div>

                <div class="box-item">
                  <div class="Title">Task details</div>
                  <textarea class="details" name="taskDetails"> </textarea>
                </div>
                <div class="box-item">
                  <!-- option priority task  -->
                  <div class="Title">Priority</div>
                  <div class="select-menu">
                    <div class="select-btn status">
                      <input
                        class="sBtn-text"
                        value="Select your option"
                        type="text"
                        readonly
                      />

                      <i class="fa-solid fa-chevron-down"></i>
                    </div>
                    <ul class="options">
                      <li class="option">
                        <span class="option--icon">
                          <i class="fa-solid fa-bolt"></i>
                        </span>
                        <span class="option-text">High</span>
                      </li>
                      <li class="option">
                        <div class="option--icon">
                          <i class="fa-solid fa-star-half-stroke"></i>
                        </div>
                        <span class="option-text">Medium</span>
                      </li>
                      <li class="option">
                        <div class="option--icon">
                          <i class="fa-solid fa-star-of-life"></i>
                        </div>
                        <span class="option-text">Low</span>
                      </li>
                    </ul>
                  </div>
                  <div class="text-error"></div>
                </div>
                <div class="box-item box-time">
                  <div class="Title">Time</div>
                  <div class="box-timeInput status">
                    <input
                      class="hours"
                      id="hours"
                      type="number"
                      min="1"
                      max="12"
                      value="00"
                    />
                    <span class="dotts_line"
                      ><i class="fa-solid fa-colon"></i
                    ></span>
                    <input
                      class="minutes"
                      id="minutes"
                      type="number"
                      min="1"
                      max="60"
                      value="00"
                    />
                    <span class="line"></span>

                    <input
                      class="selector-time"
                      id="selector-time"
                      type="text"
                      min="1"
                      max="5"
                      value="--"
                    />
                    <span class="line"></span>
                    <span class="icon--clock"
                      ><i class="fa-regular fa-stopwatch"></i
                    ></span>
                  </div>
                  <div class="box-item time-container"></div>
                  <div class="text-error"></div>
                </div>

                <div class="box-item box-date">
                  <div class="Title">Expiration date</div>
                  <div class="box-item-wrap">
                    <div class="due-date__container status">
                      <input
                        class="Duedate"
                        type="date"
                        name="date"
                        id="date"
                      />
                      <span class="calendar--icon">
                        <i class="fa-solid fa-calendar-days"></i>
                      </span>
                    </div>
                  </div>
                  <div class="text-error"></div>

                  <section class="calendar card"></section>
                </div>
                <div class="btn-form">
                  <div class="btn-left">
                    <button type="button" class="btn btn-exit">Exit</button>
                  </div>
                  <div class="btn-right">
                    <button type="submit" class="btn btn-submits btn--update">
                      Update
                    </button>
                  </div>
                </div>
              </form>
              <!-- end form edit -->
            </div>

            <button class="clear">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </li>

          <li class="card todos-item" data-index="1" draggable="true">
            <div class="cb-container">
              <input class="cb-input" type="checkbox" /><span
                class="check"
              ></span>
            </div>
            <p class="item--title">456777</p>
            <button class="clear">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </li>

{
"TName": "1",
"Tdesc": "1",
"Tpriority": "Medium",
"hours": "12",
"minutes": "52",
"typeHours": "AM",
"date": "2023-07-26"
}

<!-- còn lưu vào local storage và xử lý phần footer -->
