import React, { useState, useRef, useEffect } from 'react';
import MapView, {LatLng, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '../../environments';
import Constants from 'expo-constants';
import MapViewDirections from 'react-native-maps-directions';
import axios from 'axios';
import io from 'socket.io-client';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { ActivityIndicator, MD2Colors, Button } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { red400 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';


const user = FIREBASE_AUTH;
const auth = getAuth();
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = {
  latitude: 14.686361484784461,
  longitude: 121.06421657817447,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const handleLogin = async (email, password) => {
  try {
    // Sign in user with Firebase
    const response = await signInWithEmailAndPassword(auth, email, password);

    // Get the Firebase user and ID token
    const user = response.user;
    const idToken = await user.getIdToken();

    // Emit the user_login event to the server
    const socket = io('http://192.168.254.101:3000');
    socket.emit('user_login', { idToken });
  } catch (error) {
  }
};

type InputAutocompleteProps = {
  label: string;
  placeholder?: string;
  onPlaceSelected: (details: GooglePlaceDetail | null) => void;
};

function InputAutocomplete({
  label,
  placeholder,
  onPlaceSelected,
}: InputAutocompleteProps) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <GooglePlacesAutocomplete
        styles={{ textInput: styles.input }}
        placeholder={placeholder || ""}
        fetchDetails
        onPress={(data, details = null) => {
          onPlaceSelected(details);
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: "en",
          components: 'country:ph',
        }}
      />
    </>
  );
}

const App = React.memo(() => {
  const [origin, setOrigin] = useState<LatLng | null>();
  const [destination, setDestination] = useState<LatLng | null>();
  const [showDirections, setShowDirections] = useState(false);
  const [title] = useState(0);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBookingInProgress, setBookingInProgress] = useState(false);
  const mapRef = useRef<MapView>(null);
  const [uid] = useState(0);
  const [bookingStatus, setBookingStatus] = useState('');
  const [bookingId, setBookingId] = useState<string>(''); // Assuming bookingId is a string
  
  function generateBookingID() {
    const timestamp = new Date().getTime().toString(36);
    const random = Math.random().toString(36).substr(2, 5); // Adjust the length as needed
    const bookingID = `${timestamp}-${random}`;
    setBookingId(bookingID);
    return bookingID;
  }
  
  useEffect(() => {
    const socket = io('http://192.168.254.101:3000');
    
    socket.on('connect', () => {
      console.log('Connected to the server!');
    });

    // Listen for booking updates from the server
    socket.on('booking_update', (data) => {
      console.log('Received booking update:', data);
  
      if (bookingId === data.bookingId) {
        // Handle different booking status scenarios
        if (data.status === 'Accepted') {
          setBookingStatus('Accepted');
          console.log('Booking has been accepted!');
        } else if (data.status === 'Rejected') {
          console.log('Booking has been rejected');
          // You can handle rejection scenarios here
        } else if (data.status === 'InProgress') {
          // You can handle in-progress scenarios here
        } else {
          console.error('Invalid booking update:', data);
        }
      }
    });
  
    return () => {
      //socket.disconnect();
    };
  }, [bookingId, setBookingStatus]);
  
  
  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  const edgePaddingValue = 70;

  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };

  const traceRouteOnReady = (args: any) => {
    if (args) {
      // args.distance
      // args.duration
      setDistance(args.distance);
      setDuration(args.duration);
    }
  };

  const traceRoute = async () => {
    if (origin && destination && user && user.currentUser) {
      try {
        const uid = user.currentUser.uid;
        const bookingId = generateBookingID();
        const userResponse = await axios.get(`http://192.168.254.101:3000/api/user/${uid}`);
  
        if (userResponse.data) {
          const { uid, name, contact } = userResponse.data;
  
          const payload = {
            origin,
            destination,
            title,
            passenger: {
              uid,
              name,
              contact,
            },
            distance: distance,
            bookingId,
          };
          console.log(bookingId);
  
          setBookingStatus('Pending');
          console.log(bookingStatus);

          const response = await axios.post('http://192.168.254.101:3000/book', payload);
          
          const socket = io('http://192.168.254.101:3000');
          socket.emit('locationUpdate', payload);          
        } else {
          console.log('User not found',);
        }
      } catch (error) {
        console.log("THE ERROR: " + error);
      }
      setBookingInProgress(false);
      setShowDirections(true);
      mapRef.current?.fitToCoordinates([origin, destination], { edgePadding });
      console.log("Origin:",origin,"Destination:",destination);
    } else {
      console.log('Invalid Input Data');
    }
  };
  

  const onPlaceSelected = (
    details: GooglePlaceDetail | null,
    flag: "origin" | "destination"
  ) => {
    const set = flag === "origin" ? setOrigin : setDestination;
  
    if (details) {
      const position = {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        title: [details.name,details.formatted_address],
      };

      set(position);
      moveTo(position);
    };
  };
return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_POSITION}
      >
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {showDirections && origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeColor="#6644ff"
            strokeWidth={4}
            onReady={traceRouteOnReady}
          />
        )}
      </MapView>


      <View style={styles.searchContainer}>
          <>
            <InputAutocomplete
              label="Origin"
              onPlaceSelected={(details) => {
                onPlaceSelected(details, "origin");
              }}
            />
            <InputAutocomplete
              label="Destination"
              onPlaceSelected={(details) => {
                onPlaceSelected(details, "destination");
              }}
            />
            <Button style={styles.button} icon="bicycle-cargo" mode="contained" onPress={traceRoute}>
              Book
            </Button>
          </>

        {distance && duration ? (  
          <View>
            <Text><Text style={styles.title}>Distance:</Text> {distance.toFixed(2)}</Text>
            <Text><Text style={styles.title}>Duration:</Text> {Math.ceil(duration)} min</Text>
          </View>
        ) : null}
          
          {bookingStatus === 'Pending' && (
            <View>
              <ActivityIndicator animating={true} color={MD2Colors.purple300} size={'large'} />
              <Text>Looking for Driver...</Text>
            </View>
          )}
          
          {bookingStatus === 'Accepted' && (
          <View>
            <Text>Booking has been accepted! Driver is on the way!</Text>
          </View>
          )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  input: {
    borderColor: "#6B4EAA",
    borderWidth: 2,
  },
  button: {
    marginVertical: 10,
  },
  buttonText: {
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  }
});

export default App;




