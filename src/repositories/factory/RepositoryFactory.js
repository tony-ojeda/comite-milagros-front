import UserRepository from '../UserRepository';
import AuthRepository from '../AuthRepository';
import ServiceRepository from '../ServiceRepository';
import TransactionRepository from '../TransactionRepository';
import TransactionDetailRepository from '../TransactionDetailRepository';
import VehicleRepository from '../VehicleRepository';
import VehicleExitRepository from '../VehicleExitRepository';
import UploadRepository from '../UploadRepository';

const repositories = {
  user: UserRepository,
  auth: AuthRepository,
  vehicle: VehicleRepository,
  vehicleExit: VehicleExitRepository,
  transaction: TransactionRepository,
  transactionDetail: TransactionDetailRepository,
  upload: UploadRepository,
  service: ServiceRepository,
  //mas repos
};

const factory = {
  get: name => repositories[name],
};

export default factory;
