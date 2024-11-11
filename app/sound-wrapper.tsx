import { AVPlaybackSource } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

export class SoundWrapper {
    static newSound = () => new Sound();
    static loadSoundAsync = async (sound: Sound, audio: AVPlaybackSource) => await sound.loadAsync(audio);
    static playFromPositionAsync = async (sound: Sound, position: number) => await sound.playFromPositionAsync(position);
    static getStatusAsync = async (sound: Sound) => await sound.getStatusAsync();
    static stopAsync = async (sound: Sound) => await sound.stopAsync();
}