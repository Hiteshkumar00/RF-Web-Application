export interface StatisticCard {
    title: string;
    amount: number;
    colorClass: string; // e.g., 'primary', 'success', 'danger', 'info', 'secondary'
    icon: string; // e.g., 'pi-shopping-cart', 'pi-wallet'
    isRemaining?: boolean; // if true, the color becomes 'success' when amount is 0, 'danger' when > 0
}
