export type LoadDetail = {
  _id: string;
  loadNumber: string;
  truckObject: string;
  trailerObject: string;
  driverObject: string;
  pickupTime: string;
  deliveryTime: string;
  pickupLocation: string;
  deliveryLocation: string;
  documents?: CustomFile[];
  price: number | null;
  detentionPrice: number | null;
  allMiles: number | null;
  fuelGallons: number | null;
  status: string;
  brokerInfo: {
    name: string;
    phoneNumber: string;
    email: string;
    company: string;
  };
  comments: string;
  createdAt: string;
  updatedAt: string;
};

export type TruckDetail = {
  _id: string;
  truckNumber: string;
  make: string;
  model: string;
  year: number;
  vin: string;
};

export type TrailerDetail = {
  _id: string;
  trailerNumber: string;
  make: string;
  model: string;
  year: number;
  vin: string;
};

export type DriverDetail = {
  _id: string;
  name: string;
  licenseNumber: string;
  phoneNumber: string;
  email: string;
};

export type VehiclesDetailsTableProps = {
  drivers: DriverDetail[];
  trucks: TruckDetail[];
  trailers: TrailerDetail[];
};

export type RepairDetail = {
  _id: string;
  repair: string;
  truckObject: string;
  trailerObject: string;
  repairDate: string;
  repairCost: string;
  repairComments: string;
};

export type PayrollDetail = {
  _id: string;
  driver: string;
  payrollDate: string;
  payrollCost: string;
};

export type Fuel = {
  _id: string;
  cost: string;
  truckObject: string;
  date: string;
  comments: string;
};

export interface CustomFile extends File {
  _id?: string;
  fileName: string;
  contentType: string;
  file: File;
  data?: any;
}
