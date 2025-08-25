export function getDayOrNightIcon(
  iconName: string,
  dt: number,         
  timezone: number    
): string {
  
  const localTimestamp = dt + timezone;
  const localDate = new Date(localTimestamp * 1000);
  const hours = localDate.getHours();

  const isDayTime = hours >= 6 && hours < 18;
  return isDayTime ? iconName.replace(/.$/, "d") : iconName.replace(/.$/, "n");
}