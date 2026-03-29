import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { useBranding } from '../Context/BrandingContext';


function Navbar() {
    const [isOpen, setOpen] = useState(false);
    const navigate = useNavigate();
    const { auth, logout } = useContext(AuthContext);
    const { brandData } = useBranding();


    /* useEffect(() => {
        const handleReload = () => {
            if (auth) {
                navigate('/HomePage')
            } else {
                navigate("/register")
            }
        }

        handleReload()
    }, [auth]) */

    const handleStart = () => {
        if (auth) {
            navigate('/HomePage')
        } else {
            navigate("/register")
        }
    }

    const Data = [
        {
            name: "Home",
            url: "/",
            status: true,
            isExternal: false
        },
        {
            name: "Get Started",
            url: "/get-started",
            status: true,
            isExternal: false
        },
        {
            name: "Emergency Map",
            url: "/emergency-map",
            status: true,
            isExternal: false
        },
        {
            name: "About",
            url: "/about",
            status: true,
            isExternal: false
        },
        {
            name: "Shop",
            url: "/shop",
            status: true,
            isExternal: false
        },
        {
            name: "Free Checklist",
            url: "/get-started",
            status: true,
            isExternal: false
        },
        {
            name: "FAQ",
            url: "/faq",
            status: true,
            isExternal: false
        },
        {
            name: "Self Defence",
            url: "/self-defence",
            status: true,
            isExternal: false
        },
        {
            name: "Contact Us",
            url: "/contact-us",
            status: true,
            isExternal: false
        }
    ]

    const handleNavbar = () => {
        setOpen(!isOpen);
    };

    const handleLogout = async () => {
        const res = await logout();
        if (res) navigate("/login")

    };

    return (
        <nav className="sticky top-0 z-[120] w-full bg-white/90 backdrop-blur-md border-b border-rose-100">
            <div className='w-full p-1 flex items-center justify-between shadow-[rgba(7,_65,_210,_0.06)_0px_4px_17px] md:p-3'>
                <div className='w-[40%] p-2 flex items-center gap-2'>
                    {brandData.logo.image ? (
                        <div className='rounded-xl border border-rose-100 bg-white/85 px-2 py-1 shadow-sm'>
                            <img
                                src={brandData.logo.image}
                                alt={brandData.name}
                                className='h-12 w-auto object-contain drop-shadow-sm md:h-14'
                            />
                        </div>
                    ) : (
                        <h1 className='text-xl font-bold text-gray-800'>{brandData.name}</h1>
                    )}
                </div>

                <div className='hidden w-[60%] p-2 md:flex items-center gap-6'>
                    {Data.map((item, index) => (
                        item.status ? (
                            item.isExternal ? (
                                <a 
                                    key={index} 
                                    className='text-gray-600 font-semibold hover:text-pink-600 transition-colors duration-300 text-sm' 
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.name}
                                </a>
                            ) : (
                                <Link 
                                    key={index} 
                                    className='text-gray-600 font-semibold hover:text-pink-600 transition-colors duration-300 text-sm' 
                                    to={item.url}
                                >
                                    {item.name}
                                </Link>
                            )
                        ) : null
                    ))}
                </div>

                <div className=' w-[30%] p-2 flex items-center justify-end gap-3'>
                    {auth && <button className='hidden md:block px-6 py-2 text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-bold hover:shadow-lg transition-all duration-300'
                        onClick={handleLogout}>
                        Logout
                    </button>}
                    {!auth && <button className='hidden md:block px-6 py-2 text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-bold hover:shadow-lg transition-all duration-300'
                        onClick={handleStart}>
                        Get Started
                    </button>}

                    <button
                        className="relative w-10 h-10 focus:outline-none md:hidden"
                        onClick={handleNavbar}
                        aria-label="Toggle menu"
                        aria-expanded={isOpen}
                    >
                        <div className="absolute w-6 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                            <span
                                className={`absolute h-0.5 w-6 bg-black  transform transition duration-300 ease-in-out ${isOpen ? 'rotate-45 delay-200' : '-translate-y-1.5'
                                    }`}
                            ></span>
                            <span
                                className={`absolute h-0.5 bg-black  transform transition-all duration-200 ease-in-out ${isOpen ? 'w-0 opacity-50' : 'w-6 delay-200 opacity-100'
                                    }`}
                            ></span>
                            <span
                                className={`absolute h-0.5 w-6 bg-black  transform transition duration-300 ease-in-out ${isOpen ? '-rotate-45 delay-200' : 'translate-y-1.5'
                                    }`}
                            ></span>
                        </div>
                    </button>
                </div>
            </div>

            <div className={`absolute w-full bg-white shadow-lg md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
                }`}>
                <div className='flex flex-col space-y-4 p-4'>
                    {Data.map((item, index) => (
                        item.status ? (
                            item.isExternal ? (
                                <a 
                                    key={index} 
                                    className='text-gray-600 font-semibold hover:text-pink-600 transition-colors duration-300 text-sm z-50 block' 
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.name}
                                </a>
                            ) : (
                                <Link 
                                    key={index} 
                                    className='text-gray-600 font-semibold hover:text-pink-600 transition-colors duration-300 text-sm z-50 block' 
                                    to={item.url}
                                    onClick={() => setOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            )
                        ) : null
                    ))}

                    {auth && <button className='w-full py-2 text-white bg-black rounded-lg font-bold font-mono hover:bg-gray-800 transition-colors duration-300 z-50'
                        onClick={() => {
                            setOpen(false)
                            handleLogout()
                        }}>
                        Logout
                    </button>}
                    {!auth && <button className='w-full py-2 text-white bg-black rounded-lg font-bold font-mono hover:bg-gray-800 transition-colors duration-300 z-50'
                        onClick={() => {
                            setOpen(false)
                            handleStart()
                        }}>
                        Get Started
                    </button>}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;