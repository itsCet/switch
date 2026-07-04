import { SpaceHeader } from "@/components/SpaceHeader";
import { SplitScheduleBanner } from "@/components/SplitScheduleBanner";
import { ContextJournal } from "@/components/ContextJournal";
import { CalendarView } from "@/components/CalendarView";
import { TemplateBank } from "@/components/TemplateBank";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10 space-y-5">
        <SpaceHeader />
        <SplitScheduleBanner />
        <ContextJournal />
        <CalendarView />
        <TemplateBank />
      </div>
    </main>
  );
}
