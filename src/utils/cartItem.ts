import type { CartItem, Product, ProductExtra, SelectedProductOption } from '../types';

export const createCartItem = (
  product: Product,
  selectedOptionIds: Record<string, string> = {},
  selectedExtraIds: string[] = [],
  quantity = 1,
): CartItem => {
  const variant=product.variants?.find(v=>v.id===selectedOptionIds.variant);
  const baseProduct=product;
  if(variant)product={...product,price:variant.price,optionGroups:variant.optionGroups,extras:variant.extras};
  const selectedOptions: SelectedProductOption[] = (product.optionGroups ?? []).flatMap((group) => {
    const option = group.options.find((entry) => entry.id === selectedOptionIds[group.id]);
    return option ? [{
      groupId: group.id,
      groupName: group.name,
      optionId: option.id,
      optionName: option.name,
      price: option.price ?? 0,
    }] : [];
  });

  if(variant)selectedOptions.unshift({groupId:'variant',groupName:'Größe',optionId:variant.id,optionName:variant.name,price:0});
  const selectedExtras: ProductExtra[] = (product.extras ?? []).filter((extra) => selectedExtraIds.includes(extra.id));
  const optionTotal = selectedOptions.reduce((sum, option) => sum + option.price, 0);
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const configurationKey = [
    ...selectedOptions.map((option) => `${option.groupId}:${option.optionId}`),
    ...selectedExtras.map((extra) => `extra:${extra.id}`).sort(),
  ].join('|');

  return {
    lineId: configurationKey ? `${product.id}::${configurationKey}` : product.id,
    id: baseProduct.id,
    minAge: baseProduct.minAge,
    name: product.name,
    price: Math.round((product.price + optionTotal + extrasTotal)*100)/100,
    quantity,
    imageUrl: product.imageUrl,
    selectedOptions,
    selectedExtras,
  };
};
