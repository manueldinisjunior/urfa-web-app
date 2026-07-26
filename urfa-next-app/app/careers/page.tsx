import React from 'react';
import { useEffect, useState } from 'react';
import { fetchJobOpenings } from '../../lib/cms';

const CareersPage = () => {
  const [jobOpenings, setJobOpenings] = useState([]);

  useEffect(() => {
    const getJobOpenings = async () => {
      const openings = await fetchJobOpenings();
      setJobOpenings(openings);
    };

    getJobOpenings();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Careers</h1>
      <p className="mb-4">Join our team and help us create amazing experiences!</p>
      <ul className="space-y-4">
        {jobOpenings.map((job) => (
          <li key={job.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p>{job.description}</p>
            <a href={job.applyLink} className="text-blue-500 hover:underline">
              Apply Now
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CareersPage;