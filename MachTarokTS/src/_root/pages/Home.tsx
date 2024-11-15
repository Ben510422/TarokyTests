import React from 'react'

const Home = () => {
    return (
        <div className='flex flex-col justify-start w-full h-full'>
            <img src="/assets/tarok-cards.jpg" className="m-0"></img>
            <div className="flex flex-col justify-start mt-20 mb-40 w-full m:w-4/5 xl:w-3/4">
                <h1 className="flex h1-bold w-full text-center">Welcome to Mach Tarok</h1>
                <h2 className="flex h2-bold w-full text-center">play Tarok online</h2>
                <div className="w-40 h-12 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out flex items-center justify-center">
                    <p className="m-0">Play</p>
                </div>

            </div>
        </div>
    )
}

export default Home