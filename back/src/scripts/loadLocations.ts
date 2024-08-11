import { RowDataPacket } from 'mysql2';
import pool from '@_config/db.config';

interface Location extends RowDataPacket {
  id: number;
  address_a_name: string;
  address_b_name: string;
}

const loadLocations = async (): Promise<Location[]> => {
  const query = 'SELECT id, address_a_name, address_b_name FROM locations ORDER BY id ASC';
  try {
    const [results] = await pool.query<Location[]>(query);
    return results;
  } catch (err) {
    throw err;
  }
};

export default loadLocations;
