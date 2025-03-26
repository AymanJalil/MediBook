import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  address: string;
  bio?: string;
  isActive: boolean;
}

interface DoctorsBySpecialization {
  [key: string]: Doctor[];
}

export default function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsBySpecialization, setDoctorsBySpecialization] = useState<DoctorsBySpecialization>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('All');
  const [specializations, setSpecializations] = useState<string[]>([]);
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/graphql";
  
  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (doctors.length > 0) {
      groupDoctorsBySpecialization();
    }
  }, [doctors, searchTerm]);
  
  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Using GraphQL endpoint
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              doctors {
                _id
                name
                specialization
                email
                phone
                address
                bio
                isActive
              }
            }
          `
        }),
      });
      
      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      setDoctors(result.data.doctors);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const groupDoctorsBySpecialization = () => {
    // Filter doctors based on search term
    const filteredDoctors = doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group doctors by specialization
    const grouped: DoctorsBySpecialization = {};
    const specializationSet = new Set<string>();
    
    filteredDoctors.forEach(doctor => {
      const specialization = doctor.specialization.trim();
      specializationSet.add(specialization);
      
      if (!grouped[specialization]) {
        grouped[specialization] = [];
      }
      
      grouped[specialization].push(doctor);
    });
    
    setDoctorsBySpecialization(grouped);
    setSpecializations(Array.from(specializationSet).sort());
  };

  const handleSpecializationChange = (specialization: string) => {
    setSelectedSpecialization(specialization);
  };

  const getRandomGradient = (specialization: string) => {
    // Generate a consistent color based on the specialization string
    const hash = specialization.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const h = Math.abs(hash % 360);
    const s = 70 + (hash % 20);
    const l = 60 + (hash % 15);
    
    return `linear-gradient(135deg, hsl(${h}, ${s}%, ${l}%), hsl(${(h + 40) % 360}, ${s}%, ${l - 20}%))`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const renderDoctors = () => {
    if (selectedSpecialization === 'All') {
      return (
        <>
          {specializations.map(specialization => (
            <div key={specialization} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-blue-600 border-b border-blue-100 pb-3 flex items-center gap-3">
                <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center justify-center">
                  {doctorsBySpecialization[specialization].length}
                </span>
                {specialization}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctorsBySpecialization[specialization].map(doctor => renderDoctorCard(doctor))}
              </div>
            </div>
          ))}
        </>
      );
    } else {
      return (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-blue-600 border-b border-blue-100 pb-3 flex items-center gap-3">
            <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center justify-center">
              {doctorsBySpecialization[selectedSpecialization]?.length || 0}
            </span>
            {selectedSpecialization}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctorsBySpecialization[selectedSpecialization]?.map(doctor => renderDoctorCard(doctor)) || 
              <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg">
                <div className="text-gray-500">No doctors found in this specialization.</div>
              </div>
            }
          </div>
        </div>
      );
    }
  };

  const renderDoctorCard = (doctor: Doctor) => (
    <div key={doctor._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
      <div className="p-1">
        <div className="flex items-start p-5">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 flex-shrink-0"
            style={{ background: getRandomGradient(doctor.name) }}
          >
            {getInitials(doctor.name)}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{doctor.name}</h2>
            <div className="text-blue-600 font-medium text-sm mb-1">{doctor.specialization}</div>
            
            {doctor.isActive ? (
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
            ) : (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">Inactive</span>
            )}
          </div>
        </div>
        
        <div className="px-6 pb-4">
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[4.5rem]">{doctor.bio || 'No bio available'}</p>
          
          <div className="text-gray-600 space-y-2 text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span className="tracking-wide break-all">{doctor.email}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span>{doctor.phone}</span>
            </div>
            <div className="flex items-start">
              <svg className="w-4 h-4 mr-2 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>{doctor.address}</span>
            </div>
          </div>
        </div>
        <div className="mt-auto px-6 py-3 bg-gray-50 border-t border-gray-100">
          <button className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200 text-sm font-medium">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Medi Book - Doctor Directory</title>
        <meta name="description" content="Find the right doctor for your needs with Medi Book" />
        {/* Using public path for favicon instead of relative path */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="logo-container">
              <Image 
                src="/logo.png"  // Place logo.png in public folder
                alt="Site Logo"
                width={120}
                height={50}
                priority
              />
            </div>
            <h1 className="text-5xl font-bold text-gray-800">Medi Book</h1>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Find Your Specialist</h2>
          <p className="text-blue-100 mb-6 max-w-2xl">Browse Medi Book's comprehensive directory of qualified healthcare professionals across various specializations.</p>
          
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-lg shadow-lg">
            <input
              type="text"
              placeholder="Search by name or specialization..."
              className="flex-grow p-3 rounded-lg text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select 
              className="p-3 rounded-lg text-gray-800 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSpecialization}
              onChange={(e) => handleSpecializationChange(e.target.value)}
            >
              <option value="All">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500">Total Doctors</div>
            <div className="text-2xl font-bold text-gray-800">{doctors.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500">Specializations</div>
            <div className="text-2xl font-bold text-gray-800">{specializations.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500">Active Doctors</div>
            <div className="text-2xl font-bold text-gray-800">
              {doctors.filter(doc => doc.isActive).length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500">Search Results</div>
            <div className="text-2xl font-bold text-gray-800">
              {Object.values(doctorsBySpecialization).flat().length}
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-middle"></div>
            <div className="mt-4 text-gray-600">Loading doctors...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-lg text-red-700 border border-red-100 mb-8">
            <div className="font-bold mb-1">Error</div>
            <div>{error}</div>
          </div>
        ) : Object.keys(doctorsBySpecialization).length > 0 ? (
          renderDoctors()
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="mt-4 text-gray-600">No doctors found matching "{searchTerm}".</div>
            <div className="mt-2 text-gray-500">Try a different search term.</div>
          </div>
        )}
      </div>
      
      <footer className="bg-gray-800 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-lg font-bold mb-2">Medi Book</div>
            <div className="text-gray-400 text-sm">© 2025 All rights reserved</div>
          </div>
        </div>
      </footer>
    </div>
  );
}