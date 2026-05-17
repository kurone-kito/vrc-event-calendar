import { z } from "zod";

const EventCategoryEnum = z.enum([
  "PARTY",
  "MUSIC",
  "ART",
  "GAME",
  "SOCIAL",
  "OTHER",
]);

export const CreateEventSchema = z
  .object({
    title: z.string().min(1),
    startAt: z.string().datetime(),
    endAt: z.string().datetime(),
    category: EventCategoryEnum,
    description: z.string().optional(),
    worldId: z.string().optional(),
    worldName: z.string().optional(),
  })
  .refine((data) => new Date(data.endAt) > new Date(data.startAt), {
    message: "endAt must be after startAt",
    path: ["endAt"],
  });

export const UpdateEventSchema = z.object({
  title: z.string().min(1).optional(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  category: EventCategoryEnum.optional(),
  description: z.string().optional(),
  worldId: z.string().optional(),
  worldName: z.string().optional(),
});

export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
