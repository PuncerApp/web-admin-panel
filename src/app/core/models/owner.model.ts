export interface Owner {
    id: number;
    name: string;
    shopName: string;
    location: string; 
    mobile: string;
    email?: string;
    latitude: number;
    longitude: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
  }
  