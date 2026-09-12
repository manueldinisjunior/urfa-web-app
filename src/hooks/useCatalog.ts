import { products as demoProducts } from '../data/products';
import type { Product } from '../types';
import { DEMO_MODE } from '../utils/api';
import { useResource } from './useResource';
export function useCatalog(){const resource=useResource<Product[]>(DEMO_MODE?null:'/products',20000);return {...resource,products:DEMO_MODE?demoProducts:resource.data || []};}
