import SettingsNav from "@/components/SettingsNav";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-8 -my-8 flex">
      <SettingsNav />
      <div className="flex-1 px-8 py-8 max-w-5xl">{children}</div>
    </div>
  );
}
