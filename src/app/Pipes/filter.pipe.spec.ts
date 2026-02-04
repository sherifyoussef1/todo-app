import { FilterPipe } from './filter.pipe';
import { ITodo } from '../Models/ITodo';

describe('FilterPipe', () => {
  let pipe: FilterPipe;

  const mockTodos: ITodo[] = [
    { id: 1, title: 'Todo 1', completed: false, userId: 1 },
    { id: 2, title: 'Todo 2', completed: true, userId: 1 },
    { id: 3, title: 'Todo 3', completed: false, userId: 2 },
  ];

  beforeEach(() => {
    pipe = new FilterPipe();
  });

  // Test 1: Pipe should be created
  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  // Test 2: Should filter completed todos
  it('should filter completed todos', () => {
    const result = pipe.transform(mockTodos, 'completed', true);

    expect(result.length).toBe(1);
    expect(result[0].completed).toBe(true);
  });

  // Test 3: Should filter pending todos
  it('should filter pending todos', () => {
    const result = pipe.transform(mockTodos, 'completed', false);

    expect(result.length).toBe(2);
    expect(result[0].completed).toBe(false);
  });

  // Test 4: Should filter by userId
  it('should filter by userId', () => {
    const result = pipe.transform(mockTodos, 'userId', 2);

    expect(result.length).toBe(1);
    expect(result[0].userId).toBe(2);
  });

  // Test 5: Should return empty array when no match
  it('should return empty array for no matches', () => {
    const result = pipe.transform(mockTodos, 'id', 999);

    expect(result.length).toBe(0);
  });
});
