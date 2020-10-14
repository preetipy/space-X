class dashboardData {
    constructor() {
      this.baseUrl = "https://api.spacexdata.com/v3/launches?limit=100";
      this.spaceProgramData = [];
      this.yearList = [];
      this.filterApplied = 'filtersApplied';
      this.isPageReload = false;
    }
  
    // function to render dashboard
    async renderDashboardPage () {
      await this.renderInfoCards(this.baseUrl);
      this.renderYearListForFilter();
      if(sessionStorage.getItem(this.filterApplied)){
        let filter = JSON.parse(sessionStorage.getItem(this.filterApplied));
        this.isPageReload = true;
        filter.type === "year" ? this.filterBasedOnYears(filter.value, this.isPageReload) 
                               : this.launchLandFilterFn(filter.type, filter.value, this.isPageReload);
      }
    }
  
  
    async getDashboardData(url) {
        await fetch(url,{
            method: 'GET',
            credentials: 'same-origin'
          })
          .then(response => response.json())
          .then((response) => {
            this.spaceProgramData = response;
          }).catch((error) => {
            console.log(error);
          });
    }
  
    // Below function renderInfoCards is to render the data cards with info in it.
    async renderInfoCards(url) {
        await this.getDashboardData(url);
        let dataCardshtml = '';
        let years = new Set();
        let container = document.querySelector('.dataCardHolder'); 
        if(this.spaceProgramData.length >0  && this.spaceProgramData instanceof Array){
          this.spaceProgramData.forEach((data) => {
            years.add(data.launch_year);
            let spaceShipInfo = ` <div class="column">
                                    <div class="card">
                                        <img class="imgCSS" src=${data.links.mission_patch_small}></img>
                                        <h5>${data.mission_name} #${data.flight_number}</h5>
                                        <p>Mission Ids:<span>${data.mission_id}<span></p>
                                        <p>Launch Year:<span>${data.launch_year}<span></p>
                                        <p><b>Successful Launch:</b><span>${data.launch_success}<span></p>
                                        <p><b>Successful Landing:</b><span>${data.rocket.first_stage.cores[0].land_success}<span></p>
                                    </div>
                                </div>`;          
            dataCardshtml += spaceShipInfo;
            container.innerHTML = dataCardshtml;
          });
          this.yearList = Array.from(years);
        } else {
          let noData = `<div><b>No Results Found !</b></div>`;
          dataCardshtml = noData;
          container.innerHTML = dataCardshtml;
        }
       
    }
  
    // Below function is to provide the years for filtering the data.
    renderYearListForFilter() {
      this.yearList.forEach((year) => {
        var element = document.createElement("button");
        element.type = 'button';
        element.className = "button";
        element.value = year;
        element.id = year;
        element.textContent = year;
        element.addEventListener("click", this.filterBasedOnYears.bind(this, year));
        let htmlpage = document.getElementById("filterByYears");
        //Append the element in page 
        htmlpage.appendChild(element);
    });
    }
  
    // action handler function for filtering data based on year value selected.
    filterBasedOnYears(year) {
       // if its a page reload, then retain the filters and background color change for selected filters
      // if a new filter is selected , remove the color change of previously selected filter.
      // get the element.
     
      let element = document.getElementById(year);
      let btnBgColor = window.getComputedStyle(element).backgroundColor;
      (!this.isPageReload) ? this.revertbackgroundColorChange() : this.setColor(element);
      console.log(element);
      console.log(btnBgColor);

      if (btnBgColor === 'rgba(133, 228, 133, 0.57)') {
        element.style.backgroundColor = "#3da03d91";
        let year = element.textContent.trim();

        //generate filter url
        const filter = `&launch_success=true&land_success=true&launch_year=${year}`;
        this.renderInfoCards(`${this.baseUrl}${filter}`);

        //store the filter in session storage
        sessionStorage.setItem(this.filterApplied, JSON.stringify({"type": "year", "value": year}));
      } else {
        // once the filter is removed, by clicking again the same selected button(like toggle button)
        // remove the session storage info and change back the background color
        element.style.backgroundColor =  "#85e48591";
        this.renderInfoCards(this.baseUrl);
        sessionStorage.removeItem(this.filterApplied);
        (!this.isPageReload) ? this.revertbackgroundColorChange() : '';
      }
      // (!this.isPageReload) ? this.revertbackgroundColorChange() : '';
      this.isPageReload = false;
    }

    // This is a common function to handle filtering of data for launch and land success and failure.
  
    launchLandFilterFn(type, value) {
      // if its a page reload, then retain the filters and background color change for selected filters
      // if a new filter is selected , remove the color change of previously selected filter.

      let elementid = value.concat(type);
      let element = document.getElementById(elementid);
      let btnBgColor = window.getComputedStyle(element).backgroundColor;

      (!this.isPageReload) ? this.revertbackgroundColorChange() : this.setColor(element);

      if(btnBgColor === 'rgba(133, 228, 133, 0.57)') {

        //background color change after click of button
        element.style.backgroundColor = "#3da03d91";

        //generating filter url
        const filter = (type === 'Launch') ? '&launch_success=' : '&launch_success=true&land_success='
        const filterUrl = `${this.baseUrl}${filter}${value}`;
        this.renderInfoCards(filterUrl);
        // storage the filter in session storage.
        window.sessionStorage.setItem(this.filterApplied, JSON.stringify({"type": type, "value": value}));
      } else{
        element.style.backgroundColor = "#85e48591";
        this.renderInfoCards(this.baseUrl);
        sessionStorage.removeItem(this.filterApplied);
        document.getElementsByClassName("button").disabled = false;
        (!this.isPageReload) ? this.revertbackgroundColorChange() : '';
      }
      this.isPageReload = false;
    }

    revertbackgroundColorChange(){
      let prevFilter = JSON.parse(sessionStorage.getItem(this.filterApplied));
      if(prevFilter){
        let elementid = prevFilter.type === 'year' ? prevFilter.value : prevFilter.value+prevFilter.type;
        let element = document.getElementById(elementid);
        element.style.backgroundColor =  "#85e48591";
      }
    }
    setColor(element) {
      element.style.backgroundColor = '#3da03d91';
    }
  }
