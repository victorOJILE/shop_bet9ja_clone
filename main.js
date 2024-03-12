(function () {
  const elemAppend = Element.prototype.append;
  const arraySlice = Array.prototype.slice;

  function el(element, props = {}) {
    let el = document.createElement(element);

    for (let key in props) {
      if (key == "name") {
        el.setAttribute(key, value);
      } else if (key == "class") {
        el.className = props[key];
      } else if (key == "data") {
        for (let p in props.data) {
          el.dataset[p] = props.data[p];
        }
      } else if (key == "style") {
        for (let p in props.style) {
          el.style[p] = props.style[p];
        }
      } else if (key == "event") {
        for (let p in props.event) {
          el.addEventListener(p, props.event[p]);
        }
      } else {
        el[key] = props[key];
      }
    }

    if (arguments.length > 2) {
      elemAppend.apply(el, arraySlice.call(arguments, 2));
    }
    return el;
  }

  
  function UPDATE_CLASS_ON_SELECT(obj, toggle, callback) {
    obj.parent.addEventListener('click', function(e) {
      let target = e.target;
      if (!target.isSameNode(obj.parent)) {
        function getParent(elem) {
          if (!elem.parentElement.isSameNode(obj.parent)) {
            getParent(elem.parentElement);
          } else {
            target = elem;
          }
        }

        if (!target.parentElement.isSameNode(obj.parent)) getParent(target.parentElement);
        callback && callback(target);

        if (toggle && target.classList.contains(obj.className)) {
          target.classList.remove(obj.className);
          return;
        }

        for (let child of obj.parent.children) {
          child.classList.remove(obj.className);
        }

        target.classList.add(obj.className);
      }
    });
  }

  let elId = (id) => document.getElementById(id);
  let emptyShown = true;
  let links = document.querySelectorAll(".nav1-div a");
  
  links.forEach((each) => {
    each.addEventListener("click", (e) => {
      e.preventDefault();
      if (each.style.color === "rgb(255, 0, 0)") return;
      for (let key of links) {
        if (key.style.color == "rgb(255, 0, 0)") {
          key.style.color = "";
          key.getElementsByTagName("i")[0].style.visibility = "hidden";
        }
      }
      each.getElementsByTagName("i")[0].style.visibility = "visible";
      each.style.color = "rgb(255, 0, 0)";
    });
  });

  function calculateOdds(newOdd, condition = undefined) {
    const betslip_list = document.getElementsByClassName("betslip-list")[0];
    const odds = elId("odds");
    if (!condition) {
      // removing a selected game
      const odd = (Number(odds.innerText) / Number(newOdd)).toFixed(2);
      odds.innerText = odds.innerText == newOdd ? "0.00" : odd;
      let selectedG = Array.from(betslip_list.querySelectorAll("i")).filter(
        (each) => each.classList.contains("fa-times-rectangle")
      );
      elId("selectedG-bonus").innerText =
        selectedG.length > 4 ? (odd * selectedG.length).toFixed(2) : "0.00";
    } else if (condition == "new") {
      try {
        let selectedG = Array.from(betslip_list.querySelectorAll("i")).filter(
          (each) => each.classList.contains("fa-times-rectangle")
        );
        let odd = selectedG.map((a) => a.dataset.odd).reduce((a, b) => a * b);
        odds.innerText = Number(odd).toFixed(2);
        console.log(selectedG.length);
        document.getElementById("selectedG-bonus").innerText =
          selectedG.length > 4 ? (odd * selectedG.length).toFixed(2) : "0.00";
      } catch (error) {}
    }
  }

  function stakeAmountInputChange() {
    const odds = elId("odds");
    const amount = elId("amount");
    amount.addEventListener("change", (e) => {});
  }

  function gameSelected() {
    const resetDiv = Array.from(
      document.getElementsByClassName("resetDiv")[0].children
    );
    resetDiv.forEach((each) => {
      each.addEventListener("click", (e) => {
        stakeAmountButton(e.target.innerText);
      });
    });
  }

  function stakeAmountButton(e) {
    const amount = elId("amount");
    if (e === "RESET") {
      amount.value = "";
      amount.focus();
    } else {
      amount.value = +amount.value + +e;
    }
  }

  let formatG = `
    <div class="flex multiple">
     <div class="mult">MULTIPLE</div>
     <div class="odds-color">COMBINED</div>
   </div>
   <div class="odds-color odds-pad flex js-sp">
     <span>Odds</span>
     <span id="odds"></span>
   </div>
   <div class="flex-ajc js-sp amount">
     <div>Amount</div>
     <div>
       <input type="number" id="amount"><svg style="width: 12px;height: 13px" viewBox="-2 -2 20 20">
         <path d="M4 17 L4 1 L11 17 L11 1" stroke="whitesmoke" stroke-width="2" fill="none"></path>
         <path stroke-width="2" stroke="whitesmoke" d="M1 7 L14 7" class=""></path>
         <path stroke-width="2" stroke="whitesmoke" d="M1 10 L14 10" class=""></path>
         </svg>
     </div>
   </div>
   <div class="flex-ajc js-sp bonus bg-white">
     <span>Bonus</span>
     <div><span style="padding-right: 4px;" id="selectedG-bonus"></span><svg style="width: 12px;height: 13px" viewBox="-2 -2 20 20">
       <path fill="none" stroke-width="2" stroke="black" d="M4 17 L4 1 L11 17 L11 1"></path>
       <path stroke-width="2" stroke="black" d="M1 7 L14 7" class=""></path>
       <path stroke-width="2" stroke="black" d="M1 10 L14 10" class=""></path>
       </svg></div>
   </div>
   <div class="flex-ajc js-sp bonus bg-white">
     <span>Pot. Winnings <button style=" padding: 4px; background-color: #b00303; color: white;"><i class="fa fa-refresh"></i></button></span>
     <div><span class="bold"><strong>626516.02</strong></span><svg style="width: 12px;height: 13px" viewBox="-2 -2 20 20">
       <path fill="none" stroke-width="2" stroke="black" d="M4 17 L4 1 L11 17 L11 1"></path>
       <path stroke-width="2" stroke="black" d="M1 7 L14 7" class=""></path>
       <path stroke-width="2" stroke="black" d="M1 10 L14 10" class=""></path>
       </svg></div>
   </div>
   <div class="bg-white reset-par">
     <div class="flex resetDiv">
       <button class="col-wh reset">RESET</button>
       <button class="col-wh">100</button>
       <button class="col-wh">200</button>
       <button class="col-wh">500</button>
       <button class="col-wh">1000</button>
     </div>
     <div class="flex-ajc js-sp cancelDiv">
       <button class="cancelBtn col-wh" id="cancelGames">Cancel</button>
       <button class="betBtn col-wh">BET</button>
     </div>
   </div>`;

  function cancelSelectedGames() {
    document.getElementsByClassName("betslip-list")[0].innerHTML = "";
    elId("odds").innerHTML = "";
    elId("number-of-select").innerText = "";
    elId("add_to_betslip").style.display = "block";
    elId("formatGame").innerHTML = "";
  }

  function hoverEffect(parent, bg) {
    for (let d of parent) {
      d.onclick = () => {
        if (d.classList.contains(bg)) return;
        for (let div of parent) {
          if (div.classList.contains(bg)) {
            div.classList.remove(bg);
            break;
          }
        }
        d.classList.add(bg);
      };
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    let greenBtn = document.getElementsByClassName("date")[0].children;
    hoverEffect(greenBtn, "hv-bg-color");
    // async
    function getGamesObj() {
      let response = [
        {
          name: "Soccer",
          avail: 946,
          vals: [
            { name: "International", vals: [] },
            { name: "International Clubs", vals: [] },
            {
              name: "England",
              vals: [
                "Community Shield",
                "Premier League",
                "EFL Cup",
                "Championship",
                "League One",
                "National League",
              ],
            },
            { name: "Spain", vals: ["LaLiga", "LaLiga 2"] },
            { name: "Italy", vals: ["Serie A", "Serie B"] },
            {
              name: "Germany",
              vals: [
                "supercup",
                "bundesliga",
                "2. bundesliga",
                "3. liga",
                "DFB Pokal",
              ],
            },
            {
              name: "France",
              vals: ["ligue 1", "ligue 2", "Trophee des Champions"],
            },
            {
              name: "Netherlands",
              vals: ["Eredivisie", "Eerste Divisie", "Johan Cruijff Schaal"],
            },
            {
              name: "Portugal",
              vals: ["primeira Liga", "Segunda Liga", "Super Cup"],
            },
            { name: "Belgium", vals: ["First Division A"] },
            {
              name: "Scotland",
              vals: ["Primiership", "Championship", "League One", "League Two"],
            },
            { name: "Turkey", vals: ["Super Lig", "Super Cup"] },
            { name: "Simulated Reality League", vals: [] },
            { name: "Argentina", vals: [] },
            { name: "Australia", vals: [] },
            { name: "Austria", vals: [] },
            { name: "Bangladesh", vals: [] },
            { name: "Bolivia", vals: [] },
            { name: "Brazil", vals: [] },
            { name: "Bulgaria", vals: [] },
            { name: "Chile", vals: [] },
            { name: "Colombia", vals: [] },
            { name: "Croatia", vals: [] },
            { name: "Czech Republic", vals: [] },
            { name: "Denmark", vals: [] },
            { name: "Ecuador", vals: [] },
            { name: "Egypt", vals: [] },
            { name: "Estonia", vals: [] },
            { name: "Finland", vals: [] },
            { name: "Hungary", vals: [] },
            { name: "Iceland", vals: [] },
            { name: "Indonesia", vals: [] },
            { name: "Japan", vals: [] },
            { name: "Mexico", vals: [] },
            { name: "Myanmar", vals: [] },
            { name: "Norway", vals: [] },
            { name: "Paraguay", vals: [] },
            { name: "Peru", vals: [] },
            { name: "Poland", vals: [] },
            { name: "Romania", vals: [] },
            { name: "Russia", vals: [] },
            { name: "Slovakia", vals: [] },
            { name: "Slovenia", vals: [] },
            { name: "South", vals: [] },
            { name: "Korea", vals: [] },
            { name: "Sweden", vals: [] },
            { name: "Switzerland", vals: [] },
            { name: "Uruguay", vals: [] },
            { name: "USA", vals: [] },
            { name: "Wales", vals: [] },
          ],
        },
        {
          name: "Soccer Zoom",
          avail: 57,
          vals: [
            { name: "Premier-Zoom", vals: [] },
            { name: "Bundes-Zoom", vals: [] },
            { name: "SerieA-Zoom", vals: [] },
            { name: "Ligue1-Zoom", vals: [] },
            { name: "Primeria-Zoom", vals: [] },
            { name: "Eredivisie", vals: [] },
            { name: "Zoom", vals: [] },
          ],
        },
        {
          name: "Soccer Specials",
          avail: 220,
          vals: [{ name: "Ballon d'Or", vals: [] }],
        },
        {
          name: "Soccer Players",
          avail: 764,
          vals: [
            { name: "Germany", vals: ["Super Cup", "European Championship"] },
            { name: "Argentina", vals: ["Liga Professional"] },
            { name: "Brazil", vals: ["Serie A"] },
            { name: "Denmark", vals: ["Superligaen"] },
            { name: "Finland", vals: ["Veikkausliliga"] },
            { name: "Mexico", vals: ["Liga MX"] },
            { name: "Norway", vals: ["1st Division"] },
            { name: "Poland", vals: ["Ekstraklasa"] },
            { name: "Romania", vals: ["Liga 1"] },
            { name: "Sweden", vals: ["Allvenskan", "Superettan"] },
          ],
        },
        { name: "Antepost Soccer", avail: 1893, vals: [] },
        { name: "Tennis", avail: 289, vals: [] },
        { name: "Basketball", avail: 571, vals: [] },
        { name: "American Football", avail: 291, vals: [] },
        { name: "Baseball", avail: 90, vals: [] },
        { name: "Handball", avail: 16, vals: [] },
        { name: "Rugby", avail: 8, vals: [] },
        { name: "Volleyball", avail: 4, vals: [] },
        { name: "Motor sport", avail: 139, vals: [] },
        { name: "Ice Hockey", avail: 117, vals: [] },
        { name: "Aussie Rules", avail: 5, vals: [] },
        { name: "Bowls", avail: 6, vals: [] },
        { name: "Boxing", avail: 11, vals: [] },
        { name: "Cricket", avail: 5, vals: [] },
        { name: "Darts", avail: 15, vals: [] },
        { name: "Golf", avail: 225, vals: [] },
        { name: "MMA", avail: 34, vals: [] },
        { name: "Snooker", avail: 187, vals: [] },
        { name: "Specials", avail: 96, vals: [] },
        { name: "Table Tennis", avail: 91, vals: [] },
      ]; //fetch(path);
      // let result = await response.json();
      generateGamesNav(response);
    }

    getGamesObj();
    const add_to_betslip = elId("add_to_betslip");

    function numberOfSelectedGames() {
      try {
        const number = elId("number-of-select");
        const sel_games = elId("sel-games").getElementsByTagName("li").length;
        if (sel_games) {
          if (add_to_betslip.style.display !== "none") {
            add_to_betslip.style.display = "none";
          }
          number.textContent =
            sel_games > 1
              ? `No. Selections ${sel_games}`
              : `No. Selection ${sel_games}`;
          gameSelected();
        } else {
          number.textContent = "";
          add_to_betslip.style.display = "block";
        }
      } catch (error) {
        console.log(error);
      }
    }

    numberOfSelectedGames();

    try {
      let cancelGamesBtn = elId("cancelGames");
      cancelGamesBtn.onclick = () => cancelSelectedGames();
    } catch (error) {}

    const betslip_list = document.getElementsByClassName("betslip-list")[0];
    betslip_list.addEventListener("click", (e) => {
      if (e.target.tagName == "I") {
        let data = e.target.dataset.game;
        let li = Array.from(betslip_list.querySelectorAll("ul li")).find(
          (e) => e.dataset.game === data
        );
        li.parentElement.removeChild(li);
        numberOfSelectedGames();
        calculateOdds(e.target.dataset.odd);
      }
    });
    calculateOdds(0, "new");
    try {
      const category_info_par = elId("category-info");
      category_info_par.addEventListener("click", (e) => {
        let targ = e.target;
        if (targ.tagName === "I" && targ.className === "fa fa-remove") {
          let data = targ.dataset.select;
          let category_info = Array.from(
            document.querySelectorAll("#category-info > div")
          ).find((e) => e.dataset.select == data);
          category_info_par.removeChild(category_info);
          if (
            !category_info_par.getElementsByClassName("indiv_game").length > 0
          ) {
            document
              .getElementsByClassName("empty")[0]
              .classList.remove("show");
            emptyShown = true;
          }
          let country = data.split(" - ")[0],
            league = data.split(" - ")[1];
          let ul = document.querySelectorAll("ul");
          for (let uls of ul) {
            if (uls.dataset.name == country) {
              for (let li of uls.children) {
                if (li.innerText === league) {
                  li.classList.remove("bg-color");
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
  function generateGamesNav(response) {
    let gamesNav = elId("gamesNav");
    let toggle = (elem) => elem.nextElementSibling.classList.toggle("show");

    response.forEach((element) => {
      let ul = el("ul", { class: "ini-ul" });
      let i = 0;

      while (element.vals[i]) {
        let ul2 = el("ul", {
          class: "fin-ul",
          data: { name: element.vals[i].name },
        });

        if (element.vals[i].vals && element.vals[i].vals.length > 0) {
          let j = 0;
          while (element.vals[i].vals[j])
            ul2.append(el("li", { textContent: element.vals[i]["vals"][j++] }));
        }

        ul.append(
          el("li", { data: { name: element.vals[i].name } },
            el("div", { class: "dropdown flex js-sp",
              event: {
                click() {
                  toggle(this);
                  let plus = this.querySelector("span");
                  if (plus.innerText == "+") {
                    plus.innerText = "-";
                  } else {
                    plus.innerText = "+";
                  }
                }
              }},
              el("p", { textContent: element.vals[i].name }),
              el("span", { textContent: "+", style: { color: "#34268a" } })
            ),
            el("div", { class: "show" }, ul2)
          )
        );
        i++;
      }

      gamesNav.append(
        el("div", { class: "rel" },
          el("div", { class: "category-par",
            event: {
              click() {
                toggle(this);
                let iRight = this.querySelector(".fa-caret-right");
                let iDown = this.querySelector(".fa-caret-down");
                if (iDown.style.display == "block") {
                  iRight.style.display = "block";
                  iDown.style.display = "none";
                } else {
                  iRight.style.display = "none";
                  iDown.style.display = "block";
                }
              }}
            },
            el("div",{ class: "width-3" },
              el("i", { class: "fa fa-caret-right" }),
              el("i", { class: "fa fa-caret-down", style: { display: "none" } })
            ),
            el("div", { class: "width-auto flex js-sp" },
              el("div", { textContent: element.name }),
              el("div", { class: "fs-2", textContent: element.avail })
            )
          ),
          el("div", { class: "show" }, ul)
        )
      );
    });

    let final_li = document.querySelectorAll(".fin-ul > li");

    let prediction_options = [
      "MAIN",
      "HSH AWAY",
      "HSH HOME",
      "TO SCORE",
      "1X2/DC &amp; 1-2<br>GOAL",
      "1X2/DC &amp; 1-3<br>GOAL",
      "1X2/DC &amp; 1-4<br>GOAL",
      "1X2/DC &amp; 1-5<br>GOAL",
      "1X2/DC &amp; 2-3<br>GOAL",
      "1X2/DC &amp; 2-4<br>GOAL",
      "1X2/DC &amp; 2-5<br>GOAL",
      "1X2/DC &amp; 3-4<br>GOAL",
      "1X2/DC &amp; 3-5<br>GOAL",
      "1X2/DC &amp; 4-5<br>GOAL",
      "HALF 1ST GOAL",
      "HALF 1ST G<br>HOME",
      "HALF 1ST G<br>AWAY",
      "HT/FT",
      "HANDICAP",
      "GG/NG",
      "D N B",
      "C.SCORE",
      "O / U 0.5",
      "O / U 1.5",
      "DC&amp;OU 2.5",
      "O / U 3.5",
      "DC&amp;OU 3.5",
      "O / U 4.5",
      "DC&amp;OU 4.5",
      "DC&amp;O/U 1.5",
      "MULTI GOAL 2HT",
      "1X2 HT / DC FT",
      "DC HT / 1X2 FT",
      "O / U 5.5",
      "1X2 &amp;GG/NG",
      "GG/NG &amp; O/U 2.5",
      "GG/NG &amp; O/U 3.5",
      "O / U 6.5",
      "O / U 7.5",
      "CHANCE MIX",
      "PENALTY YES/NO",
      "FIRST GOAL",
      "LAST GOAL",
      "CH MIX 1.5",
      "MULTI GOAL",
      "TOT GOALS",
      "CH MIX 2.5",
      "CLEAN SHEET",
      "G.HOME",
      "CH MIX 3.5",
      "G.AWAY",
      "FIRST GOAL &amp; 1X2",
      "3COMBO 1.5",
      "H/A O/U0.5",
      "DC &amp; GG/NG",
      "3COMBO 2.5",
      "H/A OU 4.5",
      "H/A OU 3.5",
      "H/A O/U1.5",
      "DC HT / DC FT",
      "H/A O/U2.5",
      "H/A 2H OV/UN 0.5",
      "H/A HT OV/UN 0.5",
      "TEAM TO SCORE",
      "HANDCAP HT",
      "AT LEAST A HALF X",
      "H WIN TO NIL HT",
      "A WIN TO NIL HT",
      "HOME SCORE HT",
      "AWAY SCORE HT",
      "HOME SCORE 2HT",
      "AWAY SCORE 2HT",
      "HANDICAP 2HT",
      "HOME SCORE 2 ROW",
      "AWAY SCORE 2 ROW",
      "HOME SCORE 3 ROW",
      "AWAY SCORE 3 ROW",
      "TEAM SCORE 2 ROW",
      "TEAM SCORE 3 ROW",
      "A WIN TO NIL 2HT",
      "H WIN TO NIL 2HT",
      "HS HALF",
      "H/A 2H OV/UN 1.5",
      "H/A HT OV/UN 1.5",
      "H WIN BOTH",
      "H/A HT OV/UN 2.5",
      "A WIN BOTH",
      "H/A 2H OV/UN 2.5",
      "H WIN EITH",
      "3C MIX 2.5",
      "A WIN EITH",
      "H SC. BOTH",
      "A SC. BOTH",
      "HNB",
      "O / E HT",
      "ANB",
      "WIN MARGIN",
      "GG/NG 1HT &amp; 2HT",
      "HALF TIME",
      "DC HT",
      "GG / NG HT",
      "DNB HT",
      "C. SCORE HT",
      "O/U 0.5 HT",
      "O/U 1.5 HT",
      "O/U 2.5 HT",
      "TOTAL GOALS HT",
      "1X2 2HT",
      "1X2&amp;OU 1.5",
      "1X2&amp;O/U 2.5",
      "1X2&amp;O/U 3.5",
      "1X2&amp;O/U 4.5",
      "TOT 1H/2H",
      "MULTI GOAL HT",
      "GG/NG 2+",
      "CHANCE MIX+",
      "HT/FT &amp; O/U 1.5 HT",
      "3COMBO 3.5",
      "DC 2HT",
      "GG/NG 2HT",
      "DNB 2HT",
      "C.SCORE2HT",
      "O/U0.5 2HT",
      "O/U1.5 2HT",
      "O/U2.5 2HT",
      "TOT G. 2HT",
      "ODD / EVEN",
      "O / E 2HT",
      "O/E HOME",
      "O/E AWAY",
      "1X2-5 MIN",
      "1X2-10 MIN",
      "1X2-15 MIN",
      "1X2-20 MIN",
      "1X2-30 MIN",
      "1X2-60 MIN",
      "M.G. HOME",
      "M.G. AWAY",
      "SCORE5MIN",
      "SCORE10MIN",
      "SCORE20MIN",
      "SCORE30MIN",
      "HT/FT &amp; O/U 1.5",
      "HT/FT &amp; O/U 2.5",
      "HT/FT &amp; O/U 3.5",
      "HT/FT &amp; O/U 4.5",
      "PEN SCORE/MISS",
      "MULTI C.SCORE (1)",
      "MULTI C.SCORE (2HT DC&amp;OU)",
      "2HT DC&amp;O/U",
      "HT/FT CORRECT",
      "HT 1X2&amp;O/U1.5",
      "HT &amp; GG/NG",
      "HT DC&amp;GNG",
      "2H 1X2&amp;O/U 1.5",
      "2HT&amp;GG/NG",
      "2HT DC&amp;GNG",
      "WIN TO NIL ",
    ];

    function generateNewPredictionOptions(country, league) {
      try {
        let category_info = elId("category-info");

        if (emptyShown) {
          category_info
            .getElementsByClassName("empty")[0]
            .classList.add("show");
          emptyShown = false;
        }

        let div2 = el("div", {
          class: "flex js-sp game-info",
          innerHTML: `
          <div>
              <p>${country} - ${league}</p>
          </div>
          <div>
            <i class="fa fa-short-arrow-left"></i>
            <i class="fa fa-rotate-right" title="Refresh"></i>
            <i class="fa fa-print" title="Print"></i>
            <i class="fa fa-remove" data-select="${country} - ${league}" title="Remove"></i>
          </div>`,
        });

        let section = el("section", {
          class: "p-3",
          style: { backgroundColor: "ghostwhite" },
        });

        let div3 = el("div", { class: "flex options" });

        prediction_options.forEach((each) => {
          let retDiv = el("div", { innerHTML: `<span>${each}</span>` });
          div3.append(retDiv);
        });

        div3.firstElementChild.className = "hv-bg-color2";
        section.append(div3);

        category_info.append(
          el(
            "div",
            { class: "indiv_game", data: { select: `${country} - ${league}` } },
            div2,
            section
          )
        );

        hoverEffect(div3.children, "hv-bg-color2");
      } catch (error) {
        console.log(error);
      }
    }
    for (let li of final_li) {
      li.onclick = (e) => {
        if (e.target.classList.contains("bg-color")) {
          const category_info_par = elId("category-info");
          let data = `${li.parentElement.dataset.name} - ${li.innerText}`;
          let category_info = Array.from(
            document.querySelectorAll("#category-info > div")
          ).find((e) => e.dataset.select == data);
          category_info_par.removeChild(category_info);
          if (
            !category_info_par.getElementsByClassName("indiv_game").length > 0
          ) {
            document
              .getElementsByClassName("empty")[0]
              .classList.remove("show");
            emptyShown = true;
          }
          li.classList.remove("bg-color");
          return;
        }
        li.classList.add("bg-color");
        generateNewPredictionOptions(
          li.parentElement.dataset.name,
          li.innerText
        );
      };
    }

    // let cat_names = document.querySelectorAll(".width-auto");
    // cat_names.forEach((n) =>
    //   n.addEventListener("click", (e) => {
    //     n.querySelectorAll("div").forEach((each) => {
    //       each.style.color = "#04d704";
    //     });
    //   })
    // );
    // cat_names.forEach((n) =>
    //   n.addEventListener("mouseout", (e) => {
    //     n.querySelectorAll("div").forEach((each) => {
    //       each.style.color = "";
    //     });
    //   })
    // );
    // cat_names.forEach((n) =>
    //   n.addEventListener("click", (e) => {
    //     n.style.color = "#04d704";
    //   })
    // );
    // cat_names.forEach((n) =>
    //   n.addEventListener("mouseout", (e) => {
    //     n.style.color = "";
    //   })
    // );
  }
})();
