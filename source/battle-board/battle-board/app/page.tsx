import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className="bg-background flex flex-col">
      <Hero />
      <main className=" flex-auto font-odibee text-9xl text-center ">Main</main>
    </div>
  );
}
