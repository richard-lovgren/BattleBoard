import ButtonData from "@/models/button-data";
import { Dispatch, SetStateAction } from "react";

export default function SearchToggleButton(data: ButtonData) {
    function handleClick(e : any) {
      e.preventDefault();
      data.handleOnClick();
    }

    return (
      <>
        {
          data.isOn ? (
            <button 
              className="flex items-center justify-end appearance-none bg-white shadow-sm shadow-white rounded-full h-8 w-20 p-1 ease-in-out"
              onClick={handleClick}
            >
              <div 
                className="appearence-none h-7 w-7 rounded-full bg-buttonprimary hover:bg-buttonprimaryhover hover:cursor-pointer ease-in-out"
                >
                </div>  
            </button>
          ) : (

            <button 
              className="appearence-none flex items-center justify-start appearance-none bg-buttonprimary shadow-sm shadow-buttonprimary rounded-full h-8 w-20 p-1 ease-in-out"
              onClick={handleClick}
            >
              <div className="h-7 w-7 rounded-full bg-white hover:bg-slate-300 hover:cursor-pointer ease-in-out"
              >
              </div>
            </button>
          )
        }
      </>
    );
}