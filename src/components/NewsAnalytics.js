import React, { Component } from 'react';

export class NewsAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readingStats: JSON.parse(localStorage.getItem('readingStats') || '{}'),
      totalArticlesRead: 0,
      favoriteCategories: {},
      readingTime: 0
    };
  }

  componentDidMount() {
    this.calculateStats();
  }

  calculateStats = () => {
    const stats = this.state.readingStats;
    let totalRead = 0;
    let totalTime = 0;
    const categories = {};

    Object.values(stats).forEach(article => {
      totalRead++;
      totalTime += article.readingTime || 0;
      if (article.category) {
        categories[article.category] = (categories[article.category] || 0) + 1;
      }
    });

    this.setState({
      totalArticlesRead: totalRead,
      readingTime: totalTime,
      favoriteCategories: categories
    });
  };

  getTopCategories = () => {
    const categories = this.state.favoriteCategories;
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  formatReadingTime = (minutes) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  render() {
    const topCategories = this.getTopCategories();

    return (
      <div className="container mt-4">
        <h2 className="text-center mb-4">Reading Analytics</h2>
        
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Total Articles Read</h5>
                <h2 className="text-primary">{this.state.totalArticlesRead}</h2>
                <p className="card-text">Articles you've read</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Total Reading Time</h5>
                <h2 className="text-success">{this.formatReadingTime(this.state.readingTime)}</h2>
                <p className="card-text">Time spent reading</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Average Time</h5>
                <h2 className="text-info">
                  {this.state.totalArticlesRead > 0 
                    ? Math.round(this.state.readingTime / this.state.totalArticlesRead) 
                    : 0} min
                </h2>
                <p className="card-text">Per article</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5>Favorite Categories</h5>
              </div>
              <div className="card-body">
                {topCategories.length > 0 ? (
                  <div>
                    {topCategories.map(([category, count], index) => (
                      <div key={category} className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-primary me-2">{index + 1}</span>
                        <span className="text-capitalize">{category}</span>
                        <span className="badge bg-secondary">{count} articles</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No reading data available yet.</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5>Reading Insights</h5>
              </div>
              <div className="card-body">
                {this.state.totalArticlesRead > 0 ? (
                  <div>
                    <p><strong>Most Active:</strong> {topCategories[0]?.[0] || 'N/A'}</p>
                    <p><strong>Total Categories:</strong> {Object.keys(this.state.favoriteCategories).length}</p>
                    <p><strong>Average Daily:</strong> {Math.round(this.state.totalArticlesRead / 7)} articles</p>
                  </div>
                ) : (
                  <p className="text-muted">Start reading articles to see insights!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewsAnalytics; 