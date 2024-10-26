import { Image, StyleSheet, View, Pressable, useWindowDimensions, ImageBackground } from 'react-native';
import { useEffect, useState } from 'react';
import { Sound } from 'expo-av/build/Audio';
import { Audio } from 'expo-av';

let sound: Sound;

export default function HomeScreen() {  
  const backgroundImage1 = require(`@/assets/images/scream-background-gradient-1.jpg`);
  const backgroundImage2 = require(`@/assets/images/scream-background-gradient-2.jpg`);
  const backgroundImage3 = require(`@/assets/images/scream-background-gradient-3.jpg`);
  const backgroundImages = [backgroundImage1, backgroundImage2, backgroundImage3]

  const [isPressed, setIsPressed] = useState<Boolean>(false);
  const [background, setBackground] = useState<string>('black');
  const [backgroundImage, setBackgroundImage] = useState(backgroundImages[0]);
  const { width } = useWindowDimensions();

  const image1Width = width * 0.5;
  const image1Height = image1Width * 1.3;

  const image2Width = width * 0.6;
  const image2Height = image2Width * 1.1;

  const resetCountdown = 750;
  const pressDelay = 175;
  
  const setNewBackgroundImage = () => {
    const indexes = [0,1,2];
    const currentIndex = backgroundImages.indexOf(backgroundImage);
    indexes.splice(currentIndex, 1)
    const newIndex = Math.floor(Math.random() * indexes.length);
    const index = indexes[newIndex];
    setBackgroundImage(backgroundImages[index])
  }

  const loadSound = async () => {
    sound = new Audio.Sound();

    try {
        await sound.loadAsync(require('@/assets/audio/the-scream.mp3'));        
    }
    catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    loadSound();
  }, [])

  useEffect(() => {  
    if (isPressed) {
      setBackground('red')
      
      setTimeout(() => {
        if(isPressed) {
          setBackground('black');
          setIsPressed(false);
          setNewBackgroundImage();
        }
      }, resetCountdown)
    }
    else {
      setBackground('black')
    }
  }, [isPressed]);

  const handlePress = async () => {
    if (sound) {
      try {      
        sound.playAsync()
        .then(() => {
          setTimeout(() => {
            setIsPressed(true);
          }, pressDelay)            
        });

        await sound.setPositionAsync(0);
      }
      catch(err) {
        console.log(err);
      }
    }    
  }

  return (
    <View style={{flex: 1, backgroundColor: background, justifyContent: "center", alignItems: "center",}}>    
      {
      isPressed ? 
      (
        <ImageBackground source={backgroundImage} resizeMode="cover" style={{flex: 1, width: width, justifyContent: "center", alignItems: "center"}}>
            <Image
              source={require('@/assets/images/scream-2-transparent.png')}
              style={{ width: image2Width, height: image2Height, ...styles.scream2 }}
            />
        </ImageBackground>
      ) 
      : 
      (
        <Pressable
          onPressIn={ () => handlePress() }>
          <Image
            source={require('@/assets/images/scream-1-transparent.png')}           
            style={{ width: image1Width, height: image1Height, ...styles.scream1 }}
          />
        </Pressable>
      )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  scream1: {
    marginRight: 20
  },
  scream2: {
    marginLeft: 90,
    marginTop: 30
  }
});
