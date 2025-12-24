'use client';

import { ExternalLink, Github } from 'lucide-react';

export default function InstructorProjects({ projects }) {
    if (!projects || projects.length === 0) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Projects</h2>
            <div className="space-y-4">
                {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        {project.description && (
                            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-3">
                            {project.repository && (
                                <a href={project.repository} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                                    <Github className="w-4 h-4" />
                                    <span>Code</span>
                                </a>
                            )}
                            {project.demoUrl && (
                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800">
                                    <ExternalLink className="w-4 h-4" />
                                    <span>Live Demo</span>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}