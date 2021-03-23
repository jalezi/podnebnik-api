import { csvToJSON, getJSON } from '../fetchData';

describe('fetchData', () => {
  describe('csvToJSON', () => {
    it('should be a function', () => {
      expect(csvToJSON).toBeInstanceOf(Function);
    });
  });
  describe('getJSON', () => {
    it('should be a function', () => {
      expect(getJSON).toBeInstanceOf(Function);
    });
  });
});
