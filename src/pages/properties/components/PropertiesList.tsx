import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, Eye, Camera } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { StatusBadge } from '../../../components/common/StatusBadge';

interface Property {
  id: string;
  address: string;
  propertyType: string;
  constructionStage: string;
  value: string;
  status: string;
  lastUpdated: string;
  images: number;
  owner: string;
}

const mockProperties: Property[] = [
  {
    id: 'PROP-001',
    address: '123 Victoria Street, Victoria Island, Lagos',
    propertyType: 'Residential Building',
    constructionStage: 'Completed',
    value: '₦50,000,000',
    status: 'active',
    lastUpdated: '2025-01-27T10:30:00Z',
    images: 8,
    owner: 'John Smith'
  },
  {
    id: 'PROP-002',
    address: '45 Allen Avenue, Ikeja, Lagos',
    propertyType: 'Commercial Building',
    constructionStage: 'Under Construction',
    value: '₦120,000,000',
    status: 'underwriting',
    lastUpdated: '2025-01-26T14:20:00Z',
    images: 12,
    owner: 'ABC Construction Ltd'
  }
];

export function PropertiesList() {
  const [properties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMap, setShowMap] = useState(false);

  const filteredProperties = properties.filter(property =>
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
              Filters
            </Button>
            <Button 
              variant={showMap ? 'primary' : 'secondary'}
              icon={<MapPin className="w-4 h-4" />}
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? 'List View' : 'Map View'}
            </Button>
          </div>
        </div>
      </div>

      {showMap ? (
        /* Map View */
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Interactive map view will be displayed here</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Showing {filteredProperties.length} properties
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Property</th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Type</th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Construction</th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Value</th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Media</th>
                  <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{property.id}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{property.address}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Owner: {property.owner}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {property.propertyType}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          property.constructionStage === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {property.constructionStage}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {property.value}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={property.status as any} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Camera className="w-4 h-4 mr-1" />
                        {property.images} images
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}