import './createCommunity.css'

export default function CreateCommunity() {
  return (
    <div className='bg-background flex flex-col items-center'>
      <main className='flex-auto item font-odibee text-9xl'>
      <div className='createWrapper'>
      <div className='text-6xl'>Create a community
      <hr/>
      </div>

        <div className='createGroup'>

        

        <div className='text-5xl'>Community name</div>
        <div className='search-bar flex items-center rounded-full border-solid border-[5px] h-[50px] w-[50vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50'>
          <input className=' text-3xl text-left w-full'></input>
        </div>
        </div>

        <div className='createGroup'>
        <div className='text-5xl'>Add a cover image</div>
        <button className='uploadButton font-nunito'>
        Upload image
        </button>

        </div>

        <div className='createGroup'>


        <div className='text-5xl'>Invite community members</div>
        <div className='search-bar flex items-center rounded-full border-solid border-[5px] h-[50px] w-[50vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50'>
          <input className=' text-3xl text-left w-full'></input>
        </div>
        </div>

        <button className='createButton font-nunito'>
        Save
        </button>

        </div>
      
      </main>
    </div>
  )
}
