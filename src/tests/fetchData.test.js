import { csvToJSON, getJSON, byKey } from '../fetchData/utils';
import ApplicationError, { DataError } from '../Errors/ApplicationError';

describe('fetchData', () => {
  describe('csvToJSON', () => {
    it('should be a function - csvToJSON', () => {
      expect(csvToJSON).toBeInstanceOf(Function);
    });
    it('should return empty array', () => {
      const result = csvToJSON();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });
    it('should throw DataError', () => {
      expect(() => csvToJSON('x')).toThrowError(DataError);
    });
    it('should return array with error obj', () => {
      const result1 = csvToJSON([['value1']], ['key1', 'key2']);
      expect(result1).toBeInstanceOf(Array);
      expect(result1).toHaveLength(1);
      expect(result1[0]).toHaveProperty('error');
      const result2 = csvToJSON([['value1', 'value2']], ['key1']);
      expect(result2).toBeInstanceOf(Array);
      expect(result2).toHaveLength(1);
      expect(result2[0]).toHaveProperty('error');
    });
    it('should return correct array with length 1 and obj', () => {
      const result = csvToJSON([['value1', 'value2']], ['key1', 'key2']);
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ key1: 'value1', key2: 'value2' });
    });
    it('should return correct array with length 2 and obj', () => {
      const result = csvToJSON(
        [
          ['value1', 'value2', 'value3'],
          ['value1', 'value2', 'value3'],
        ],
        ['key1', 'key2.nested1', 'key3.nested2']
      );
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('key1');
      expect(result[0].key2).toHaveProperty('nested1');
    });
  });
  describe('getJSON', () => {
    it('should be a function - getJSON', () => {
      expect(getJSON).toBeInstanceOf(Function);
    });

    it('should return obj with key and error name "DataError"', () => {
      const func = jest.fn(([key, data]) => getJSON({}, [key, data]));
      const result = func(['myKey', 'header1,header2,header3\nitem1,item2\n']);
      expect(result).toHaveProperty('myKey');
      expect(result.myKey).toBeInstanceOf(Array);
      expect(result.myKey).toHaveLength(1);
      expect(result.myKey[0]).not.toHaveProperty('header1');
      expect(result.myKey[0]).toHaveProperty('error');
      expect(result.myKey[0].error).toHaveProperty('name');
      expect(result.myKey[0].error.name).toBe('DataError');
    });

    it('should return obj with key and value', () => {
      const func = jest.fn(([key, data]) => getJSON({}, [key, data]));
      const result = func([
        'myKey',
        'header1,header2,header3\nitem1,item2,item3\n',
      ]);
      expect(result).toHaveProperty('myKey');
      expect(result.myKey).toBeInstanceOf(Array);
      expect(result.myKey).toHaveLength(1);
      expect(Object.keys(result.myKey[0])).toHaveLength(3);
      expect(result.myKey[0]).toHaveProperty('header1');
      expect(result.myKey[0].header1).toBe('item1');
    });
  });

  describe('byKey', () => {
    it('should be a function - byKey', () => {
      expect(byKey).toBeInstanceOf(Function);
    });
    it('should return an empty array', () => {
      const result = byKey();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });

    it('should throw an ApplicationError if func called with wrong args', () => {
      const func1 = jest.fn(() => byKey({}));
      expect(func1).toThrowError(ApplicationError);
      const func2 = jest.fn(() => byKey([], null));
      expect(func2).toThrowError(ApplicationError);
      const func3 = jest.fn(() => byKey([], 'something', {}));
      expect(func3).toThrowError(ApplicationError);
      const func4 = jest.fn(() => byKey([], 'something', [], null));
      expect(func4).toThrowError(ApplicationError);
    });

    const input = [
      {
        year: '2020',
        default: {
          yes: 'some data',
        },
        someKey: {
          yes: 'some data',
        },
      },
      {
        year: '2021',
        default: {
          yes: 'other data',
        },
        someKey: {
          yes: 'other data',
        },
      },
    ];
    const missingProperty = [
      {
        year: '2020',
        default: {
          yes: 'some data',
        },
      },
      {
        year: '2021',
        default: {
          yes: 'other data',
        },
        someKey: {
          yes: 'other data',
        },
      },
    ];

    it('should return empty array if second arg in falsy', () => {
      const result = byKey(input);
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });

    it('should have different length than input', () => {
      const result = byKey(missingProperty, 'someKey');
      expect(result).toBeInstanceOf(Array);
      expect(result).not.toHaveLength(missingProperty.length);
    });

    it('should return array with two items with default 2nd arg.', () => {
      const output = [
        { default: { yes: 'some data' } },
        { default: { yes: 'other data' } },
      ];
      const result = byKey(input, 'default');
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result).toEqual(output);
    });

    it('should return array, length 2 with 2nd arg as key', () => {
      const output = [
        { someKey: { yes: 'some data', year: '2020' } },
        { someKey: { yes: 'other data', year: '2021' } },
      ];
      const result = byKey(input, 'someKey', ['year']);
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result).toEqual(output);
    });

    it('should return array, length 2 with key as 2nd arg value', () => {
      const output = [
        { [2020]: { default: { yes: 'some data' } } },
        { [2021]: { default: { yes: 'other data' } } },
      ];
      const result = byKey(input, 'year', ['default']);
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result).toEqual(output);
    });
  });
});
