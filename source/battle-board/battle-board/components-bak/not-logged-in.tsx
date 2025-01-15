export default function NotLoggedIn() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="text-4xl text-white textshadow font-nunito">You are not logged in</div>
            <div className="text-2xl text-white textshadow font-nunito">Please log in to create Competitions/Communities</div>
        </div>
    );
}