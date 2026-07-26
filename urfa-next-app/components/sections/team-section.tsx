import React from 'react';

const TeamSection = () => {
    const teamMembers = [
        {
            name: 'John Doe',
            role: 'CEO',
            image: '/images/team/john.jpg',
            bio: 'John is the visionary behind our brand, leading the team with passion and dedication.',
        },
        {
            name: 'Jane Smith',
            role: 'CTO',
            image: '/images/team/jane.jpg',
            bio: 'Jane oversees our technology and product development, ensuring we stay ahead of the curve.',
        },
        {
            name: 'Alice Johnson',
            role: 'Marketing Manager',
            image: '/images/team/alice.jpg',
            bio: 'Alice crafts our marketing strategies, connecting our brand with our audience.',
        },
        {
            name: 'Bob Brown',
            role: 'Head Chef',
            image: '/images/team/bob.jpg',
            bio: 'Bob brings our menu to life with his culinary expertise and creativity.',
        },
    ];

    return (
        <section className="py-16 bg-gray-100">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-8">Meet Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member) => (
                        <div key={member.name} className="bg-white rounded-lg shadow-lg p-6">
                            <img src={member.image} alt={member.name} className="w-full h-48 object-cover rounded-t-lg" />
                            <h3 className="text-xl font-semibold mt-4">{member.name}</h3>
                            <p className="text-gray-600">{member.role}</p>
                            <p className="mt-2 text-gray-500">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;