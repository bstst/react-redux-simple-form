import { required } from './';

test('required passing', () => {
  expect(required('hello')).toBe(undefined);
});

test('required failing', () => {
  expect(required('')).toBe('Required');
});

test('required array passing', () => {
  expect(required([1])).toBe(undefined);
});

test('required array failing', () => {
  expect(required([])).toBe('Required');
});

