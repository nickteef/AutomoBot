import * as React from "react";

const MenuItem = ({ text, className }) => (
  <div className={`mt-10 ${className}`}>{text}</div>
);

const IconSwitch = ({ iconSrc }) => (
  <div className="flex flex-col justify-center items-start py-1 mt-8 bg-gray-200 rounded-3xl">
    <div className="shrink-0 bg-white rounded-full h-[22px] w-[22px]" />
  </div>
);

function Settings() {
  return (
    <div className="flex flex-col pb-10 mx-auto w-full bg-gray-200 max-w-[480px]">
      <header className="flex gap-3.5 items-start px-16 py-16 text-2xl font-medium tracking-wider text-white whitespace-nowrap rounded-none bg-blue-950">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/29ea2bb94d302983dedfff9fb4b3324a60d150a2d5b2bd785c45e34d3da6a518?apiKey=9a85d5b5448742b884d073283514b2d2&" alt="" className="shrink-0 aspect-square w-[43px]" />
        <div className="flex-auto mt-5">Settings</div>
      </header>
      <main className="flex z-10 flex-col self-center px-6 pt-5 pb-20 mt-0 w-full bg-white rounded-2xl shadow-sm max-w-[379px]">
        <section className="flex gap-2 text-lg text-black">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/99d86d09b530d85f37260e12e7b4a1adf96c1955c718d35f6a02b0b94d5a8789?apiKey=9a85d5b5448742b884d073283514b2d2&" alt="" className="shrink-0 aspect-square w-[52px]" />
          <div className="flex-auto my-auto">Connected to ******************</div>
        </section>
        <section className="mt-11 text-lg text-zinc-400">App Settings</section>
        <div className="flex gap-5 justify-between mt-8">
          <section className="flex flex-col mt-1.5 text-lg text-black">
            <div>Language</div>
            <MenuItem text="Change the connection" />
            <MenuItem text="Incognito mode" />
            <MenuItem text="Dark mode" className="mt-11" />
            <div className="mt-16 text-zinc-400">More</div>
            <MenuItem text="About us" />
            <MenuItem text="Privacy policy" />
            <MenuItem text="Terms and conditions" />
          </section>
          <aside className="flex flex-col">
            <div className="flex flex-col items-start pl-8">
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/6f1efc86d8ccd4e4be692fbeaa1e36e491668187e8ba5164b65bea23d91814fb?apiKey=9a85d5b5448742b884d073283514b2d2&" alt="" className="w-6 aspect-square" />
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/6f1efc86d8ccd4e4be692fbeaa1e36e491668187e8ba5164b65bea23d91814fb?apiKey=9a85d5b5448742b884d073283514b2d2&" alt="" className="mt-8 w-6 aspect-square" />
            </div>
            <IconSwitch />
            <IconSwitch />
            <div className="flex flex-col items-start pl-8 mt-24">
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/6f1efc86d8ccd4e4be692fbeaa1e36e491668187e8ba5164b65bea23d91814fb?apiKey=9a85d5b5448742b884d073283514b2d2&" alt="" className="w-6 aspect-square" />
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/6f1efc86d8ccd4e4be692fbeaa1e36e491668187e8ba5164b65bea23d91814fb?apiKey=9a85d5b5448742b884d073283514b2d2&" alt="" className="mt-8 w-6 aspect-square" />
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/6f1efc86d8ccd4e4be692fbeaa1e36e491668187e8ba5164b65bea23d91814fb?apiKey=9a85d5b5448742b884d073283514b2d2&" alt="" className="mt-8 w-6 aspect-square" />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Settings;