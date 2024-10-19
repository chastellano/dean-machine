import { Image, StyleSheet, View, Pressable, useWindowDimensions, ImageBackground } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { Sound } from 'expo-av/build/Audio';
import { Audio } from 'expo-av';

export default function HomeScreen() {  
  const backgroundImage1 = require(`@/assets/images/scream-background-1.png`);
  const backgroundImage2 = require(`@/assets/images/scream-background-2.jpg`);
  const backgroundImage3 = require(`@/assets/images/scream-background-3.jpg`);
  const backgroundImages = [backgroundImage1, backgroundImage2, backgroundImage3]

  const [isPressed, setIsPressed] = useState<Boolean>(false);
  const [background, setBackground] = useState<string>('black');
  const [sound, setSound] = useState<Sound>(new Audio.Sound());
  const [backgroundImage, setBackgroundImage] = useState(backgroundImages[0]);
  const { width } = useWindowDimensions();
  const imageWith = width * 0.9;
  const resetCountdown = 1000;

  const playSound = async () => {      
      if (sound) {
        try {
          await sound.setPositionAsync(0);
          await sound.playAsync();
        }
        catch(err) {
          console.log(err);
        }
      }
  }
  
  const setNewBackgroundImage = () => {
    const indexes = [0,1,2];
    const currentIndex = backgroundImages.indexOf(backgroundImage);
    indexes.splice(currentIndex, 1)
    const newIndex = Math.floor(Math.random() * indexes.length);
    const index = indexes[newIndex];
    setBackgroundImage(backgroundImages[index])
  }

  const loadSound = async () => {
    try {
      if(sound !== undefined){        
        await sound!.loadAsync(require('@/assets/audio/the-scream.mp3'));
      }
    }
    catch(err) {
      console.log(err)
    }
    setSound(sound);
  }

  useEffect(() => {
    loadSound();
  }, [])

  useEffect(() => {  
    if (isPressed) {
      setBackground('red')
      playSound();
      
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
  }, [isPressed])

  return (
    <View style={{flex: 1, backgroundColor: background, justifyContent: "center", alignItems: "center",}}>
      {!isPressed &&
        <Pressable onPress={() => setIsPressed(true)}>
          <Image
            source={require('@/assets/images/frame-01.png')}           
            style={{ width: imageWith}}
          />
        </Pressable>
      }
      {isPressed &&
      <ImageBackground source={backgroundImage} resizeMode="cover" style={{flex: 1, width: width, justifyContent: "center", alignItems: "center",}}>
        <Pressable onPress={() => setIsPressed(false)}>
          <Image
            source={require('@/assets/images/frame-02.png')}
            style={{ width: imageWith }}
          />
        </Pressable>
      </ImageBackground>
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
  reactLogo: {
    // height: 230,
    // width: 290,
    // bottom: 200,
    // left: 0,
    // position: 'absolute',
    // borderColor: 'red',
    // borderStyle: 'solid',
    // borderWidth:  3,
  },
});
