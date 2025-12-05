import { Request, Response } from 'express';
import * as eventtimeController from '../controllers/eventtimeController';
import Eventtime from '../models/eventtime';

// Mock the Eventtime model
jest.mock('../models/eventtime');
const MockedEventtime = Eventtime as jest.MockedClass<typeof Eventtime>;

describe('Eventtime Controller', () => {
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

  describe('getAllEventtimes', () => {
    it('should return all eventtimes successfully', async () => {
      const mockEventtimes = [
        {
          _id: '1',
          startAt: new Date('2024-01-01T10:00:00Z'),
          endAt: new Date('2024-01-01T11:00:00Z'),
        },
        {
          _id: '2',
          startAt: new Date('2024-01-02T14:00:00Z'),
          endAt: new Date('2024-01-02T15:00:00Z'),
        },
      ];

      MockedEventtime.find = jest.fn().mockResolvedValue(mockEventtimes);

      await eventtimeController.getAllEventtimes(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(MockedEventtime.find).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEventtimes);
    });

    it('should handle errors when fetching eventtimes', async () => {
      const error = new Error('Database error');
      MockedEventtime.find = jest.fn().mockRejectedValue(error);

      await eventtimeController.getAllEventtimes(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Database error' });
    });

    it('should return empty array when no eventtimes exist', async () => {
      MockedEventtime.find = jest.fn().mockResolvedValue([]);

      await eventtimeController.getAllEventtimes(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getEventtimeById', () => {
    it('should return an eventtime by ID successfully', async () => {
      const mockEventtime = {
        _id: '1',
        startAt: new Date('2024-01-01T10:00:00Z'),
        endAt: new Date('2024-01-01T11:00:00Z'),
      };
      mockRequest.params = { id: '1' };

      MockedEventtime.findById = jest.fn().mockResolvedValue(mockEventtime);

      await eventtimeController.getEventtimeById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(MockedEventtime.findById).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith(mockEventtime);
    });

    it('should return 404 when eventtime is not found', async () => {
      mockRequest.params = { id: 'nonexistent' };

      MockedEventtime.findById = jest.fn().mockResolvedValue(null);

      await eventtimeController.getEventtimeById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Eventtimes not found' });
    });

    it('should handle errors when fetching eventtime by ID', async () => {
      const error = new Error('Invalid ID format');
      mockRequest.params = { id: 'invalid' };

      MockedEventtime.findById = jest.fn().mockRejectedValue(error);

      await eventtimeController.getEventtimeById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid ID format' });
    });
  });

  describe('createEventtime', () => {
    it('should create an eventtime successfully', async () => {
      const mockEventtimeData = {
        startAt: new Date('2024-01-01T10:00:00Z'),
        endAt: new Date('2024-01-01T11:00:00Z'),
      };
      const mockSavedEventtime = {
        _id: '1',
        ...mockEventtimeData,
      };

      mockRequest.body = mockEventtimeData;
      const saveMock = jest.fn().mockResolvedValue(mockSavedEventtime);
      (MockedEventtime as jest.MockedClass<typeof Eventtime>).mockImplementation(() => ({
        ...mockEventtimeData,
        save: saveMock,
      } as any));

      await eventtimeController.createEventtime(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(MockedEventtime).toHaveBeenCalledWith(mockEventtimeData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should handle validation errors when creating eventtime', async () => {
      const error = new Error('Eventtime validation failed: startAt is required');
      mockRequest.body = {
        endAt: new Date('2024-01-01T11:00:00Z'),
        // Missing startAt
      };

      (MockedEventtime as jest.MockedClass<typeof Eventtime>).mockImplementation(() => {
        throw error;
      });

      await eventtimeController.createEventtime(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Eventtime validation failed: startAt is required',
      });
    });

    it('should handle invalid date format', async () => {
      const error = new Error('Cast to Date failed for value "invalid"');
      mockRequest.body = {
        startAt: 'invalid',
        endAt: new Date('2024-01-01T11:00:00Z'),
      };

      const saveMock = jest.fn().mockRejectedValue(error);
      (MockedEventtime as jest.MockedClass<typeof Eventtime>).mockImplementation(() => ({
        save: saveMock,
      } as any));

      await eventtimeController.createEventtime(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Cast to Date failed for value "invalid"',
      });
    });

    it('should handle endAt before startAt validation', async () => {
      const error = new Error('endAt must be after startAt');
      mockRequest.body = {
        startAt: new Date('2024-01-01T11:00:00Z'),
        endAt: new Date('2024-01-01T10:00:00Z'), // endAt before startAt
      };

      const saveMock = jest.fn().mockRejectedValue(error);
      (MockedEventtime as jest.MockedClass<typeof Eventtime>).mockImplementation(() => ({
        save: saveMock,
      } as any));

      await eventtimeController.createEventtime(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'endAt must be after startAt',
      });
    });
  });
});

