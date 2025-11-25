import { Request, Response } from 'express';
import * as eventController from '../controllers/eventController';
import Event from '../models/event';

// Mock the Event model
jest.mock('../models/event');
const MockedEvent = Event as jest.MockedClass<typeof Event>;

describe('Event Controller', () => {
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

  describe('getAllEvents', () => {
    it('should return all events with populated fields', async () => {
      const mockEvents = [
        {
          _id: '1',
          name: 'Team Meeting',
          eventLink: 'https://example.com/meeting',
          eventtimeid: { _id: 'time1', startAt: new Date(), endAt: new Date() },
          organizerid: { _id: 'user1', name: 'Organizer' },
          participantsid: [{ _id: 'user2', name: 'Participant' }],
        },
      ];

      const populateMock = jest.fn().mockResolvedValue(mockEvents);
      const mockQuery = {
        populate: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: populateMock }) }),
      };
      MockedEvent.find = jest.fn().mockReturnValue(mockQuery);

      await eventController.getAllEvents(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(MockedEvent.find).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEvents);
    });

    it('should handle errors when fetching events', async () => {
      const error = new Error('Database error');
      const populateMock = jest.fn().mockRejectedValue(error);
      const mockQuery = {
        populate: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: populateMock }) }),
      };
      MockedEvent.find = jest.fn().mockReturnValue(mockQuery);

      await eventController.getAllEvents(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getEventById', () => {
    it('should return an event by ID successfully', async () => {
      const mockEvent = {
        _id: '1',
        name: 'Team Meeting',
        eventLink: 'https://example.com/meeting',
        eventtimeid: { _id: 'time1' },
        organizerid: { _id: 'user1' },
        participantsid: [],
      };
      mockRequest.params = { id: '1' };

      const populateMock = jest.fn().mockResolvedValue(mockEvent);
      const mockQuery = {
        populate: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: populateMock }) }),
      };
      MockedEvent.findById = jest.fn().mockReturnValue(mockQuery);

      await eventController.getEventById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(MockedEvent.findById).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith(mockEvent);
    });

    it('should return 404 when event is not found', async () => {
      mockRequest.params = { id: 'nonexistent' };

      const populateMock = jest.fn().mockResolvedValue(null);
      const mockQuery = {
        populate: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: populateMock }) }),
      };
      MockedEvent.findById = jest.fn().mockReturnValue(mockQuery);

      await eventController.getEventById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });

    it('should handle errors when fetching event by ID', async () => {
      const error = new Error('Invalid ID format');
      mockRequest.params = { id: 'invalid' };

      const populateMock = jest.fn().mockRejectedValue(error);
      const mockQuery = {
        populate: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: populateMock }) }),
      };
      MockedEvent.findById = jest.fn().mockReturnValue(mockQuery);

      await eventController.getEventById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid ID format' });
    });
  });

  describe('createEvent', () => {
    it('should create an event successfully', async () => {
      const mockEventData = {
        name: 'Team Meeting',
        eventLink: 'https://example.com/meeting',
        eventtimeid: 'time1',
        status: 'proposed',
        organizerid: 'user1',
        participantsid: ['user2'],
      };
      const mockSavedEvent = {
        _id: '1',
        ...mockEventData,
      };

      mockRequest.body = mockEventData;
      const saveMock = jest.fn().mockResolvedValue(mockSavedEvent);
      const eventInstance = {
        ...mockEventData,
        save: saveMock,
      };
      (MockedEvent as jest.MockedClass<typeof Event>).mockImplementation(() => eventInstance as any);

      await eventController.createEvent(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(MockedEvent).toHaveBeenCalledWith(mockEventData);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      // The controller returns the instance, not the saved result directly
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle validation errors when creating event', async () => {
      const error = new Error('Event validation failed: name is required');
      mockRequest.body = {
        eventLink: 'https://example.com/meeting',
        // Missing name
      };

      (MockedEvent as jest.MockedClass<typeof Event>).mockImplementation(() => {
        throw error;
      });

      await eventController.createEvent(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Event validation failed: name is required',
      });
    });

    it('should handle missing required fields', async () => {
      const error = new Error('Event validation failed: organizerid is required');
      mockRequest.body = {
        name: 'Team Meeting',
        eventtimeid: 'time1',
        // Missing organizerid
      };

      const saveMock = jest.fn().mockRejectedValue(error);
      (MockedEvent as jest.MockedClass<typeof Event>).mockImplementation(() => ({
        save: saveMock,
      } as any));

      await eventController.createEvent(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Event validation failed: organizerid is required',
      });
    });
  });
});

