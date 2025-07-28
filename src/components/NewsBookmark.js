import React, { Component } from 'react';
import NewsItem from './news/NewsItem';
import defaultImage from '../assets/dumy.png';

export class NewsBookmark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarks: JSON.parse(localStorage.getItem('newsBookmarks') || '[]')
    };
  }

  removeBookmark = (url) => {
    const updatedBookmarks = this.state.bookmarks.filter(bookmark => bookmark.url !== url);
    this.setState({ bookmarks: updatedBookmarks });
    localStorage.setItem('newsBookmarks', JSON.stringify(updatedBookmarks));
  };

  clearAllBookmarks = () => {
    this.setState({ bookmarks: [] });
    localStorage.removeItem('newsBookmarks');
  };

  render() {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>My Bookmarked Articles</h2>
          {this.state.bookmarks.length > 0 && (
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={this.clearAllBookmarks}
            >
              Clear All
            </button>
          )}
        </div>

        {this.state.bookmarks.length === 0 ? (
          <div className="text-center">
            <div className="alert alert-info">
              <h4>No bookmarked articles yet!</h4>
              <p>Click the bookmark icon on any article to save it here.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-3">
              <span className="badge bg-primary">{this.state.bookmarks.length} bookmarked articles</span>
            </div>
            <div className="row">
              {this.state.bookmarks.map((article, index) => (
                <div className="col-md-4 mb-3" key={index}>
                  <div className="position-relative">
                    <button
                      className="btn btn-sm btn-danger position-absolute"
                      style={{ top: '10px', right: '10px', zIndex: 10 }}
                      onClick={() => this.removeBookmark(article.url)}
                    >
                      ×
                    </button>
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default NewsBookmark; 