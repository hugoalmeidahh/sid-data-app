
import express from 'express'

import { Router, Request, Response } from 'express';

const app = express();

const route = Router()

app.use(express.json())
app.use(route)

let xDias: any[] = []
const HORAS_SEMANA = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']
const HORAS_SABADO = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00']
const ID = [18]

function getDateTimes(month:number, year:number) {
  var dias = getDiasMes(month, year);
  for (var i = 0; i < dias.length; i++) {
    if(dias[i].weekDay != 6) {
      for (const hKeys in HORAS_SEMANA) {
        xDias.push(`${dias[i].date} ${HORAS_SEMANA[hKeys]}`)
      }
    } else {
      for (const hKeys in HORAS_SABADO) {
        xDias.push(`${dias[i].date} ${HORAS_SABADO[hKeys]}`)
      }
    }
  }
}


const getDiasMes = (month:number, year:number) => {
  month--; // lets fix the month once, here and be done with it

  var date = new Date(year, month, 1);
  var days = [];

  while (date.getMonth() === month) {
    // Exclude weekends
    var tmpDate = new Date(date);
    var weekDay = tmpDate.getDay(); // week day
    var day = tmpDate.getDate(); // day
    var xMonth = tmpDate.getMonth() //Month
    var xYear = tmpDate.getFullYear() //full year

    if (weekDay != 0) { // exclude 0=Sunday and 6=Saturday
      days.push({ date:`${xYear}/${(month+1)}/${day}`, weekDay});
    }
    date.setDate(date.getDate() + 1);
  }
  return days;
}

route.get('/', (req: Request, res: Response) => {
  const {id, month, year} = req.query

  // @ts-ignore
  getDateTimes(month, year)

  let asdf: string[] = []

  for (const key in xDias) {
    let xScript = `insert into wp_gb_scheduling(id_user,date,status) VALUES ( ${id}, '${xDias[key]}', 'available' );`
    asdf.push(xScript)
  }

  res.json(asdf)
})


//
// const payload = {
//   id_user: 18,
//   dates:[{
//     date:'2022-07-04',
//     hours: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']
//   },
//     {
//       date:'2022-07-05',
//       hours: ['06:00', '07:00', '08:00']
//     },
//     {
//       date:'2022-07-06',
//       hours: ['06:00', '07:00', '08:00']
//     }]
// }
//
// function insertdb(payload:any) {
//   const {id_user, dates} = payload
//   let script: any[] = []
//
//   for (const key in dates) {
//       const {date, hours} = dates[key]
//     for (const hKey in hours) {
//       let xDateTime = date+ ' ' + hours[hKey]
//       let xScript = `insert into wp_gb_scheduling(id_user,date,status) VALUES ( ${id_user}, '${xDateTime}', 'available' );`
//       script.push(xScript)
//     }
//   }
//
//   return script
// }





app.listen(3333, () => 'server running on port 3333')


