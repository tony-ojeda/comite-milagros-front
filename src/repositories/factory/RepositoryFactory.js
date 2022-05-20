import UserRepository from '../UserRepository';
import AuthRepository from '../AuthRepository';
import VehicleRepository from '../VehicleRepository';
import UploadRepository from '../UploadRepository';

const repositories = {
  user: UserRepository,
  auth: AuthRepository,
  vehicle: VehicleRepository,
  upload: UploadRepository,
  //mas repos
};

const factory = {
  get: name => repositories[name],
};

export default factory;
