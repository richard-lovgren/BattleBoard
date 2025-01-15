import ButtonData from "@/models/component-props/button-data";

export default function SearchToggleButton(data: ButtonData) {
  
  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    data.handleOnClick();
  }

  const buttonClasses = `appearance-none group flex items-center shadow-sm rounded-full h-7 w-16 p-1 hover:cursor-pointer transition-all ease-in-out duration-200 ${
    data.isOn ? ' bg-white shadow-white hover:bg-slate-300' : 'justify-start bg-buttonprimary shadow-buttonprimary hover:bg-buttonprimaryhover'
  }`;

  const divClasses = `h-6 w-6 rounded-full transition-all ease-in-out duration-200 transform ${
    data.isOn ? 'translate-x-8 bg-buttonprimary group-hover:bg-buttonprimaryhover' : 'translate-x-0 bg-white group-hover:bg-slate-300'
  }`;

  return (
    <button className={buttonClasses} onClick={handleClick}>
      <div className={divClasses}></div>
    </button>
  );
}