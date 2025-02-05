import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { generatePost } from '../../api/generate';

interface GeneratedContent {
    content: string;
    hashtags: string[];
}

interface GeneratedPost {
    platforms: Record<string, GeneratedContent>;
}

const platformsList = ["x (twitter)", "instagram", "linkedin", "facebook"];

const CreatePost: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const togglePlatform = (platform: string) => {
        setSelectedPlatforms((prev) =>
            prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
        );
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt!');
            return;
        }

        if (selectedPlatforms.length === 0) {
            setError('Please select at least one platform!');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const data = await generatePost(prompt, selectedPlatforms);
            setGeneratedPost(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f4f4f9', marginTop: 40 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
                    Create Your Social Media Post
                </Text>

                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 15,
                        borderRadius: 10,
                        marginTop: 40,
                        marginBottom: 20,
                        backgroundColor: '#fff',
                        fontSize: 16,
                        width: '100%',
                        maxWidth: 400,
                        color: '#333',
                    }}
                    placeholder="Type your idea..."
                    value={prompt}
                    onChangeText={setPrompt}
                />

                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 }}>
                    Select Platforms:
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10, marginBottom: 20 }}>    
                    {platformsList.map((platform) => (
                        <TouchableOpacity
                            key={platform}
                            onPress={() => togglePlatform(platform)}
                            style={{
                                backgroundColor: selectedPlatforms.includes(platform) ? '#007bff' : '#ccc',
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                                margin: 8,
                                borderRadius: 30,
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                                {platform.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Button title="Generate Post" onPress={handleGenerate} disabled={loading} color="#007bff" />
                
                {loading && (
                    <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
                )}

                {error && <Text style={{ color: 'red', marginTop: 10, fontSize: 16 }}>{error}</Text>}

                {generatedPost && (
                    <View style={{ marginTop: 30, width: '100%', maxWidth: 400 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
                            Generated Post:
                        </Text>
                        {Object.entries(generatedPost.platforms).map(([platform, post], index) => (
                            <View
                                key={index}
                                style={{
                                    marginTop: 15,
                                    padding: 15,
                                    backgroundColor: '#fff',
                                    borderRadius: 10,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 5,
                                    elevation: 3,
                                    marginBottom: 15,
                                }}
                            >
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                                    {platform.toUpperCase()}:
                                </Text>
                                <Text style={{ marginTop: 10, fontSize: 16, color: '#555' }}>{post.content}</Text>
                                <Text style={{ color: '#007bff', marginTop: 10, fontSize: 16 }}>
                                    {post.hashtags.join(' ')}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default CreatePost;
