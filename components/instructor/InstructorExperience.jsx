'use client';

import { Briefcase, Calendar, Building } from 'lucide-react';

export default function InstructorExperience({ instructorId }) {
    const experiences = [
        {
            company: "Tech Solutions Inc.",
            role: "Senior UX/UI Designer & Instructor",
            period: "2018 - Present",
            description: "Lead design team for enterprise applications and mentor junior designers. Created over 50 courses on design principles."
        },
        {
            company: "Creative Agency Co.",
            role: "Lead UI Designer",
            period: "2015 - 2018",
            description: "Designed interfaces for mobile and web applications used by millions of users. Conducted design workshops."
        },
        {
            company: "Digital Innovation Lab",
            role: "Product Designer",
            period: "2013 - 2015",
            description: "Built design systems from scratch for startup products. Started teaching design fundamentals online."
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Professional Experience</h2>

            <div className="space-y-6">
                {experiences.map((exp, index) => (
                    <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Building className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {exp.period}
                                </span>
                            </div>

                            <div className="flex items-center mt-1 space-x-2 text-gray-600">
                                <Briefcase className="w-4 h-4" />
                                <span>{exp.company}</span>
                            </div>

                            <p className="mt-2 text-gray-600">{exp.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}