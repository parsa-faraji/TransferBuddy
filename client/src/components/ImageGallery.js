import { useState } from 'react';

const ImageGallery = ({ darkMode }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const universities = [
    {
      name: 'UC Berkeley',
      image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
      description: 'Sather Gate and Campanile - UC Berkeley Campus'
    },
    {
      name: 'UCLA',
      image: 'https://images.unsplash.com/photo-1607963735195-d8cfc5ae5c9c?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
      description: 'Royce Hall - UCLA Campus'
    },
    {
      name: 'UC San Diego',
      image: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
      description: 'Geisel Library - UC San Diego'
    }
  ];

  const colleges = [
    {
      name: 'Berkeley City College',
      image: 'https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
      description: 'BCC Campus Building'
    },
    {
      name: 'Laney College',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
      description: 'Laney College Campus'
    },
    {
      name: 'College of Alameda',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
      description: 'College of Alameda Campus'
    },
    {
      name: 'Merritt College',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80',
      description: 'Merritt College Campus'
    }
  ];

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl shadow-xl p-6 transition-all duration-300`}>
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        🏛️ Campus Gallery
      </h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">UC Universities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {universities.map((uni, index) => (
            <div 
              key={index}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => setSelectedImage(uni)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-md">
                <img 
                  src={uni.image} 
                  alt={uni.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-semibold">{uni.name}</h4>
                    <p className="text-sm opacity-90">{uni.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Community Colleges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {colleges.map((college, index) => (
            <div 
              key={index}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => setSelectedImage(college)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-md">
                <img 
                  src={college.image} 
                  alt={college.name}
                  className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-2 left-2 text-white">
                    <h4 className="font-medium text-sm">{college.name}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[80vh] animate-scaleIn">
            <img 
              src={selectedImage.image} 
              alt={selectedImage.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button 
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              ✕
            </button>
            <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 rounded-lg p-3">
              <h3 className="font-bold text-lg">{selectedImage.name}</h3>
              <p className="text-sm">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;