export interface SystemConfiguration {
    id: number;
    propertyName: string;
    propertyDisplayName: string;
    propertyType: 'string' | 'boolean' | 'number';
    propertyValue: string;
    // Helper property for UI binding
    propertyValueBool?: boolean;
}

export interface UpdateSystemConfigurationDto {
    id: number;
    propertyValue: string;
}
