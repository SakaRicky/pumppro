import { DailySale } from "@prisma/client";
import prisma from "../../../client";

export const getAllDailySales = async (): Promise<DailySale[]> => {
    return await prisma.dailySale.findMany({
        select: {
            id: true,
            user_id: true,
            amount_sold: true,
            amount_given: true,
            date_of_sale_start: true,
            date_of_sale_stop: true,
            fuel_counts: true,
            user: true,
            created_at: true,
            updated_at: true
        },
    });
}