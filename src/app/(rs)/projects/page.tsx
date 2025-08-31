"use client";

import ProjectForm from "@/app/(rs)/projects/form/ProjectForm";
import ProjectsDisplay from "@/app/(rs)/projects/form/ProjectsDisplay";

export default function Projects() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Form: takes top half */}
      <div className="flex-1 p-8 overflow-auto">
        <ProjectForm />
      </div>

      {/* ProjectsDisplay: takes bottom half */}
      <div className="flex-1 p-8 bg-black text-white overflow-auto">
        <ProjectsDisplay />
      </div>
    </div>
  );
}
