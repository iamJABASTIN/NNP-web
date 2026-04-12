import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useTables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTables() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tables')
          .select('*')
          .eq('is_active', true)
          .neq('table_number', 'Takeout')
          .order('table_number', { ascending: true });

        if (error) throw error;
        
        // Sort numerically if possible to ensure "1, 2, ... 10" order
        const sortedTables = (data || []).sort((a, b) => {
          const numA = parseInt(a.table_number, 10);
          const numB = parseInt(b.table_number, 10);
          if (isNaN(numA) || isNaN(numB)) {
            return a.table_number.localeCompare(b.table_number);
          }
          return numA - numB;
        });

        setTables(sortedTables);
      } catch (err) {
        console.error('Error fetching tables:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTables();
  }, []);

  return { tables, loading };
}
