import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { z } from 'zod'


export const userRouter = createTRPCRouter({
  create: publicProcedure.input(z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    profileImage: z.string().optional()
  })).mutation(async ({ input, ctx }) => {
    const user = await ctx.db.user.create({
      data: input
    })
    return user
  }),
  
  getUser: privateProcedure.query(async ({ ctx }) => {
    const id = ctx.user.userId
    const user = await ctx.db.user.findUnique({
      where: { id }
    })
    return user
  }),
})