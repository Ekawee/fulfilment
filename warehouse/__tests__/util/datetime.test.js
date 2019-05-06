import { DateTime } from 'luxon';
import datetimeUtil from '../../src/util/datetime';

describe('/util/datetime/toStartOfUnit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return date with start day time when input JS format', async () => {
    const mockDateInput = DateTime.fromISO('2019-05-01T16:21:01').toJSDate();
    const mockUnit = 'days';

    const expectedResult = DateTime.fromISO('2019-05-01T00:00:00');
    const result = datetimeUtil.toStartOfUnit(mockDateInput, mockUnit);

    expect(result).toEqual(expectedResult);
  });

  it('should return date with start day time when input JS format', async () => {
    const mockDateInput = DateTime.fromISO('2019-05-01T16:21:01').toISO();
    const mockUnit = 'days';

    const expectedResult = DateTime.fromISO('2019-05-01T00:00:00');
    const result = datetimeUtil.toStartOfUnit(mockDateInput, mockUnit);

    expect(result).toEqual(expectedResult);
  });

});

describe('/util/datetime/toEndOfUnit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return date with end day time when input JS format', async () => {
    const mockDateInput = DateTime.fromISO('2019-05-01T16:21:01').toJSDate();
    const mockUnit = 'days';

    const expectedResult = DateTime.fromISO('2019-05-01T23:59:59.999');
    const result = datetimeUtil.toEndOfUnit(mockDateInput, mockUnit);

    expect(result).toEqual(expectedResult);
  });

  it('should return date with end day time when input JS format', async () => {
    const mockDateInput = DateTime.fromISO('2019-05-01T16:21:01').toISO();
    const mockUnit = 'days';

    const expectedResult = DateTime.fromISO('2019-05-01T23:59:59.999');
    const result = datetimeUtil.toEndOfUnit(mockDateInput, mockUnit);

    expect(result).toEqual(expectedResult);
  });

});

describe('/util/datetime/diffDateInUnit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return day preiod that does not care about time', async () => {
    const mockDateStartInput = DateTime.fromISO('2019-05-01T16:00:01').toJSDate();
    const mockDateEndInput = DateTime.fromISO('2019-05-05T11:20:09').toJSDate();
    const mockUnit = 'days';

    const expectedResult = 4;
    const result = datetimeUtil.diffDateInUnit(mockDateEndInput, mockDateStartInput, mockUnit);

    expect(result).toEqual(expectedResult);
  });

  it('should return month preiod that does not care about time', async () => {
    const mockDateStartInput = DateTime.fromISO('2019-02-01T16:00:01').toJSDate();
    const mockDateEndInput = DateTime.fromISO('2019-05-05T11:20:09').toJSDate();
    const mockUnit = 'months';

    const expectedResult = 3;
    const result = datetimeUtil.diffDateInUnit(mockDateEndInput, mockDateStartInput, mockUnit);

    expect(result).toEqual(expectedResult);
  });

});
