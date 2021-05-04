const BASE_CSV_URL = 'https://raw.githubusercontent.com';

const baseURL = new URL('/podnebnik/data/master/', BASE_CSV_URL);

const emissionsDataURL = new URL('emissions/data/', baseURL);

// https://raw.githubusercontent.com/podnebnik/data/master/emissions/data/emissions.historical.agriculture.csv

export const Historical_URL = {
  total: new URL('emissions.historical.csv', emissionsDataURL),
  agriculture: new URL(
    'emissions.historical.agriculture.csv',
    emissionsDataURL
  ),
  aviation: new URL('emissions.historical.aviation.csv', emissionsDataURL),
  biomass: new URL('emissions.historical.biomass.csv', emissionsDataURL),
  energy: new URL('emissions.historical.energy.csv', emissionsDataURL),
  industrial_processes: new URL(
    'emissions.historical.industrial.processes.csv',
    emissionsDataURL
  ),
  international: new URL(
    'emissions.historical.industrial.processes.csv',
    emissionsDataURL
  ),
  lulucf: new URL(
    'emissions.historical.industrial.processes.csv',
    emissionsDataURL
  ),
  waste: new URL(
    'emissions.historical.industrial.processes.csv',
    emissionsDataURL
  ),
};

export const Projections_URL = {
  projections: new URL('emissions.projections.csv', emissionsDataURL),
};
