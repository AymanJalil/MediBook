import { Test, TestingModule } from '@nestjs/testing';
import { DoctorService } from './doctor.service';
import { getModelToken } from '@nestjs/mongoose';
import { Doctor } from './entities/doctor.entity';

describe('DoctorService', () => {
  let service: DoctorService;
  let model: any;

  const mockDoctorModel = class {
    constructor() { }
    save = jest.fn().mockResolvedValue({
      _id: 'some-mongo-id',
      name: 'Test Doctor',
      specialization: 'Test Specialization',
      contactInfo: 'test@example.com',
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorService,
        {
          provide: getModelToken(Doctor.name),
          useValue: mockDoctorModel
        },
      ],
    }).compile();

    service = module.get<DoctorService>(DoctorService);
    model = module.get(getModelToken(Doctor.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save a doctor to the database', async () => {
    const createDoctorInput = {
      name: 'Test Doctor',
      specialization: 'Test Specialization',
      contactInfo: 'test@example.com',
    };

    const savedDoctor = await service.create(createDoctorInput);

    expect(savedDoctor).toBeDefined();
    expect(savedDoctor.name).toEqual(createDoctorInput.name);
    expect(savedDoctor.specialization).toEqual(createDoctorInput.specialization);
    expect(savedDoctor.contactInfo).toEqual(createDoctorInput.contactInfo);
  });

  it('should create and save a random doctor to the database', async () => {
    const randomDoctor = await service.createRandomDoctor();

    expect(randomDoctor).toBeDefined();
    expect(randomDoctor.name).toBeDefined();
    expect(randomDoctor.specialization).toBeDefined();
    expect(randomDoctor.contactInfo).toBeDefined();
  });
});
