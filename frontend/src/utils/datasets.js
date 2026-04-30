export const isHighDeathRatio = (row) => {
  if (row.deathsPer100Cases !== undefined) {
    return row.deathsPer100Cases >= 70
  }
  const confirmed = row.confirmed ?? row.totalCases
  const deaths = row.deaths ?? row.totalDeaths
  if (confirmed && deaths && confirmed > 0) {
    return (deaths / confirmed) * 100 >= 70
  }
  return false
}

export const datasets = {
  countryWise: {
    key: 'countryWise',
    label: 'Country Wise Latest',
    endpoint: 'country-wise',
    searchEndpoint: 'country-wise/search',
    searchParam: 'keyword',
    defaultSortBy: 'confirmed',
    sortOptions: ['confirmed', 'deaths', 'recovered', 'active', 'whoRegion'],
    allowSearch: true,
    allowSort: true,
    columns: [
      { key: 'countryRegion', label: 'Country' },
      { key: 'confirmed', label: 'Confirmed' },
      { key: 'deaths', label: 'Deaths' },
      { key: 'recovered', label: 'Recovered' },
      { key: 'active', label: 'Active' },
      { key: 'whoRegion', label: 'WHO Region' }
    ],
    formFields: [
      { key: 'countryRegion', label: 'Country / Region', type: 'text' },
      { key: 'confirmed', label: 'Confirmed', type: 'number' },
      { key: 'deaths', label: 'Deaths', type: 'number' },
      { key: 'recovered', label: 'Recovered', type: 'number' },
      { key: 'active', label: 'Active', type: 'number' },
      { key: 'newCases', label: 'New Cases', type: 'number' },
      { key: 'newDeaths', label: 'New Deaths', type: 'number' },
      { key: 'newRecovered', label: 'New Recovered', type: 'number' },
      { key: 'deathsPer100Cases', label: 'Deaths per 100 Cases', type: 'number', step: '0.01' },
      { key: 'recoveredPer100Cases', label: 'Recovered per 100 Cases', type: 'number', step: '0.01' },
      { key: 'deathsPer100Recovered', label: 'Deaths per 100 Recovered', type: 'number', step: '0.01' },
      { key: 'confirmedLastWeek', label: 'Confirmed Last Week', type: 'number' },
      { key: 'oneWeekChange', label: 'One Week Change', type: 'number' },
      { key: 'oneWeekPercentIncrease', label: 'One Week % Increase', type: 'number', step: '0.01' },
      { key: 'whoRegion', label: 'WHO Region', type: 'text' }
    ]
  },
  worldometer: {
    key: 'worldometer',
    label: 'Worldometer',
    endpoint: 'worldometer',
    searchEndpoint: 'worldometer/search',
    searchParam: 'country',
    defaultSortBy: 'totalCases',
    sortOptions: ['totalCases', 'totalDeaths', 'totalRecovered', 'activeCases', 'countryRegion'],
    allowSearch: true,
    allowSort: true,
    columns: [
      { key: 'countryRegion', label: 'Country' },
      { key: 'continent', label: 'Continent' },
      { key: 'totalCases', label: 'Total Cases' },
      { key: 'totalDeaths', label: 'Total Deaths' },
      { key: 'totalRecovered', label: 'Recovered' },
      { key: 'activeCases', label: 'Active' }
    ],
    formFields: [
      { key: 'countryRegion', label: 'Country', type: 'text' },
      { key: 'continent', label: 'Continent', type: 'text' },
      { key: 'totalCases', label: 'Total Cases', type: 'number' },
      { key: 'totalDeaths', label: 'Total Deaths', type: 'number' },
      { key: 'totalRecovered', label: 'Recovered', type: 'number' },
      { key: 'activeCases', label: 'Active Cases', type: 'number' }
    ]
  },
  covid: {
    key: 'covid',
    label: 'Covid Overview',
    endpoint: 'covid',
    searchEndpoint: 'covid/search',
    searchParam: 'country',
    defaultSortBy: 'confirmed',
    sortOptions: ['confirmed', 'deaths', 'recovered', 'active', 'date', 'countryRegion', 'provinceState', 'whoRegion'],
    allowSearch: true,
    allowSort: true,
    columns: [
      { key: 'provinceState', label: 'Province' },
      { key: 'countryRegion', label: 'Country' },
      { key: 'confirmed', label: 'Confirmed' },
      { key: 'deaths', label: 'Deaths' },
      { key: 'recovered', label: 'Recovered' },
      { key: 'active', label: 'Active' }
    ],
    formFields: [
      { key: 'provinceState', label: 'Province / State', type: 'text' },
      { key: 'countryRegion', label: 'Country', type: 'text' },
      { key: 'confirmed', label: 'Confirmed', type: 'number' },
      { key: 'deaths', label: 'Deaths', type: 'number' },
      { key: 'recovered', label: 'Recovered', type: 'number' },
      { key: 'active', label: 'Active', type: 'number' },
      { key: 'date', label: 'Date', type: 'date' }
    ]
  },
  dayWise: {
    key: 'dayWise',
    label: 'Day Wise',
    endpoint: 'day-wise',
    searchEndpoint: 'day-wise/search',
    searchParam: 'keyword',
    defaultSortBy: 'date',
    sortOptions: ['date', 'confirmed', 'deaths', 'recovered', 'active', 'numberOfCountries'],
    allowSearch: true,
    allowSort: true,
    columns: [
      { key: 'date', label: 'Date' },
      { key: 'confirmed', label: 'Confirmed' },
      { key: 'deaths', label: 'Deaths' },
      { key: 'recovered', label: 'Recovered' },
      { key: 'active', label: 'Active' },
      { key: 'numberOfCountries', label: 'Countries' }
    ],
    formFields: [
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'confirmed', label: 'Confirmed', type: 'number' },
      { key: 'deaths', label: 'Deaths', type: 'number' },
      { key: 'recovered', label: 'Recovered', type: 'number' },
      { key: 'active', label: 'Active', type: 'number' },
      { key: 'numberOfCountries', label: 'Number of Countries', type: 'number' }
    ]
  },
  fullGrouped: {
    key: 'fullGrouped',
    label: 'Full Grouped',
    endpoint: 'full-grouped',
    searchEndpoint: 'full-grouped/search',
    searchParam: 'keyword',
    defaultSortBy: 'date',
    sortOptions: ['date', 'confirmed', 'deaths', 'recovered', 'active', 'countryRegion'],
    allowSearch: true,
    allowSort: true,
    columns: [
      { key: 'date', label: 'Date' },
      { key: 'countryRegion', label: 'Country' },
      { key: 'confirmed', label: 'Confirmed' },
      { key: 'deaths', label: 'Deaths' },
      { key: 'recovered', label: 'Recovered' },
      { key: 'active', label: 'Active' }
    ],
    formFields: [
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'countryRegion', label: 'Country', type: 'text' },
      { key: 'confirmed', label: 'Confirmed', type: 'number' },
      { key: 'deaths', label: 'Deaths', type: 'number' },
      { key: 'recovered', label: 'Recovered', type: 'number' },
      { key: 'active', label: 'Active', type: 'number' }
    ]
  },
  usaCounty: {
    key: 'usaCounty',
    label: 'USA County',
    endpoint: 'usa-county',
    searchEndpoint: 'usa-county/search',
    searchParam: 'keyword',
    defaultSortBy: 'confirmed',
    sortOptions: ['confirmed', 'deaths', 'countryRegion', 'provinceState', 'admin2'],
    allowSearch: true,
    allowSort: true,
    columns: [
      { key: 'admin2', label: 'County' },
      { key: 'provinceState', label: 'State' },
      { key: 'countryRegion', label: 'Country' },
      { key: 'confirmed', label: 'Confirmed' },
      { key: 'deaths', label: 'Deaths' }
    ],
    formFields: [
      { key: 'admin2', label: 'County', type: 'text' },
      { key: 'provinceState', label: 'State', type: 'text' },
      { key: 'countryRegion', label: 'Country', type: 'text' },
      { key: 'confirmed', label: 'Confirmed', type: 'number' },
      { key: 'deaths', label: 'Deaths', type: 'number' }
    ]
  }
}
