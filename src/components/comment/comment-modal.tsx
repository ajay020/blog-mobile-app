import { useAuthStore } from '@/store/authStore';
import { useCommentsStore } from '@/store/commentsStore';
import { Comment } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import CommentItem from './comment-item';

interface Props {
    articleId: string;
    visible: boolean;
    onClose: () => void;
}

const CommentsModal: React.FC<Props> = ({ articleId, visible, onClose }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
    const [editingComment, setEditingComment] = useState<Comment | null>(null);

    const {
        comments,
        getComments,
        createComment,
        toggleCommentLike,
        updateComment,
        deleteComment,
        isLoading,
    } = useCommentsStore();

    const { user } = useAuthStore();

    useEffect(() => {
        if (visible) {
            getComments(articleId);
        }
    }, [visible, articleId]);

    const handleSubmit = async () => {
        if (!newComment.trim()) return;

        if (editingComment) {
            await updateComment(editingComment._id, newComment);
        } else if (replyingTo) {
            await createComment(articleId, newComment, replyingTo._id);
        } else {
            await createComment(articleId, newComment);
        }

        setNewComment('');
        setEditingComment(null);
        setReplyingTo(null);

        // refresh comments 
        await getComments(articleId);
    };

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            await getComments(articleId);
        } finally {
            setRefreshing(false);
        }
    };

    const handleEditInitiated = (comment: Comment) => {
        setEditingComment(comment);
        setNewComment(comment.content);
    };


    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: '#fff' }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Ionicons name="close-outline" size={26} color="#444" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Responses ({comments.length})</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Comments List */}
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    renderItem={({ item }) => (
                        <CommentItem
                            comment={item}
                            currentUserId={user?.id}
                            onLike={toggleCommentLike}
                            onDelete={deleteComment}
                            onEdit={handleEditInitiated}
                            onReply={(comment) => setReplyingTo(comment)}
                        />
                    )}
                    ListEmptyComponent={
                        !isLoading ? (
                            <Text style={styles.emptyText}>No comments yet</Text>
                        ) : null
                    }
                />

                {/* Input */}
                <View style={styles.inputWrapper}>
                    {replyingTo && (
                        <View style={styles.replyIndicator}>
                            <Text style={styles.replyText}>
                                Replying to {replyingTo.author.name}
                            </Text>
                            <TouchableOpacity onPress={() => setReplyingTo(null)}>
                                <Ionicons name="close-circle" size={16} color="#6b6b6b" />
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Write a response..."
                            value={newComment}
                            onChangeText={setNewComment}
                            editable={!isLoading}
                            multiline
                        />

                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                (!newComment.trim() || isLoading) && styles.disabledButton,
                            ]}
                            onPress={handleSubmit}
                            disabled={!newComment.trim() || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Ionicons name="send" size={20} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default CommentsModal;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },

    closeBtn: {
        padding: 8,
    },

    title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111',
    },

    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 120, // space for input bar
    },

    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 14,
        color: '#777',
    },

    inputWrapper: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#eee',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: Platform.OS === 'ios' ? 28 : 12,
        backgroundColor: '#fff',
    },

    replyIndicator: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
        paddingHorizontal: 4,
    },

    replyText: {
        fontSize: 12,
        color: '#6b6b6b',
        fontStyle: 'italic',
    },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
    },

    input: {
        flex: 1,
        backgroundColor: '#f4f4f5',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        fontSize: 15,
        color: '#111',
        maxHeight: 110,
    },

    sendButton: {
        backgroundColor: '#1a8917',
        padding: 12,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    disabledButton: {
        backgroundColor: '#9fc7a0',
    },
});