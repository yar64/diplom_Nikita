'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/lib/prisma';
import { z } from 'zod';
import { cookies } from 'next/headers';

// Схема валидации регистрации
const registerSchema = z.object({
    firstName: z.string().min(1, 'Имя обязательно'),
    lastName: z.string().min(1, 'Фамилия обязательна'),
    username: z.string().min(3, 'Имя пользователя должно быть не менее 3 символов'),
    email: z.string().email('Некорректный email адрес'),
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
});

// Схема валидации входа
const loginSchema = z.object({
    email: z.string().min(1, 'Email или имя пользователя обязательно'),
    password: z.string().min(1, 'Пароль обязателен'),
});

export async function registerUser(formData: FormData) {
    try {
        // Получаем данные из FormData
        const rawData = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            username: formData.get('username') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string,
        };

        // Валидация
        const validatedData = registerSchema.parse(rawData);

        // Проверка существующего пользователя
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: validatedData.email },
                    { username: validatedData.username }
                ]
            }
        });

        if (existingUser) {
            return {
                success: false,
                errors: {
                    general: 'Пользователь с таким email или именем уже существует'
                }
            };
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Создание пользователя
        const user = await prisma.user.create({
            data: {
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                username: validatedData.username,
                email: validatedData.email,
                password: hashedPassword,
                role: 'USER',
                profile: {
                    create: {
                        bio: '',
                        avatar: '',
                        socialLinks: {},
                    }
                },
                settings: {
                    create: {
                        emailNotifications: true,
                        pushNotifications: true,
                        privacyLevel: 'PUBLIC',
                    }
                },
                stats: {
                    create: {
                        totalStudyTime: 0,
                        completedCourses: 0,
                        completedProjects: 0,
                        skillPoints: 0,
                    }
                }
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
            }
        });

        // Создаем сессию (без JWT, используем базу данных)
        const sessionToken = await createSession(user.id);

        return {
            success: true,
            user,
            redirect: '/dashboard'
        };

    } catch (error) {
        console.error('Ошибка регистрации:', error);

        if (error instanceof z.ZodError) {
            const errors: Record<string, string> = {};
            error.errors.forEach((err) => {
                if (err.path) {
                    errors[err.path[0]] = err.message;
                }
            });
            return { success: false, errors };
        }

        return {
            success: false,
            errors: {
                general: 'Произошла ошибка при регистрации'
            }
        };
    }
}

export async function loginUser(formData: FormData) {
    try {
        const rawData = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        };

        // Валидация
        const validatedData = loginSchema.parse(rawData);

        // Поиск пользователя
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: validatedData.email },
                    { username: validatedData.email }
                ]
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                password: true,
                role: true,
            }
        });

        if (!user) {
            return {
                success: false,
                errors: {
                    general: 'Неверный email или пароль'
                }
            };
        }

        // Проверка пароля
        const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

        if (!isPasswordValid) {
            return {
                success: false,
                errors: {
                    general: 'Неверный email или пароль'
                }
            };
        }

        // Создаем сессию
        const sessionToken = await createSession(user.id);

        // Обновляем последний вход
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        const { password, ...userWithoutPassword } = user;

        return {
            success: true,
            user: userWithoutPassword,
            redirect: '/dashboard'
        };

    } catch (error) {
        console.error('Ошибка входа:', error);

        if (error instanceof z.ZodError) {
            const errors: Record<string, string> = {};
            error.errors.forEach((err) => {
                if (err.path) {
                    errors[err.path[0]] = err.message;
                }
            });
            return { success: false, errors };
        }

        return {
            success: false,
            errors: {
                general: 'Произошла ошибка при входе'
            }
        };
    }
}

export async function logoutUser() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session_token')?.value;

        if (sessionToken) {
            // Удаляем сессию из базы данных
            await prisma.session.deleteMany({
                where: { token: sessionToken }
            });
        }

        // Удаляем cookie
        cookieStore.delete('session_token');

        return {
            success: true,
            redirect: '/login'
        };
    } catch (error) {
        console.error('Ошибка выхода:', error);
        return {
            success: false,
            errors: {
                general: 'Произошла ошибка при выходе'
            }
        };
    }
}

// Вспомогательная функция создания сессии
async function createSession(userId: string) {
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 дней

    await prisma.session.create({
        data: {
            token: sessionToken,
            userId,
            expiresAt,
        }
    });

    // Устанавливаем cookie
    const cookieStore = await cookies();
    cookieStore.set('session_token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
        path: '/',
    });

    return sessionToken;
}

// Проверка текущей сессии
export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session_token')?.value;

        if (!sessionToken) return null;

        const session = await prisma.session.findUnique({
            where: { token: sessionToken },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                        profile: true,
                        stats: true,
                    }
                }
            }
        });

        if (!session || session.expiresAt < new Date()) {
            return null;
        }

        return session.user;
    } catch (error) {
        console.error('Ошибка получения пользователя:', error);
        return null;
    }
}