import { PrismaClient, User } from '@prisma/client';
import { DailySaleSummary, NewDailySaleSummary } from '../../types';

const prisma = new PrismaClient();

/**
 * Checks if a user already has a recorded sale in the given time range.
 */
const checkForDuplicate = async (userId: string, startDate: Date, stopDate: Date): Promise<DailySaleSummary | null> => {
    return await prisma.dailySalesSummary.findFirst({
        where: {
            user_id: userId,
            OR: [
                {
                    date_of_sale_start: { lte: startDate },
                    date_of_sale_stop: { gte: stopDate }
                }
            ]
        },
    });
}

const checkUser = async (user_id: string): Promise<User> => {
    const user = await prisma.user.findUnique({
        where: { id: user_id }
    });

    if (!user) {
        throw new Error("This worker couldn't be found");
    }

    return user
}

/**
 * 
 * @param newDailySale a new validated daily sale to be saved in the db
 * @returns the new saved record
 */
export const createDailySaleInDB = async (newDailySale: NewDailySaleSummary) => {

    const user = await checkUser(newDailySale.user_id)
    
    const existingDailySale = await checkForDuplicate(newDailySale.user_id, newDailySale.date_of_sale_start, newDailySale.date_of_sale_stop);

    if (existingDailySale) {
        throw new Error("This worker already have a saved sale in this period");
    }

    // Normalize timestamps to avoid unwanted precision differences by remove seconds to have fix hours intervals
    newDailySale.date_of_sale_start.setSeconds(0);
    newDailySale.date_of_sale_stop.setSeconds(0);

    return await prisma.dailySalesSummary.create({data: {
        amount_sold: newDailySale.amount_sold,
        amount_given: newDailySale.amount_given,
        date_of_sale_start: newDailySale.date_of_sale_start,
        date_of_sale_stop: newDailySale.date_of_sale_stop,
        user: { connect: { id: user.id } }
    },});
}

export const updateDailySaleInDB = async (dailySaleToUpdate: DailySaleSummary) => {

    const user = await checkUser(dailySaleToUpdate.user_id)
    
    const existingDailySale = await checkForDuplicate(dailySaleToUpdate.user_id, dailySaleToUpdate.date_of_sale_start, dailySaleToUpdate.date_of_sale_stop);

    if (!existingDailySale) {
        throw new Error("There is no daily sale for this period for this user");
    }

    return await prisma.dailySalesSummary.update({
        data: {
            amount_sold: dailySaleToUpdate.amount_sold,
            amount_given: dailySaleToUpdate.amount_given,
            date_of_sale_start: dailySaleToUpdate.date_of_sale_start,
            date_of_sale_stop: dailySaleToUpdate.date_of_sale_stop,
            user: { connect: { id: user.id } }
        },
        where: {id: dailySaleToUpdate.id}
    });
}

export const deleteDailySaleInDB = async (dailySaleToDelete: DailySaleSummary) => {

    await checkUser(dailySaleToDelete.user_id)
    
    const existingDailySale = await checkForDuplicate(dailySaleToDelete.user_id, dailySaleToDelete.date_of_sale_start, dailySaleToDelete.date_of_sale_stop);

    if (!existingDailySale) {
        throw new Error("There is no daily sale for delete for this period for this user");
    }

    return await prisma.$transaction(async (tx) => {
         const deletedDailySale = await tx.dailySalesSummary.delete({
                where: {id: dailySaleToDelete.id},
            });                    
        return deletedDailySale;
    });
}