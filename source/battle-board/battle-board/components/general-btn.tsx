import { ButtonHTMLAttributes, ReactNode } from "react";

interface GeneralButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  children?: ReactNode;
}

export default function GeneralButton({
  text = "Click me!",
  type = "button",
  children,
  ...props
}: GeneralButtonProps) {
  return (
    <button
      type={type}
      className="appearance-none flex bg-buttonprimary py-2 px-5 text-sm rounded-xl items-center justify-center hover:bg-buttonprimaryhover transition ease-in-out duration-300 font-nunito text-white"
      {...props}
    >
      {text}
      {children} 
    </button>
  );
}