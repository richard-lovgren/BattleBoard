import { ButtonHTMLAttributes } from "react";

export default function GeneralButton({ 
  text ="Click me!", 
  type = "button", 
  ...props }: { text?: string, type?: "button" | "submit" | "reset" 
  } & ButtonHTMLAttributes<HTMLButtonElement>) 
{
  return (
    <button 
      type={type} 
      className="appearance-none flex bg-buttonprimary max-h-10 max-w-40 py-3 px-5 text-sm rounded-xl items-center justify-center hover:bg-buttonprimaryhover transition ease-in-out duration-300 font-nunito text-white"
      {...props}>
      {text}
    </button>
  );
