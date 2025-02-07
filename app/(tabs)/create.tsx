import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { generatePost } from '../../api/generate';
import { useRouter } from 'expo-router';

const platformsList = ["x (twitter)", "instagram", "linkedin", "facebook"];

const CreatePost: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const router = useRouter();

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
            router.push('/'); 
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.heading}>Create Your Social Media Post</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Type your idea..."
                    value={prompt}
                    onChangeText={setPrompt}
                />

                <Text style={styles.subheading}>Select Platforms:</Text>
                <View style={styles.platformContainer}>
                    {platformsList.map((platform) => (
                        <TouchableOpacity
                            key={platform}
                            onPress={() => togglePlatform(platform)}
                            style={[
                                styles.platformButton,
                                selectedPlatforms.includes(platform) && styles.selectedPlatform
                            ]}
                        >
                            <Text style={styles.platformText}>{platform.toUpperCase()}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    onPress={handleGenerate}
                    style={[styles.generateButton, loading && styles.loadingButton]}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.generateButtonText}>Generate Post</Text>
                    )}
                </TouchableOpacity>

                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#021F59',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 25,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F2B705',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#fff',
        fontSize: 16,
        width: '100%',
        maxWidth: 400,
        color: '#333',
    },
    subheading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F2B705',
        marginBottom: 10,
    },
    platformContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    platformButton: {
        backgroundColor: '#ccc',
        paddingVertical: 12,
        paddingHorizontal: 20,
        margin: 8,
        borderRadius: 30,
        alignItems: 'center',
    },
    selectedPlatform: {
        backgroundColor: '#3D90D9',
    },
    platformText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    generateButton: {
        backgroundColor: '#66BCF2',
        paddingVertical: 14,
        paddingHorizontal: 50,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loadingButton: {
        backgroundColor: '#a0c4ff',
    },
    generateButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        fontSize: 16,
    },
});

export default CreatePost;
