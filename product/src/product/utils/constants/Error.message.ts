export class ERROR_MESSAGES {
  static readonly PRODUCT_NOT_FOUND = 'Product not found';
  static readonly CATEGORY_NOT_FOUND = 'Category not found';
  static readonly FILE_NOT_FOUND = 'File not found';
  static readonly USER_DATA_NOT_FOUND = 'User data not found';
  static readonly CATEGORY_WITH_ID_NOT_FOUND = (id: string) =>
    `Category with ID ${id} not found`;
  static readonly PRODUCT_WITH_ID_NOT_FOUND = (id: string) =>
    `Product with ID ${id} not found`;

  static readonly PRODUCT_DELETED = 'Product deleted succeddfully';
}
