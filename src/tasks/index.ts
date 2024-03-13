import { CronJob } from 'cron'
const cronExp = process.env.CRON_EXP ?? '* * * * *'

export const cron = new CronJob(cronExp, () => {
  console.log('Executing cron job once every minutes')
})
