import { DailySalesSummary, Prisma, Sale, SaleDetail } from "@prisma/client";
import prisma from "../../../client";

export const getAllDailySales = async (): Promise<DailySalesSummary[]> => {
    return await prisma.dailySalesSummary.findMany({
        select: {
            id: true,
            user_id: true,
            amount_sold: true,
            amount_given: true,
            date_of_sale_start: true,
            date_of_sale_stop: true,
            user: true,
            created_at: true,
            updated_at: true
        },
    });
}

export const getAllSales = async (): Promise<Sale[]> => {
    return await prisma.sale.findMany({
        select: {
            id: true,
            user_id: true,
            total: true,
            user: true,
            sale_details: true,
            created_at: true,
            updated_at: true
        },
    });
}

export const getAllSalesDetails = async (): Promise<SaleDetail[]> => {
    return await prisma.saleDetail.findMany({
        select: {
            id: true,
            sale_id: true,
            product: true,
            product_id: true,
            quantity: true,
            unit_price: true,
            created_at: true,
            updated_at: true
        },
    });
}

export const getDailySaleFromID = async (id: number): Promise<DailySalesSummary | null> => {
    return await prisma.dailySalesSummary.findUnique({where: {id: id},
        select: {
            id: true,
            user_id: true,
            amount_sold: true,
            amount_given: true,
            date_of_sale_start: true,
            date_of_sale_stop: true,
            user: true,
            created_at: true,
            updated_at: true
        },
    });
}