'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const searchHistoryList = document.querySelector('.search-history-list');
const searchHistoryTab = document.querySelector('.search-history-tab');
let isSearchHistoryOpen = false;

let searchHistory = [];
const loadSearchHistory = function () {
  const storedSearchHistory = localStorage.getItem('searchHistory');
  if (storedSearchHistory) {
    searchHistory = JSON.parse(storedSearchHistory);
  }
};
loadSearchHistory();

// Call loadSearchHistory function to display saved data on page load

///////////////////////////////////////
const country = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => {
      if (!response.ok)
        throw new Error(`Country not found (${response.status})`);
      return response.json();
    })
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
      <h3 class="country__capital">Capital is ${countryData.capital[0]}</h3>
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
    })
    .catch(err => {
      if (err.message.includes('Country not found')) {
        // Country not found, display an alert
        alert('Country not found!');
      } else {
        // Other errors, display a generic error message
        renderError(`Something went wrong (${err.message}). Please try again.`);
      }
    })
    .finally(() => {
      // Update search history after the promise is settled
      searchHistory.push(country);
      updateSearchHistory();
      saveSearchHistory();
    });
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

const toggleSearchHistory = function () {
  if (isSearchHistoryOpen) {
    searchHistoryTab.classList.remove('open');
  } else {
    searchHistoryTab.classList.add('open');
  }
  isSearchHistoryOpen = !isSearchHistoryOpen;
};

// Add click event listener to the search history tab
searchHistoryTab.addEventListener('click', toggleSearchHistory);

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
const saveSearchHistory = function () {
  // Save search history to local storage
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
};
