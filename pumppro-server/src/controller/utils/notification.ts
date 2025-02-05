import { PrismaClient, Product, Role } from "@prisma/client";

const prisma = new PrismaClient();

export const createNotificationForAdmins = async (product: Product) => {
	const adminUsers = await prisma.user.findMany({
		where: { role: Role.ADMIN }
	});

	await prisma.messageNotification.create({
		data: {
			title: `Insuficient stock: ${product.name}`,
			message: `Product ${product.name} is running low on stock remaining only ${product.quantity}. Please order more!`,
			read: false,
			users: { connect: adminUsers.map(u => ({ id: u.id })) }
		}
	});
};
