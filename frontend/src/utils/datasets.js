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
    ]
  },
  dayWise: {
    key: 'dayWise',
    label: 'Day Wise',
    endpoint: 'day-wise',
    defaultSortBy: 'date',
    sortOptions: ['date', 'confirmed', 'deaths', 'recovered', 'active', 'numberOfCountries'],
    allowSearch: false,
    allowSort: true,
    columns: [
      { key: 'date', label: 'Date' },
      { key: 'confirmed', label: 'Confirmed' },
      { key: 'deaths', label: 'Deaths' },
      { key: 'recovered', label: 'Recovered' },
      { key: 'active', label: 'Active' },
      { key: 'numberOfCountries', label: 'Countries' }
    ]
  },
  fullGrouped: {
    key: 'fullGrouped',
    label: 'Full Grouped',
    endpoint: 'full-grouped',
    defaultSortBy: 'date',
    sortOptions: ['date', 'confirmed', 'deaths', 'recovered', 'active', 'countryRegion'],
    allowSearch: false,
    allowSort: true,
    columns: [
      { key: 'date', label: 'Date' },
      { key: 'countryRegion', label: 'Country' },
      { key: 'confirmed', label: 'Confirmed' },
      { key: 'deaths', label: 'Deaths' },
      { key: 'recovered', label: 'Recovered' },
      { key: 'active', label: 'Active' }
    ]
  },
  usaCounty: {
    key: 'usaCounty',
    label: 'USA County',
    endpoint: 'usa-county',
    defaultSortBy: 'confirmed',
    sortOptions: ['confirmed', 'deaths', 'countryRegion', 'provinceState', 'admin2'],
    allowSearch: false,
    allowSort: true,
    columns: [
      { key: 'admin2', label: 'County' },
      { key: 'provinceState', label: 'State' },
      { key: 'countryRegion', label: 'Country' },
      { key: 'confirmed', label: 'Confirmed' },
      { key: 'deaths', label: 'Deaths' }
    ]
  }
}

export const countryWiseFormFields = [
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

