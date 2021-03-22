const BASE_CSV_URL = 'https://raw.githubusercontent.com';

const baseURl = new URL('/podnebnik/data/master/csv/', BASE_CSV_URL);

export const Historical_URL = {
  total: new URL('emissions_historical.csv', baseURl),
  agriculture: new URL('emissions_historical_agriculture.csv', baseURl),
  aviation: new URL('emissions_historical_aviation.csv', baseURl),
  biomass: new URL('emissions_historical_biomass.csv', baseURl),
  energy: new URL('emissions_historical_energy.csv', baseURl),
  industrial_processes: new URL(
    'emissions_historical_industrial_processes.csv',
    baseURl
  ),
  international: new URL(
    'emissions_historical_industrial_processes.csv',
    baseURl
  ),
  lulucf: new URL('emissions_historical_industrial_processes.csv', baseURl),
  waste: new URL('emissions_historical_industrial_processes.csv', baseURl),
};

export const Projections_URL = {
  projections: new URL('emissions_projections.csv', baseURl),
};
