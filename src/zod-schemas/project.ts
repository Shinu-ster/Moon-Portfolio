import { z } from "zod";


export const insertProjectSchema = z.object({
    id: z.number(),
    title: z.string().min(3, "Title too short"),
    imageUrl: z.string().url("Image URL required"),
    isFeatured: z.boolean(),
})


export type insertProjectSchemaType = z.infer<typeof insertProjectSchema>;
