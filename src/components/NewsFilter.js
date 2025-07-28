import React, { Component } from 'react';
import NewsItem from './news/NewsItem';
import Spinner from './Spinner';
import defaultImage from '../assets/dumy.png';
import sampleData from '../sampleData.json';

export class NewsFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      filteredArticles: [],
      loading: false,
      filters: {
        dateRange: 'all',
        source: 'all',
        sortBy: 'publishedAt',
        country: 'us'
      },
      sources: [],
      countries: [
        { code: 'us', name: 'United States' },
        { code: 'gb', name: 'United Kingdom' },
        { code: 'in', name: 'India' },
        { code: 'ca', name: 'Canada' },
        { code: 'au', name: 'Australia' }
      ]
    };
  }

  componentDidMount() {
    this.fetchArticles();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.articles.length === 0 && !this.state.loading) {
      console.log('No articles available, loading sample data');
      this.setState({
        articles: sampleData.articles,
        filteredArticles: sampleData.articles,
        sources: [...new Set(sampleData.articles.map(article => article.source?.name).filter(Boolean))],
        loading: false
      });
    }
  }

  fetchArticles = async () => {
    this.setState({ loading: true });

    try {
      const url = `https://newsapi.org/v2/top-headlines?country=${this.state.filters.country}&apiKey=${this.props.apiKey}&pageSize=50`;
      console.log('Fetching articles from:', url);

      const response = await fetch(url);
      const data = await response.json();

      console.log('API Response:', data);

      if (data.status === 'ok' && data.articles && data.articles.length > 0) {
        const articles = data.articles;
        const sources = [...new Set(articles.map(article => article.source?.name).filter(Boolean))];

        console.log('Successfully fetched articles:', articles.length);
        console.log('Available sources:', sources);

        this.setState({
          articles,
          filteredArticles: articles,
          sources,
          loading: false
        });
      } else {
        console.log('API returned no articles, using sample data');
        this.setState({
          articles: sampleData.articles,
          filteredArticles: sampleData.articles,
          sources: [...new Set(sampleData.articles.map(article => article.source?.name).filter(Boolean))],
          loading: false
        });
      }
    } catch (error) {
      console.log('Filter error, using sample data:', error);
      this.setState({
        articles: sampleData.articles,
        filteredArticles: sampleData.articles,
        sources: [...new Set(sampleData.articles.map(article => article.source?.name).filter(Boolean))],
        loading: false
      });
    }
  };

  handleFilterChange = (filterType, value) => {
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        [filterType]: value
      }
    }), () => {
      // If country changes, fetch new articles
      if (filterType === 'country') {
        this.fetchArticles();
      } else {
        this.applyFilters();
      }
    });
  };

  applyFilters = () => {
    const { articles, filters } = this.state;
    let filtered = [...articles];

    console.log('Applying filters:', filters);
    console.log('Total articles before filtering:', articles.length);

    // Filter by source
    if (filters.source !== 'all') {
      filtered = filtered.filter(article => {
        const sourceMatch = article.source?.name === filters.source;
        console.log(`Article source: ${article.source?.name}, Filter source: ${filters.source}, Match: ${sourceMatch}`);
        return sourceMatch;
      });
      console.log('Articles after source filter:', filtered.length);
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate;

      if (filters.dateRange === 'today') {
        // For today, check if article is from today (same day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        cutoffDate = today;
      } else if (filters.dateRange === 'recent') {
        // For recent, use last 7 days (works better with sample data)
        const daysAgo = 7;
        cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      } else {
        const daysAgo = filters.dateRange === 'week' ? 7 :
          filters.dateRange === 'month' ? 30 : 365;
        cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      }

      filtered = filtered.filter(article => {
        const articleDate = new Date(article.publishedAt);
        let dateMatch;

        if (filters.dateRange === 'today') {
          // For today, check if it's the same day
          const articleDay = new Date(articleDate);
          articleDay.setHours(0, 0, 0, 0);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          dateMatch = articleDay.getTime() === today.getTime();
        } else if (filters.dateRange === 'recent') {
          // For recent, check if it's within last 7 days
          dateMatch = articleDate >= cutoffDate;
        } else {
          dateMatch = articleDate >= cutoffDate;
        }

        console.log(`Article date: ${articleDate}, Cutoff: ${cutoffDate}, Match: ${dateMatch}`);
        return dateMatch;
      });
      console.log('Articles after date filter:', filtered.length);
    }

    // Sort articles
    filtered.sort((a, b) => {
      if (filters.sortBy === 'publishedAt') {
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      } else if (filters.sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      } else if (filters.sortBy === 'source') {
        return (a.source?.name || '').localeCompare(b.source?.name || '');
      }
      return 0;
    });

    console.log('Final filtered articles:', filtered.length);
    this.setState({ filteredArticles: filtered });
  };

  clearFilters = () => {
    this.setState({
      filters: {
        dateRange: 'all',
        source: 'all',
        sortBy: 'publishedAt',
        country: 'us'
      }
    }, this.applyFilters);
  };

  render() {
    const { filteredArticles, loading, filters, sources, countries } = this.state;

    return (
      <div className="container mt-4">
        <h2 className="text-center mb-4">Advanced News Filter</h2>

        {/* Filter Controls */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Filter Options</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">Country</label>
                <select
                  className="form-select"
                  value={filters.country}
                  onChange={(e) => this.handleFilterChange('country', e.target.value)}
                >
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Date Range</label>
                <select
                  className="form-select"
                  value={filters.dateRange}
                  onChange={(e) => this.handleFilterChange('dateRange', e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="recent">Recent (Last 7 days)</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Source</label>
                <select
                  className="form-select"
                  value={filters.source}
                  onChange={(e) => this.handleFilterChange('source', e.target.value)}
                >
                  <option value="all">All Sources</option>
                  {sources.map(source => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Sort By</label>
                <select
                  className="form-select"
                  value={filters.sortBy}
                  onChange={(e) => this.handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="publishedAt">Date</option>
                  <option value="title">Title</option>
                  <option value="source">Source</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <button
                  className="btn btn-outline-secondary me-2"
                  onClick={this.clearFilters}
                >
                  Clear Filters
                </button>
                <button
                  className="btn btn-primary"
                  onClick={this.fetchArticles}
                >
                  Refresh
                </button>
                <button
                  className="btn btn-outline-info ms-2"
                  onClick={() => {
                    console.log('Loading sample data manually');
                    this.setState({
                      articles: sampleData.articles,
                      filteredArticles: sampleData.articles,
                      sources: [...new Set(sampleData.articles.map(article => article.source?.name).filter(Boolean))],
                      loading: false
                    });
                  }}
                >
                  Load Sample Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-3">
          <h5>
            Showing {filteredArticles.length} articles
            {filters.source !== 'all' && ` from ${filters.source}`}
            {filters.dateRange !== 'all' && ` in the last ${filters.dateRange}`}
          </h5>
          <div className="alert alert-info">
            <strong>Debug Info:</strong><br />
            Total Articles: {this.state.articles.length}<br />
            Available Sources: {sources.join(', ')}<br />
            Current Filters: {JSON.stringify(filters)}
            {this.state.articles.length > 0 && this.state.articles[0].title === sampleData.articles[0].title && (
              <div className="mt-2">
                <strong>💡 Tip:</strong> Using sample data. Try "Recent (Last 7 days)" for better date filtering results.
              </div>
            )}
          </div>
        </div>

        {loading && <Spinner />}

        {!loading && (
          <div className="row">
            {filteredArticles.map((article, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <NewsItem
                  title={article.title ? article.title.slice(0, 45) : ""}
                  description={article.description ? article.description.slice(0, 88) : ""}
                  imageUrl={article.urlToImage ? article.urlToImage : defaultImage}
                  newsUrl={article.url}
                  author={article.author ? article.author : "Unknown"}
                  date={article.publishedAt}
                  source={article.source?.name || "Unknown"}
                  category="filtered"
                />
              </div>
            ))}
          </div>
        )}

        {!loading && filteredArticles.length === 0 && (
          <div className="alert alert-info">
            No articles match your current filters. Try adjusting your filter criteria.
          </div>
        )}
      </div>
    );
  }
}

export default NewsFilter; 