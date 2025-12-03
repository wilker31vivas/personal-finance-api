import z from 'zod'
import {transactionCategory, transactionType} from '../utils.js'

const expensesSchemas = z.object({
    type: z.literal(transactionType),
    amount: z.number().min(1),
    category: z.literal(transactionCategory),
    description: z.string(),
})

export function validateTransaction(object){
    return expensesSchemas.safeParse(object)
}

export function validateTransactionPartial(object){
    return expensesSchemas.partial().safeParse(object)
}
