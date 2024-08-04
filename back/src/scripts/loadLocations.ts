import { RowDataPacket } from 'mysql2';
import connection from '@_config/db.config';

interface Location extends RowDataPacket {
  id: number;
  address_a_name: string;
  address_b_name: string;
}

const loadLocations = (): Promise<Location[]> => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id, address_a_name, address_b_name FROM locations ORDER BY id ASC';
    connection.query<Location[]>(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

export default loadLocations;
