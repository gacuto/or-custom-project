import {css, html, TemplateResult, unsafeCSS } from "lit";
import {customElement, property, state} from "lit/decorators.js";
import {AppStateKeyed, Page, PageProvider} from "@openremote/or-app";
import {EnhancedStore} from "@reduxjs/toolkit";
import manager from "@openremote/core";
import {Asset} from "model";
import {AssetModelUtil} from "model";
import { pageOverviewStyles } from './page-overview-style';

export function pageOverviewProvider(store: EnhancedStore<AppStateKeyed>): PageProvider<AppStateKeyed> {
    return {
        name: "overview",
        routes: [
            "overview"
        ],
        pageCreator: () => {
            const page = new PageOverview(store);
            return page;
        }
        }
    };


interface AssetTypeCount {
    type: string;
    count: number;
    icon: string;
    color: string;
    displayName: string;
}

interface AssetFilterConfig {
    includeTypes?: string[];
    excludeTypes?: string[];
    hideSystemAssets?: boolean;
    hideGroupAssets?: boolean;
    hideAgentAssets?: boolean;
}

@customElement("page-overview")
export class PageOverview extends Page<AppStateKeyed> {
    static styles = [pageOverviewStyles];

    @state()
    protected assetCounts: AssetTypeCount[] = [];

    @state()
    protected isLoading = true;

    @property()
    protected connectivity = {
        ingress: "online",
        egress: "online"
    };

    @property()
    protected coreStatus = {
        status: "error",
        version: "01.12.22"
    };

    // Asset filtering configuration
    private assetFilter: AssetFilterConfig = {
        includeTypes: [
            "ElectricityProducerSolarAsset",
            "PVAsset",
            "ElectricityConsumerAsset",
            "EVChargingStationAsset",
            "BatteryAsset",
            "WeatherAsset",
            "ElectricityStorageAsset",
            "ElectricityProducerWindAsset",
            "HeatPumpAsset",
            "ElectricVehicleAsset"
        ],
        hideSystemAssets: true,
        hideGroupAssets: true,
        hideAgentAssets: true
    };

//     static get styles() {
//         // Import external CSS file
//         return css`
//             @import url('./page-overview.css');
//         `;
//     }

    get name(): string {
        return "overview";
    }

    constructor(store: EnhancedStore<AppStateKeyed>) {
        super(store);
    }

    protected render(): TemplateResult {
        return html`
            <div class="overview-container">
                <!-- Map Section -->
                <div class="map-section">
                    <div class="map-placeholder">
                        Map View - NetZOptimal Project Area
                    </div>
                </div>

                <!-- Statistics Grid -->
                <div class="stats-grid">
                    <!-- Active Assets Card -->
                    <div class="stat-card">
                        ${this.isLoading ? html`<div class="loading-overlay"><div class="loading-spinner"></div></div>` : ''}
                        <div class="stat-header">Active Assets</div>
                        ${this.renderActiveAssets()}
                    </div>

                    <!-- Connectivity Card -->
                    <div class="stat-card">
                        <div class="stat-header">Connectivity</div>
                        <div class="connectivity-grid">
                            <div class="connectivity-item">
                                <span>INGRESS</span>
                                <div class="status-indicator ${this.connectivity.ingress === 'online' ? 'status-online' : 'status-error'}"></div>
                            </div>
                            <div class="connectivity-item">
                                <span>EGRESS</span>
                                <div class="status-indicator ${this.connectivity.egress === 'online' ? 'status-online' : 'status-error'}"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Core Status Card -->
                    <div class="stat-card">
                        <div class="stat-header">Core</div>
                        <div class="core-section">
                            <div class="core-status">
                                <div class="status-indicator ${this.coreStatus.status === 'online' ? 'status-online' : 'status-error'}"></div>
                                <span class="version-info">VERSION: ${this.coreStatus.version}</span>
                            </div>
                            <div class="action-buttons">
                                <button class="btn btn-secondary">SEE LOGS</button>
                                <button class="btn btn-success">START</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Chart Section -->
                <div class="chart-section">
                    <div class="chart-placeholder">
                        Performance Chart Placeholder
                    </div>
                </div>
            </div>
        `;
    }

    private renderActiveAssets(): TemplateResult {
        if (this.isLoading) {
            return html`<div class="empty-state">Loading assets...</div>`;
        }

        if (this.assetCounts.length === 0) {
            return html`<div class="empty-state">No assets found</div>`;
        }

        return html`
            <div class="asset-stats">
                ${this.assetCounts.map(assetType => html`
                    <div class="asset-item" style="--asset-color: ${assetType.color}">
                        <div class="asset-icon">${assetType.icon}</div>
                        <span class="asset-count">${assetType.count}</span>
                        <span class="asset-name">${assetType.displayName}</span>
                    </div>
                `)}
            </div>
        `;
    }

    protected firstUpdated(changedProperties: Map<string, any>) {
        super.firstUpdated(changedProperties);
        this.loadAssetData();
    }

    private async loadAssetData(): Promise<void> {
        try {
            this.isLoading = true;

            console.log("Fetching assets for realm:", manager.displayRealm);

            let assets: Asset[] = [];

            try {
                const result = await manager.rest.api.AssetResource.queryAssets({});
                console.log("API response:", result);

                if (Array.isArray(result)) {
                    assets = result;
                } else if (result && result.data && Array.isArray(result.data)) {
                    assets = result.data;
                } else if (result && Array.isArray((result as any).assets)) {
                    assets = (result as any).assets;
                } else {
                    console.warn("Unexpected API response format:", result);
                }
            } catch (apiError) {
                console.error("API call failed:", apiError);
                assets = this.getMockAssets();
            }

            console.log("Final assets array:", assets);

            // Filter assets based on configuration
            const filteredAssets = assets.filter(asset => this.shouldIncludeAsset(asset));
            console.log("Filtered assets:", filteredAssets);

            // Process assets and group by type
            const assetTypeCounts = new Map<string, number>();

            filteredAssets.forEach(asset => {
                if (asset.type) {
                    const currentCount = assetTypeCounts.get(asset.type) || 0;
                    assetTypeCounts.set(asset.type, currentCount + 1);
                }
            });

            // Convert to display format
            this.assetCounts = Array.from(assetTypeCounts.entries()).map(([type, count]) => {
                const icon = this.getIconForType(type);
                const color = this.getColorForType(type);
                const displayName = this.getDisplayName(type);

                return {
                    type,
                    count,
                    icon,
                    color,
                    displayName
                };
            });

            console.log("Processed asset counts:", this.assetCounts);

        } catch (error) {
            console.error("Error loading assets:", error);
            this.assetCounts = [];
        } finally {
            this.isLoading = false;
        }
    }

    // Simplified icon system using emojis
    private getIconForType(assetType: string): string {
        const iconMap: { [key: string]: string } = {
            // Solar/PV Assets
            'PVAsset': '☀️',
            'ElectricityProducerSolarAsset': '☀️',
            'ElectricityProducerWindAsset': '🌪️',

            // Electric Vehicle & Charging
            'ElectricityConsumerAsset': '⚡',
            'EVChargingStationAsset': '🔌',
            'ElectricVehicleAsset': '🚗',

            // Storage & Battery
            'BatteryAsset': '🔋',
            'ElectricityStorageAsset': '🔋',

            // HVAC & Climate
            'HeatPumpAsset': '🌡️',
            'WeatherAsset': '🌤️',

            // System Assets
            'GroupAsset': '📁',
            'ConsoleAsset': '💻',
            'HTTPAgentAsset': '🌐',
            'MQTTAgentAsset': '📡',
            'ThingAsset': '🔧'
        };

        return iconMap[assetType] || '❓';
    }

    private getColorForType(assetType: string): string {
        const colorMap: { [key: string]: string } = {
            'PVAsset': '#ff9500',
            'ElectricityProducerSolarAsset': '#ff9500',
            'ElectricityProducerWindAsset': '#00bcd4',
            'ElectricityConsumerAsset': '#4a90e2',
            'EVChargingStationAsset': '#2196f3',
            'ElectricVehicleAsset': '#1976d2',
            'BatteryAsset': '#4caf50',
            'ElectricityStorageAsset': '#388e3c',
            'HeatPumpAsset': '#9c27b0',
            'WeatherAsset': '#607d8b'
        };

        return colorMap[assetType] || '#4a90e2';
    }

    private getDisplayName(assetType: string): string {
        const nameMap: { [key: string]: string } = {
            'ElectricityProducerSolarAsset': 'Solar Panels',
            'PVAsset': 'PV Systems',
            'ElectricityProducerWindAsset': 'Wind Turbines',
            'ElectricityConsumerAsset': 'EV Chargers',
            'EVChargingStationAsset': 'Charging Stations',
            'ElectricVehicleAsset': 'Electric Vehicles',
            'BatteryAsset': 'Batteries',
            'ElectricityStorageAsset': 'Energy Storage',
            'HeatPumpAsset': 'Heat Pumps',
            'WeatherAsset': 'Weather Stations'
        };

        return nameMap[assetType] || assetType.replace(/Asset$/, '').replace(/([A-Z])/g, ' $1').trim();
    }

    private getMockAssets(): Asset[] {
        return [
            { id: "pv-1", name: "Solar Panel 1", type: "ElectricityProducerSolarAsset", realm: manager.displayRealm } as Asset,
            { id: "pv-2", name: "Solar Panel 2", type: "ElectricityProducerSolarAsset", realm: manager.displayRealm } as Asset,
            { id: "pv-3", name: "Solar Panel 3", type: "ElectricityProducerSolarAsset", realm: manager.displayRealm } as Asset,
            { id: "ec-1", name: "EV Charger 1", type: "ElectricityConsumerAsset", realm: manager.displayRealm } as Asset,
            { id: "ec-2", name: "EV Charger 2", type: "ElectricityConsumerAsset", realm: manager.displayRealm } as Asset,
            // System assets that should be filtered out
            { id: "group-1", name: "Main Group", type: "GroupAsset", realm: manager.displayRealm } as Asset,
            { id: "console-1", name: "Console 1", type: "ConsoleAsset", realm: manager.displayRealm } as Asset,
            { id: "agent-1", name: "MQTT Agent", type: "HTTPAgentAsset", realm: manager.displayRealm } as Asset
        ];
    }

    private shouldIncludeAsset(asset: Asset): boolean {
        if (!asset.type) return false;

        const assetType = asset.type;

        // System asset types to exclude
        const systemAssetTypes = [
            'ConsoleAsset', 'RuleEngineAsset', 'NotificationAsset', 'UserAsset', 'RealmAsset'
        ];

        // Group/hierarchy asset types
        const groupAssetTypes = [
            'GroupAsset', 'BuildingAsset', 'FloorAsset', 'RoomAsset', 'CityAsset', 'AreaAsset'
        ];

        // Agent asset types
        const agentAssetTypes = [
            'HTTPAgentAsset', 'MQTTAgentAsset', 'TCPAgentAsset', 'UDPAgentAsset',
            'ModbusAgentAsset', 'KNXAgentAsset', 'ZWaveAgentAsset', 'ZigbeeAgentAsset',
            'BluetoothAgentAsset', 'VelbusBridgeAsset', 'SimulatorAgentAsset'
        ];

        // Check exclude filters
        if (this.assetFilter.hideSystemAssets && systemAssetTypes.includes(assetType)) return false;
        if (this.assetFilter.hideGroupAssets && groupAssetTypes.includes(assetType)) return false;
        if (this.assetFilter.hideAgentAssets && agentAssetTypes.includes(assetType)) return false;
        if (this.assetFilter.excludeTypes && this.assetFilter.excludeTypes.includes(assetType)) return false;

        // Check include list
        if (this.assetFilter.includeTypes && this.assetFilter.includeTypes.length > 0) {
            return this.assetFilter.includeTypes.includes(assetType);
        }

        return true;
    }

    // Public API for customizing filters
    public updateAssetFilter(newFilter: Partial<AssetFilterConfig>): void {
        this.assetFilter = { ...this.assetFilter, ...newFilter };
        console.log("Updated asset filter:", this.assetFilter);
        this.loadAssetData();
    }

    public setIncludeAssetTypes(assetTypes: string[]): void {
        this.updateAssetFilter({ includeTypes: assetTypes });
    }

    public addExcludeAssetTypes(assetTypes: string[]): void {
        const currentExcludes = this.assetFilter.excludeTypes || [];
        const newExcludes = [...new Set([...currentExcludes, ...assetTypes])];
        this.updateAssetFilter({ excludeTypes: newExcludes });
    }

    public refreshAssetData(): void {
        this.loadAssetData();
    }

    stateChanged(state: AppStateKeyed): void {
        const currentRealm = state.app.realm || manager.displayRealm;
        if (this.previousRealm && this.previousRealm !== currentRealm) {
            this.loadAssetData();
        }
        this.previousRealm = currentRealm;
    }

    private previousRealm?: string;
}