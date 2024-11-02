import React from 'react';
import HomeScreen from '../index'
import { render, screen, userEvent } from '@testing-library/react-native';

const mockPlayAsync = jest.fn().mockResolvedValue(Promise.resolve());
const mockLoadAsync = jest.fn();
const mockSetPositionAsync = jest.fn();

const mockSound = { 
  playAsync: mockPlayAsync, 
  loadAsync: mockLoadAsync, 
  setPositionAsync: mockSetPositionAsync 
}

jest.mock('expo-av', () => {
  return   {
    Audio: {
      Sound: jest.fn().mockImplementation(() => mockSound) 
    }
  };
});

test('renders correct image and loads sound when homescreen renders', async () => {
  render(<HomeScreen/>);

  await screen.findByTestId('before-image');
  expect(screen.queryByTestId('after-image')).toBeNull();

  expect(mockLoadAsync).toHaveBeenCalled();
});

test('plays and resets sound, shows after image when before image is pressed', async () => {
  render(<HomeScreen/>);

  const beforeImage = await screen.findByTestId('before-image');

  await userEvent.press(beforeImage);

  await screen.findByTestId('after-image');
  expect(screen.queryByTestId('before-image')).toBeNull();

  expect(mockPlayAsync).toHaveBeenCalled();
  expect(mockSetPositionAsync).toHaveBeenCalledWith(0);

  await screen.findByTestId('before-image');
  expect(screen.queryByTestId('after-image')).toBeNull();
});