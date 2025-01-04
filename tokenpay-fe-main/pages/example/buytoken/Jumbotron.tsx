import React from "react";

const Jumbotron: React.FC = () => {
  return (
    <div className="relative bg-gray-900 text-white h-screen flex items-center justify-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage: `url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhDauO-C1vdx6SLqHBm9sH-XscdkXiyZ_O_JJelpF3QHweEFtt7leMgJcVoGE49TYgPilpGUhDM31bCba9VPnW_uN0LRnkZiANqs1CPB15uYwNGoAymhvwvMhSZA-SBz2JYdsNA9GKC8X1EfpuLj8CUmsSikpkoIvy3R3BnAnGEsXpHFKNbkBldvzzCHvU/s16000/Check%20in%20Asrama%20Telkom%20University%20Bandung%20(3).jpg')`,
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-center p-6">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Selamat Datang di Tokenpay
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Tempat pebelian token listrik hijau dari energi listrik terbarukan.
        </p>
        <div className="mt-6 space-x-4">
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg">
            Ayo mulai beli..
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-lg">
            Pelajari lebih lanjut...
          </button>
        </div>
      </div>
    </div>
  );
};

export default Jumbotron;
