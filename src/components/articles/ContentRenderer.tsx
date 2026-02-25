import { FONT_SIZES } from '@/constants';
import React from 'react';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { WebView } from 'react-native-webview';

// Define the shape of an Editor.js block
interface EditorBlock {
    id?: string;
    type: string;
    data: any;
}

interface ContentRendererProps {
    blocks: EditorBlock[];
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ blocks }) => {
    const { width } = useWindowDimensions();

    // console.log("Rendering content with blocks:", blocks);


    const renderBlocks = () => {
        return (blocks.map((block, index) => {
            switch (block.type) {
                case 'header':
                    return (
                        <Text
                            key={block.id || index}
                            style={[styles.header, { fontSize: block.data.level === 1 ? 26 : 22 }]}
                        >
                            {block.data.text}
                        </Text>
                    );

                case 'paragraph':
                    return (
                        <RenderHtml
                            key={block.id || index}
                            contentWidth={width}
                            source={{ html: block.data.text }}
                            baseStyle={{
                                fontSize: FONT_SIZES.lg,
                                lineHeight: 28,
                                color: '#292929',
                                marginBottom: 16,
                            }}
                            tagsStyles={{
                                p: {
                                    marginBottom: 16,
                                },
                                a: {
                                    color: '#1a0dab',
                                    textDecorationLine: 'underline',
                                },
                                b: {
                                    fontWeight: 'bold',
                                },
                                i: {
                                    fontStyle: 'italic',
                                },
                                u: {
                                    textDecorationLine: 'underline',
                                },
                            }}
                        />
                    );

                case 'image':
                    return (
                        <View key={block.id || index} style={styles.imageContainer}>
                            <Image
                                source={{ uri: block.data.file.url }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            {block.data.caption && (
                                <Text style={styles.caption}>{block.data.caption}</Text>
                            )}
                        </View>
                    );

                case 'list':
                    return (
                        <View key={block.id || index} style={styles.listContainer}>
                            {block.data.items.map((item: any, i: number) => (
                                <View key={i} style={styles.listItem}>
                                    <Text style={styles.bullet}>
                                        {block.data.items.style === 'ordered' ? `${i + 1}.` : '•'}
                                    </Text>
                                    <RenderHtml
                                        contentWidth={width - 40}
                                        source={{ html: item.content }}
                                        baseStyle={styles.listText}
                                        tagsStyles={{
                                            p: {
                                                marginBottom: 16,
                                            },
                                            a: {
                                                color: '#1a0dab',
                                                textDecorationLine: 'underline',
                                            },
                                            b: {
                                                fontWeight: 'bold',
                                            },
                                            i: {
                                                fontStyle: 'italic',
                                            },
                                            u: {
                                                textDecorationLine: 'underline',
                                            },
                                        }} />
                                </View>
                            ))}
                        </View>
                    );

                case 'code':
                    return (
                        <View key={block.id || index}
                            style={{ marginVertical: 20, backgroundColor: '#f5f5f5', padding: 16, borderRadius: 8 }}
                        >
                            <Text style={styles.code}>{block.data.code}</Text>
                        </View>
                    );

                case 'quote':
                    return (
                        <View key={block.id || index} style={{ marginVertical: 20, paddingLeft: 16, borderLeftWidth: 4, borderLeftColor: '#eee' }}>
                            <RenderHtml
                                contentWidth={width - 40}
                                source={{ html: block.data.text }}
                                baseStyle={{ fontStyle: 'italic', color: '#555', fontSize: 18, lineHeight: 28 }}
                            />
                            {block.data.caption && (
                                <Text style={{
                                    textAlign: 'right',
                                    color: '#6b6b6b',
                                    fontSize: 14, marginTop: 4
                                }}>
                                    — {block.data.caption}
                                </Text>
                            )}
                        </View>
                    );

                case 'embed':
                    return (
                        <View key={block.id || index} style={{ marginVertical: 20 }}>
                            <WebView
                                source={{ uri: block.data.embed }}
                                style={{ width: '100%', height: 200 }}
                                javaScriptEnabled
                                domStorageEnabled
                            />
                        </View>
                    );

                case 'delimiter':
                    return (
                        <View
                            key={block.id || index}
                            style={{ marginVertical: 20, alignItems: 'center' }}
                        >
                            <Text style={{ color: '#ccc', fontSize: 24 }}>*  *  *</Text>
                        </View>
                    );

                default:
                    console.log('Unknown block type:', block.type);
                    return null;
            }
        }))
    }

    return (
        <View style={styles.container}>
            {/* Render the blocks */}
            {renderBlocks()}

        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%' },
    code: {
        fontFamily: 'Courier New, Menlo, monospace',
        fontSize: 16,
        lineHeight: 24,
        color: '#c7254e',
    },
    header: {
        fontWeight: '800',
        color: '#1a1a1a',
        marginTop: 20,
        marginBottom: 10,
        lineHeight: 32,
    },
    paragraph: {
        fontSize: 18,
        lineHeight: 28,
        color: '#292929',
        marginBottom: 16,
    },
    imageContainer: { marginVertical: 20 },
    image: { width: '100%', height: 250, borderRadius: 8 },
    caption: {
        textAlign: 'center',
        color: '#6b6b6b',
        fontSize: 14,
        marginTop: 8,
    },
    listContainer: {
        marginBottom: 16,
    },
    listItem: {
        // backgroundColor: '#f9f9f9',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-start',
        marginBottom: 4,
        paddingRight: 20
    },
    bullet: { fontSize: 18, marginRight: 10, color: '#292929' },
    listText: { fontSize: FONT_SIZES.lg, lineHeight: 28, color: '#292929', flex: 1 },
});

export default ContentRenderer;