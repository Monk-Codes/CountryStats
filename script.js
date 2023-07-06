'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const searchHistoryList = document.querySelector('.search-history');

let searchHistory = [];

///////////////////////////////////////
const country = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => response.json())
    .then(data => {
      const [countryData] = data;
      console.log(countryData);
      let curr = countryData.currencies[Object.keys(countryData.currencies)[0]];
      let laNg = countryData.languages[Object.keys(countryData.languages)[0]];
      let maps = countryData.maps[Object.keys(countryData.maps)[0]];
      const html = `
        <article class="country">
          <img class="country__img" src="${countryData.flags.png}" />
          <div class="country__data">
            <h3 class="country__name">${countryData.name.official}</h3>
            <h3 class="country__capital">Capital is ${
              countryData.capital[0]
            }</h3>
            <h4 class="country__region">It lies in continent of ${
              countryData.continents
            }</h4>
            <p class="country__row"><span>👫</span>${(
              +countryData.population / 1000000
            ).toFixed(1)}M people</p>
            <p class="country__row"><span>🗣️</span>${laNg}</p>
            <p class="country__row"><span>💰</span>${curr.name}</p>
            <p class="maps-link"><span>🗺️</span><a href="${maps}" target="_blank">Get Map</a></p>
            </div>
        </article>
      `;
      countriesContainer.insertAdjacentHTML('beforeend', html);
    });
  // Update search history
  searchHistory.push(country);
  updateSearchHistory();
};

btn.addEventListener('click', function () {
  Swal.fire({
    title: 'Enter country name:',
    input: 'text',
    showCancelButton: true,
    confirmButtonText: 'Submit',
    cancelButtonText: 'Cancel',
    inputValidator: value => {
      if (!value) {
        return 'Please enter a country name!';
      }
    },
  }).then(result => {
    if (result.isConfirmed) {
      const countryName = result.value.trim();
      countriesContainer.innerHTML = '';
      country(countryName);
    }
  });
});
const updateSearchHistory = function () {
  // Clear the existing search history
  searchHistoryList.innerHTML = '';

  // Add recent search history items
  searchHistory.forEach((search, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = search;
    searchHistoryList.appendChild(listItem);
  });
};

menuToggle.addEventListener('click', function () {
  sidebar.classList.toggle('sidebar--collapsed');
});
collapseButton.addEventListener('click', function () {
  sidebar.classList.add('sidebar--collapsed');
});
