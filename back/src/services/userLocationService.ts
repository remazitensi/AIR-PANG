import connection from '@_config/db.config';
import { ResultSetHeader } from 'mysql2';

export class UserLocationService {
  async getUserLocations(userId: number) {
    const [rows] = await connection.promise().query(
      'SELECT id, location_id FROM user_locations WHERE user_id = ?',
      [userId]
    );
    return rows;
  }

 
  async searchLocations(query: string) {
    const [rows] = await connection.promise().query(
      'SELECT id, name, description FROM locations WHERE name LIKE ?',
      [`%${query}%`]
    );
    return rows;
  }

  async addUserLocation(userId: number, locationId: number) {
    const [result] = await connection.promise().query<ResultSetHeader>(
      'INSERT INTO user_locations (user_id, location_id) VALUES (?, ?)',
      [userId, locationId]
    );
    return result.insertId;
  }

  async updateUserLocation(userId: number, id: number, locationId: number) {
    await connection.promise().query(
      'UPDATE user_locations SET location_id = ? WHERE user_id = ? AND id = ?',
      [locationId, userId, id]
    );
    return { userId, id, locationId };
  }

  async deleteUserLocation(userId: number, id: number) {
    await connection.promise().query(
      'DELETE FROM user_locations WHERE user_id = ? AND id = ?',
      [userId, id]
    );
  }
}
