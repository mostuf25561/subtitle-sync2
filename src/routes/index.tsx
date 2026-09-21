import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Empty Project" },
      { name: "description", content: "Empty project" },
      { property: "og:title", content: "Empty Project" },
      { property: "og:description", content: "Empty project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">Empty project</p>
    </div>
  );
}
