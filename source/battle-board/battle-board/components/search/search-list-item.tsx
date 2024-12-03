export default function SearchListItem() {

    return (
    <div className="flex flex-none flex-col h-[420px] w-[329px] rounded-[2.5rem] bg-gradient-to-br from-[#4E35BE] to-[#241958]">
        <div className="flex items-center justify-center rounded-t-[2.5rem] bg-[#D9D9D9] h-[173px] ">
            <img src="/image.svg" alt="image-placeholder" className="fit" />    
        </div>
        <div className="item-container flex flex-col text-[16px] font-outfit p-4">
            <div className="flex flex-col ml-3 mb-3">
                <span className="flex items-center text-[24px] mb-4">
                    Title of competiton
                </span>
                <span className="flex items-center">
                    <img src="/controller.svg" alt="search" className="h-12 w-12 my-[-5px]" />
                    Leauge of legends
                </span>
                <span className="flex items-center">
                    <img src="/customer.svg" alt="search" className="h-12 w-12 my-[-5px]" />
                    10 participants
                </span>
                <span className="flex items-center">
                    <img src="/calendar.svg" alt="search" className="h-12 w-12 my-[-5px]" />
                    10 december 2024
                </span>
            </div>
            <div className="flex items-center justify-center">
                <button className=" appearance-none flex bg-buttonprimary h-10 w-36 rounded-xl items-center justify-center hover:bg-buttonprimaryhover">
                    View
                </button>
            </div>
        </div>
    </div>
    );
}