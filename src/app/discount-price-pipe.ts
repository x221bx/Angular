import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discountPrice'
})
export class DiscountPricePipe implements PipeTransform {

  transform(price: number, discountPercentage?: number): { original: number, discounted: number } {
    if (!discountPercentage || discountPercentage <= 0) {
      return { original: price, discounted: price };
    }

    const discountedPrice = price * (1 - discountPercentage / 100);
    return {
      original: price,
      discounted: Math.round(discountedPrice * 100) / 100 // Round to 2 decimal places
    };
  }

}
