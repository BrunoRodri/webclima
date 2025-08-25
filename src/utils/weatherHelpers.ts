/* eslint-disable @typescript-eslint/no-explicit-any */
import { format, parseISO, fromUnixTime } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function getUniqueDates(list: any[]) {
  return [
    ...new Set(
      list.map(
        entry => new Date(entry.dt * 1000).toISOString().split('T')[0]
      )
    ),
  ];
}

export function getFirstDataForEachDate(list: any[], uniqueDates: string[]) {
  return uniqueDates.map(date => {
    return list.find(entry => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split('T')[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });
}

export function formatLocalHour(dt: number, timezone: number) {
  const localTimestamp = dt + timezone;
  return format(fromUnixTime(localTimestamp), 'H:mm');
}

export function formatDay(dt_txt: string) {
  return format(parseISO(dt_txt), 'EEEE', { locale: ptBR });
}

export function formatDate(dt_txt: string) {
  return format(parseISO(dt_txt), '(dd.MM.yyyy)');
}

export function formatHour(dt_txt: string) {
  return format(parseISO(dt_txt), 'H:mm');
}

export function formatSunTime(unix: number) {
  return format(fromUnixTime(unix), 'HH:mm');
}