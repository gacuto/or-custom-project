/* page-overview.css - Overview Page Styles */

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
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

.map-section {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    height: 300px;
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
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 20px;
}

.stat-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: relative;
    min-height: 150px;
}

.stat-header {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #333;
    border-bottom: 2px solid #4a90e2;
    padding-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.asset-stats {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 15px 0;
}

.asset-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: #f8f9fa;
    border-radius: 6px;
    border-left: 4px solid var(--asset-color, #4a90e2);
    font-weight: 600;
    font-size: 16px;
    transition: all 0.2s ease;
}

.asset-item:hover {
    background: #e9ecef;
    transform: translateX(2px);
}

.asset-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: var(--asset-color, #4a90e2);
    color: white;
    font-size: 18px;
    font-weight: bold;
    flex-shrink: 0;
    text-align: center;
}

.asset-count {
    font-size: 20px;
    font-weight: bold;
    color: var(--asset-color, #4a90e2);
    min-width: 30px;
}

.asset-name {
    color: #495057;
}

.connectivity-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin: 15px 0;
}

.connectivity-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 6px;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-indicator {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    margin-left: 10px;
    box-shadow: 0 0 0 2px rgba(255,255,255,0.8);
}

.status-online {
    background-color: #28a745;
    box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
}

.status-error {
    background-color: #dc3545;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
}

.core-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 15px 0;
    flex-wrap: wrap;
    gap: 15px;
}

.core-status {
    display: flex;
    align-items: center;
    gap: 12px;
}

.version-info {
    font-family: 'Courier New', monospace;
    font-size: 16px;
    font-weight: bold;
    color: #495057;
}

.action-buttons {
    display: flex;
    gap: 10px;
}

.btn {
    padding: 10px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.5px;
    transition: all 0.2s ease;
}

.btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
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
    border: 2px dashed #ddd;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 16px;
    background: #fafafa;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    z-index: 10;
}

.loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #4a90e2;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.error-message {
    color: #dc3545;
    text-align: center;
    padding: 20px;
    background: #f8d7da;
    border-radius: 4px;
    border: 1px solid #f5c6cb;
}

.empty-state {
    text-align: center;
    color: #6c757d;
    font-style: italic;
    padding: 30px;
    font-size: 16px;
}