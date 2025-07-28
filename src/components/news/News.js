import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from '../Spinner';
import defaultImage from '../../assets/dumy.png'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
import sampleData from '../../sampleData.json'; // Importing sample data

export class News extends Component {
  generateId = () => {
    let length = 10
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }

  generateSimulatedNews = () => {
    const newsTemplates = [
      {
        title: "Breaking: Major Development in Technology Sector",
        description: "A significant breakthrough has been announced in the technology industry, promising to revolutionize how we interact with digital devices.",
        source: { name: "Tech News Daily" }
      },
      {
        title: "Global Markets React to Economic Policy Changes",
        description: "Financial markets worldwide are responding to recent policy announcements, with analysts predicting long-term implications for investors.",
        source: { name: "Business Insider" }
      },
      {
        title: "Sports: Championship Game Sets New Records",
        description: "An incredible performance in last night's championship game has broken several historical records and captivated audiences worldwide.",
        source: { name: "Sports Central" }
      },
      {
        title: "Health & Science: Revolutionary Medical Discovery",
        description: "Researchers have made a groundbreaking discovery that could lead to new treatments for previously untreatable conditions.",
        source: { name: "Science Today" }
      },
      {
        title: "Entertainment: Award Show Highlights and Controversies",
        description: "The annual awards ceremony featured stunning performances and unexpected moments that are already trending on social media.",
        source: { name: "Entertainment Weekly" }
      },
      {
        title: "Politics: International Summit Addresses Global Challenges",
        description: "World leaders gathered for a critical summit to discuss pressing global issues and announce collaborative solutions.",
        source: { name: "World News" }
      }
    ];

    return newsTemplates.map((template, index) => ({
      ...template,
      url: `https://example.com/news/${index + 1}`,
      urlToImage: defaultImage,
      author: "NewsHub Pro",
      publishedAt: new Date().toISOString(),
      title: template.title + ` (Updated at ${new Date().toLocaleTimeString()})`
    }));
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static defaultProps = {
    pageSize: 9,
    category: "general",
    country: "in"
  }

  static propTypes = {
    pageSize: PropTypes.number,
    category: PropTypes.string.isRequired,
    country: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
      isOpen: false,
      lastRefresh: null,
      autoRefreshEnabled: true,
      showRefreshNotification: false,
      countdown: 30
    }
    document.title = `${this.capitalize(this.props.category)} News - NewsHub Pro`;
    this.refreshInterval = null;
    this.countdownInterval = null;
  }

  async fetchData(url) {
    try {
      let data = await fetch(url);
      let parsedData = await data.json();
      console.log("api data", parsedData);
      if (parsedData.status !== "error") {
        return parsedData;
      }
      return sampleData;
    } catch (error) {
      console.log("Error fetching data, using sample data:", error);
      return sampleData;
    }
  }

  async componentDidMount() {
    this.setState({ loading: true });

    // If no API key is provided or it's a dummy key, use sample data directly
    if (!this.props.apiKey || this.props.apiKey === 'undefined' || this.props.apiKey === 'dummy_key') {
      console.log("No valid API key provided, using simulated news");
      // Generate simulated news for demonstration
      const simulatedNews = this.generateSimulatedNews();

      this.setState({
        articles: simulatedNews,
        totalResults: simulatedNews.length,
        loading: false,
        lastRefresh: new Date()
      });
      this.startAutoRefresh();
      return;
    }

    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data = await this.fetchData(url);
    this.setState({
      articles: data.articles,
      totalResults: data.totalResults,
      loading: false,
      lastRefresh: new Date()
    });

    // Start auto-refresh timer
    this.startAutoRefresh();
  }

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 });
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
    let data = await this.fetchData(url);
    this.setState({
      articles: this.state.articles.concat(data.articles || []),
      totalResults: data.totalResults
    });
  };

  startAutoRefresh = () => {
    // Clear any existing intervals
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    // Reset countdown
    this.setState({ countdown: 30 });

    // Set up countdown timer
    this.countdownInterval = setInterval(() => {
      this.setState(prevState => ({
        countdown: prevState.countdown > 0 ? prevState.countdown - 1 : 30
      }));
    }, 1000);

    // Set up new interval for 30 seconds
    this.refreshInterval = setInterval(() => {
      if (this.state.autoRefreshEnabled) {
        this.refreshNews();
        this.setState({ countdown: 30 }); // Reset countdown after refresh
      }
    }, 30000); // 30 seconds
  };

  stopAutoRefresh = () => {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  };

  refreshNews = async () => {
    console.log('Auto-refreshing news...');
    this.setState({ loading: true });

    // Reset to page 1 for fresh news
    this.setState({ page: 1 });

    if (!this.props.apiKey || this.props.apiKey === 'undefined' || this.props.apiKey === 'dummy_key') {
      // For sample data, generate new simulated news articles
      const simulatedNews = this.generateSimulatedNews();

      this.setState({
        articles: simulatedNews,
        totalResults: simulatedNews.length,
        lastRefresh: new Date(),
        loading: false,
        showRefreshNotification: true
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        this.setState({ showRefreshNotification: false });
      }, 3000);
      return;
    }

    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=1&pageSize=${this.props.pageSize}`;
    let data = await this.fetchData(url);
    this.setState({
      articles: data.articles,
      totalResults: data.totalResults,
      loading: false,
      lastRefresh: new Date(),
      showRefreshNotification: true
    });

    // Hide notification after 3 seconds
    setTimeout(() => {
      this.setState({ showRefreshNotification: false });
    }, 3000);
  };

  toggleAutoRefresh = () => {
    this.setState(prevState => ({
      autoRefreshEnabled: !prevState.autoRefreshEnabled
    }), () => {
      if (this.state.autoRefreshEnabled) {
        this.startAutoRefresh();
      } else {
        this.stopAutoRefresh();
      }
    });
  };

  componentWillUnmount() {
    this.stopAutoRefresh();
  }

  render() {
    const { lastRefresh, autoRefreshEnabled, showRefreshNotification, countdown } = this.state;
    const formatTime = (date) => {
      if (!date) return '';
      return date.toLocaleTimeString();
    };

    return (
      <>
        <h1 className='text-center' style={{ marginTop: "80px" }}>NewsHub Pro - Top {this.capitalize(this.props.category)} headlines</h1>

        {/* Refresh notification */}
        {showRefreshNotification && (
          <div className='container mb-3'>
            <div className='alert alert-success alert-dismissible fade show text-center' role='alert'>
              <i className='fas fa-sync-alt me-2'></i>
              <strong>News refreshed!</strong> {this.props.apiKey && this.props.apiKey !== 'undefined' && this.props.apiKey !== 'dummy_key' ?
                'Latest headlines updated' :
                'New simulated articles generated'
              } at {formatTime(new Date())}
              <button type='button' className='btn-close' onClick={() => this.setState({ showRefreshNotification: false })}></button>
            </div>
          </div>
        )}

        {/* Auto-refresh controls */}
        <div className='container mb-3'>
          <div className='row justify-content-center'>
            <div className='col-md-8'>
              <div className='card'>
                <div className='card-body text-center'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <div>
                      <i className={`fas fa-sync-alt ${autoRefreshEnabled ? 'text-success' : 'text-muted'}`}></i>
                      <span className='ms-2'>
                        Auto-refresh: <strong>{autoRefreshEnabled ? 'ON' : 'OFF'}</strong>
                        {autoRefreshEnabled && (
                          <span className='ms-2 text-info'>
                            <i className='fas fa-hourglass-half'></i> Next refresh in {countdown}s
                          </span>
                        )}
                      </span>
                    </div>
                    <div>
                      <button
                        className={`btn btn-sm ${autoRefreshEnabled ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        onClick={this.toggleAutoRefresh}
                      >
                        <i className={`fas ${autoRefreshEnabled ? 'fa-pause' : 'fa-play'}`}></i>
                        {autoRefreshEnabled ? ' Pause' : ' Start'} Auto-refresh
                      </button>
                      <button
                        className='btn btn-sm btn-outline-primary ms-2'
                        onClick={this.refreshNews}
                      >
                        <i className='fas fa-sync-alt'></i> Refresh Now
                      </button>
                    </div>
                  </div>
                  {lastRefresh && (
                    <div className='mt-2 text-muted small'>
                      <i className='fas fa-clock'></i> Last updated: {formatTime(lastRefresh)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >
          <div className='container'>
            <div className='row'>
              {this.state.articles.map((ele) => {
                return <div className='col-md-4' key={ele.url + this.generateId()}>
                  <NewsItem title={ele.title ? ele.title.slice(0, 45) : ""} description={ele.description ? ele.description.slice(0, 88) : ""} imageUrl={ele.urlToImage ? ele.urlToImage : defaultImage} newsUrl={ele.url} author={ele.author ? ele.author : "Unknown"} date={ele.publishedAt} source={ele.source.name} category={this.props.category} />
                </div>
              })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    )
  }
}

export default News
