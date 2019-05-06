import { DateTime } from 'luxon';
import { getOr } from 'lodash/fp';

const toStartOfUnit = (date, unit) => (typeof date === 'string' ?
DateTime.fromISO(date) : DateTime.fromJSDate(date)).startOf(unit);

const toEndOfUnit = (date, unit) => (typeof date === 'string' ?
DateTime.fromISO(date) : DateTime.fromJSDate(date)).endOf(unit);

/*
 * unit: string => ex. 'years', 'months', 'days', 'hours' etc...
 */
const diffDateInUnit = (end, start, unit) => {
  const endDate = toStartOfUnit(end, unit);
  const startDate = toEndOfUnit(start, unit);

  return getOr(0, unit, endDate.diff(startDate, unit).toObject());
};

export default {
  toStartOfUnit,
  toEndOfUnit,
  diffDateInUnit,
};
