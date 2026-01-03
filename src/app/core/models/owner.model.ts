export interface Owner {
    id: number;
    ownerName: string;
    shopName: string;
    address?: string;
    vehicleType?: 'BIKE' | 'CAR' | 'BOTH';
    shopType?: 'MECHANIC' | 'PUNCHER' | 'BOTH';
    mobile: string;
    email?: string;
    latitude: number;
    longitude: number;
    tube?: boolean;
    tubeless?: boolean;
    air?: boolean;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
  }
  