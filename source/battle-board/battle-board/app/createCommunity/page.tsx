"use client";

import './createCommunity.css';

export default function CreateCommunity() {

  const redirectToDiscord = () => {
    const user_profile_url = window.location.href.replace("createCommunity", "createCommunity/fetchCreatedCommunity");
    const bot_url = "https://discord.com/oauth2/authorize?client_id=1308029231342555136&permissions=18136036801537&integration_type=0&scope=bot" + "&redirect_uri=" + encodeURIComponent(user_profile_url) + "&response_type=code";
    window.location.href = bot_url;
  };

  return (
    <div className='bg-background flex flex-col items-center'>
      <main className='flex-auto item font-odibee text-9xl'>
        <div className='createWrapper'>

          <div className='createGroup'>
            <div className='text-3xl'>Add a cover image</div>
            <button className='uploadButton font-nunito'>
              Upload image
            </button>
          </div>

          <div className='createGroup'>
            <button 
              className='uploadButton font-nunito' 
              onClick={() => redirectToDiscord()}
            >
              Link with Discord server
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}