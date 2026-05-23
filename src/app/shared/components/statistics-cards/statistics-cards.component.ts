import { Component, Input } from '@angular/core';
import { StatisticCard } from '../../models/statistic-card.model';
import { AccountDetailsService } from '../../../core/services/account-details.service';

@Component({
    selector: 'app-statistics-cards',
    standalone: false,
    templateUrl: './statistics-cards.component.html'
})
export class StatisticsCardsComponent {
    @Input() cards: StatisticCard[] = [];

    constructor(public accountDetailsService: AccountDetailsService) {}

    getColorClass(card: StatisticCard): string {
        if (card.isRemaining) {
            return card.amount > 0 ? 'danger' : 'success';
        }
        return card.colorClass;
    }
}
