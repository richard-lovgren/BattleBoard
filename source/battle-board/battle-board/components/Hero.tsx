

import Image from "next/image";

export default function Hero() {
  return (
    <div className=" font-odibee text-9xl text-center flex items-center justify-center ">
      <Image src="/hero.png" alt="Hero" className=" m-0 p-0 "
        height={1100}
        width={1100}



      />
    </div>
  );
}
