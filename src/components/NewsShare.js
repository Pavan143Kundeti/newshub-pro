import React, { Component } from 'react';
import NewsItem from './news/NewsItem';
import Spinner from './Spinner';
import defaultImage from '../assets/dumy.png';
import sampleData from '../sampleData.json';

export class NewsShare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      sharedArticles: JSON.parse(localStorage.getItem('sharedArticles') || '[]')
    };
  }

  componentDidMount() {
    this.fetchTrendingArticles();
  }

  fetchTrendingArticles = async () => {
    this.setState({ loading: true });

    try {
      const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${this.props.apiKey}&pageSize=20&sortBy=popularity`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'ok') {
        this.setState({
          articles: data.articles,
          loading: false
        });
      } else {
        this.setState({
          articles: sampleData.articles.slice(0, 20),
          loading: false
        });
      }
    } catch (error) {
      console.log('Share error, using sample data:', error);
      this.setState({
        articles: sampleData.articles.slice(0, 20),
        loading: false
      });
    }
  };

  shareArticle = (article, platform) => {
    const { title, url, description } = article;
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + '\n\nRead more: ' + url)}`;
        break;
      default:
        return;
    }

    // Track sharing statistics
    const sharedArticles = this.state.sharedArticles;
    const articleKey = url;

    if (!sharedArticles[articleKey]) {
      sharedArticles[articleKey] = {
        title,
        shares: {},
        totalShares: 0
      };
    }

    sharedArticles[articleKey].shares[platform] = (sharedArticles[articleKey].shares[platform] || 0) + 1;
    sharedArticles[articleKey].totalShares += 1;

    this.setState({ sharedArticles });
    localStorage.setItem('sharedArticles', JSON.stringify(sharedArticles));

    // Open share URL
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  getShareCount = (articleUrl, platform = null) => {
    const sharedArticles = this.state.sharedArticles;
    const article = sharedArticles[articleUrl];

    if (!article) return 0;

    if (platform) {
      return article.shares[platform] || 0;
    }

    return article.totalShares || 0;
  };

  render() {
    const { articles, loading } = this.state;

    return (
      <div className="container mt-4">
        <h2 className="text-center mb-4">Share Trending News</h2>

        <div className="alert alert-info">
          <h5><i className="fas fa-share-alt"></i> Share Articles</h5>
          <p className="mb-0">Click the share buttons below each article to share on your favorite social media platforms.</p>
        </div>

        {loading && <div className="text-center"><Spinner /></div>}

        {!loading && (
          <div className="row">
            {articles.map((article, index) => (
              <div className="col-md-6 mb-4" key={index}>
                <div className="card h-100">
                  <div className="card-body">
                    <NewsItem
                      title={article.title ? article.title.slice(0, 45) : ""}
                      description={article.description ? article.description.slice(0, 88) : ""}
                      imageUrl={article.urlToImage ? article.urlToImage : defaultImage}
                      newsUrl={article.url}
                      author={article.author ? article.author : "Unknown"}
                      date={article.publishedAt}
                      source={article.source?.name || "Unknown"}
                      category="shared"
                    />

                    {/* Share Buttons */}
                    <div className="mt-3">
                      <h6 className="mb-2">Share this article:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => this.shareArticle(article, 'facebook')}
                          title="Share on Facebook"
                        >
                          <i className="fab fa-facebook-f"></i> Facebook
                          <span className="badge bg-light text-dark ms-1">
                            {this.getShareCount(article.url, 'facebook')}
                          </span>
                        </button>

                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => this.shareArticle(article, 'twitter')}
                          title="Share on Twitter"
                        >
                          <i className="fab fa-twitter"></i> Twitter
                          <span className="badge bg-light text-dark ms-1">
                            {this.getShareCount(article.url, 'twitter')}
                          </span>
                        </button>

                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => this.shareArticle(article, 'whatsapp')}
                          title="Share on WhatsApp"
                        >
                          <i className="fab fa-whatsapp"></i> WhatsApp
                          <span className="badge bg-light text-dark ms-1">
                            {this.getShareCount(article.url, 'whatsapp')}
                          </span>
                        </button>

                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => this.shareArticle(article, 'linkedin')}
                          title="Share on LinkedIn"
                        >
                          <i className="fab fa-linkedin"></i> LinkedIn
                          <span className="badge bg-light text-dark ms-1">
                            {this.getShareCount(article.url, 'linkedin')}
                          </span>
                        </button>

                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => this.shareArticle(article, 'email')}
                          title="Share via Email"
                        >
                          <i className="fas fa-envelope"></i> Email
                          <span className="badge bg-light text-dark ms-1">
                            {this.getShareCount(article.url, 'email')}
                          </span>
                        </button>
                      </div>

                      <div className="mt-2">
                        <small className="text-muted">
                          Total shares: <span className="badge bg-primary">{this.getShareCount(article.url)}</span>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default NewsShare; 