import './createCompetition.css'
import SearchToggleButton from '@/components/search/search-toggle-btn'
import SearchListItem from '@/components/search/search-list-item'

export default function CreateCompetition() {
  return (
    <div className='bg-background flex flex-col items-center'>
      <main className='flex-auto item font-odibee text-9xl'>
        <div className='createWrapper'>
          <div className='text-6xl'>
            Create a competition
            <hr />
          </div>

          <div className='createGroupTwoCols'>
            <div className='createGroup'>
              <div className='text-5xl '>Title</div>
              <div className='search-bar flex items-center rounded-full border-solid border-[5px] h-[50px] w-[30vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50'>
                <input className=' text-3xl text-left w-full'></input>
              </div>
            </div>
            <div className='createGroup'>
              <div className='text-5xl'>Date</div>
              <div className='search-bar flex items-center rounded-full border-solid border-[5px] h-[50px] w-[30vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50'>
                <input className=' text-3xl text-left w-full'></input>
              </div>
            </div>
          </div>

          <div className='createGroup'>
              <div className='text-5xl '>Description</div>
              <div className='search-bar flex items-center rounded-3xl border-solid border-[5px] h-[150px] w-[62vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50'>
                <input className=' text-3xl text-left w-full'></input>
              </div>
            </div>

          <div className='createGroup'>
            <div className='text-5xl'>Add a cover image</div>
            <button className='uploadButton font-nunito'>Upload image</button>
          </div>

          <div className='createGroup'>
            <div className='text-5xl'>Settings</div>
            

          </div>

          <div className='createGroup'>
            <div className='text-5xl'>Invite community members</div>
            <div className='search-bar flex items-center rounded-full border-solid border-[5px] h-[50px] w-[50vw] py-8 pl-4 pr-8 shadow-lg shadow-indigo-500/50'>
              <input className=' text-3xl text-left w-full'></input>
            </div>
          </div>

          <button className='createButton font-nunito'>Save</button>
        </div>
      </main>
    </div>
  )
}
