"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import { CldUploadButton } from "next-cloudinary";
import {
  insertProjectSchema,
  insertProjectSchemaType,
} from "@/zod-schemas/project";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function ProjectForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const defaultValues: insertProjectSchemaType = {
    id: 0,
    title: "",
    imageUrl: "",
    isFeatured: false,
  };

  const form = useForm({
    resolver: zodResolver(insertProjectSchema),
    defaultValues,
  });

  const onSubmit = async (values: insertProjectSchemaType) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("image", values.imageUrl);

      const res = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      console.log(res);
      if (!res.ok) {
        toast.error("Failed to add Projects");
        throw new Error("Failed to add project");
      }

      toast.success("Project inserted successfully");

      const newProject = await res.json();

      console.log("new Project", newProject);
      window.dispatchEvent(
        new CustomEvent("project-added", { detail: newProject })
      );

      form.reset();
      setPreviewUrl(null);
    } catch (err) {
      toast.error(`Error: Failed to add project ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter project title" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Image</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <CldUploadButton
                    uploadPreset="moon_cloudinary_app"
                    options={{ folder: "projects", sources: ["local"] }}
                    onSuccess={(result) => {
                      if (result?.event === "success") {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const url = (result.info as any).secure_url;
                        field.onChange(url);
                        setPreviewUrl(url);
                      }
                    }}
                    onError={(err) => {
                      console.error(err);
                      toast.error("Image upload failed");
                    }}
                  />

                  {/* Image preview */}
                  {previewUrl && (
                    <div className="relative w-32 h-20 rounded-md overflow-hidden border">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="flex items-center">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Uploading..." : "Add Project"}
        </Button>
      </form>
    </Form>
  );
}
