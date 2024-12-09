export default function GeneralButton({text}: {text: string}) {
  return (
    <button className=" appearance-none flex bg-buttonprimary max-h-12 max-w-40 py-3 px-5 rounded-xl items-center justify-center hover:bg-buttonprimaryhover">
      {text}
    </button>
  );
}
