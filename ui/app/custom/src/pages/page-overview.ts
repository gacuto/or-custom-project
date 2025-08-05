import {css, html, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {AppStateKeyed, Page, PageProvider} from "@openremote/or-app";
import {EnhancedStore} from "@reduxjs/toolkit";

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
    };
}

@customElement("page-overview")
export class PageOverview extends Page<AppStateKeyed> {

    @property()
    protected activeAssets = {
        pv: 3,
        ec: 2
    };

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

    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                background: #f5f5f5;
                padding: 20px;
                box-sizing: border-box;
            }

            .overview-container {
                display: flex;
                flex-direction: column;
                gap: 30px;
                max-width: 1200px;
                margin: 0 auto;
                width: 100%;
            }

            .map-section {
                background: white;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                height: 400px;
                position: relative;
            }

            .map-placeholder {
                width: 100%;
                height: 100%;
                background: #e0e0e0;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 18px;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
            }

            .stat-card {
                background: white;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .stat-header {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #333;
                border-bottom: 2px solid #4a90e2;
                padding-bottom: 10px;
            }

            .asset-stats {
                display: flex;
                justify-content: space-around;
                align-items: center;
                margin: 20px 0;
            }

            .asset-item {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 24px;
                font-weight: bold;
            }

            .pv-icon {
                color: #ff9500;
            }

            .ec-icon {
                color: #4a90e2;
            }

            .connectivity-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 20px 0;
            }

            .connectivity-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 4px;
            }

            .status-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin-left: 10px;
            }

            .status-online {
                background-color: #28a745;
            }

            .status-error {
                background-color: #dc3545;
            }

            .core-section {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 20px 0;
            }

            .core-status {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .version-info {
                font-family: monospace;
                font-size: 18px;
                font-weight: bold;
            }

            .action-buttons {
                display: flex;
                gap: 10px;
            }

            .btn {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                text-transform: uppercase;
            }

            .btn-secondary {
                background: #6c757d;
                color: white;
            }

            .btn-success {
                background: #28a745;
                color: white;
            }

            .chart-section {
                background: white;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                height: 300px;
            }

            .chart-placeholder {
                width: 100%;
                height: 100%;
                border: 2px solid #ddd;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                position: relative;
                overflow: hidden;
            }

            .mock-chart {
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, transparent 49%, #ddd 50%, transparent 51%);
                background-size: 20px 20px;
                opacity: 0.3;
            }
        `;
    }

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
                        <div class="stat-header">ACTIVE ASSETS</div>
                        <div class="asset-stats">
                            <div class="asset-item">
                                <span class="pv-icon">☀️</span>
                                <span>${this.activeAssets.pv} PV</span>
                            </div>
                            <div class="asset-item">
                                <span class="ec-icon">🔌</span>
                                <span>${this.activeAssets.ec} EC</span>
                            </div>
                        </div>
                    </div>

                    <!-- Connectivity Card -->
                    <div class="stat-card">
                        <div class="stat-header">CONNECTIVITY</div>
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
                        <div class="stat-header">CORE</div>
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
                        <div class="mock-chart"></div>
                        <span style="position: absolute;">Performance Chart Placeholder</span>
                    </div>
                </div>
            </div>
        `;
    }

    protected firstUpdated(changedProperties: Map<string, any>) {
        super.firstUpdated(changedProperties);
        this.loadOverviewData();
    }

    private async loadOverviewData() {
        console.log("Loading overview data...");
    }

    stateChanged(state: AppStateKeyed): void {
        // Handle state changes if needed
    }
}