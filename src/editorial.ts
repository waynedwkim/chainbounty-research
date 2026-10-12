/** House style: English long dates for readers; ISO dates remain in machine data. */
export function formatDate(iso:string):string {
  return new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(`${iso}T00:00:00Z`));
}
/** No implicit three-decimal rounding of source quantities. */
export function formatQuantity(value:number):string {
  return new Intl.NumberFormat('en-US',{maximumFractionDigits:20}).format(value);
}
export function readingTime(minutes:number):string{return `${minutes}-minute read`;}
export function resultCount(count:number):string{return `${count} investigation${count===1?'':'s'}`;}
export const labels={read:'Read the investigation',clear:'Clear filters',table:'View data table',routes:'View routes and wallet details',sources:'Sources and scope',copiedLink:'Article link copied.',copiedPrompt:'Investigation prompt copied.'} as const;
