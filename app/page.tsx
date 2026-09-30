import SpaceBackground from "@/components/SpaceBackground";
import CardSwitcher from "@/components/CardSwitcher";

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-10">
      <SpaceBackground />
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
          Zaman İstasyonu
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Saat, kronometre ve sayaç — tek yerde.
        </p>
      </div>
      <CardSwitcher />
    </main>
  );
}