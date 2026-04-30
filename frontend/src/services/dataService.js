import api from './api'
import { datasets } from '../utils/datasets'

const buildPageParams = ({ page = 0, size = 10, sortBy, dangerZone, allowedSorts = [], defaultSortBy }) => {
  const safeSortBy = allowedSorts.includes(sortBy) ? sortBy : defaultSortBy
  const params = { page, size, ...(safeSortBy ? { sortBy: safeSortBy } : {}) }
  if (dangerZone !== undefined) params.dangerZone = dangerZone
  return params
}

const createListService = (endpoint, searchEndpoint, searchParam = 'keyword', sortConfig = {}) => ({
  list: (params = {}) => api.get(`/${endpoint}`, { params: buildPageParams({ ...params, ...sortConfig }) }).then(r => r.data),
  search: searchEndpoint
    ? (value, params = {}) => api.get(`/${searchEndpoint}`, { params: { [searchParam]: value, ...buildPageParams({ ...params, ...sortConfig }) } }).then(r => r.data)
    : null,
  create: (payload) => api.post(`/${endpoint}`, payload).then(r => r.data),
  update: (id, payload) => api.put(`/${endpoint}/${id}`, payload).then(r => r.data),
  remove: (id) => api.delete(`/${endpoint}/${id}`).then(r => r.data),
  getById: (id) => api.get(`/${endpoint}/${id}`).then(r => r.data)
})

export const countryWiseApi = createListService('country-wise', 'country-wise/search', 'keyword', { allowedSorts: datasets.countryWise.sortOptions, defaultSortBy: datasets.countryWise.defaultSortBy })
export const worldometerApi = createListService('worldometer', 'worldometer/search', 'country', { allowedSorts: datasets.worldometer.sortOptions, defaultSortBy: datasets.worldometer.defaultSortBy })
export const covidApi = createListService('covid', 'covid/search', 'country', { allowedSorts: datasets.covid.sortOptions, defaultSortBy: datasets.covid.defaultSortBy })
export const dayWiseApi = createListService('day-wise', datasets.dayWise.searchEndpoint, datasets.dayWise.searchParam, { allowedSorts: datasets.dayWise.sortOptions, defaultSortBy: datasets.dayWise.defaultSortBy })
export const fullGroupedApi = createListService('full-grouped', datasets.fullGrouped.searchEndpoint, datasets.fullGrouped.searchParam, { allowedSorts: datasets.fullGrouped.sortOptions, defaultSortBy: datasets.fullGrouped.defaultSortBy })
export const usaCountyApi = createListService('usa-county', datasets.usaCounty.searchEndpoint, datasets.usaCounty.searchParam, { allowedSorts: datasets.usaCounty.sortOptions, defaultSortBy: datasets.usaCounty.defaultSortBy })

