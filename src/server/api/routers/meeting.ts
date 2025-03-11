import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { z } from 'zod'


export const meetingRouter = createTRPCRouter({
  create: privateProcedure.input(z.object({
    name: z.string(),
    streamId: z.string()
  })).mutation(async ({ input, ctx }) => {
    const hostId = ctx.user.userId
    const meeting = await ctx.db.meeting.create({
      data: { ...input, hostId}
    })
    return meeting
  }),

  getMeeting: privateProcedure.input(z.object({
    id: z.string()
  })).query(async ({ input, ctx }) => {
    const meeting = await ctx.db.meeting.findUnique({
      where: { streamId: input.id }
    })
    return meeting
  }),

  getMeetings: privateProcedure.query(async ({ ctx }) => {
    const hostId = ctx.user.userId
    const meetings = await ctx.db.meeting.findMany({
      where: { 
        OR: [
          { hostId: hostId },
          { attendees: { some: { id: hostId } } }
        ]
       }
    })
    return meetings
  }),


  join: privateProcedure.input(z.object({
    meetingId: z.string()
  })).mutation(async ({ input, ctx }) => {
    const meeting = await ctx.db.meeting.findUnique({
      where: { streamId: input.meetingId }
    })
    if(!meeting) throw new Error('Meeting not found')
    const userId = ctx.user.userId
    await ctx.db.meeting.update({
      where: { id: meeting.id },
      data: { attendees: { connect: { id: userId } } }
    })
    return meeting
  }),
})