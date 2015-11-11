'use strict'

const React = require('react')
    , AudioPlayer = require('./audio')
    , SearchBox = require('./searchbox')
    , SearchResults = require('./searchresults')
    , TranscriptView = require('./transcript')
    , search = require('./search')

class TranscriptPlayer extends React.Component {
  static propTypes =
    { transcript: React.PropTypes.shape(
        { media: React.PropTypes.string
        , speakers: React.PropTypes.arrayOf(React.PropTypes.string)
        , turns: React.PropTypes.arrayOf(React.PropTypes.object)
        }).isRequired
    }
  constructor(props) {
    super(props)
    this.state =
      { time: 0
      , seekTime: null
      , ended: false
      , query: ''
      , searchResults: search.execute(props.transcript.turns)
      , resultIndex: null
      }
    }
  handleTimeUpdate(time) {
    if (this.state.seekTime !== null
        && Math.abs(time - this.state.seekTime) < 10) {
      this.setState({time: time, seekTime: null})
    } else {
      this.setState({time: time})
    }
  }
  handleEnded(ended) {
    this.setState({ended: ended})
  }
  handleSeekRequest(seekTime) {
    this.setState({seekTime: seekTime, ended: false})
  }
  handleQuery(query) {
    const re = query === '' ? null : new RegExp(query, 'ig')
        , results = search.execute(this.props.transcript.turns, re)
    this.setState({query: query, searchResults: results, resultIndex: null})
  }
  handleNavigateResult(direction) {
    if (this.state.searchResults.get('count') === 0) return
    const times = this.state.searchResults.get('times')
    let index = this.state.resultIndex
    if (direction === 'forward') {
      index = (index === null) ? 0 : index + 1
      if (index === times.size) index = 0
    } else {
      index = (index === null) ? times.size - 1 : index - 1
      if (index < 0) index = times.size - 1
    }
    this.setState({resultIndex: index})
    this.handleSeekRequest(times.get(index))
  }
  render() {
    var searchResults = (
      <SearchResults
        count={this.state.searchResults.get('count')}
        onNavigateResult={this.handleNavigateResult}
      />
    )
    return (
      <div className="container flex flex-column border">
        <AudioPlayer
          media={this.props.transcript.media}
          onEnded={this.handleEnded}
          onTimeUpdate={this.handleTimeUpdate}
          seekTime={this.state.seekTime}
        />
        <div className="clearfix p1 mb1">
          <SearchBox
            onQuery={this.handleQuery}
            query={this.state.query}
          />
          {this.state.query ? searchResults : ''}
        </div>
        <TranscriptView
          ended={this.state.ended}
          highlights={this.state.searchResults.get('matches')}
          onSeekRequest={this.handleSeekRequest}
          speakers={this.props.transcript.speakers}
          time={this.state.time}
          turns={this.props.transcript.turns}
        />
      </div>
    )
  }
}
export default TranscriptPlayer
