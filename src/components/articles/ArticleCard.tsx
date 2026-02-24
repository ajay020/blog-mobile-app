import { Article } from '@/types';
import { formatDistanceToNow } from 'date-fns'; // Standard for date formatting
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ArticleCardProps {
    article: Article;
    onPress: (slug: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onPress }) => {
    const {
        title,
        excerpt,
        coverImage,
        author,
        publishedAt,
        likesCount,
        commentsCount,
        readingTime,
    } = article;

    // Format date safely
    const formattedDate = publishedAt
        ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true })
        : 'Recently';

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(article.slug)}
            activeOpacity={0.7}
        >
            <View style={styles.contentRow}>
                <View style={styles.textContainer}>
                    {/* Author Info Section */}
                    <View style={styles.authorRow}>
                        {author.avatar && (
                            <Image source={{ uri: author.avatar }} style={styles.avatar} />
                        )}
                        <Text style={styles.authorName}>{author.name}</Text>
                    </View>

                    <Text style={styles.title} numberOfLines={2}>
                        {title}
                    </Text>

                    {excerpt && (
                        <Text style={styles.excerpt} numberOfLines={2}>
                            {excerpt}
                        </Text>
                    )}
                </View>

                {coverImage && (
                    <Image source={{ uri: coverImage }} style={styles.coverImage} />
                )}
            </View>

            {/* Bottom Metadata */}
            <View style={styles.footer}>
                <View style={styles.footerLeft}>
                    <Text style={styles.footerText}>{formattedDate}</Text>
                    <Text style={styles.dotSeparator}>·</Text>
                    <Text style={styles.footerText}>{readingTime} min read</Text>
                </View>

                <View style={styles.footerRight}>
                    <Text style={styles.statsText}>👏 {likesCount}</Text>
                    <Text style={styles.statsText}>💬 {commentsCount}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e0e0e0',
        borderRadius: 8,
        marginBottom: 12,
    },
    contentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    textContainer: {
        flex: 1,
        paddingRight: 12,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 8,
    },
    authorName: {
        fontSize: 13,
        fontWeight: '500',
        color: '#242424',
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1a1a1a',
        lineHeight: 22,
        marginBottom: 4,
    },
    excerpt: {
        fontSize: 14,
        color: '#6b6b6b',
        lineHeight: 20,
    },
    coverImage: {
        width: 80,
        height: 80,
        borderRadius: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    footerText: {
        fontSize: 13,
        color: '#6b6b6b',
    },
    dotSeparator: {
        marginHorizontal: 4,
        color: '#6b6b6b',
    },
    statsText: {
        fontSize: 13,
        color: '#6b6b6b',
    },
});

export default React.memo(ArticleCard);