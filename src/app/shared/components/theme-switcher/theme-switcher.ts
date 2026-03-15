import { Component, computed, effect, inject, PLATFORM_ID, signal, OnInit } from '@angular/core';
import { $t, updatePreset, updateSurfacePalette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Material from '@primeuix/themes/material';
import Nora from '@primeuix/themes/nora';
import { PrimeNG } from 'primeng/config';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

const presets: any = { Aura, Material, Lara, Nora };

export interface ThemeState {
    preset: string;
    primary: string;
    surface: string | null;
    darkTheme: boolean;
}

@Component({
    selector: 'app-theme-switcher',
    standalone: false,
    templateUrl: './theme-switcher.html'
})
export class ThemeSwitcher implements OnInit {
    private readonly STORAGE_KEY = 'rf_theme_state';
    document = inject(DOCUMENT);
    platformId = inject(PLATFORM_ID);
    config: PrimeNG = inject(PrimeNG);

    themeState = signal<ThemeState>({
        preset: 'Aura',
        primary: 'emerald',
        surface: null,
        darkTheme: false
    });

    // Signals for UI reactivity
    iconClass = computed(() => this.themeState().darkTheme ? 'pi-sun' : 'pi-moon');
    presets = Object.keys(presets);
    selectedPreset = computed(() => this.themeState().preset);
    selectedSurfaceColor = computed(() => this.themeState().surface);
    selectedPrimaryColor = computed(() => this.themeState().primary);

    // Added "Furniture Brown" for Ramdev Furniture brand
    surfaces = [
        { name: 'slate', palette: { 500: '#64748b' } },
        { name: 'gray', palette: { 500: '#6b7280' } },
        { name: 'zinc', palette: { 500: '#71717a' } },
        { name: 'neutral', palette: { 500: '#737373' } },
        { name: 'stone', palette: { 500: '#78716c' } } // Good for furniture themes
    ];

    constructor() {
        const saved = this.loadthemeState();
        this.themeState.set(saved);

        effect(() => {
            const state = this.themeState();
            this.savethemeState(state);
            this.handleDarkModeTransition(state);
        });
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.onPresetChange(this.themeState().preset);
        }
    }

    onThemeToggler() {
        this.themeState.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    handleDarkModeTransition(state: ThemeState) {
        if (isPlatformBrowser(this.platformId)) {
            const root = this.document.documentElement;
            if (state.darkTheme) {
                root.classList.add('p-dark');
                root.setAttribute('data-bs-theme', 'dark');
            } else {
                root.classList.remove('p-dark');
                root.removeAttribute('data-bs-theme');
            }
        }
    }

    onPresetChange(event: any) {
        this.themeState.update((state) => ({ ...state, preset: event }));
        const preset = presets[event];
        $t().preset(preset).use({ useDefaultOptions: true });
    }

    private loadthemeState(): ThemeState {
        if (isPlatformBrowser(this.platformId)) {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : { preset: 'Aura', primary: 'emerald', surface: null, darkTheme: false };
        }
        return { preset: 'Aura', primary: 'emerald', surface: null, darkTheme: false };
    }

    private savethemeState(state: ThemeState) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
        }
    }
}