import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import TableManager from './TableManager';

const Settings = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      const { data } = await supabase.from('restaurants').select('name').limit(1).single();
      setRestaurantName(data?.name || 'Restaurant');
      setLoading(false);
    };
    fetchRestaurant();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center font-black uppercase tracking-[0.5em]">
        Loading Settings...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b-4 border-black inline-block">
        Settings
      </h2>
      <TableManager restaurantName={restaurantName} />
    </div>
  );
};

export default Settings;
