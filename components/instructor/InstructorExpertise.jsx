'use client';

import { CheckCircle } from 'lucide-react';

export default function InstructorExpertise({ expertise }) {
    const expertiseAreas = [
        'User Experience (UX) Design',
        'User Interface (UI) Design',
        'Information Architecture',
        'Interaction Design',
        'Visual Design',
        'Usability Testing',
        'Wireframing and Prototyping',
        'Design Thinking',
        'Frontend Development',
        'Responsive Design'
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Areas of Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {expertiseAreas.map((area, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{area}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}