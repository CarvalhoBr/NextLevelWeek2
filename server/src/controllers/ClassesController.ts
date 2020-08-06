import db from "../database/connection"
import { Request, Response } from 'express'
import toMinutes from "../utils/convertHourToMinutes"

export default class ClassesController{

    async index(req: Request, res: Response){
        const filters = req.query

        if(!filters.week_day || !filters.subject || !filters.time){
            return res.status(400).json({error: "Missing filters"})
        }

        const week_day = Number(filters.week_day)
        const subject = String(filters.subject)
        const time = String(filters.time)

        const timeInMinutes = toMinutes(String(filters.time))


        const classes = await db('classes')
            .whereExists(function(){
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                    .whereRaw('`class_schedule`.`week_day` = ??', [week_day])
                    .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                    .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*'])
    

        return res.json(classes)

    }

    async create(req: Request, res: Response){
    
        const trx = await db.transaction()
        
        const {
            name,
            whatsapp,
            avatar,
            bio,
            subject,
            cost,
            schedule
        } = req.body
    
        
        try {
            const insertedUserIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio,
            })
            const user_id = insertedUserIds[0]
        
            const insertedClassesIds = await trx('classes').insert({
                subject,
                cost,
                user_id
            })
            const class_id = insertedClassesIds[0]
        
            interface schedule{
                week_day: number,
                from: string,
                to: string
            }
        
            const serializedSchedule = schedule.map((scheduleItem: schedule) => {
        
                const item = {
                    "week_day": scheduleItem.week_day,
                    "from": toMinutes(scheduleItem.from),
                    "to": toMinutes(scheduleItem.to),
                    class_id
                }
        
                return (item)
            })
        
            await trx('class_schedule').insert(serializedSchedule)
        
            await trx.commit()
    
            return res.status(201).send()
    
        } catch (error) {
            console.log(error)
            await trx.rollback()
            return res.status(400).json({error: "Unable t create a new class"})
        }
       
    }
}