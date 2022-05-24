import UserRepository from '../UserRepository';
import AuthRepository from '../AuthRepository';
import ServiceRepository from '../ServiceRepository';
import VehicleRepository from '../VehicleRepository';
import VehicleExitRepository from '../VehicleExitRepository';
import UploadRepository from '../UploadRepository';

const repositories = {
  user: UserRepository,
  auth: AuthRepository,
  vehicle: VehicleRepository,
  vehicleExit: VehicleExitRepository,
  upload: UploadRepository,
  service: ServiceRepository,
  //mas repos
};

const factory = {
  get: name => repositories[name],
};

export default factory;
