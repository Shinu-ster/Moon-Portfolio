"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { insertProjectSchemaType } from "@/zod-schemas/project";
import Image from "next/image";
import { X } from "lucide-react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  useSensor,
  PointerSensor,
  useSensors,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { toast } from "sonner";

export default function ProjectsDisplay() {
  const [projects, setProjects] = useState<insertProjectSchemaType[]>([]);

  useEffect(() => {
    
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => toast.error("Failed to load Projects"));

    
    const handleNewProject = (e: Event) => {
      const customEvent = e as CustomEvent<insertProjectSchemaType>;
      console.log("Event Details ", customEvent)
      setProjects((prev) => {
        if (prev.some((p) => p.id === customEvent.detail.id)) return prev;
        return [...prev, customEvent.detail];
      });
    };

    window.addEventListener("project-added", handleNewProject);
    return () => window.removeEventListener("project-added", handleNewProject);
  }, []);

  const deleteProject = async (id: number) => {
  const res = await fetch("/api/projects", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    toast.error("Failed to delete project");
    return;
  }

  setProjects((prev) => prev.filter((p) => p.id !== id));
  toast.success("Project deleted");
};


  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const id = parseInt(active.id as string);
    const dropZone = String(over.id);

    const current = projects.find((p) => p.id === id);
    if (!current) return;

    if (dropZone === "featured") {
      const featuredCount = projects.filter((p) => p.isFeatured).length;
      if (!current.isFeatured && featuredCount >= 2) {
        toast.error("Only 2 items can be featured");
        return;
      }
    }

    const newIsFeatured = dropZone === "featured";
    if (current.isFeatured === newIsFeatured) return;

    const res = await fetch("/api/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isFeatured: newIsFeatured }),
    });

    if (!res.ok) {
      const data = await res
        .json()
        .catch((err) => toast.error("Failed to fetch Projects ", err));
      toast.error(data?.error ?? "Update failed");
      return;
    }

    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: newIsFeatured } : p))
    );
    toast.success(
      newIsFeatured ? "Added to Displaying" : "Moved to All Projects"
    );
  };

  const featured = projects.filter((p) => p.isFeatured).slice(0, 2);
  const others = projects.filter((p) => !p.isFeatured);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="space-y-8">
        {/* Featured Section */}
        <DropZone id="featured" label="Displaying (MAX 2)">
          {featured.map((p) => (
            <DraggableCard
              key={p.id ?? `temp-${p.title}-${Math.random()}`}
              p={p}
              onDelete={deleteProject}
            />
          ))}
        </DropZone>

        {/* Others Section */}
        <DropZone id="others" label="All Projects">
          {others.map((p) => (
            <DraggableCard
              key={p.id ?? `temp-${p.title}-${Math.random()}`}
              p={p}
              onDelete={deleteProject}
            />
          ))}
        </DropZone>
      </div>
    </DndContext>
  );
}

function DropZone({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">{label}</h2>
      <div
        ref={setNodeRef}
        className={`flex flex-wrap gap-2 p-2 rounded-xl border-2 transition ${
          isOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function DraggableCard({
  p,
  onDelete,
}: {
  p: insertProjectSchemaType;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: p.id ? p.id.toString() : `temp-${p.title}-${Math.random()}`,
    });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`relative overflow-hidden rounded-xl shadow-md transition bg-gray-700 text-white w-40 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="relative w-full h-28">
        <Image
          src={p.imageUrl}
          alt={p.title}
          fill
          className="object-cover"
          sizes="100px"
        />
      </div>

      <CardContent className="p-2">
        <h3 className="text-sm font-semibold">{p.title}</h3>
      </CardContent>

      <Button
        size="icon"
        variant="destructive"
        className="absolute top-1 right-1 rounded-full p-1"
        onClick={() => onDelete(p.id)}
      >
        <X className="h-3 w-3" />
      </Button>
    </Card>
  );
}
