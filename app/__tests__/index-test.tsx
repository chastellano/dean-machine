import React from 'react';
import HomeScreen from '../index'
import { render, screen, userEvent, waitFor, act } from '@testing-library/react-native';
import { SoundWrapper } from '../sound-wrapper'
import { Sound } from 'expo-av/build/Audio';

const mockPlayFromPositionAsync = jest.fn().mockResolvedValue(Promise.resolve());
const mockLoadAsync = jest.fn();
const mockNewSound = jest.fn();

const screamAudio = require('@/assets/audio/the-scream.mp3');

jest.mock('../sound-wrapper');
let sound: Sound;

beforeEach(() => {
  sound = new Sound();
  SoundWrapper.newSound = mockNewSound.mockReturnValue(sound);
  SoundWrapper.playFromPositionAsync = mockPlayFromPositionAsync;
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllTimers();
  jest.useRealTimers();
})

test('renders correct image and loads sound when homescreen renders', async () => {
  SoundWrapper.loadSoundAsync = mockLoadAsync;

  render(<HomeScreen/>);

  await screen.findByTestId('before-image');
  expect(screen.queryByTestId('after-image')).toBeNull();

  expect(mockNewSound).toHaveBeenCalled();
  expect(mockLoadAsync).toHaveBeenCalledTimes(1);
  expect(mockLoadAsync).toHaveBeenCalledWith(sound, screamAudio);
});

test('plays and resets sound, shows after image when before image is pressed', async () => {
  jest.useFakeTimers();

  const mockGetStatusAsync = jest.fn();
  mockGetStatusAsync.mockResolvedValueOnce({ isPlaying: false });
  SoundWrapper.getStatusAsync = mockGetStatusAsync;

  render(<HomeScreen/>);

  const beforeImage = await screen.findByTestId('before-image');

  await userEvent.press(beforeImage);

  await screen.findByTestId('after-image');
  expect(screen.queryByTestId('before-image')).toBeNull();

  expect(mockPlayFromPositionAsync).toHaveBeenCalledWith(sound, 0);
  await jest.runOnlyPendingTimersAsync();

  await screen.findByTestId('before-image');
  expect(screen.queryByTestId('after-image')).toBeNull();
});

test('calls stopAsync when sound is finished playing', async () => {
  jest.useFakeTimers();

  const mockGetStatusAsync = jest.fn();
  mockGetStatusAsync.mockResolvedValueOnce({ isPlaying: false });
  mockGetStatusAsync.mockResolvedValueOnce({ isPlaying: true });
  mockGetStatusAsync.mockResolvedValueOnce({ isPlaying: true });
  mockGetStatusAsync.mockResolvedValueOnce({ isPlaying: true });
  mockGetStatusAsync.mockResolvedValueOnce({ isPlaying: false });

  const mockStopAsync = jest.fn();

  SoundWrapper.getStatusAsync = mockGetStatusAsync;
  SoundWrapper.stopAsync = mockStopAsync;

  render(<HomeScreen/>);

  const beforeImage = await screen.findByTestId('before-image');

  await userEvent.press(beforeImage);

  while (mockGetStatusAsync.mock.calls.length < 4) {
    await act(async () => await jest.runOnlyPendingTimersAsync());
  }

  await waitFor(() => expect(mockStopAsync).toHaveBeenCalled());
});

test('calls stopAsync when when timer expires if sound does not finish playing', async () => {
  jest.useFakeTimers();

  const mockGetStatusAsync = jest.fn();
  mockGetStatusAsync.mockResolvedValueOnce({ isPlaying: false });
  mockGetStatusAsync.mockResolvedValue({ isPlaying: true });

  const mockStopAsync = jest.fn();

  SoundWrapper.getStatusAsync = mockGetStatusAsync;
  SoundWrapper.stopAsync = mockStopAsync;

  render(<HomeScreen/>);
  const beforeImage = await screen.findByTestId('before-image');

  await userEvent.press(beforeImage);

  while (mockGetStatusAsync.mock.calls.length <= 16) {
    await act(async () => await jest.runOnlyPendingTimersAsync());
  }

  await waitFor(() => expect(mockStopAsync).toHaveBeenCalled());
});

test('calls stopAsync when getStatusAsync throws exception', async () => {
  jest.useFakeTimers();

  const mockGetStatusAsync = jest.fn();
  mockGetStatusAsync.mockResolvedValueOnce({ isPlaying: false });
  mockGetStatusAsync.mockRejectedValueOnce(new Error());
  SoundWrapper.getStatusAsync = mockGetStatusAsync;

  const mockStopAsync = jest.fn();
  SoundWrapper.stopAsync = mockStopAsync;
  
  render(<HomeScreen/>);
  const beforeImage = await screen.findByTestId('before-image');
  
  await userEvent.press(beforeImage);

  while (mockStopAsync.mock.calls.length === 0) {
    await act(async () => await jest.runOnlyPendingTimersAsync());
  }
  expect(mockStopAsync).toHaveBeenCalled();
});