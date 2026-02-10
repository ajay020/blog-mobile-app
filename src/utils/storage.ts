import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage utility for managing AsyncStorage operations
 */
class StorageService {
    /**
     * Store a value in AsyncStorage
     */
    async setItem<T>(key: string, value: T): Promise<void> {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (error) {
            console.error(`Error storing ${key}:`, error);
            throw error;
        }
    }

    /**
     * Retrieve a value from AsyncStorage
     */
    async getItem<T>(key: string): Promise<T | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error(`Error retrieving ${key}:`, error);
            return null;
        }
    }

    /**
     * Remove a value from AsyncStorage
     */
    async removeItem(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
            throw error;
        }
    }

    /**
     * Clear all values from AsyncStorage
     */
    async clear(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('Error clearing storage:', error);
            throw error;
        }
    }

    /**
     * Get multiple items from AsyncStorage
     */
    async multiGet(keys: string[]): Promise<Record<string, any>> {
        try {
            const values = await AsyncStorage.multiGet(keys);
            const result: Record<string, any> = {};

            values.forEach(([key, value]) => {
                if (value) {
                    try {
                        result[key] = JSON.parse(value);
                    } catch {
                        result[key] = value;
                    }
                }
            });

            return result;
        } catch (error) {
            console.error('Error getting multiple items:', error);
            throw error;
        }
    }
}

export const storage = new StorageService();