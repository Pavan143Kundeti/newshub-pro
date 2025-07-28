import React, { Component } from 'react'
import defaultImage from "../../assets/dumy.png"


export class NewsItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBookmarked: this.checkIfBookmarked(),
      readingStartTime: null
    };
  }

  checkIfBookmarked = () => {
    const bookmarks = JSON.parse(localStorage.getItem('newsBookmarks') || '[]');
    return bookmarks.some(bookmark => bookmark.url === this.props.newsUrl);
  };

  handleImageError = (event) => {
    event.target.onerror = null;
    event.target.src = defaultImage;
    event.target.alt = "dummy image";
  };

  toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('newsBookmarks') || '[]');
    const articleData = {
      title: this.props.title,
      description: this.props.description,
      urlToImage: this.props.imageUrl,
      url: this.props.newsUrl,
      author: this.props.author,
      publishedAt: this.props.date,
      source: { name: this.props.source },
      category: this.props.category
    };

    if (this.state.isBookmarked) {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.url !== this.props.newsUrl);
      localStorage.setItem('newsBookmarks', JSON.stringify(updatedBookmarks));
      this.setState({ isBookmarked: false });
    } else {
      bookmarks.push(articleData);
      localStorage.setItem('newsBookmarks', JSON.stringify(bookmarks));
      this.setState({ isBookmarked: true });
    }
  };

  handleReadMore = () => {
    // Track reading statistics
    const stats = JSON.parse(localStorage.getItem('readingStats') || '{}');
    const articleKey = this.props.newsUrl;
    
    if (!stats[articleKey]) {
      stats[articleKey] = {
        title: this.props.title,
        category: this.props.category,
        readingTime: 0,
        readCount: 0,
        lastRead: new Date().toISOString()
      };
    }
    
    stats[articleKey].readCount += 1;
    stats[articleKey].lastRead = new Date().toISOString();
    localStorage.setItem('readingStats', JSON.stringify(stats));
  };

  render() {
    let {title,description,imageUrl,newsUrl,author,date,source } = this.props;
    return (
      <div className='my-3'>
        <div className="card">
            <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger" style={{zIndex:"1",left:"85%"}}>
              {source}
            </span>
            <button
              className={`btn btn-sm position-absolute ${this.state.isBookmarked ? 'btn-warning' : 'btn-outline-warning'}`}
              style={{ top: '10px', left: '10px', zIndex: 10 }}
              onClick={this.toggleBookmark}
              title={this.state.isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
            >
              {this.state.isBookmarked ? '★' : '☆'}
            </button>
            <img src={imageUrl} loading='lazy' onError={this.handleImageError}  className="card-img-top" alt="..."/>
            <div className="card-body">
                <h5 className="card-title">{title}...</h5>
                <p className="card-text">{description}...</p>
                <p className="card-text"><small className="text-muted">By {author} on {new Date(date).toGMTString()}</small></p>
                <a href={newsUrl} target='_blanck' className="btn btn-sm btn-primary" onClick={this.handleReadMore}>Read more</a>
            </div>
            </div>
      </div>
    )
  }
}

export default NewsItem
