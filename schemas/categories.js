import z from 'zod'

const categoriesSchemas = z.object({
    name: z.string(),
})

export function validateCategory(object){
    return categoriesSchemas.safeParse(object)
}

export function validateCategoriePartial(object){
    return categoriesSchemas.partial().safeParse(object)
}
