import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className="bg-[#0E0030] flex flex-col">
      <Hero />
      <main className=" flex-auto font-odibee">Main</main>
    </div>
  );
}
