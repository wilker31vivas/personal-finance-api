import z from 'zod'
import {getCategoryNames, transactionType} from '../utils.js'
const categoryNames = getCategoryNames()

const TransactionSchemas = z.object({
    type: z.literal(transactionType),
    amount: z.number().min(1),
    category: z.literal(categoryNames),
    description: z.string(),
    date: z.string()
})

export function validateTransaction(object){
    return TransactionSchemas.safeParse(object)
}

export function validateTransactionPartial(object){
    return TransactionSchemas.partial().safeParse(object)
}
