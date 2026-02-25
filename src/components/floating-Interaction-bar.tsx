import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    Platform,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface InteractionBarProps {
    isLiked: boolean;
    likesCount: number;
    commentsCount: number;
    onLike: () => void;
    onCommentPress: () => void;
    articleTitle: string;
    articleSlug: string;
}

const InteractionBar: React.FC<InteractionBarProps> = ({
    isLiked,
    likesCount,
    commentsCount,
    onLike,
    onCommentPress,
    articleTitle,
    articleSlug,
}) => {

    const handleLike = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onLike();
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this article: ${articleTitle}`,
                url: `https://yourblog.com/article/${articleSlug}`, // URL is iOS specific in the share object
            });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* BlurView makes the content behind it look frosted/modern */}
            <BlurView intensity={90} tint="light" style={styles.capsule}>

                {/* CLAP BUTTON */}
                <TouchableOpacity style={styles.button} onPress={handleLike} activeOpacity={0.7}>
                    <Ionicons name={isLiked ? "heart" : "heart-outline"} size={22} color="#111" />
                    <Text style={styles.text}>{likesCount}</Text>
                </TouchableOpacity>

                {/* COMMENT BUTTON */}
                <TouchableOpacity style={styles.button} onPress={onCommentPress} activeOpacity={0.7}>
                    <Ionicons name="chatbubble-outline" size={20} color="#6b6b6b" />
                    <Text style={styles.text}>{commentsCount}</Text>
                </TouchableOpacity>

                {/* BOOKMARK BUTTON */}
                <TouchableOpacity style={styles.button} activeOpacity={0.7}>
                    <Ionicons name="bookmark-outline" size={20} color="#6b6b6b" />
                </TouchableOpacity>

                {/* SHARE BUTTON */}
                <TouchableOpacity style={styles.button} onPress={handleShare} activeOpacity={0.7}>
                    <Ionicons name="share-outline" size={20} color="#6b6b6b" />
                </TouchableOpacity>

            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30, // Floats 30px from the bottom
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    capsule: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // Fallback for when blur isn't supported
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        // Professional Shadow
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        gap: 6,
    },
    text: {
        fontSize: 14,
        color: '#6b6b6b',
        fontWeight: '600',
    },
    activeText: {
        color: '#1a8917',
    }
});

export default InteractionBar;