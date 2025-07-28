import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from "./components/Navbar";
import News from "./components/news/News";
import NewsSearch from "./components/NewsSearch";
import NewsBookmark from "./components/NewsBookmark";
import NewsAnalytics from "./components/NewsAnalytics";
import NewsFilter from "./components/NewsFilter";
import NewsShare from "./components/NewsShare";
import NewsSettings from "./components/NewsSettings";

export default class App extends Component {
  page = 12;
  news_api = process.env.REACT_APP_NEWS_API || '54c5895d45d943d0972b9aa699036e4a';
  render() {
    return (
      <div>
        <Router>
          <Navbar />
          <Routes>
            <Route exact path="/business" element={<News key="business" apiKey={this.news_api} pageSize={this.page} country="us" category="business" />} />
            <Route exact path="/entertainment" element={<News key="entertainment" apiKey={this.news_api} pageSize={this.page} country="us" category="entertainment" />} />
            <Route exact path="/general" element={<News key="general" apiKey={this.news_api} pageSize={this.page} country="us" category="general" />} />
            <Route exact path="/health" element={<News key="health" apiKey={this.news_api} pageSize={this.page} country="us" category="health" />} />
            <Route exact path="/science" element={<News key="science" apiKey={this.news_api} pageSize={this.page} country="us" category="science" />} />
            <Route exact path="/sports" element={<News key="sports" apiKey={this.news_api} pageSize={this.page} country="us" category="sports" />} />
            <Route exact path="/technology" element={<News key="technology" apiKey={this.news_api} pageSize={this.page} country="us" category="technology" />} />
            <Route exact path="/home" element={<News key="general" apiKey={this.news_api} pageSize={this.page} country="us" category="general" />} />
            <Route exact path="/" element={<News key="general" apiKey={this.news_api} pageSize={this.page} country="us" category="general" />} />
            <Route exact path="/search" element={<NewsSearch apiKey={this.news_api} />} />
            <Route exact path="/filter" element={<NewsFilter apiKey={this.news_api} />} />
            <Route exact path="/share" element={<NewsShare apiKey={this.news_api} />} />
            <Route exact path="/bookmarks" element={<NewsBookmark />} />
            <Route exact path="/analytics" element={<NewsAnalytics />} />
            <Route exact path="/settings" element={<NewsSettings />} />
          </Routes>
        </Router>
      </div>
    );
  }
}
