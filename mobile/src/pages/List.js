import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import { 
    Alert,
    View,
    SafeAreaView, 
    ScrollView,
    Platform,
    StatusBar,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity, 
    AsyncStorage } from 'react-native';

import SpotList from '../components/SpotList';

import logo from '../assets/logo.png';

export default function List({ navigation }) {
    const [techs, setTechs] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem('user').then(user_id => {
            const socket = socketio('http://192.168.0.6:3333', {
                query: { user_id }
            });

            socket.on('booking_response', booking => {
                Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'APROVADA' : 'REJEITADA' }`);
            })
        })
    }, []);

    useEffect(() => {
        
        AsyncStorage.getItem('techs').then(storagedTechs => {
            const techsArray = storagedTechs.split(',').map(tech => tech.trim());

            setTechs(techsArray);
        });
    }, []);

    async function handleLogout() {
        await AsyncStorage.removeItem('user');

        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.nav}>
                <TouchableOpacity 
                onPress={handleLogout}
                style={styles.logout}>
                    <Text style={styles.logoutText}>
                        Logout
                    </Text>
                </TouchableOpacity>
                <Image style={styles.logo} source={logo} />
            </View>

            <ScrollView>
                {techs.map(tech => <SpotList key={tech} tech={tech} />)}

                
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },

    nav: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },

    logout: {
        height: 32,
        paddingLeft: 20,
        alignItems: 'center',
        alignSelf: 'center',
    },

    logoutText: {
        fontSize: 18,
        alignItems: 'center',
        fontWeight: 'bold',
        marginTop: 8,
        color: '#f05a5b',
    },

    logo: {
        height: 32,
        resizeMode: 'contain',
        alignSelf: 'center',
    },

    button: {
        height: 42,
        backgroundColor: '#f05a5b',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
    },

    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});