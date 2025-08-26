import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function getWeekdayFromDate(dateStr: string) {
  const date = parse(dateStr, 'dd/MM/yyyy', new Date());
  return format(date, 'EEEE', { locale: ptBR });
}