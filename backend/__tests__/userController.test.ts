import { Request, Response } from 'express';
import * as userController from '../controllers/userController';
import User from '../models/user';

// Mock the User model
jest.mock('../models/user');
const MockedUser = User as jest.MockedClass<typeof User>;

describe('User Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users successfully', async () => {
      const mockUsers = [
        { _id: '1', name: 'John Doe', userEmail: 'john@example.com', userName: 'johndoe' },
        { _id: '2', name: 'Jane Doe', userEmail: 'jane@example.com', userName: 'janedoe' },
      ];

      MockedUser.find = jest.fn().mockResolvedValue(mockUsers);

      await userController.getAllUsers(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(MockedUser.find).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors when fetching users', async () => {
      const error = new Error('Database error');
      MockedUser.find = jest.fn().mockRejectedValue(error);

      await userController.getAllUsers(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID successfully', async () => {
      const mockUser = {
        _id: '1',
        name: 'John Doe',
        userEmail: 'john@example.com',
        userName: 'johndoe',
      };
      mockRequest.params = { id: '1' };

      MockedUser.findById = jest.fn().mockResolvedValue(mockUser);

      await userController.getUserById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(MockedUser.findById).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 when user is not found', async () => {
      mockRequest.params = { id: 'nonexistent' };

      MockedUser.findById = jest.fn().mockResolvedValue(null);

      await userController.getUserById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle errors when fetching user by ID', async () => {
      const error = new Error('Invalid ID format');
      mockRequest.params = { id: 'invalid' };

      MockedUser.findById = jest.fn().mockRejectedValue(error);

      await userController.getUserById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid ID format' });
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const mockUserData = {
        name: 'John Doe',
        userEmail: 'john@example.com',
        userName: 'johndoe',
      };
      const mockSavedUser = {
        _id: '1',
        ...mockUserData,
      };

      mockRequest.body = mockUserData;
      const saveMock = jest.fn().mockResolvedValue(mockSavedUser);
      
      // Mock the constructor to return an instance with a save method
      (MockedUser as jest.MockedClass<typeof User>).mockImplementation(() => ({
        ...mockUserData,
        save: saveMock,
      } as any));

      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(MockedUser).toHaveBeenCalledWith(mockUserData);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      // The controller returns the instance, verify it has the expected properties
      expect(mockResponse.json).toHaveBeenCalled();
      const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(jsonCall).toMatchObject(mockUserData);
    });

    it('should handle validation errors when creating user', async () => {
      const error = new Error('User validation failed: userEmail is required');
      mockRequest.body = {
        name: 'John Doe',
        userName: 'johndoe',
        // Missing userEmail
      };

      (MockedUser as jest.MockedClass<typeof User>).mockImplementation(() => {
        throw error;
      });

      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User validation failed: userEmail is required',
      });
    });

    it('should handle duplicate email errors', async () => {
      const error = new Error('E11000 duplicate key error: userEmail already exists');
      mockRequest.body = {
        name: 'John Doe',
        userEmail: 'existing@example.com',
        userName: 'johndoe',
      };

      const saveMock = jest.fn().mockRejectedValue(error);
      (MockedUser as jest.MockedClass<typeof User>).mockImplementation(() => ({
        save: saveMock,
      } as any));

      await userController.createUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'E11000 duplicate key error: userEmail already exists',
      });
    });
  });
});

