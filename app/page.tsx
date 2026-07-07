import { SpaceHeader } from "@/components/SpaceHeader";
import { SplitScheduleBanner } from "@/components/SplitScheduleBanner";
import { ContextJournal } from "@/components/ContextJournal";
import { CalendarView } from "@/components/CalendarView";
import { PublishChecklist } from "@/components/PublishChecklist";
import { SpaceManager } from "@/components/SpaceManager";
import { AccountBar } from "@/components/AccountBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10 space-y-5">
        <AccountBar />
        <SpaceHeader />
        <SplitScheduleBanner />
        <ContextJournal />
        <CalendarView />
        <PublishChecklist />
        <SpaceManager />
      </div>
    </main>
  );
}
