import { PrismaClient, User } from '@prisma/client';
import { DailySale, NewDailySale, NewFuelCount } from '../../types';

const prisma = new PrismaClient();

/**
 * Checks if a user already has a recorded sale in the given time range.
 */
const checkForDuplicate = async (userId: string, startDate: Date, stopDate: Date): Promise<DailySale | null> => {
    return await prisma.dailySale.findFirst({
        where: {
            user_id: userId,
            OR: [
                {
                    date_of_sale_start: { lte: startDate },
                    date_of_sale_stop: { gte: stopDate }
                }
            ]
        },
        include: {fuel_counts: true}
    });
}

/**
 * 
 * @param tx the prisma transaction
 * @param fuel_counts 
 */
const updateFuelQuantity = async (tx: any, fuel_counts: NewFuelCount[]) => {
    for (const fuelCount of fuel_counts) {
        await tx.fuel.update({
            where: { id: fuelCount.fuel_id },
            data: {
                quantity_theory: {
                    decrement: fuelCount.stop_count - fuelCount.start_count
                }
            }
        });
    }
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
export const createDailySaleInDB = async (newDailySale: NewDailySale) => {

    const user = await checkUser(newDailySale.user_id)
    
    const existingDailySale = await checkForDuplicate(newDailySale.user_id, newDailySale.date_of_sale_start, newDailySale.date_of_sale_stop);

    if (existingDailySale) {
        throw new Error("This worker already have a saved sale in this period");
    }

    // Normalize timestamps to avoid unwanted precision differences by remove seconds to have fix hours intervals
    newDailySale.date_of_sale_start.setSeconds(0);
    newDailySale.date_of_sale_stop.setSeconds(0);

    return await prisma.$transaction(async (tx) => {
        let savedDailySale = {}
        if (newDailySale.fuel_counts && newDailySale.fuel_counts.length > 0) {
            // Create Daily Sale and FuelCounts
            savedDailySale = await tx.dailySale.create({
                data: {
                    amount_sold: newDailySale.amount_sold,
                    amount_given: newDailySale.amount_given,
                    date_of_sale_start: newDailySale.date_of_sale_start,
                    date_of_sale_stop: newDailySale.date_of_sale_stop,
                    fuel_counts: { createMany: { data: newDailySale.fuel_counts } },
                    user: { connect: { id: user.id } }
                },
                include: { fuel_counts: true }
            });

            // Update Fuel quantities based on the recorded FuelCounts
            await updateFuelQuantity(tx, newDailySale.fuel_counts)

        } else {
            savedDailySale = await tx.dailySale.create({
                data: {
                    amount_sold: newDailySale.amount_sold,
                    amount_given: newDailySale.amount_given,
                    date_of_sale_start: newDailySale.date_of_sale_start,
                    date_of_sale_stop: newDailySale.date_of_sale_stop,
                    user: { connect: { id: user.id } }
                },
                include: { fuel_counts: true }
            });
        }
        return savedDailySale;
    });
}

export const updateDailySaleInDB = async (dailySaleToUpdate: DailySale) => {

    const user = await checkUser(dailySaleToUpdate.user_id)
    
    const existingDailySale = await checkForDuplicate(dailySaleToUpdate.user_id, dailySaleToUpdate.date_of_sale_start, dailySaleToUpdate.date_of_sale_stop);

    if (!existingDailySale) {
        throw new Error("There is no daily sale for this period for this user");
    }

    return await prisma.$transaction(async (tx) => {
        let updatedDailySale = {}
        if (dailySaleToUpdate.fuel_counts && dailySaleToUpdate.fuel_counts.length > 0) {
            // Create Daily Sale and FuelCounts
            updatedDailySale = await tx.dailySale.update({
                where: {id: dailySaleToUpdate.id},
                data: {
                    amount_sold: dailySaleToUpdate.amount_sold,
                    amount_given: dailySaleToUpdate.amount_given,
                    date_of_sale_start: dailySaleToUpdate.date_of_sale_start,
                    date_of_sale_stop: dailySaleToUpdate.date_of_sale_stop,
                    fuel_counts: { createMany: { data: dailySaleToUpdate.fuel_counts } },
                    user: { connect: { id: user.id } }
                },
                include: { fuel_counts: true }
            });

            // Update Fuel quantities based on the recorded FuelCounts
            await updateFuelQuantity(tx, dailySaleToUpdate.fuel_counts)

            // // only update fuel counts if they have changed
            // if (existingDailySale.fuel_counts) {
            //     for (let i = 0; i < existingDailySale.fuel_counts.length; i++) {
            //         if ((existingDailySale.fuel_counts[i].start_count !== dailySaleToUpdate.fuel_counts[i].start_count) || 
            //             (existingDailySale.fuel_counts[i].stop_count !== dailySaleToUpdate.fuel_counts[i].stop_count)) {
            //                 await updateFuelQuantity(tx, dailySaleToUpdate.fuel_counts)
            //         }
            //     }
            // }
            

        } else {
            updatedDailySale = await tx.dailySale.update({
                where: {id: dailySaleToUpdate.id},
                data: {
                    amount_sold: dailySaleToUpdate.amount_sold,
                    amount_given: dailySaleToUpdate.amount_given,
                    date_of_sale_start: dailySaleToUpdate.date_of_sale_start,
                    date_of_sale_stop: dailySaleToUpdate.date_of_sale_stop,
                    user: { connect: { id: user.id } }
                },
                include: { fuel_counts: true }
            });
        }
        return updatedDailySale;
    });
}

export const deleteDailySaleInDB = async (dailySaleToDelete: DailySale) => {

    await checkUser(dailySaleToDelete.user_id)
    
    const existingDailySale = await checkForDuplicate(dailySaleToDelete.user_id, dailySaleToDelete.date_of_sale_start, dailySaleToDelete.date_of_sale_stop);

    if (!existingDailySale) {
        throw new Error("There is no daily sale for delete for this period for this user");
    }

    return await prisma.$transaction(async (tx) => {
         const deletedDailySale = await tx.dailySale.delete({
                where: {id: dailySaleToDelete.id},
            });                    
        return deletedDailySale;
    });
}