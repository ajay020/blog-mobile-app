import { Comment } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CommentItemProps {
    comment: Comment;
    currentUserId: string | undefined;
    onLike: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (comment: Comment) => void;
    onReply: (comment: Comment) => void; // New: trigger reply mode
    isReply?: boolean; // New: styling for nested items
}

const CommentItem = ({
    comment,
    currentUserId,
    onLike,
    onDelete,
    onEdit,
    onReply,
    isReply = false
}: CommentItemProps) => {
    const [showOptions, setShowOptions] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const isOwner = currentUserId === comment.author._id;

    return (
        <View style={[styles.container, isReply && styles.replyContainer]}>
            <Image
                source={{ uri: comment.author.avatar }}
                style={[styles.avatar, isReply && styles.replyAvatar]}
            />

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.authorName}>{comment.author.name}</Text>
                        <Text style={styles.date}>{formatDistanceToNow(new Date(comment.createdAt))} ago</Text>
                    </View>

                    {isOwner && (
                        <TouchableOpacity onPress={() => setShowOptions(!showOptions)} hitSlop={10}>
                            <Ionicons name="ellipsis-vertical" size={18} color="#6b6b6b" />
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.commentText}>{comment.content}</Text>

                {/* OPTIONS MENU (Delete/Edit) */}
                {showOptions && (
                    <View style={styles.optionsMenu}>
                        <TouchableOpacity onPress={() => { onEdit(comment); setShowOptions(false); }} style={styles.optionItem}>
                            <Ionicons name="pencil-outline" size={16} color="#242424" />
                            <Text style={styles.optionText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { onDelete(comment._id); setShowOptions(false); }} style={styles.optionItem}>
                            <Ionicons name="trash-outline" size={16} color="#d32f2f" />
                            <Text style={[styles.optionText, { color: '#d32f2f' }]}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => onLike(comment._id)} style={styles.footerButton}>
                        <Ionicons
                            name={comment.likes.includes(currentUserId || '') ? "heart" : "heart-outline"}
                            size={16}
                            color={comment.likes.includes(currentUserId || '') ? "#d32f2f" : "#6b6b6b"}
                        />
                        <Text style={styles.footerText}>{comment.likesCount}</Text>
                    </TouchableOpacity>

                    {/* REPLIES TOGGLE */}
                    {comment.repliesCount! > 0 && !isReply && (
                        <TouchableOpacity onPress={() => setShowReplies(!showReplies)} style={styles.footerButton}>
                            <Ionicons name="chatbubble-ellipses-outline" size={16} color="#6b6b6b" />
                            <Text style={styles.footerText}>
                                {showReplies ? 'Hide' : `Replies ${comment.repliesCount}`}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* REPLY ACTION */}
                    <TouchableOpacity onPress={() => onReply(comment)} style={styles.footerButton}>
                        <Text style={styles.footerText}>Reply</Text>
                    </TouchableOpacity>
                </View>

                {/* NESTED REPLIES RENDERING */}
                {showReplies && comment.replies && (
                    <View style={styles.repliesList}>
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply._id}
                                comment={reply}
                                currentUserId={currentUserId}
                                onLike={onLike}
                                onDelete={onDelete}
                                onEdit={onEdit}
                                onReply={onReply}
                                isReply={true}
                            />
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#eee',
        zIndex: 1
    },
    avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 12 },
    content: { flex: 1, position: 'relative' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    authorName: { fontSize: 14, fontWeight: '600', color: '#242424' },
    date: { fontSize: 12, color: '#6b6b6b' },
    commentText: { fontSize: 15, lineHeight: 22, color: '#292929', marginTop: 4 },
    optionsMenu: {
        position: 'absolute',
        right: 0,
        top: 25,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#eee',
        zIndex: 10,
    },
    optionItem: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 10 },
    optionText: { fontSize: 14, fontWeight: '500' },
    footer: { flexDirection: 'row', marginTop: 12 },
    likeButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    replyButton: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 20 },
    footerText: { fontSize: 13, color: '#6b6b6b' },

    replyContainer: {
        paddingLeft: 0,
        borderBottomWidth: 0,
        marginTop: 10,
    },
    replyAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    repliesList: {
        marginTop: 10,
        paddingLeft: 12,
        borderLeftWidth: 2,
        borderLeftColor: '#f0f0f0', // The vertical thread line
    },
    footerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginRight: 20,
    },
    replyIndicator: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f5f5f5',
        padding: 8,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: 15,
    },
    replyIndicatorText: {
        fontSize: 12,
        color: '#6b6b6b',
        fontWeight: '600',
    }
});

export default CommentItem;