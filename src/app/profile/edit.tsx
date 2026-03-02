import { imageUploadApi } from '@/api/image-upload.api';
import TopBar from '@/components/topbar';
import { useAuthStore } from '@/store';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EditProfileScreen() {
    const { user, updateProfile, isLoading } = useAuthStore();
    const [isUploading, setIsUploading] = useState(false);
    const [tempAvatar, setTempAvatar] = useState(user?.avatar);
    const router = useRouter();

    // Local state for the form
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        website: user?.website || '',
    });

    const pickImage = async () => {
        // 1. Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need gallery access to change your photo.');
            return;
        }

        // 2. Launch picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true, // Crop to square
            aspect: [1, 1],
            quality: 0.7, // Compress for faster upload
        });

        if (!result.canceled) {
            handleUpload(result.assets[0].uri);
        }
    };

    const handleUpload = async (uri: string) => {
        setIsUploading(true);
        try {
            // 3. Prepare FormData
            const fileName = uri.split('/').pop();
            const formData = new FormData();

            // @ts-ignore
            formData.append('image', {
                uri,
                name: fileName,
                type: 'image/jpeg',
            });

            // 4. Upload to Cloudinary via your API
            const response = await imageUploadApi.uploadImage(formData);

            if (response.success) {
                setTempAvatar(response.data.url);
                // 5. Update the user profile immediately
                await updateProfile({ avatar: response.data.url });
                Alert.alert('Success', 'Profile picture updated!');
            }
        } catch (error) {
            Alert.alert('Upload Failed', 'Could not upload image. Please try again.');
            console.log("Imapge upload error: ", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        try {
            await updateProfile(formData);
            Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            // Error is already handled in your store, but you can add local feedback here
            console.log("Upload image error", error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TopBar title='Edit Profile' />

                {/* Avatar Edit Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: tempAvatar }} style={styles.largeAvatar} />
                        {isUploading && (
                            <View style={styles.avatarOverlay}>
                                <ActivityIndicator color="#fff" />
                            </View>
                        )}
                    </View>
                    <TouchableOpacity onPress={pickImage} disabled={isUploading}>
                        <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Input: Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                        placeholder="Your name"
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Input: Bio */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.bio}
                        onChangeText={(text) => setFormData({ ...formData, bio: text })}
                        placeholder="Tell us about yourself..."
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                    <Text style={styles.charCount}>{formData.bio.length}/160</Text>
                </View>

                {/* Input: Website */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Website</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.website}
                        onChangeText={(text) => setFormData({ ...formData, website: text })}
                        placeholder="https://yourwebsite.com"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        keyboardType="url"
                    />
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={[styles.saveButton, isLoading && styles.disabledButton]}
                    onPress={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 20 },
    header: { marginBottom: 30 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#1a1a1a' },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#6b6b6b', marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1a1a1a',
        backgroundColor: '#fafafa',
    },
    textArea: {
        height: 100,
        paddingTop: 12,
    },
    charCount: {
        textAlign: 'right',
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    saveButton: {
        backgroundColor: '#1a8917',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#1a8917',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    disabledButton: { backgroundColor: '#a8c6a7' },
    saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarWrapper: {
        position: 'relative',
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    largeAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
    },
    avatarOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    changePhotoText: {
        color: '#1a8917',
        fontWeight: '600',
        fontSize: 15,
    },
});