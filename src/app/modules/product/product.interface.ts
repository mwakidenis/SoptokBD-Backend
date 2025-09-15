export type TProduct = {
  name: string;
  type:
    | 'Tablet'
    | 'Capsule'
    | 'Syrup'
    | 'Injection'
    | 'Cream'
    | 'Drops'
    | 'Food'
    | 'Skin'
    | 'Baby';
  description: string;
  price: number;
  discount: number;
  imageUrl: string[];
  manufacturer: string;
  quantity: number;
  expireDate: string;
  inStock: boolean;
  requiredPrescription: boolean;
};
