export interface MenuCalculationResult {
  totalCost: number;
  costPerPerson: number;
  profitMargin: number;
  recommendedPrice: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  cost?: number;
  quantity: number;
}

export interface MenuCalculationInput {
  items: MenuItem[];
  guestCount: number;
  laborCostPercentage?: number;
  overheadPercentage?: number;
  targetProfitMargin?: number;
}

export class MenuCalculations {
  static calculateMenuCost({
    items,
    guestCount,
    laborCostPercentage = 30,
    overheadPercentage = 15,
    targetProfitMargin = 25
  }: MenuCalculationInput): MenuCalculationResult {
    // Calculate base cost from items
    const baseCost = items.reduce((total, item) => {
      const itemCost = (item.cost || item.price * 0.6) * item.quantity;
      return total + itemCost;
    }, 0);

    // Calculate total cost per person including labor and overhead
    const costPerPerson = baseCost / guestCount;
    const laborCost = costPerPerson * (laborCostPercentage / 100);
    const overheadCost = costPerPerson * (overheadPercentage / 100);
    const totalCostPerPerson = costPerPerson + laborCost + overheadCost;

    // Calculate total cost for all guests
    const totalCost = totalCostPerPerson * guestCount;

    // Calculate recommended price with target profit margin
    const profitMultiplier = 1 + (targetProfitMargin / 100);
    const recommendedPricePerPerson = totalCostPerPerson * profitMultiplier;
    const recommendedPrice = recommendedPricePerPerson * guestCount;

    // Calculate actual profit margin
    const profit = recommendedPrice - totalCost;
    const profitMargin = (profit / recommendedPrice) * 100;

    return {
      totalCost,
      costPerPerson: totalCostPerPerson,
      profitMargin,
      recommendedPrice
    };
  }

  static calculateBulkDiscount(quantity: number, basePrice: number): number {
    if (quantity >= 50) return basePrice * 0.85; // 15% discount
    if (quantity >= 20) return basePrice * 0.90; // 10% discount
    if (quantity >= 10) return basePrice * 0.95; // 5% discount
    return basePrice;
  }

  static calculateSeasonalPricing(basePrice: number, season: 'peak' | 'off' | 'normal'): number {
    switch (season) {
      case 'peak':
        return basePrice * 1.15; // 15% increase
      case 'off':
        return basePrice * 0.90; // 10% discount
      default:
        return basePrice;
    }
  }

  static calculateTotalMenuPrice(
    basePrice: number, 
    guestCount: number, 
    options: {
      bulkDiscount?: boolean;
      season?: 'peak' | 'off' | 'normal';
      customizations?: number;
    } = {}
  ): number {
    let finalPrice = basePrice;

    // Apply bulk discount if enabled
    if (options.bulkDiscount) {
      finalPrice = this.calculateBulkDiscount(guestCount, finalPrice);
    }

    // Apply seasonal pricing
    if (options.season) {
      finalPrice = this.calculateSeasonalPricing(finalPrice, options.season);
    }

    // Add customization costs
    if (options.customizations) {
      finalPrice += options.customizations;
    }

    return finalPrice * guestCount;
  }

  static estimatePreparationTime(items: MenuItem[]): number {
    const complexityFactors = {
      appetizer: 15, // minutes per item
      main: 30,
      dessert: 20,
      beverage: 5,
      special: 45
    };

    return items.reduce((total, item) => {
      // Estimate based on item name/type - simplified logic
      const complexity = item.name.toLowerCase().includes('special') ? 45 :
                        item.name.toLowerCase().includes('main') ? 30 :
                        item.name.toLowerCase().includes('dessert') ? 20 :
                        item.name.toLowerCase().includes('beverage') ? 5 : 15;
      
      return total + (complexity * item.quantity);
    }, 0);
  }

  static calculateNutritionalInfo(items: MenuItem[]): {
    estimatedCalories: number;
    servingSize: string;
  } {
    // Simplified nutritional estimation
    const avgCaloriesPerDollar = 150; // rough estimate
    const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      estimatedCalories: Math.round(totalValue * avgCaloriesPerDollar),
      servingSize: `${items.length} items`
    };
  }

  static compareMenuPricing(menus: {
    id: string;
    name: string;
    pricePerPerson: number;
    items: MenuItem[];
  }[], guestCount: number): Array<{
    id: string;
    name: string;
    totalPrice: number;
    pricePerPerson: number;
    valueScore: number; // items per dollar
  }> {
    return menus.map(menu => {
      const totalPrice = menu.pricePerPerson * guestCount;
      const valueScore = menu.items.length / menu.pricePerPerson;
      
      return {
        id: menu.id,
        name: menu.name,
        totalPrice,
        pricePerPerson: menu.pricePerPerson,
        valueScore
      };
    }).sort((a, b) => b.valueScore - a.valueScore);
  }
}

export default MenuCalculations; 