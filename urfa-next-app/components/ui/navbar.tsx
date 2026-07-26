import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                    </div>
                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex-shrink-0">
                            <Link href="/" className="text-xl font-bold text-gray-900">
                                BrandName
                            </Link>
                        </div>
                        <div className="hidden sm:block sm:ml-6">
                            <div className="flex space-x-4">
                                <Link href="/" className="text-gray-900 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                                    Home
                                </Link>
                                <Link href="/about" className="text-gray-900 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                                    About
                                </Link>
                                <Link href="/menu" className="text-gray-900 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                                    Menu
                                </Link>
                                <Link href="/contact" className="text-gray-900 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                                    Contact
                                </Link>
                                <Link href="/careers" className="text-gray-900 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                                    Careers
                                </Link>
                                <Link href="/faq" className="text-gray-900 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                                    FAQ
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;