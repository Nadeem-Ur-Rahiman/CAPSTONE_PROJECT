import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ScreenWrapper from '@/components/ScreenWrapper';
import { supabase } from '../../supabase';
import { useUser } from '../UserContext';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Colors } from '@/constants/Colors';

// In React Native, hardcode the API key for development (use secure storage for production)
const API_KEY = "";
const genAI = new GoogleGenerativeAI(API_KEY);

export default function ChatbotScreen() {
  const { user } = useUser();
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI baby care assistant. How can I help you today?' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [dbContext, setDbContext] = useState<string>('');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Enhanced user data fetching with better error handling
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsFetchingUser(true);
        setFetchError(null);
        
        if (!user || !user.email) {
          console.error("User session missing or invalid");
          setFetchError("User session not found. Please log in again.");
          return;
        }
        
        // Log user information for debugging
        console.log("Fetching data for user:", user.email);
        
        // Get all columns from the Profiles table for this user
        const { data, error } = await supabase
          .from('Profiles')
          .select('*')
          .eq('email', user.email)
          .single();
        
        if (error) {
          console.error('Supabase error fetching user data:', error);
          setFetchError("Couldn't load your profile. Please try again.");
          return;
        }
        
        if (!data) {
          console.error('No profile found for user:', user.email);
          setFetchError("Profile not found. Please complete your profile setup.");
          return;
        }
        
        // Log success for debugging
        console.log("Successfully retrieved profile data:", data.name);
        
        // Set user name
        setUserName(data.name || "User");
        
        // Organize data into meaningful categories
        const contextData = {
          userInfo: {
            name: data.name,
            email: data.email,
            babyName: data.baby_name,
            babyDOB: data.dob,
            // Add any other basic info fields
          },
          growth: {
            latest: {
              date: data.GROW_DATE_5 || data.GROW_DATE_4 || data.GROW_DATE_3 || data.GROW_DATE_2 || data.GROW_DATE,
              weight: data.GROW_WEIGHT_5 || data.GROW_WEIGHT_4 || data.GROW_WEIGHT_3 || data.GROW_WEIGHT_2 || data.GROW_WEIGHT,
              height: data.GROW_HEIGHT_5 || data.GROW_HEIGHT_4 || data.GROW_HEIGHT_3 || data.GROW_HEIGHT_2 || data.GROW_HEIGHT,
            },
            history: [
              data.GROW_DATE && { date: data.GROW_DATE, weight: data.GROW_WEIGHT, height: data.GROW_HEIGHT },
              data.GROW_DATE_2 && { date: data.GROW_DATE_2, weight: data.GROW_WEIGHT_2, height: data.GROW_HEIGHT_2 },
              data.GROW_DATE_3 && { date: data.GROW_DATE_3, weight: data.GROW_WEIGHT_3, height: data.GROW_HEIGHT_3 },
              data.GROW_DATE_4 && { date: data.GROW_DATE_4, weight: data.GROW_WEIGHT_4, height: data.GROW_HEIGHT_4 },
              data.GROW_DATE_5 && { date: data.GROW_DATE_5, weight: data.GROW_WEIGHT_5, height: data.GROW_HEIGHT_5 }
            ].filter(Boolean)
          },
          feeding: {
            recentFeedings: [
              data.FEED_DATE_1 && { date: data.FEED_DATE_1, time: data.FEED_TIME_1 },
              data.FEED_DATE_2 && { date: data.FEED_DATE_2, time: data.FEED_TIME_2 },
              data.FEED_DATE_3 && { date: data.FEED_DATE_3, time: data.FEED_TIME_3 },
              data.FEED_DATE_4 && { date: data.FEED_DATE_4, time: data.FEED_TIME_4 },
              data.FEED_DATE_5 && { date: data.FEED_DATE_5, time: data.FEED_TIME_5 }
            ].filter(Boolean)
          },
          sleep: {
            recentSleepTimes: [
              data.SLEEP_DATE_1 && { date: data.SLEEP_DATE_1, time: data.SLEEP_TIME_1 },
              data.SLEEP_DATE_2 && { date: data.SLEEP_DATE_2, time: data.SLEEP_TIME_2 },
              data.SLEEP_DATE_3 && { date: data.SLEEP_DATE_3, time: data.SLEEP_TIME_3 },
              data.SLEEP_DATE_4 && { date: data.SLEEP_DATE_4, time: data.SLEEP_TIME_4 }
            ].filter(Boolean)
          },
          nappy: {
            recentChanges: [
              data.NAPPY_DATE_1 && { date: data.NAPPY_DATE_1, type: data.NAPPY_1 },
              data.NAPPY_DATE_2 && { date: data.NAPPY_DATE_2, type: data.NAPPY_2 },
              data.NAPPY_DATE_3 && { date: data.NAPPY_DATE_3, type: data.NAPPY_3 },
              data.NAPPY_DATE_4 && { date: data.NAPPY_DATE_4, type: data.NAPPY_4 }
            ].filter(Boolean)
          },
          vaccination: {
            twoMonth: {
              sixInOne: data['2M_6in1'],
              PCV: data['2M_PCV'],
              MenB: data['2M_MENB'],
              ROV: data['2M_ROV']
            },
            fourMonth: {
              sixInOne: data['4M_6in1'],
              MenB: data['4M_MENB'],
              ROV: data['4M_ROV']
            },
            sixMonth: {
              sixInOne: data['6M_6in1'],
              PCV: data['6M_PCV'],
              MenC: data['6M_MENC']
            },
            tenMonth: {
              MMR: data['10M_MMR'],
              MenB: data['10M_MENB']
            },
            twelveMonth: {
              MenC: data['12M_MENC'],
              PCV: data['12M_PCV']
            }
          }
        };
        
        // Convert to string for the AI context and log the size for debugging
        const contextString = JSON.stringify(contextData);
        console.log(`Context data prepared (${contextString.length} chars)`);
        setDbContext(contextString);
        
      } catch (err) {
        console.error('Unexpected error in fetchUserData:', err);
        setFetchError("An unexpected error occurred. Please try again.");
      } finally {
        setIsFetchingUser(false);
      }
    };

    // Only run fetchUserData if we have a user session
    if (user) {
      fetchUserData();
    } else {
      // Handle case when user is not logged in
      setIsFetchingUser(false);
      setFetchError("Please log in to use the chatbot.");
    }
  }, [user]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    setMessage('');
    
    // Add user message to chat history
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Show loading state
    setIsLoading(true);
    
    try {
      if (!dbContext) {
        throw new Error("User data not loaded. Please refresh the app.");
      }
      
      // Initialize the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Build the prompt with enhanced context
      const prompt = `USER DATABASE CONTEXT (For your reference only, don't mention that you have this data directly):
      ${dbContext}
      
      USER QUERY: ${userMessage}
      
      Based on the user's baby data (feeding, growth, sleep, vaccination, nappy changes), provide personalized baby care advice.
      Consider the baby's growth trends, recent feeding and sleeping patterns, and vaccination status when relevant to the question.
      Keep your response friendly, supportive, and concise.`;

      // Get response from Gemini
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Add AI response to chat history
      setChatHistory(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (error) {
      console.error('Error with Gemini API or data:', error);
      
      // More user-friendly error message
      setChatHistory(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: "I'm having trouble connecting to my knowledge base right now. Could you try again in a moment?" 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history and start a new conversation
  const startNewChat = () => {
    Alert.alert(
      "Start New Chat",
      "Are you sure you want to clear this conversation and start a new one?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Clear Chat", 
          onPress: () => {
            setChatHistory([
              { role: 'assistant', content: 'Hello! I\'m your AI baby care assistant. How can I help you today?' },
            ]);
          },
          style: "destructive"
        }
      ]
    );
  };

  // Scroll to bottom whenever chat history updates
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatHistory]);

  // Loading state screen
  if (isFetchingUser) {
    return (
      <ScreenWrapper bg="white">
        <View style={styles.loadingScreenContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingScreenText}>Setting up your assistant...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // Error state screen
  if (fetchError) {
    return (
      <ScreenWrapper bg="white">
        <View style={styles.errorScreenContainer}>
          <FontAwesome name="exclamation-circle" size={50} color={Colors.primary} />
          <Text style={styles.errorScreenText}>{fetchError}</Text>
          <TouchableOpacity 
            style={styles.errorRetryButton}
            onPress={() => {
              setFetchError(null);
              setIsFetchingUser(true);
              // Force re-render to trigger useEffect again
              if (user) {
                // This is a hack to force the useEffect to run again
                const tempUser = {...user};
                useUser().setUser(null);
                setTimeout(() => {
                  useUser().setUser(tempUser);
                }, 100);
              }
            }}
          >
            <Text style={styles.errorRetryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Baby Care Assistant</Text>
          <TouchableOpacity 
            style={styles.newChatButton}
            onPress={startNewChat}
          >
            <FontAwesome name="trash" size={18} color={Colors.primary} />
            <Text style={styles.newChatText}>New Chat</Text>
          </TouchableOpacity>
        </View>
        
        {userName && (
          <Text style={styles.welcomeText}>
            Hi {userName}, ask me anything about baby care!
          </Text>
        )}
        
        <View style={styles.chatContainer}>
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
          >
            {chatHistory.map((chat, index) => (
              <View 
                key={index} 
                style={[
                  styles.messageBubble,
                  chat.role === 'user' ? styles.userBubble : styles.aiBubble
                ]}
              >
                <Text style={[
                  styles.messageText,
                  chat.role === 'user' ? styles.userText : styles.aiText
                ]}>
                  {chat.content}
                </Text>
              </View>
            ))}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.loadingText}>Baby care assistant is thinking...</Text>
              </View>
            )}
          </ScrollView>
        </View>
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your question..."
              multiline
              maxLength={1000}
            />
            <TouchableOpacity 
              style={[styles.sendButton, !message.trim() && styles.disabledButton]}
              onPress={sendMessage}
              disabled={!message.trim() || isLoading}
            >
              <FontAwesome name="send" size={20} color={message.trim() ? '#fff' : '#ccc'} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  newChatText: {
    marginLeft: 6,
    color: Colors.primary,
    fontWeight: '500',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingBottom: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
    marginLeft: '20%',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    marginRight: '20%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: 'white',
  },
  aiText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 12,
    marginVertical: 5,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  loadingScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingScreenText: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  errorScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorScreenText: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorRetryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  errorRetryText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  welcomeMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
});
