import { PrismaClient } from '@prisma/client';
import { NewDailySale, NewFuelCount } from '../../types';

const prisma = new PrismaClient();

/**
 * Checks if a user already has a recorded sale in the given time range.
 */
const checkForDuplicate = async (userId: string, startDate: Date, stopDate: Date) => {
    return await prisma.dailySale.findFirst({
        where: {
            user_id: userId,
            OR: [
                {
                    date_of_sale_start: { lte: startDate },
                    date_of_sale_stop: { gte: stopDate }
                }
            ]
        }
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

/**
 * 
 * @param newDailySale a new validated daily sale to be saved in the db
 * @returns the new saved record
 */
export const createDailySale = async (newDailySale: NewDailySale) => {

    const user = await prisma.user.findUnique({
        where: { id: newDailySale.user_id }
    });

    if (!user) {
        throw new Error("This worker couldn't be found");
    }

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