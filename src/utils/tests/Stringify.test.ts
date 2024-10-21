import {describe, expect, it} from 'vitest';
import {Stringify} from '../Stringify';

describe('Stringify', () => {
  it('should correctly stringify a simple object', () => {
    const obj = {name: 'Alice', age: 30};
    const result = Stringify(obj);
    expect(result).toBe(JSON.stringify(obj));
  });

  it('should handle objects with nested properties', () => {
    const obj = {name: 'Alice', details: {age: 30, city: 'Wonderland'}};
    const result = Stringify(obj);
    expect(result).toBe(JSON.stringify(obj));
  });

  it('should correctly handle circular references in an object', () => {
    const obj: any = {name: 'Alice'};
    obj.self = obj; // Circular reference
    const result = Stringify(obj);
    expect(result).toBe('{"name":"Alice"}');
  });

  it('should handle arrays with circular references', () => {
    const arr: any = ['Alice', null];
    arr[1] = arr; // Circular reference
    const result = Stringify(arr);
    expect(result).toBe('["Alice",null]');
  });

  it('should handle complex structures with multiple circular references', () => {
    const obj: any = {name: 'Alice', friends: ['Bob'], details: {age: 30}};
    obj.self = obj; // Circular reference
    obj.friends.push(obj); // Circular reference in an array
    const result = Stringify(obj);
    const expected =
      '{"name":"Alice","friends":["Bob",null],"details":{"age":30}}';
    expect(result).toBe(expected);
  });
});
