'use server'

import { prisma } from '../prisma/lib/prisma'

export async function getAllInstructors() {
    try {
        // ПРОСТО Ищем пользователей с ролью ADMIN или MENTOR
        // ИЛИ тех у кого есть хотя бы один курс (любого статуса)
        const instructors = await prisma.user.findMany({
            where: {
                OR: [
                    { role: 'ADMIN' },
                    { role: 'MENTOR' },
                    {
                        authoredCourses: {
                            some: {} // Есть хотя бы один курс
                        }
                    }
                ]
            },
            include: {
                _count: {
                    select: {
                        authoredCourses: true
                    }
                },
                settings: {
                    select: {
                        company: true,
                        occupation: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return instructors;
    } catch (error) {
        console.error('Error getting instructors:', error);
        return [];
    }
}

export async function getInstructorById(id: string) {
    try {
        if (!id) return null;

        const instructor = await prisma.user.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        authoredCourses: true
                    }
                },
                authoredCourses: {
                    take: 3,
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        thumbnailUrl: true,
                        averageRating: true,
                        totalStudents: true
                    }
                },
                settings: {
                    select: {
                        location: true,
                        company: true,
                        website: true,
                    }
                }
            }
        });

        return instructor;
    } catch (error) {
        console.error('Error fetching instructor:', error);
        return null;
    }
}

export async function getInstructorStats(instructorId: string) {
    try {
        const courses = await prisma.course.findMany({
            where: { instructorId },
            select: {
                totalStudents: true,
                totalReviews: true
            }
        });

        const totalStudents = courses.reduce((sum, course) => sum + course.totalStudents, 0);
        const totalReviews = courses.reduce((sum, course) => sum + course.totalReviews, 0);
        const totalCourses = courses.length;

        return {
            totalStudents,
            totalReviews,
            totalCourses,
            averageRating: 4.8 // Пока статическое значение
        };
    } catch (error) {
        return {
            totalStudents: 0,
            totalReviews: 0,
            totalCourses: 0,
            averageRating: 0
        };
    }
}

export async function getInstructorCourses(instructorId: string) {
    try {
        const courses = await prisma.course.findMany({
            where: { instructorId },
            include: {
                _count: {
                    select: {
                        enrollments: true
                    }
                }
            },
            take: 6
        });

        return courses;
    } catch (error) {
        return [];
    }
}