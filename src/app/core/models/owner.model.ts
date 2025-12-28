export interface Owner {
    id: number;
    ownerName: string;
    shopName: string;
    address?: string;
    mobile: string;
    email?: string;
    latitude: number;
    longitude: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
  }
  