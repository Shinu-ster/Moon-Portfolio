"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ABeeZee, Quicksand } from "next/font/google";

const aBeeZee = ABeeZee({ subsets: ["latin"], weight: "400" });
const quickSand = Quicksand({ subsets: ["latin"], weight: "400" });

type Project = {
  id: number;
  title: string;
  imageUrl: string;
  isFeatured: boolean;
  type?: string; // e.g. "Website", "App Design"
};

export default function ProjectSection() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("api/projects")
      .then((res) => res.json())
      .then((data: Project[]) => {
        setProjects(data.filter((p) => p.isFeatured));
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  return (
    <section
      id="project"
      className={`min-h-screen section px-6 py-16 relative z-20 text-white snap-start ${quickSand.className}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-10">
          <Image
            src="/textimage.svg"
            alt="The Simple Easy Work Logo"
            width={120}
            height={60}
            priority
          />
          <a
            href="#portfolio"
            className="text-gray-300 hover:text-white transition"
          >
            See the Portfolio →
          </a>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col bg-transparent text-white border border-neutral-700 hover:shadow-lg transition rounded-[14px] h-[380px]"
            >
              {/* Image */}
              <div className="relative w-full h-72 overflow-hidden rounded-t-[14px] -mt-6">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center" }}
                />
              </div>

              {/* Content */}
              <CardContent className="flex-1 p-5">
                {/* Tags */}
                <div className="flex gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-pink-500/20 text-pink-400">
                    {project.type || "Project"}
                  </span>
                  {project.isFeatured && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                      Featured
                    </span>
                  )}
                </div>

                <CardTitle
                  className={`text-xl font-semibold line-clamp-2 ${aBeeZee.className}`}
                >
                  {project.title}
                </CardTitle>
              </CardContent>

              {/* Footer */}
              <CardFooter className="p-5 mt-auto">
                <a
                  href="#"
                  className="text-white hover:text-pink-400 font-medium transition"
                >
                  View detail →
                </a>
              </CardFooter>
            </Card>
          ))}

          {/* Request Card */}
          <Card className="flex flex-col justify-center items-center text-center p-6 bg-transparent text-white border border-neutral-700 rounded-[14px] h-[380px]">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">
                Couldn’t find what you need?
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Suggest a tutorial, course or video. I read and seek
                feedback/suggestion!
              </p>
              <Button
                asChild
                className="border border-white text-white rounded-full px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base bg-transparent hover:bg-white/10 transition"
              >
                <a href="mailto:sajatbazz@gmail.com">Request Now →</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
