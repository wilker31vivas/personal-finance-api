import z from 'zod'
import { getCategories, transactionType} from '../utils.js'
const categoryNames = getCategories().map((item) => item.name)

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
