import z from 'zod'
import {getCategoryNames, transactionType} from '../utils.js'
const categoryNames = getCategoryNames()

const expensesSchemas = z.object({
    type: z.literal(transactionType),
    amount: z.number().min(1),
    category: z.literal(categoryNames),
    description: z.string(),
})

export function validateTransaction(object){
    return expensesSchemas.safeParse(object)
}

export function validateTransactionPartial(object){
    return expensesSchemas.partial().safeParse(object)
}
