import Image from "next/image";

export default function Hero() {
  return (
    <div className=" font-odibee text-9xl text-center flex items-center justify-center ">
      <Image
        src="/hero.png"
        alt="Hero"
        height={1000}
        width={1000}
        style={{
          margin:'20px',
        }}
      />
    </div>
  );
}
