import { products as demoProducts } from '../data/products';
import type { Product } from '../types';
import { DEMO_MODE } from '../utils/api';
import { useResource } from './useResource';
import { useMemo } from 'react';
import { withProductPhoto } from '../utils/productPhoto';
export function useCatalog(){const resource=useResource<Product[]>(DEMO_MODE?null:'/products',20000);const data=DEMO_MODE?demoProducts:resource.data;const products=useMemo(()=> (data || []).map(withProductPhoto),[data]);return {...resource,products};}
