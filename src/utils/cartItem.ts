import type { CartItem, Product, ProductExtra, SelectedProductOption } from '../types';

export const createCartItem = (
  product: Product,
  selectedOptionIds: Record<string, string> = {},
  selectedExtraIds: string[] = [],
  quantity = 1,
): CartItem => {
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

  const selectedExtras: ProductExtra[] = (product.extras ?? []).filter((extra) => selectedExtraIds.includes(extra.id));
  const optionTotal = selectedOptions.reduce((sum, option) => sum + option.price, 0);
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const configurationKey = [
    ...selectedOptions.map((option) => `${option.groupId}:${option.optionId}`),
    ...selectedExtras.map((extra) => `extra:${extra.id}`).sort(),
  ].join('|');

  return {
    lineId: configurationKey ? `${product.id}::${configurationKey}` : product.id,
    id: product.id,
    name: product.name,
    price: product.price + optionTotal + extrasTotal,
    quantity,
    imageUrl: product.imageUrl,
    selectedOptions,
    selectedExtras,
  };
};
