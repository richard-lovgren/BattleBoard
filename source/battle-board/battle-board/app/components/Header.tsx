export default function Header() {
  return (
    <header className="h-28 flex flex-row items-center justify-between px-10">
      <img src="/logo.svg" alt="logo" className=" justify-self-start" />
      <div className="flex flex-row gap-4">
        <button className="text-white py-2 px-4 rounded-xl border-[#4E35BE] border-2">
          Log in
        </button>
        <button className="bg-[#4E35BE] text-white py-2 px-4 rounded-xl">
          Sign up
        </button>
      </div>
    </header>
  );
}
