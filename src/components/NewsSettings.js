import React, { Component } from 'react';

export class NewsSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: JSON.parse(localStorage.getItem('newsSettings') || '{}'),
            defaultSettings: {
                theme: 'light',
                language: 'en',
                country: 'us',
                pageSize: 12,
                autoRefresh: false,
                notifications: false,
                compactView: false,
                showImages: true,
                showSource: true,
                showAuthor: true,
                showDate: true
            }
        };
    }

    componentDidMount() {
        // Initialize settings with defaults if not set
        const settings = { ...this.state.defaultSettings, ...this.state.settings };
        this.setState({ settings });
        localStorage.setItem('newsSettings', JSON.stringify(settings));
    }

    handleSettingChange = (setting, value) => {
        const newSettings = { ...this.state.settings, [setting]: value };
        this.setState({ settings: newSettings });
        localStorage.setItem('newsSettings', JSON.stringify(newSettings));

        // Apply theme change immediately
        if (setting === 'theme') {
            this.applyTheme(value);
        }
    };

    applyTheme = (theme) => {
        const body = document.body;
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
        }
    };

    resetSettings = () => {
        this.setState({ settings: this.state.defaultSettings });
        localStorage.setItem('newsSettings', JSON.stringify(this.state.defaultSettings));
        this.applyTheme('light');
    };

    exportSettings = () => {
        const settings = this.state.settings;
        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'news-settings.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    importSettings = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const settings = JSON.parse(e.target.result);
                    this.setState({ settings });
                    localStorage.setItem('newsSettings', JSON.stringify(settings));
                    this.applyTheme(settings.theme);
                } catch (error) {
                    alert('Invalid settings file');
                }
            };
            reader.readAsText(file);
        }
    };

    render() {
        const { settings } = this.state;

        return (
            <div className="container mt-4">
                <h2 className="text-center mb-4">News Settings</h2>

                <div className="row">
                    <div className="col-md-8 mx-auto">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0"><i className="fas fa-cog"></i> Customize Your Experience</h5>
                            </div>
                            <div className="card-body">

                                {/* Appearance Settings */}
                                <div className="mb-4">
                                    <h6 className="border-bottom pb-2">Appearance</h6>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Theme</label>
                                            <select
                                                className="form-select"
                                                value={settings.theme || 'light'}
                                                onChange={(e) => this.handleSettingChange('theme', e.target.value)}
                                            >
                                                <option value="light">Light Theme</option>
                                                <option value="dark">Dark Theme</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">View Mode</label>
                                            <select
                                                className="form-select"
                                                value={settings.compactView ? 'compact' : 'detailed'}
                                                onChange={(e) => this.handleSettingChange('compactView', e.target.value === 'compact')}
                                            >
                                                <option value="detailed">Detailed View</option>
                                                <option value="compact">Compact View</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Settings */}
                                <div className="mb-4">
                                    <h6 className="border-bottom pb-2">Content Display</h6>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="showImages"
                                                    checked={settings.showImages !== false}
                                                    onChange={(e) => this.handleSettingChange('showImages', e.target.checked)}
                                                />
                                                <label className="form-check-label" htmlFor="showImages">
                                                    Show Article Images
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="showSource"
                                                    checked={settings.showSource !== false}
                                                    onChange={(e) => this.handleSettingChange('showSource', e.target.checked)}
                                                />
                                                <label className="form-check-label" htmlFor="showSource">
                                                    Show Source Information
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="showAuthor"
                                                    checked={settings.showAuthor !== false}
                                                    onChange={(e) => this.handleSettingChange('showAuthor', e.target.checked)}
                                                />
                                                <label className="form-check-label" htmlFor="showAuthor">
                                                    Show Author Information
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="showDate"
                                                    checked={settings.showDate !== false}
                                                    onChange={(e) => this.handleSettingChange('showDate', e.target.checked)}
                                                />
                                                <label className="form-check-label" htmlFor="showDate">
                                                    Show Publication Date
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* News Settings */}
                                <div className="mb-4">
                                    <h6 className="border-bottom pb-2">News Preferences</h6>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Default Country</label>
                                            <select
                                                className="form-select"
                                                value={settings.country || 'us'}
                                                onChange={(e) => this.handleSettingChange('country', e.target.value)}
                                            >
                                                <option value="us">United States</option>
                                                <option value="gb">United Kingdom</option>
                                                <option value="in">India</option>
                                                <option value="ca">Canada</option>
                                                <option value="au">Australia</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Articles Per Page</label>
                                            <select
                                                className="form-select"
                                                value={settings.pageSize || 12}
                                                onChange={(e) => this.handleSettingChange('pageSize', parseInt(e.target.value))}
                                            >
                                                <option value={6}>6 articles</option>
                                                <option value={12}>12 articles</option>
                                                <option value={18}>18 articles</option>
                                                <option value={24}>24 articles</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Feature Settings */}
                                <div className="mb-4">
                                    <h6 className="border-bottom pb-2">Features</h6>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="autoRefresh"
                                                    checked={settings.autoRefresh || false}
                                                    onChange={(e) => this.handleSettingChange('autoRefresh', e.target.checked)}
                                                />
                                                <label className="form-check-label" htmlFor="autoRefresh">
                                                    Auto-refresh News
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="notifications"
                                                    checked={settings.notifications || false}
                                                    onChange={(e) => this.handleSettingChange('notifications', e.target.checked)}
                                                />
                                                <label className="form-check-label" htmlFor="notifications">
                                                    Enable Notifications
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="border-top pt-3">
                                    <div className="row">
                                        <div className="col-md-4 mb-2">
                                            <button
                                                className="btn btn-outline-secondary w-100"
                                                onClick={this.resetSettings}
                                            >
                                                <i className="fas fa-undo"></i> Reset to Default
                                            </button>
                                        </div>
                                        <div className="col-md-4 mb-2">
                                            <button
                                                className="btn btn-outline-primary w-100"
                                                onClick={this.exportSettings}
                                            >
                                                <i className="fas fa-download"></i> Export Settings
                                            </button>
                                        </div>
                                        <div className="col-md-4 mb-2">
                                            <label className="btn btn-outline-success w-100 mb-0">
                                                <i className="fas fa-upload"></i> Import Settings
                                                <input
                                                    type="file"
                                                    accept=".json"
                                                    onChange={this.importSettings}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewsSettings; 