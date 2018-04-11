import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group'
import EXIF from 'exif-js'
import './App.css';

var imgs = ["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg"]

var gcd = function(a, b) {
    if (b) {
        return gcd(b, a % b);
    } else {
        return Math.abs(a);
    }
}

var toFraction = function(decimal) {
  var len = decimal.toString().length - 2
  var denominator = 10 ** len
  var numerator = decimal * denominator
  var divisor = gcd(numerator, denominator)

  numerator /= divisor
  denominator /= divisor

  return Math.floor(numerator) + '/' + Math.floor(denominator)
}

class PhotoForm extends Component {
  constructor(props) {
    super(props)
    this.state = {value: '', files: []}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({value: event.target.value, files: Array.from(event.target.files)})
    console.log(Array.from(event.target.files))
  }

  handleSubmit(event) {
    event.preventDefault()
    console.log('form submitted.')
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            File(s): 
            <input type="file" multiple value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <CSSTransitionGroup transitionName="preview" transitionEnterTimeout={7000} transitionLeaveTimeout={7000}>
          {this.state.files ? this.state.files.map((item, index) =>
              <Photo className='' imageUrl={URL.createObjectURL(item)} key={index} />)
              : null
          }
        </CSSTransitionGroup>
        </div>
      )
  }
}

class PhotoPopup extends Component {
  render() {
    return (
      <CSSTransitionGroup transitionName="popup">
        <div className="popup">
          <div className="popup-inner">
            <img src={this.props.imageUrl} style={{width: '100%'}} />
            <button onClick={this.props.closePopup}>close</button>
          </div>
        </div>
      </CSSTransitionGroup>
      )
  }
}

class Photo extends Component {
  constructor(props) {
    super(props)

    this.imgRef = React.createRef()

    this.handleOnLoad = this.handleOnLoad.bind(this)
    this.togglePopup = this.togglePopup.bind(this)

    this.state = {
      aperture: 0,
      shutterSpeed: 0.0,
      iso: 0.0,
      showPopup: false,
    }
  }

  updateState() {
    const img = this.imgRef.current
    var self = this

    EXIF.getData(img, function() {
      console.log(JSON.stringify(EXIF.getAllTags(this), null, '\t'))
      var aperture = EXIF.getTag(this, 'FNumber')
      var shutterSpeed = EXIF.getTag(this, 'ExposureTime')
      var sens = EXIF.getTag(this, 'ISOSpeedRatings')
      var state = {aperture: aperture, shutterSpeed: shutterSpeed, iso: sens}

      self.setState(state)
    })
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    })
  }

  handleOnLoad() {
    this.updateState()
  }

  render() {
    return (
      <div>
        <img onClick={this.togglePopup.bind(this)} onLoad={this.handleOnLoad} ref={this.imgRef} src={this.props.imageUrl} style={{width: 400}} />
        <span ref={this.descRef} className="text-muted"><i>ƒ/</i>{this.state.aperture.toString()}, {toFraction(this.state.shutterSpeed)}s, {this.state.iso.toString()}iso</span>
        {this.state.showPopup ?
          <PhotoPopup closePopup={this.togglePopup} imageUrl={this.props.imageUrl} />
          : null
        }
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="App">
        <PhotoForm />
        <br />
        {imgs.map((item, index) => 
          <Photo imageUrl={item} key={index} />
        )}
      </div>
    );
  }
}

export default App;
