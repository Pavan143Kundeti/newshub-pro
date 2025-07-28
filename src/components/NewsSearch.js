import React, { Component } from 'react';
import NewsItem from './news/NewsItem';
import Spinner from './Spinner';
import defaultImage from '../assets/dumy.png';
import sampleData from '../sampleData.json';

export class NewsSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      searchQuery: '',
      searchPerformed: false
    };
  }

  handleSearch = async (e) => {
    e.preventDefault();
    if (!this.state.searchQuery.trim()) return;

    this.setState({ loading: true, searchPerformed: true });
    
    try {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(this.state.searchQuery)}&apiKey=${this.props.apiKey}&pageSize=20&sortBy=publishedAt`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'ok') {
        this.setState({
          articles: data.articles,
          loading: false
        });
      } else {
        // Fallback to sample data
        this.setState({
          articles: sampleData.articles.filter(article => 
            article.title?.toLowerCase().includes(this.state.searchQuery.toLowerCase()) ||
            article.description?.toLowerCase().includes(this.state.searchQuery.toLowerCase())
          ),
          loading: false
        });
      }
    } catch (error) {
      console.log('Search error, using sample data:', error);
      this.setState({
        articles: sampleData.articles.filter(article => 
          article.title?.toLowerCase().includes(this.state.searchQuery.toLowerCase()) ||
          article.description?.toLowerCase().includes(this.state.searchQuery.toLowerCase())
        ),
        loading: false
      });
    }
  };

  render() {
    return (
      <div className="container mt-4">
        <h2 className="text-center mb-4">Search News</h2>
        
        <form onSubmit={this.handleSearch} className="mb-4">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for news..."
                  value={this.state.searchQuery}
                  onChange={(e) => this.setState({ searchQuery: e.target.value })}
                />
                <button className="btn btn-primary" type="submit">
                  Search
                </button>
              </div>
            </div>
          </div>
        </form>

        {this.state.loading && <Spinner />}
        
        {this.state.searchPerformed && !this.state.loading && (
          <div>
            <h4 className="mb-3">
              Search Results for: "{this.state.searchQuery}"
              <span className="badge bg-secondary ms-2">{this.state.articles.length} articles</span>
            </h4>
            
            {this.state.articles.length === 0 ? (
              <div className="alert alert-info">
                No articles found for "{this.state.searchQuery}". Try a different search term.
              </div>
            ) : (
              <div className="row">
                {this.state.articles.map((article, index) => (
                  <div className="col-md-4 mb-3" key={index}>
                    <NewsItem
                      title={article.title ? article.title.slice(0, 45) : ""}
                      description={article.description ? article.description.slice(0, 88) : ""}
                      imageUrl={article.urlToImage ? article.urlToImage : defaultImage}
                      newsUrl={article.url}
                      author={article.author ? article.author : "Unknown"}
                      date={article.publishedAt}
                      source={article.source?.name || "Unknown"}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default NewsSearch; 