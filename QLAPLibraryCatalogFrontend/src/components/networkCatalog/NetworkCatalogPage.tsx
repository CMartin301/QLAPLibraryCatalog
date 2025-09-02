import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const NetworkCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  return (
    <div className="container-fluid py-4 bg-pattern">
        {/* Page Header */}
        <div className="row mb-4">
            <div className="col">
                <h1 className="text-2xl md:text-3xl font-bold text-lavender-500 mb-3">
                    Browse the Network Catalog
                </h1>
            </div>
        </div>
    </div>
  );
};

export default NetworkCatalogPage;