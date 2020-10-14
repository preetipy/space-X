class dashboardData {
    constructor() {
      this.baseUrl = "https://api.spacexdata.com/v3/launches?limit=100";
      this.spaceProgramData = [];
      this.yearList = [];
    }
  
    // function to render dashboard
    async renderDashboardPage () {
      await this.renderInfoCards(this.baseUrl);
      this.renderYearListForFilter();
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
      let filtershtml = ''
      this.yearList.forEach((year) => {
        let filterYear = `<button class="yearBtn">${year}</button>`;
        filtershtml += filterYear;
        let container = document.getElementById('filterByYears');
        container.innerHTML = filtershtml;
      });
      let buttonList = document.getElementById('filterByYears');
      buttonList.addEventListener("click", this.filterBasedOnYears.bind(this));
    }
  
    // action handler function for filtering data based on year value selected.
    filterBasedOnYears(event) {
      let year = event.srcElement.innerHTML.trim();
      const filterUrl = `${this.baseUrl}&launch_success=true&land_success=true&launch_year=${year}`;
      this.renderInfoCards(filterUrl);
    }
    
    // This is a common function to handle filtering of data for launch and land success and failure.
  
    launchLandFilterFn(type, value) {
      const filter = (type === 'launch') ? '&launch_success=' : '&launch_success=true&land_success='
      const filterUrl = `${this.baseUrl}${filter}${value}`;
      this.renderInfoCards(filterUrl);
    }
  }
