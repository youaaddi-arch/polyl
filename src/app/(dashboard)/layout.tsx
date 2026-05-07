import { Sidebar } from '@/components/Sidebar';
import { AiAssistant } from '@/components/AiAssistant';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-ink-50/40">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>
      <AiAssistant />
    </div>
  );
}
