import moment from 'moment'

export default function ymdToApp(date) {
  console.log('dayte' + date)
  let dayte = date.substring(0, 11)
  let arr = dayte.split('-')
  console.log(arr)
  let months = [
    '',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  return arr[2].trim() + '-' + months[arr[1].replace(/^0+/, '')] + '-' + arr[0]
}

export function getDuration(startDate, endDate) {
  const days = moment(endDate).diff(moment(startDate), 'days')
  // console.log("Start "+startDate+" End "+endDate+" "+days)

  return isNaN(days) || days < 0 ? 0 : days

  //     const dateParts1 = startDate.substring(0,11).split('-');
  //     const dateParts2 = endDate.substring(0,11).split('-');
  //     const date1 = new Date(dateParts1[0],dateParts1[1]-1,dateParts1[2]);
  //     console.log('dateee',date1);
  //     const date2 = new Date(dateParts2[0],dateParts2[1]-1,dateParts2[2]);
  //     console.log('dateee',date2);
  //    console.log("oo "+Math.abs((date2.getTime() - date1.getTime())/(1000*3600*24)).toString())
  //      return Math.abs((date2.getTime() - date1.getTime())/(1000*3600*24)).toString();
}

export function sortDate(date) {
  console.log('Wrong date ' + date)
  let d = date.split('-')
  let months = [
    '',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  let m = months[Number(d[1] >= 10 ? d[1] : d[1] % 10)]
  console.log(`${d[2]}-${m}-${d[0]}}`)
  return `${d[2]}-${m}-${d[0]}`
}

export function getDate(date) {
  console.log('dayte' + date)
  let dayte = date.substring(0, 11)
  let arr = dayte.split('-')
  console.log(arr)
  let months = [
    '',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  return arr[2].trim() + '-' + months[arr[1].replace(/^0+/, '')] + '-' + arr[0]
}
